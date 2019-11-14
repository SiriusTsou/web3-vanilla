import { PrivateKeyWalletSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders'

import Connector, { ConnectorArguments } from './connector'

export default class PrivateKeyConnector extends Connector {
  constructor(kwargs) {
    const { privateKey, supportedNetworkURLs, defaultNetwork } = kwargs
    
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(
      (supportedNetworkURL) => Number(supportedNetworkURL)
    )
    super({ supportedNetworks })

    this.privateKey = privateKey
    this.supportedNetworkURLs = supportedNetworkURLs
    this.defaultNetwork = defaultNetwork
  }

  async onActivation(networkId = null) {
    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = networkId || this.defaultNetwork
    super._validateNetworkId(networkIdToUse)

    if (!this.engine) {
      const engine = new Web3ProviderEngine()
      this.engine = engine
      this.engine.addProvider(new PrivateKeyWalletSubprovider(this.privateKey))
      this.engine.addProvider(new RPCSubprovider(this.supportedNetworkURLs[networkIdToUse]))
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
}
