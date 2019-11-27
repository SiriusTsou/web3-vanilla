import Web3ProviderEngine from 'web3-provider-engine'
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider'
import WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'

import Connector, { ConnectorArguments } from './connector'

export default class NetworkOnlyConnector extends Connector {
  constructor(kwargs) {
    const { supportedNetworkURLs, defaultNetwork, pollingInterval, requestTimeoutMs } = kwargs
    
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(
      (supportedNetworkURL) => Number(supportedNetworkURL)
    )
    super({ supportedNetworks })

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

  async getAccount() {
    return null
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
