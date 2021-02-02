import { Web3ProviderEngine, RPCSubprovider } from '@0x/subproviders'

import Connector, { ConnectorArguments } from './connector'

export default class WalletConnectConnector extends Connector {
  constructor(kwargs) {
    const { api: WalletConnectSubprovider, bridge, qrcode, supportedNetworkURLs, defaultNetwork } = kwargs

    const supportedNetworks = Object.keys(supportedNetworkURLs).map(
      (supportedNetworkURL) => Number(supportedNetworkURL)
    )
    super({ supportedNetworks })

    this.WalletConnectSubprovider = WalletConnectSubprovider
    this.bridge = bridge
    this.qrcode = qrcode
    this.supportedNetworkURLs = supportedNetworkURLs
    this.defaultNetwork = defaultNetwork

    this.connectAndSessionUpdateHandler = this.connectAndSessionUpdateHandler.bind(this)
    this.disconnectHandler = this.disconnectHandler.bind(this)
  }

  async onActivation() {
    if (!this.walletConnectSubprovider && !this.walletConnector) {
      const walletConnectSubprovider = new this.WalletConnectSubprovider({
        bridge: this.bridge,
        qrcode: this.qrcode,
      })
      this.walletConnectSubprovider = walletConnectSubprovider
      this.walletConnector = this.walletConnectSubprovider.connector
    }

    if (!this.walletConnector._connected) {
      await this.walletConnector.createSession()
    }

    // initialize event listeners
    this.walletConnector.on('connect', this.connectAndSessionUpdateHandler)
    this.walletConnector.on('session_update', this.connectAndSessionUpdateHandler)
    this.walletConnector.on('disconnect', this.disconnectHandler)
  }

  async getProvider(networkId = null) {
    // this should never happened, because it probably means there was a funky walletconnect race condition
    if (networkId && this.walletConnector.chainId && networkId !== this.walletConnector.chainId) {
      throw Error('Unexpected Error in WalletConnectConnector. Please file an issue on Github.')
    }

    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = this.walletConnector.chainId || networkId || this.defaultNetwork
    super._validateNetworkId(networkIdToUse)

    const engine = new Web3ProviderEngine()
    this.engine = engine
    engine.addProvider(this.walletConnectSubprovider)
    engine.addProvider(new RPCSubprovider(this.supportedNetworkURLs[networkIdToUse]))
    engine.start()

    return engine
  }

  async getAccount(provider) {
    if (this.walletConnector._connected) {
      return super.getAccount(provider)
    } else {
      return null
    }
  }

  onDeactivation() {
    // TODO remove listeners here once exposed in walletconnect
    if (this.engine) {
      this.engine.stop()
    }
  }

  // walletconnect event handlers
  connectAndSessionUpdateHandler(error, payload) {
    if (error) {
      super._web3ErrorHandler(error)
    } else {
      const { chainId, accounts } = payload.params[0]

      // proactively handle wrong network errors
      try {
        super._validateNetworkId(chainId)

        super._web3UpdateHandler({
          updateNetworkId: true,
          updateAccount: true,
          networkId: chainId,
          account: accounts[0]
        })
      } catch (error) {
        super._web3ErrorHandler(error)
      }
    }
  }

  disconnectHandler(error) {
    if (error) {
      super._web3ErrorHandler(error)
    } else {
      super._web3ResetHandler()
    }
  }
}
