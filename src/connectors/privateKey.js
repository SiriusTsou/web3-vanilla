import { PrivateKeyWalletSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders'

import Connector, { ConnectorArguments } from './connector'

export default class PrivateKeyConnector extends Connector {
  constructor(kwargs) {
    const { providerURL, privateKey, ...rest } = kwargs
    super(rest)
    this.providerURL = providerURL
    this.privateKey = privateKey
  }

  async onActivation() {
    if (!this.engine) {
      const engine = new Web3ProviderEngine()
      this.engine = engine
      this.engine.addProvider(new PrivateKeyWalletSubprovider(this.privateKey))
      this.engine.addProvider(new RPCSubprovider(this.providerURL))
    }

    this.engine.start()
  }

  async getProvider() {
    return this.engine
  }

  async getAccount() {
    // dirty
    return this.engine._providers[0]._address
  }

  onDeactivation() {
    if (this.engine) {
      this.engine.stop()
    }
  }
}
