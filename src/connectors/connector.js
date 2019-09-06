import { ethers } from 'ethers'
import EventEmitter from 'events'

export function ErrorCodeMixin(Base, errorCodes) {
  return class extends Base {
    constructor(kwargs = {}) {
      super(kwargs)
    }

    static get errorCodes() {
      return errorCodes.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = currentValue
        return accumulator
      }, {})
    }
  }
}

const ConnectorErrorCodes = ['UNSUPPORTED_NETWORK']
export default class Connector extends ErrorCodeMixin(EventEmitter, ConnectorErrorCodes) {
  constructor(kwargs = {}) {
    super()
    const { supportedNetworks } = kwargs
    this.supportedNetworks = supportedNetworks
  }

  async onActivation() {}
  onDeactivation(_error) {}
  async getProvider(networkId) {}

  async getNetworkId(provider) {
    const library = new ethers.providers.Web3Provider(provider)
    const networkId = await library.getNetwork().then((network) => network.chainId)
    return this._validateNetworkId(networkId)
  }

  async getAccount(provider) {
    const library = new ethers.providers.Web3Provider(provider)
    const account = await library.listAccounts().then((accounts) => accounts[0] || null)
    return account
  }

  _validateNetworkId(networkId) {
    if (this.supportedNetworks && !this.supportedNetworks.includes(networkId)) {
      const unsupportedNetworkError = Error(`Unsupported Network: ${networkId}.`)
      unsupportedNetworkError.code = Connector.errorCodes.UNSUPPORTED_NETWORK
      throw unsupportedNetworkError
    }

    return networkId
  }

  // wraps emissions of _web3Update
  _web3UpdateHandler(options) {
    this.emit('_web3Update', options)
  }

  // wraps emissions of _web3Error
  _web3ErrorHandler(error, preserveConnector = true) {
    this.emit('_web3Error', error, preserveConnector)
  }

  // wraps emissions of _web3Error
  _web3ResetHandler() {
    this.emit('_web3Reset')
  }
}
