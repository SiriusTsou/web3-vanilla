import { ethers } from 'ethers'
import Web3Manager from './manager'

class Web3Provider {
  constructor({ connectors, libraryName = null, web3Api = null }) {
    this._libraryName = libraryName
    this._web3Api = web3Api

    const web3Manger = new Web3Manager(connectors)
    this._web3Manger = web3Manger

    this.event = web3Manger.web3State

    this.setConnector = web3Manger.setConnector.bind(web3Manger)
    this.setFirstValidConnector = web3Manger.setFirstValidConnector.bind(web3Manger)
    this.unsetConnector = web3Manger.unsetConnector.bind(web3Manger)
    this.setError = web3Manger.setError.bind(web3Manger)
  }

  get library() {
    const providerToInject =
      this.provider &&
      (() => {
        switch (this._libraryName) {
          case 'ethers.js':
            return new ethers.providers.Web3Provider(this.provider)
          case 'web3.js':
            if (!this._web3Api) {
              const error = Error('web3Api is not exists.')
              error.code = 'WEB3_API_NOT_EXISTS'

              throw error
            }

            return new this._web3Api(this.provider)
          case null:
            return this.provider
        }
      })()
    return providerToInject
  }

  get connector() {
    return this._web3Manger.activeConnector
  }

  get active() {
    return this._web3Manger.web3State.active
  }

  get connectorName() {
    return this._web3Manger.web3State.connectorName
  }

  get provider() {
    return this._web3Manger.web3State.provider
  }

  get networkId() {
    return this._web3Manger.web3State.networkId
  }

  get account() {
    return this._web3Manger.web3State.account
  }

  get error() {
    return this._web3Manger.web3State.error
  }
}

export default Web3Provider
