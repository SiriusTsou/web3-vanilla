(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@0x/subproviders"), require("ethers"));
	else if(typeof define === 'function' && define.amd)
		define(["@0x/subproviders", "ethers"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("@0x/subproviders"), require("ethers")) : factory(root["@0x/subproviders"], root["ethers"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__0x_subproviders__, __WEBPACK_EXTERNAL_MODULE_ethers__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/connectors/connector.js":
/*!*************************************!*\
  !*** ./src/connectors/connector.js ***!
  \*************************************/
/*! exports provided: ErrorCodeMixin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorCodeMixin", function() { return ErrorCodeMixin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Connector; });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ "ethers");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);


function ErrorCodeMixin(Base, errorCodes) {
  return class extends Base {
    constructor(kwargs = {}) {
      super(kwargs);
    }

    static get errorCodes() {
      return errorCodes.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = currentValue;
        return accumulator;
      }, {});
    }

  };
}
const ConnectorErrorCodes = ['UNSUPPORTED_NETWORK'];
class Connector extends ErrorCodeMixin(events__WEBPACK_IMPORTED_MODULE_1___default.a, ConnectorErrorCodes) {
  constructor(kwargs = {}) {
    super();
    const {
      supportedNetworks
    } = kwargs;
    this.supportedNetworks = supportedNetworks;
  }

  async onActivation() {}

  onDeactivation(_error) {}

  async getProvider(networkId) {}

  async getNetworkId(provider) {
    const library = new ethers__WEBPACK_IMPORTED_MODULE_0__["ethers"].providers.Web3Provider(provider);
    const networkId = await library.getNetwork().then(network => network.chainId);
    return this._validateNetworkId(networkId);
  }

  async getAccount(provider) {
    const library = new ethers__WEBPACK_IMPORTED_MODULE_0__["ethers"].providers.Web3Provider(provider);
    const account = await library.listAccounts().then(accounts => accounts[0] || null);
    return account;
  }

  _validateNetworkId(networkId) {
    if (this.supportedNetworks && !this.supportedNetworks.includes(networkId)) {
      const unsupportedNetworkError = Error(`Unsupported Network: ${networkId}.`);
      unsupportedNetworkError.code = Connector.errorCodes.UNSUPPORTED_NETWORK;
      throw unsupportedNetworkError;
    }

    return networkId;
  } // wraps emissions of _web3Update


  _web3UpdateHandler(options) {
    this.emit('_web3Update', options);
  } // wraps emissions of _web3Error


  _web3ErrorHandler(error, preserveConnector = true) {
    this.emit('_web3Error', error, preserveConnector);
  } // wraps emissions of _web3Error


  _web3ResetHandler() {
    this.emit('_web3Reset');
  }

}

/***/ }),

/***/ "./src/connectors/index.js":
/*!*********************************!*\
  !*** ./src/connectors/index.js ***!
  \*********************************/
/*! exports provided: Connector, InjectedConnector, NetworkOnlyConnector, PrivateKeyConnector, WalletConnectConnector, ErrorCodeMixin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connector */ "./src/connectors/connector.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Connector", function() { return _connector__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ErrorCodeMixin", function() { return _connector__WEBPACK_IMPORTED_MODULE_0__["ErrorCodeMixin"]; });

/* harmony import */ var _injected__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./injected */ "./src/connectors/injected.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InjectedConnector", function() { return _injected__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _networkOnly__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./networkOnly */ "./src/connectors/networkOnly.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkOnlyConnector", function() { return _networkOnly__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _privateKey__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./privateKey */ "./src/connectors/privateKey.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PrivateKeyConnector", function() { return _privateKey__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _walletConnect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./walletConnect */ "./src/connectors/walletConnect.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WalletConnectConnector", function() { return _walletConnect__WEBPACK_IMPORTED_MODULE_4__["default"]; });








/***/ }),

/***/ "./src/connectors/injected.js":
/*!************************************!*\
  !*** ./src/connectors/injected.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InjectedConnector; });
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connector */ "./src/connectors/connector.js");

const InjectedConnectorErrorCodes = ['ETHEREUM_ACCESS_DENIED', 'LEGACY_PROVIDER', 'NO_WEB3', 'UNLOCK_REQUIRED'];
class InjectedConnector extends Object(_connector__WEBPACK_IMPORTED_MODULE_0__["ErrorCodeMixin"])(_connector__WEBPACK_IMPORTED_MODULE_0__["default"], InjectedConnectorErrorCodes) {
  constructor(args = {}) {
    super(args);
    this.runOnDeactivation = [];
    this.networkChangedHandler = this.networkChangedHandler.bind(this);
    this.accountsChangedHandler = this.accountsChangedHandler.bind(this);
  }

  async onActivation() {
    const {
      ethereum,
      web3
    } = window;

    if (ethereum) {
      await ethereum.enable().catch(error => {
        const deniedAccessError = Error(error);
        deniedAccessError.code = InjectedConnector.errorCodes.ETHEREUM_ACCESS_DENIED;
        throw deniedAccessError;
      }); // initialize event listeners

      if (ethereum.on) {
        ethereum.on('networkChanged', this.networkChangedHandler);
        ethereum.on('accountsChanged', this.accountsChangedHandler);
        this.runOnDeactivation.push(() => {
          if (ethereum.removeListener) {
            ethereum.removeListener('networkChanged', this.networkChangedHandler);
            ethereum.removeListener('accountsChanged', this.accountsChangedHandler);
          }
        });
      }

      if (ethereum.isMetaMask) {
        ethereum.autoRefreshOnNetworkChange = false;
      }
    } else if (web3) {
      const legacyError = Error('Your web3 provider is outdated, please upgrade to a modern provider.');
      legacyError.code = InjectedConnector.errorCodes.LEGACY_PROVIDER;
      throw legacyError;
    } else {
      const noWeb3Error = Error('Your browser is not equipped with web3 capabilities.');
      noWeb3Error.code = InjectedConnector.errorCodes.NO_WEB3;
      throw noWeb3Error;
    }
  }

  async getProvider() {
    const {
      ethereum
    } = window;
    return ethereum;
  }

  async getAccount(provider) {
    const account = super.getAccount(provider);

    if (account === null) {
      const unlockRequiredError = Error('Ethereum account locked.');
      unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED;
      throw unlockRequiredError;
    }

    return account;
  }

  onDeactivation() {
    this.runOnDeactivation.forEach(runner => runner());
    this.runOnDeactivation = [];
  } // event handlers


  networkChangedHandler(networkId) {
    const networkIdNumber = Number(networkId);

    try {
      super._validateNetworkId(networkIdNumber);

      super._web3UpdateHandler({
        updateNetworkId: true,
        networkId: networkIdNumber
      });
    } catch (error) {
      super._web3ErrorHandler(error);
    }
  }

  accountsChangedHandler(accounts) {
    if (!accounts[0]) {
      const unlockRequiredError = Error('Ethereum account locked.');
      unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED;

      super._web3ErrorHandler(unlockRequiredError);
    } else {
      super._web3UpdateHandler({
        updateAccount: true,
        account: accounts[0]
      });
    }
  }

}

/***/ }),

/***/ "./src/connectors/networkOnly.js":
/*!***************************************!*\
  !*** ./src/connectors/networkOnly.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NetworkOnlyConnector; });
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @0x/subproviders */ "@0x/subproviders");
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_0x_subproviders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connector */ "./src/connectors/connector.js");


class NetworkOnlyConnector extends _connector__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(kwargs) {
    const {
      supportedNetworkURLs,
      defaultNetwork
    } = kwargs;
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(supportedNetworkURL => Number(supportedNetworkURL));
    super({
      supportedNetworks
    });
    this.supportedNetworkURLs = supportedNetworkURLs;
    this.defaultNetwork = defaultNetwork;
  }

  async onActivation() {
    if (!this.engine) {
      const engine = new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["Web3ProviderEngine"]();
      this.engine = engine;
      this.engine.addProvider(new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["RPCSubprovider"](this.providerURL));
    }

    this.engine.start();
  }

  async getProvider(networkId = null) {
    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = networkId || this.defaultNetwork;

    super._validateNetworkId(networkIdToUse);

    return this.engine;
  }

  async getAccount() {
    return null;
  }

  onDeactivation() {
    if (this.engine) {
      this.engine.stop();
    }
  }

}

/***/ }),

/***/ "./src/connectors/privateKey.js":
/*!**************************************!*\
  !*** ./src/connectors/privateKey.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PrivateKeyConnector; });
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @0x/subproviders */ "@0x/subproviders");
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_0x_subproviders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connector */ "./src/connectors/connector.js");


class PrivateKeyConnector extends _connector__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(kwargs) {
    const {
      privateKey,
      supportedNetworkURLs,
      defaultNetwork
    } = kwargs;
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(supportedNetworkURL => Number(supportedNetworkURL));
    super({
      supportedNetworks
    });
    this.privateKey = privateKey;
    this.supportedNetworkURLs = supportedNetworkURLs;
    this.defaultNetwork = defaultNetwork;
  }

  async onActivation() {
    if (!this.engine) {
      const engine = new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["Web3ProviderEngine"]();
      this.engine = engine;
      this.engine.addProvider(new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["PrivateKeyWalletSubprovider"](this.privateKey));
      this.engine.addProvider(new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["RPCSubprovider"](this.providerURL));
    }

    this.engine.start();
  }

  async getProvider(networkId = null) {
    // we have to validate here because networkId might not be a key of supportedNetworkURLs
    const networkIdToUse = networkId || this.defaultNetwork;

    super._validateNetworkId(networkIdToUse);

    return this.engine;
  }

  async getAccount() {
    return super.getAccount(provider);
  }

  onDeactivation() {
    if (this.engine) {
      this.engine.stop();
    }
  }

}

/***/ }),

/***/ "./src/connectors/walletConnect.js":
/*!*****************************************!*\
  !*** ./src/connectors/walletConnect.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WalletConnectConnector; });
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @0x/subproviders */ "@0x/subproviders");
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_0x_subproviders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connector */ "./src/connectors/connector.js");


class WalletConnectConnector extends _connector__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(kwargs) {
    const {
      api: WalletConnectSubprovider,
      bridge,
      qrcode,
      supportedNetworkURLs,
      defaultNetwork
    } = kwargs;
    const supportedNetworks = Object.keys(supportedNetworkURLs).map(supportedNetworkURL => Number(supportedNetworkURL));
    super({
      supportedNetworks
    });
    this.WalletConnectSubprovider = WalletConnectSubprovider;
    this.bridge = bridge;
    this.qrcode = qrcode;
    this.supportedNetworkURLs = supportedNetworkURLs;
    this.defaultNetwork = defaultNetwork;
    this.connectAndSessionUpdateHandler = this.connectAndSessionUpdateHandler.bind(this);
    this.disconnectHandler = this.disconnectHandler.bind(this);
  }

  async onActivation() {
    if (!this.walletConnectSubprovider && !this.walletConnector) {
      const walletConnectSubprovider = new this.WalletConnectSubprovider({
        bridge: this.bridge,
        qrcode: this.qrcode
      });
      this.walletConnectSubprovider = walletConnectSubprovider;
      this.walletConnector = this.walletConnectSubprovider._walletConnector;
    }

    if (!this.walletConnector.connected) {
      await this.walletConnector.createSession();
    } // initialize event listeners


    this.walletConnector.on('connect', this.connectAndSessionUpdateHandler);
    this.walletConnector.on('session_update', this.connectAndSessionUpdateHandler);
    this.walletConnector.on('disconnect', this.disconnectHandler);
  }

  async getProvider(networkId = null) {
    // this should never happened, because it probably means there was a funky walletconnect race condition
    if (networkId && this.walletConnector.chainId && networkId !== this.walletConnector.chainId) {
      throw Error('Unexpected Error in WalletConnectConnector. Please file an issue on Github.');
    } // we have to validate here because networkId might not be a key of supportedNetworkURLs


    const networkIdToUse = this.walletConnector.chainId || networkId || this.defaultNetwork;

    super._validateNetworkId(networkIdToUse);

    const engine = new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["Web3ProviderEngine"]();
    this.engine = engine;
    engine.addProvider(this.walletConnectSubprovider);
    engine.addProvider(new _0x_subproviders__WEBPACK_IMPORTED_MODULE_0__["RPCSubprovider"](this.supportedNetworkURLs[networkIdToUse]));
    engine.start();
    return engine;
  }

  async getAccount(provider) {
    if (this.walletConnector.connected) {
      return super.getAccount(provider);
    } else {
      return null;
    }
  }

  onDeactivation() {
    // TODO remove listeners here once exposed in walletconnect
    if (this.engine) {
      this.engine.stop();
    }
  } // walletconnect event handlers


  connectAndSessionUpdateHandler(error, payload) {
    if (error) {
      super._web3ErrorHandler(error);
    } else {
      const {
        chainId,
        accounts
      } = payload.params[0]; // proactively handle wrong network errors

      try {
        super._validateNetworkId(chainId);

        super._web3UpdateHandler({
          updateNetworkId: true,
          updateAccount: true,
          networkId: chainId,
          account: accounts[0]
        });
      } catch (error) {
        super._web3ErrorHandler(error);
      }
    }
  }

  disconnectHandler(error) {
    if (error) {
      super._web3ErrorHandler(error);
    } else {
      super._web3ResetHandler();
    }
  }

}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default, subproviders, Connectors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./provider */ "./src/provider.js");
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @0x/subproviders */ "@0x/subproviders");
/* harmony import */ var _0x_subproviders__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_0x_subproviders__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "subproviders", function() { return _0x_subproviders__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _connectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connectors */ "./src/connectors/index.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Connectors", function() { return _connectors__WEBPACK_IMPORTED_MODULE_2__; });

/* harmony default export */ __webpack_exports__["default"] = (_provider__WEBPACK_IMPORTED_MODULE_0__["default"]);





/***/ }),

/***/ "./src/manager.js":
/*!************************!*\
  !*** ./src/manager.js ***!
  \************************/
/*! exports provided: ManagerErrorCodes, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManagerErrorCodes", function() { return ManagerErrorCodes; });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ "ethers");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _connectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connectors */ "./src/connectors/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "./src/state.js");



const ManagerErrorCodes = ['UNEXPECTED_ERROR', 'ALL_CONNECTORS_INVALID'].reduce((accumulator, currentValue) => {
  accumulator[currentValue] = currentValue;
  return accumulator;
}, {});
const unexpectedErrorMessage = 'web3-vanila encountered an unexpected internal error. See the console for details.';
const unexpectedError = Error(unexpectedErrorMessage);
unexpectedError.code = ManagerErrorCodes.UNEXPECTED_ERROR;
const initialWeb3State = {
  account: undefined,
  connectorName: undefined,
  error: null,
  networkId: undefined,
  provider: undefined
};

function normalizeAccount(account) {
  return account === null ? account : ethers__WEBPACK_IMPORTED_MODULE_0__["ethers"].utils.getAddress(account);
} // MutableRefObject, TODO


function useRef(initialValue = null) {
  const ref = {
    current: initialValue
  };
  return ref;
} // MutableRefObject, TODO


function useRefId() {
  const refId = useRef(0);

  function increment() {
    refId.current += 1;
  }

  return [refId, increment];
}

class Web3Manager {
  constructor(connectors) {
    [this.refId, this.incrementRefId] = useRefId();
    this.connectors = connectors;
    this.web3State = new _state__WEBPACK_IMPORTED_MODULE_2__["default"]();
  }

  get web3Initialized() {
    return !!(this.web3State.account !== undefined && this.web3State.connectorName && !this.web3State.error && this.web3State.provider && this.web3State.networkId);
  }

  get activeConnector() {
    return this.web3State.connectorName ? this.connectors[this.web3State.connectorName] : undefined;
  }

  updateWeb3State(state) {
    this.web3State.account = state.account;
    this.web3State.connectorName = state.connectorName;
    this.web3State.error = state.error;
    this.web3State.networkId = state.networkId;
    this.web3State.provider = state.provider;
    this.web3State.active = this.web3Initialized;
  }

  actionWeb3State(action) {
    const state = {
      account: this.web3State.account,
      connectorName: this.web3State.connectorName,
      error: this.web3State.error,
      networkId: this.web3State.networkId,
      provider: this.web3State.provider
    };

    switch (action.type) {
      case 'UPDATE_CONNECTOR_VALUES':
        {
          const {
            connectorName,
            provider,
            networkId,
            account
          } = action.payload;
          return this.updateWeb3State({
            connectorName,
            provider,
            networkId,
            account: normalizeAccount(account),
            error: null
          });
        }

      case 'UPDATE_NETWORK_ID':
        {
          const {
            provider,
            networkId
          } = action.payload;
          return this.updateWeb3State({ ...state,
            provider: provider || state.provider,
            networkId,
            error: null
          });
        }

      case 'UPDATE_ACCOUNT':
        {
          const {
            provider,
            account
          } = action.payload;
          return this.updateWeb3State({ ...state,
            provider: provider || state.provider,
            account: normalizeAccount(account),
            error: null
          });
        }

      case 'UPDATE_NETWORK_ID_AND_ACCOUNT':
        {
          const {
            provider,
            networkId,
            account
          } = action.payload;
          return this.updateWeb3State({ ...state,
            provider: provider || state.provider,
            account: normalizeAccount(account),
            error: null,
            networkId
          });
        }

      case 'SET_ERROR':
        return this.updateWeb3State({ ...initialWeb3State,
          error: action.payload
        });

      case 'SET_ERROR_PRESERVE_CONNECTOR_NAME':
        return this.updateWeb3State({ ...initialWeb3State,
          connectorName: state.connectorName,
          error: action.payload
        });

      case 'SET_ERROR_WITH_CONNECTOR_NAME':
        {
          const {
            connectorName,
            error
          } = action.payload;
          return this.updateWeb3State({ ...initialWeb3State,
            connectorName,
            error
          });
        }

      case 'RESET':
        return this.updateWeb3State(initialWeb3State);

      default:
        {
          console.warn('Default case encountered in actionWeb3State. Please file an issue on Github.');
          return this.updateWeb3State({ ...state,
            provider: undefined,
            networkId: undefined,
            account: undefined,
            error: unexpectedError
          });
        }
    }
  } // function to set the error state.


  setError(error, {
    preserveConnector = true,
    connectorName
  } = {}) {
    if (connectorName) {
      this.actionWeb3State({
        type: 'SET_ERROR_WITH_CONNECTOR_NAME',
        payload: {
          error,
          connectorName
        }
      });
    }

    if (preserveConnector) {
      this.actionWeb3State({
        type: 'SET_ERROR_PRESERVE_CONNECTOR_NAME',
        payload: error
      });
    } else {
      this.actionWeb3State({
        type: 'SET_ERROR',
        payload: error
      });
    }
  }

  offConnector() {
    const activeConnector = this.activeConnector;

    if (activeConnector) {
      this._web3UpdateHandler && activeConnector.removeListener('_web3Update', this._web3UpdateHandler);
      this._web3ErrorHandler && activeConnector.removeListener('_web3Error', this._web3ErrorHandler);
      this._web3ResetHandler && activeConnector.removeListener('_web3Reset', this._web3ResetHandler);
      activeConnector.onDeactivation(this.web3State.error);
    }
  }

  onConnector() {
    const activeConnector = this.activeConnector;

    if (activeConnector) {
      this._web3UpdateHandler = this.web3UpdateHandler.bind(this);
      this._web3ErrorHandler = this.web3ErrorHandler.bind(this);
      this._web3ResetHandler = this.web3ResetHandler.bind(this);
      activeConnector.on('_web3Update', this._web3UpdateHandler);
      activeConnector.on('_web3Error', this._web3ErrorHandler);
      activeConnector.on('_web3Reset', this._web3ResetHandler);
    }
  } // function to set a connector


  async setConnector(connectorName, {
    suppressAndThrowErrors = false,
    networkId
  } = {}) {
    const callingTimeRefId = this.refId.current;
    this.incrementRefId();
    const validConnectorNames = Object.keys(this.connectors);
    const connector = this.connectors[connectorName];

    if (!validConnectorNames.includes(connectorName)) {
      console.warn(`'${connectorName}' is not a valid name, please pass one of: ${validConnectorNames.join(', ')}.`);
      return;
    }

    if (connectorName === this.web3State.connectorName) {
      console.warn(`'${connectorName}' is already set. Calling 'setConnector' for a connector while it is active is a no-op.'`);
      return;
    } // at this point, begin initializing the connector


    try {
      await connector.onActivation();
      const provider = await connector.getProvider(networkId);
      const networkIdPromise = connector.getNetworkId(provider);
      const accountPromise = connector.getAccount(provider);
      await Promise.all([networkIdPromise, accountPromise]).then(([networkId, account]) => {
        if (this.refId.current !== callingTimeRefId + 1) {
          console.warn(`Silently suppressing status update from stale connector '${connectorName}'.`);
          return;
        }

        this.actionWeb3State({
          payload: {
            connectorName,
            provider,
            networkId,
            account
          },
          type: 'UPDATE_CONNECTOR_VALUES'
        });
        this.onConnector();
      });
    } catch (error) {
      // if the component has re-rendered since this function was called, eat the error
      if (this.refId.current !== callingTimeRefId + 1) {
        console.warn(`Silently handling error from '${connectorName}': ${error.toString()}`);
        return;
      }

      if (suppressAndThrowErrors) {
        throw error;
      } else {
        this.setError(error, {
          connectorName
        });
      }
    }
  } // expose a wrapper to set the first valid connector in a list


  async setFirstValidConnector(connectorNames, {
    suppressAndThrowErrors = false,
    networkIds = []
  } = {}) {
    for (const connectorName of connectorNames) {
      try {
        await this.setConnector(connectorName, {
          suppressAndThrowErrors: true,
          networkId: networkIds[connectorNames.indexOf(connectorName)]
        });
        break;
      } catch (error) {
        if (connectorName === connectorNames[connectorNames.length - 1]) {
          const error = Error('Unable to set any valid connector.');
          error.code = ManagerErrorCodes.ALL_CONNECTORS_INVALID;

          if (suppressAndThrowErrors) {
            throw error;
          } else {
            this.setError(error);
          }
        }
      }
    }
  } // function to unset the current connector


  unsetConnector() {
    this.offConnector();
    this.actionWeb3State({
      type: 'RESET'
    });
  }

  async web3UpdateHandler({
    updateNetworkId = false,
    updateAccount = false,
    overrideNetworkIdCheck = false,
    overrideAccountCheck = false,
    networkId,
    account
  } = {}) {
    if (!this.activeConnector) {
      console.warn('No active connector in web3UpdateHandler call. Please file an issue on Github.');
      this.setError(unexpectedError);
      return;
    }

    if (!updateNetworkId && !updateAccount || updateNetworkId && overrideNetworkIdCheck && !networkId || updateAccount && overrideAccountCheck && !account) {
      console.warn('Malformed parameters passed to web3UpdateHandler.');
      this.setError(unexpectedError);
      return;
    } // no checks required


    if ((!updateNetworkId || updateNetworkId && overrideNetworkIdCheck) && (!updateAccount || updateAccount && overrideAccountCheck)) {
      if (updateNetworkId && !updateAccount) {
        this.actionWeb3State({
          payload: {
            networkId
          },
          type: 'UPDATE_NETWORK_ID'
        });
      } else if (!updateNetworkId && updateAccount) {
        this.actionWeb3State({
          payload: {
            account
          },
          type: 'UPDATE_ACCOUNT'
        });
      } else {
        this.actionWeb3State({
          payload: {
            networkId,
            account
          },
          type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
        });
      }

      return;
    } // one or more checks required


    try {
      const fetchNewProvider = !this.web3State.provider || updateNetworkId && !overrideNetworkIdCheck;
      const provider = await (fetchNewProvider ? this.activeConnector.getProvider(networkId) : this.web3State.provider);
      const fetchNewNetworkId = this.web3State.networkId === undefined || updateNetworkId && !overrideNetworkIdCheck;
      const networkIdPromise = this.web3State.networkId === undefined || fetchNewNetworkId ? this.activeConnector.getNetworkId(provider) : this.web3State.networkId;
      const fetchNewAccount = this.web3State.account === undefined || updateAccount && !overrideAccountCheck;
      const accountPromise = this.web3State.account === undefined || fetchNewAccount ? this.activeConnector.getAccount(provider) : this.web3State.account;
      await Promise.all([networkIdPromise, accountPromise]).then(([returnedNetworkId, returnedAccount]) => {
        if (updateNetworkId && networkId && networkId !== returnedNetworkId) {
          console.warn(`Mismatched networkIds in web3UpdateHandler: ${networkId} and ${returnedNetworkId}.`);
          throw unexpectedError;
        }

        if (updateAccount && account && normalizeAccount(account) !== normalizeAccount(returnedAccount)) {
          console.warn(`Mismatched accounts in web3UpdateHandler: ${normalizeAccount(account)} and ${normalizeAccount(returnedAccount)}.`);
          throw unexpectedError;
        }

        if (fetchNewNetworkId && !fetchNewAccount) {
          this.actionWeb3State({
            payload: {
              provider: fetchNewProvider ? provider : undefined,
              networkId: returnedNetworkId
            },
            type: 'UPDATE_NETWORK_ID'
          });
        } else if (!fetchNewNetworkId && fetchNewAccount) {
          this.actionWeb3State({
            payload: {
              provider: fetchNewProvider ? provider : undefined,
              account: returnedAccount
            },
            type: 'UPDATE_ACCOUNT'
          });
        } else {
          this.actionWeb3State({
            payload: {
              provider: fetchNewProvider ? provider : undefined,
              networkId: returnedNetworkId,
              account: returnedAccount
            },
            type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
          });
        }
      });
    } catch (error) {
      this.setError(error);
    }
  }

  web3ErrorHandler(error, preserveConnector = true) {
    this.setError(error, {
      preserveConnector
    });
  }

  web3ResetHandler() {
    this.unsetConnector();
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Web3Manager);

/***/ }),

/***/ "./src/provider.js":
/*!*************************!*\
  !*** ./src/provider.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ "ethers");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manager */ "./src/manager.js");



class Web3Provider {
  constructor({
    connectors,
    libraryName = null,
    web3Api = null
  }) {
    this._libraryName = libraryName;
    this.web3Api = web3Api;
    this._web3Manger = new _manager__WEBPACK_IMPORTED_MODULE_1__["default"](connectors);
    this.setConnector = this._web3Manger.setConnector.bind(this._web3Manger);
    this.setFirstValidConnector = this._web3Manger.setFirstValidConnector.bind(this._web3Manger);
    this.unsetConnector = this._web3Manger.unsetConnector.bind(this._web3Manger);
    this.setError = this._web3Manger.setError.bind(this._web3Manger);
  }

  get library() {
    const providerToInject = this.provider && (() => {
      switch (this._libraryName) {
        case 'ethers.js':
          this.web3Api = ethers__WEBPACK_IMPORTED_MODULE_0__["ethers"];
          return new ethers__WEBPACK_IMPORTED_MODULE_0__["ethers"].providers.Web3Provider(this.provider);

        case 'web3.js':
          if (!this.web3Api) {
            const error = Error('web3Api is not exists.');
            error.code = 'WEB3_API_NOT_EXISTS';
            throw error;
          }

          return new this.web3Api(this.provider);

        case null:
          return this.provider;
      }
    })();

    return providerToInject;
  }

  get event() {
    return this._web3Manger.web3State;
  }

  get connector() {
    return this._web3Manger.activeConnector;
  }

  get active() {
    return this._web3Manger.web3State.active;
  }

  get connectorName() {
    return this._web3Manger.web3State.connectorName;
  }

  get provider() {
    return this._web3Manger.web3State.provider;
  }

  get networkId() {
    return this._web3Manger.web3State.networkId;
  }

  get account() {
    return this._web3Manger.web3State.account;
  }

  get error() {
    return this._web3Manger.web3State.error;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Web3Provider);

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);


class Web3State extends events__WEBPACK_IMPORTED_MODULE_0___default.a {
  constructor() {
    super(); // init

    this._account = undefined;
    this._connectorName = undefined;
    this._error = null;
    this._networkId = undefined;
    this._provider = undefined;
    this._active = false;
  } // getter


  get account() {
    return this._account;
  }

  get connectorName() {
    return this._connectorName;
  }

  get error() {
    return this._error;
  }

  get networkId() {
    return this._networkId;
  }

  get provider() {
    return this._provider;
  }

  get active() {
    return this._active;
  } // setter


  set account(_account) {
    if (_account !== this._account) {
      this._account = _account;
      this.emit('accountChanged', _account);
    }
  }

  set connectorName(_connectorName) {
    if (_connectorName !== this._connectorName) {
      this._connectorName = _connectorName;
      this.emit('connectorChanged', _connectorName);
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
      this._error = _error;
      if (_error) this.emit('error', _error);
    }
  }

  set networkId(_networkId) {
    if (_networkId !== this._networkId) {
      this._networkId = _networkId;
      this.emit('networkChanged', _networkId);
    }
  }

  set provider(_provider) {
    if (_provider !== this._provider) {
      this._provider = _provider;
      this.emit('providerChanged', _provider);
    }
  }

  set active(_active) {
    if (_active !== this._active) {
      this._active = _active;
      this.emit('active', _active);
    }
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Web3State);

/***/ }),

/***/ "@0x/subproviders":
/*!***********************************!*\
  !*** external "@0x/subproviders" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0x_subproviders__;

/***/ }),

/***/ "ethers":
/*!*************************!*\
  !*** external "ethers" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_ethers__;

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map