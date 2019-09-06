import { ethers } from 'ethers'
import { Connector } from './connectors'
import Web3State from './state'

export const ManagerErrorCodes = ['UNEXPECTED_ERROR', 'ALL_CONNECTORS_INVALID'].reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue] = currentValue
    return accumulator
  },
  {}
)

const unexpectedErrorMessage = 'web3-vanila encountered an unexpected internal error. See the console for details.'
const unexpectedError = Error(unexpectedErrorMessage)
unexpectedError.code = ManagerErrorCodes.UNEXPECTED_ERROR

const initialWeb3State = {
  account: undefined,
  connectorName: undefined,
  error: null,
  networkId: undefined,
  provider: undefined
}

function normalizeAccount(account) {
  return account === null ? account : ethers.utils.getAddress(account)
}

// MutableRefObject, TODO
function useRef(initialValue = null) {
  const ref = {
    current: initialValue
  }
  return ref
}

// MutableRefObject, TODO
function useRefId() {
  const refId = useRef(0)

  function increment() {
    refId.current += 1
  }

  return [refId, increment]
}

class Web3Manager {
  constructor(connectors) {
    [this.refId, this.incrementRefId] = useRefId()

    this.connectors = connectors
    this.web3State = new Web3State()
  }

  get web3Initialized() {
    return !!(
      this.web3State.account !== undefined &&
      this.web3State.connectorName &&
      !this.web3State.error &&
      this.web3State.provider &&
      this.web3State.networkId
    )
  }

  get activeConnector() {
    return this.web3State.connectorName
      ? this.connectors[this.web3State.connectorName]
      : undefined
  }

  updateWeb3State(state) {
    this.web3State.account = state.account
    this.web3State.connectorName = state.connectorName
    this.web3State.error = state.error
    this.web3State.networkId = state.networkId
    this.web3State.provider = state.provider
    this.web3State.active = this.web3Initialized
  }

  actionWeb3State(action) {
    console.log(action)
    const state = {
      account: this.web3State.account,
      connectorName: this.web3State.connectorName,
      error: this.web3State.error,
      networkId: this.web3State.networkId,
      provider: this.web3State.provider,
    }

    switch (action.type) {
      case 'UPDATE_CONNECTOR_VALUES': {
        const { connectorName, provider, networkId, account } = action.payload
        return this.updateWeb3State({ connectorName, provider, networkId, account: normalizeAccount(account), error: null })
      }
      case 'UPDATE_NETWORK_ID': {
        const { provider, networkId } = action.payload
        return this.updateWeb3State({ ...state, provider: provider || state.provider, networkId, error: null })
      }
      case 'UPDATE_ACCOUNT': {
        const { provider, account } = action.payload
        return this.updateWeb3State({ ...state, provider: provider || state.provider, account: normalizeAccount(account), error: null })
      }
      case 'UPDATE_NETWORK_ID_AND_ACCOUNT': {
        const { provider, networkId, account } = action.payload
        return this.updateWeb3State({
          ...state,
          provider: provider || state.provider,
          account: normalizeAccount(account),
          error: null,
          networkId
        })
      }
      case 'SET_ERROR':
        return this.updateWeb3State({ ...initialWeb3State, error: action.payload })
      case 'SET_ERROR_PRESERVE_CONNECTOR_NAME':
        return this.updateWeb3State({ ...initialWeb3State, connectorName: state.connectorName, error: action.payload })
      case 'SET_ERROR_WITH_CONNECTOR_NAME': {
        const { connectorName, error } = action.payload
        return this.updateWeb3State({ ...initialWeb3State, connectorName, error })
      }
      case 'RESET':
        return this.updateWeb3State(initialWeb3State)
      default: {
        console.warn('Default case encountered in actionWeb3State. Please file an issue on Github.')
        return this.updateWeb3State({ ...state, provider: undefined, networkId: undefined, account: undefined, error: unexpectedError })
      }
    }
  }

  // function to set the error state.
  setError(error, { preserveConnector = true, connectorName } = {}) {
    if (connectorName) {
      this.actionWeb3State({
        type: 'SET_ERROR_WITH_CONNECTOR_NAME',
        payload: { error, connectorName }
      })
    }
    if (preserveConnector) {
      this.actionWeb3State({
        type: 'SET_ERROR_PRESERVE_CONNECTOR_NAME',
        payload: error
      })
    } else {
      this.actionWeb3State({
        type: 'SET_ERROR',
        payload: error
      })
    }
  }

  offConnector() {
    const activeConnector = this.activeConnector
    if (activeConnector) {
      activeConnector.removeListener('_web3Update', this._web3UpdateHandler)
      activeConnector.removeListener('_web3Error', this._web3ErrorHandler)
      activeConnector.removeListener('_web3Reset', this._web3ResetHandler)

      activeConnector.onDeactivation(this.web3State.error)
    }
  }

  onConnector() {
    const activeConnector = this.activeConnector
    if (activeConnector) {
      this._web3UpdateHandler = this.web3UpdateHandler.bind(this)
      this._web3ErrorHandler = this.web3ErrorHandler.bind(this)
      this._web3ResetHandler = this.web3ResetHandler.bind(this)

      activeConnector.on('_web3Update', this._web3UpdateHandler)
      activeConnector.on('_web3Error', this._web3ErrorHandler)
      activeConnector.on('_web3Reset', this._web3ResetHandler)
    }
  }

  // function to set a connector
  async setConnector(
    connectorName,
    { suppressAndThrowErrors = false, networkId } = {}
  ) {
    const callingTimeRefId = this.refId.current
    this.incrementRefId()

    const validConnectorNames = Object.keys(this.connectors)
    const connector = this.connectors[connectorName]

    if (!validConnectorNames.includes(connectorName)) {
      console.warn(`'${connectorName}' is not a valid name, please pass one of: ${validConnectorNames.join(', ')}.`)
      return
    }

    if (connectorName === this.web3State.connectorName) {
      console.warn(
        `'${connectorName}' is already set. Calling 'setConnector' for a connector while it is active is a no-op.'`
      )
      return
    }

    // at this point, begin initializing the connector
    try {
      await connector.onActivation()
      const provider = await connector.getProvider(networkId)
      const networkIdPromise = connector.getNetworkId(provider)
      const accountPromise = connector.getAccount(provider)
      await Promise.all([networkIdPromise, accountPromise]).then(
        ([networkId, account]) => {
          if (this.refId.current !== callingTimeRefId + 1) {
            console.warn(`Silently suppressing status update from stale connector '${connectorName}'.`)
            return
          }

          this.offConnector()

          this.actionWeb3State({
            payload: { connectorName, provider, networkId, account },
            type: 'UPDATE_CONNECTOR_VALUES'
          })
          this.onConnector()
        }
      )
    } catch (error) {
      // if the component has re-rendered since this function was called, eat the error
      if (this.refId.current !== callingTimeRefId + 1) {
        console.warn(`Silently handling error from '${connectorName}': ${error.toString()}`)
        return
      }

      if (suppressAndThrowErrors) {
        throw error
      } else {
        this.setError(error, { connectorName })
      }
    }
  }

  // expose a wrapper to set the first valid connector in a list
  async setFirstValidConnector(
    connectorNames,
    { suppressAndThrowErrors = false, networkIds = [] } = {}
  ) {
    for (const connectorName of connectorNames) {
      try {
        await this.setConnector(connectorName, {
          suppressAndThrowErrors: true,
          networkId: networkIds[connectorNames.indexOf(connectorName)]
        })
        break
      } catch (error) {
        if (connectorName === connectorNames[connectorNames.length - 1]) {
          const error = Error('Unable to set any valid connector.')
          error.code = ManagerErrorCodes.ALL_CONNECTORS_INVALID

          if (suppressAndThrowErrors) {
            throw error
          } else {
            this.setError(error)
          }
        }
      }
    }
  }

  // function to unset the current connector
  unsetConnector() {
    this.actionWeb3State({ type: 'RESET' })
  }

  async web3UpdateHandler({
    updateNetworkId = false,
    updateAccount = false,
    overrideNetworkIdCheck = false,
    overrideAccountCheck = false,
    networkId,
    account
  } = {}) {
    if (!this.activeConnector) {
      console.warn('No active connector in web3UpdateHandler call. Please file an issue on Github.')
      this.setError(unexpectedError)
      return
    }

    if (
      (!updateNetworkId && !updateAccount) ||
      (updateNetworkId && overrideNetworkIdCheck && !networkId) ||
      (updateAccount && overrideAccountCheck && !account)
    ) {
      console.warn('Malformed parameters passed to web3UpdateHandler.')
      this.setError(unexpectedError)

      return
    }

    // no checks required
    if (
      (!updateNetworkId || (updateNetworkId && overrideNetworkIdCheck)) &&
      (!updateAccount || (updateAccount && overrideAccountCheck))
    ) {
      if (updateNetworkId && !updateAccount) {
        this.actionWeb3State({
          payload: { networkId },
          type: 'UPDATE_NETWORK_ID'
        })
      } else if (!updateNetworkId && updateAccount) {
        this.actionWeb3State({
          payload: { account },
          type: 'UPDATE_ACCOUNT'
        })
      } else {
        this.actionWeb3State({
          payload: { networkId, account },
          type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
        })
      }

      return
    }

    // one or more checks required
    try {
      const fetchNewProvider = !this.web3State.provider || (updateNetworkId && !overrideNetworkIdCheck)
      const provider = await (fetchNewProvider ? this.activeConnector.getProvider(networkId) : this.web3State.provider)

      const fetchNewNetworkId = this.web3State.networkId === undefined || (updateNetworkId && !overrideNetworkIdCheck)
      const networkIdPromise =
        this.web3State.networkId === undefined || fetchNewNetworkId
          ? this.activeConnector.getNetworkId(provider)
          : this.web3State.networkId

      const fetchNewAccount = this.web3State.account === undefined || (updateAccount && !overrideAccountCheck)
      const accountPromise =
        this.web3State.account === undefined || fetchNewAccount ? this.activeConnector.getAccount(provider) : this.web3State.account

      await Promise.all([networkIdPromise, accountPromise]).then(
        ([returnedNetworkId, returnedAccount]) => {
          if (updateNetworkId && networkId && networkId !== returnedNetworkId) {
            console.warn(`Mismatched networkIds in web3UpdateHandler: ${networkId} and ${returnedNetworkId}.`)
            throw unexpectedError
          }

          if (updateAccount && account && normalizeAccount(account) !== normalizeAccount(returnedAccount)) {
            console.warn(
              `Mismatched accounts in web3UpdateHandler: ${normalizeAccount(account)} and ${normalizeAccount(
                returnedAccount
              )}.`
            )
            throw unexpectedError
          }

          if (fetchNewNetworkId && !fetchNewAccount) {
            this.actionWeb3State({
              payload: { provider: fetchNewProvider ? provider : undefined, networkId: returnedNetworkId },
              type: 'UPDATE_NETWORK_ID'
            })
          } else if (!fetchNewNetworkId && fetchNewAccount) {
            this.actionWeb3State({
              payload: { provider: fetchNewProvider ? provider : undefined, account: returnedAccount },
              type: 'UPDATE_ACCOUNT'
            })
          } else {
            this.actionWeb3State({
              payload: {
                provider: fetchNewProvider ? provider : undefined,
                networkId: returnedNetworkId,
                account: returnedAccount
              },
              type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
            })
          }
        }
      )
    } catch (error) {
      this.setError(error)
    }
  }

  web3ErrorHandler(error, preserveConnector = true) {
    this.setError(error, { preserveConnector })
  }

  web3ResetHandler() {
    this.unsetConnector()
  }
}

export default Web3Manager
