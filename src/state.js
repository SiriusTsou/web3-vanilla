import EventEmitter from 'events'

class Web3State extends EventEmitter {
  constructor() {
    super()

    // init
    this._account = undefined
    this._connectorName = undefined
    this._error = null
    this._networkId = undefined
    this._provider = undefined
    this._active = false
  }

  // getter
  get account() {
    return this._account
  }

  get connectorName() {
    return this._connectorName
  }

  get error() {
    return this._error
  }

  get networkId() {
    return this._networkId
  }

  get provider() {
    return this._provider
  }

  get active() {
    return this._active
  }

  // setter
  set account(_account) {
    if (_account !== this._account) {
      this._account = _account
      this.emit('accountChanged', _account)
    }
  }

  set connectorName(_connectorName) {
    if (_connectorName !== this._connectorName) {
      this._connectorName = _connectorName
      this.emit('connectorChanged', _connectorName)
    }
  }

  /*
    For all EventEmitter objects, if an 'error' event handler is not provided,
    the error will be thrown, causing the Node.js process to report an uncaught
    exception and crash unless either: The domain module is used appropriately
    or a handler has been registered for the 'uncaughtException' event.
  */
  set error(_error) {
    if (_error !== this._error) {
      this._error = _error

      if (_error)
        this.emit('error', _error)
    }
  }

  set networkId(_networkId) {
    if (_networkId !== this._networkId) {
      this._networkId = _networkId
      this.emit('networkChanged', _networkId)
    }
  }

  set provider(_provider) {
    if (_provider !== this._provider) {
      this._provider = _provider
      this.emit('providerChanged', _provider)
    }
  }

  set active(_active) {
    if (_active !== this._active) {
      this._active = _active
      this.emit('active', _active)
    }
  }
}

export default Web3State
