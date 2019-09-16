import ProviderEngine from 'web3-provider-engine'
import DefaultFixture from 'web3-provider-engine/subproviders/default-fixture'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache'
import SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions'
import InflightCacheSubprovider from 'web3-provider-engine/subproviders/inflight-cache'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'
import InfuraSubprovider from 'web3-provider-engine/subproviders/infura'
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch'
import WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket'

import Connector, { ConnectorArguments } from './connector'

// https://github.com/MetaMask/web3-provider-engine

export default class NetworkOnlyConnector extends Connector {
  constructor({ providerURL, rest } = {}) {
    super(rest)
    this.providerURL = providerURL
  }

  async onActivation() {
    if (!this.engine) {
      const connectionType = getConnectionType({
        rpcUrl: this.providerURL,
      })

      const engine = new ProviderEngine()

      // static
      const staticSubprovider = new DefaultFixture()
      engine.addProvider(staticSubprovider)

      // sanitization
      const sanitizer = new SanitizingSubprovider()
      engine.addProvider(sanitizer)

      // cache layer
      const cacheSubprovider = new CacheSubprovider()
      engine.addProvider(cacheSubprovider)

      // inflight cache
      const inflightCache = new InflightCacheSubprovider()
      engine.addProvider(inflightCache)

      // filters + subscriptions
      // only polyfill if not websockets
      if (connectionType !== 'ws') {
        engine.addProvider(new SubscriptionSubprovider())
        engine.addProvider(new FilterSubprovider())
      }

      // data source
      const dataSubprovider = createDataSubprovider(connectionType, {
        rpcUrl: this.providerURL,
        debug: false,
      })
      engine.addProvider(dataSubprovider)

      this.engine = engine
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

const createDataSubprovider = (connectionType, opts) => {
  const { rpcUrl, debug } = opts

  // default to infura
  if (!connectionType) {
    return new InfuraSubprovider()
  }
  if (connectionType === 'http') {
    return new FetchSubprovider({ rpcUrl, debug })
  }
  if (connectionType === 'ws') {
    return new WebSocketSubprovider({ rpcUrl, debug })
  }

  throw new Error(`ProviderEngine - unrecognized connectionType "${connectionType}"`)
}

const getConnectionType = ({ rpcUrl }) => {
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
