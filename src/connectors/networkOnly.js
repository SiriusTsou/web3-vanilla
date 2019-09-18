import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders'

import Connector, { ConnectorArguments } from './connector'

export default class NetworkOnlyConnector extends Connector {
  constructor(kwargs) {
    const { providerURL, ...rest } = kwargs
    super(rest)
    this.providerURL = providerURL
  }

  async onActivation() {
    if (!this.engine) {
      const engine = new Web3ProviderEngine()
      this.engine = engine
      this.engine.addProvider(new RPCSubprovider(this.providerURL))
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
}
