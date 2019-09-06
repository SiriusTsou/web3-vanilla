import { ethers } from 'ethers'
import Web3Manager from './manager'

class Web3Provider {
  constructor({ connectors, libraryName, web3Api }) {
    this.web3Manger = new Web3Manager(connectors)

    this._libraryName = libraryName
    this._web3Api = web3Api

    this.setConnector = this.web3Manger.setConnector.bind(this.web3Manger)
    this.setFirstValidConnector = this.web3Manger.setFirstValidConnector.bind(this.web3Manger)
    this.setError = this.web3Manger.setError.bind(this.web3Manger)
  }

  unsetConnector() {
    this.web3Manger.unsetConnector.call(this.web3Manger)
    this.removeAllListeners()
  }

  get library() {
    const providerToInject =
      this.provider &&
      (() => {
        switch (this._libraryName) {
          case 'ethers.js':
            return new ethers.providers.Web3Provider(this.provider)
          case 'web3.js':
            // if no web3Api should be error TODO
            return new this._web3Api(this.provider)
          case null:
            return this.provider
        }
      })()
    return providerToInject
  }

  get connector() {
    return this.web3Manger.activeConnector
  }

  get active() {
    return this.web3Manger.web3State.active
  }

  get connectorName() {
    return this.web3Manger.web3State.connectorName
  }

  get provider() {
    return this.web3Manger.web3State.provider
  }

  get networkId() {
    return this.web3Manger.web3State.networkId
  }

  get account() {
    return this.web3Manger.web3State.account
  }

  get error() {
    return this.web3Manger.web3State.error
  }

  removeAllListeners() {
    this.web3Manger.web3State.removeAllListeners()
  }

  onActive(callback) {
    this._active = this.web3Manger.web3State.on('_active', callback)
  }

  onAccountChange(callback) {
    this._onAccountChange = this.web3Manger.web3State.on('_account', callback)
  }

  onNetworkChange(callback) {
    this._onNetworkChange = this.web3Manger.web3State.on('_networkId', callback)
  }

  onError(callback) {
    this._onError = this.web3Manger.web3State.on('_error', callback)
  }

  onConnectorChange(callback) {
    this._onConnectorChange = this.web3Manger.web3State.on('_connectorName', callback)
  }

  offActive() {
    this.web3Manger.web3State.removeListener('_active', this._active)
  }

  offAccountChange() {
    this.web3Manger.web3State.removeListener('_account', this._onAccountChange)
  }

  offNetworkChange() {
    this.web3Manger.web3State.removeListener('_networkId', this._onNetworkChange)
  }

  offError() {
    this.web3Manger.web3State.removeListener('_error', this._onError)
  }

  offConnectorChange() {
    this.web3Manger.web3State.removeListener('_connectorName', this._onConnectorChange)
  }

  onceError(callback) {
    this.web3Manger.web3State.once('_error', callback)
  }

  onceActive(callback) {
    this.web3Manger.web3State.once('_active', callback)
  }
}

export default Web3Provider
