import Connector, { ErrorCodeMixin, ConnectorArguments } from './connector'

const InjectedConnectorErrorCodes = ['ETHEREUM_ACCESS_DENIED', 'LEGACY_PROVIDER', 'NO_WEB3', 'UNLOCK_REQUIRED']
export default class InjectedConnector extends ErrorCodeMixin(Connector, InjectedConnectorErrorCodes) {
  constructor(args = {}) {
    super(args)

    this.runOnDeactivation = []

    this.networkChangedHandler = this.networkChangedHandler.bind(this)
    this.accountsChangedHandler = this.accountsChangedHandler.bind(this)
  }

  async onActivation() {
    const { ethereum, web3 } = window

    if (ethereum) {
      await ethereum.enable().catch(
        (error) => {
          const deniedAccessError = Error(error)
          deniedAccessError.code = InjectedConnector.errorCodes.ETHEREUM_ACCESS_DENIED
          throw deniedAccessError
        }
      )

      // initialize event listeners
      if (ethereum.on) {
        ethereum.on('networkChanged', this.networkChangedHandler)
        ethereum.on('accountsChanged', this.accountsChangedHandler)

        this.runOnDeactivation.push(
          () => {
            if (ethereum.removeListener) {
              ethereum.removeListener('networkChanged', this.networkChangedHandler)
              ethereum.removeListener('accountsChanged', this.accountsChangedHandler)
            }
          }
        )
      }

      if (ethereum.isMetaMask) {
        ethereum.autoRefreshOnNetworkChange = false
      }
    } else if (web3) {
      const legacyError = Error('Your web3 provider is outdated, please upgrade to a modern provider.')
      legacyError.code = InjectedConnector.errorCodes.LEGACY_PROVIDER
      throw legacyError
    } else {
      const noWeb3Error = Error('Your browser is not equipped with web3 capabilities.')
      noWeb3Error.code = InjectedConnector.errorCodes.NO_WEB3
      throw noWeb3Error
    }
  }

  async getProvider() {
    const { ethereum } = window
    return ethereum
  }

  async getAccount(provider) {
    const account = super.getAccount(provider)

    if (account === null) {
      const unlockRequiredError = Error('Ethereum account locked.')
      unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED
      throw unlockRequiredError
    }

    return account
  }

  onDeactivation() {
    this.runOnDeactivation.forEach((runner) => runner())
    this.runOnDeactivation = []
  }

  // event handlers
  networkChangedHandler(networkId) {
    const networkIdNumber = Number(networkId)

    try {
      super._validateNetworkId(networkIdNumber)

      super._web3UpdateHandler({
        updateNetworkId: true,
        networkId: networkIdNumber
      })
    } catch (error) {
      super._web3ErrorHandler(error)
    }
  }

  accountsChangedHandler(accounts) {
    if (!accounts[0]) {
      const unlockRequiredError = Error('Ethereum account locked.')
      unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED
      super._web3ErrorHandler(unlockRequiredError)
    } else {
      super._web3UpdateHandler({
        updateAccount: true,
        account: accounts[0]
      })
    }
  }
}
