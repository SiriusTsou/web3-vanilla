import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders'

import Connector, { ConnectorArguments } from './connector'

export default class NetworkOnlyConnector extends Connector {
  constructor(kwargs) {
    const { supportedNetworkURLs, defaultNetwork } = kwargs
    
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(
      (supportedNetworkURL) => Number(supportedNetworkURL)
    )
    super({ supportedNetworks })

    this.supportedNetworkURLs = supportedNetworkURLs
    this.defaultNetwork = defaultNetwork
  }

  async onActivation() {
    if (!this.engine) {
      const engine = new Web3ProviderEngine()
      this.engine = engine
      this.engine.addProvider(new RPCSubprovider(this.providerURL))
    }

    this.engine.start()
  }

  async getProvider(networkId = null) {
    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = networkId || this.defaultNetwork
    super._validateNetworkId(networkIdToUse)

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
}
