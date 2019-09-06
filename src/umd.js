import 'core-js/modules/es.promise.finally'

import Web3Provider from './provider'

import * as subproviders from '@0x/subproviders'

import * as Connectors from './connectors'

class Web3Vanilla {
  static get Web3Provider() {
    return Web3Provider
  }

  static get subproviders() {
    return subproviders
  }

  static get Connectors() {
    return Connectors
  }
}

export default Web3Vanilla