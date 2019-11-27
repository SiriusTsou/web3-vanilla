import Web3ProviderEngine from 'web3-provider-engine'
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider'
import { PrivateKeyWalletSubprovider } from '@0x/subproviders/lib/src/subproviders/private_key_wallet'
import WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'

import Connector, { ConnectorArguments } from './connector'

export default class PrivateKeyConnector extends Connector {
  constructor(kwargs) {
    const { privateKey, supportedNetworkURLs, defaultNetwork, pollingInterval, requestTimeoutMs } = kwargs
    
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(
      (supportedNetworkURL) => Number(supportedNetworkURL)
    )
    super({ supportedNetworks })

    this.privateKey = privateKey
    this.supportedNetworkURLs = supportedNetworkURLs
    this.defaultNetwork = defaultNetwork
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
  }

  async onActivation(networkId = null) {
    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = networkId || this.defaultNetwork
    super._validateNetworkId(networkIdToUse)

    if (!this.engine) {
      const engine = new Web3ProviderEngine({ pollingInterval: this.pollingInterval })
      this.engine = engine
      this.engine.addProvider(new PrivateKeyWalletSubprovider(this.privateKey))
      const connectionType = this.getConnectionType(this.supportedNetworkURLs[networkIdToUse])
      if (connectionType === 'http') {
        this.engine.addProvider(new RPCSubprovider(this.supportedNetworkURLs[networkIdToUse], this.requestTimeoutMs))
      } 
      else if (connectionType === 'ws') {
        this.engine.addProvider(new WebSocketSubprovider({ rpcUrl: this.supportedNetworkURLs[networkIdToUse] }))
      }
    }
    this.engine.start()
  }

  async getProvider() {
    return this.engine
  }

  async getAccount(provider) {
    return super.getAccount(provider)
  }

  onDeactivation() {
    if (this.engine) {
      this.engine.stop()
    }
  }

  getConnectionType(rpcUrl) {
    if (!rpcUrl) return undefined

    const protocol = rpcUrl.split(':')[0].toLowerCase()
    switch (protocol) {
      case 'http':
      case 'https':
        return 'http'
      case 'ws':
      case 'wss':
        return 'ws'
      default:
        throw new Error(`ProviderEngine - unrecognized protocol in "${rpcUrl}"`)
    }
  }  
}
