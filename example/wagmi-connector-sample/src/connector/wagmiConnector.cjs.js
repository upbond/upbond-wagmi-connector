/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* reexport */ UpbondWagmiConnector)
});

;// CONCATENATED MODULE: external "@babel/runtime/helpers/defineProperty"
const defineProperty_namespaceObject = require("@babel/runtime/helpers/defineProperty");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty_namespaceObject);
;// CONCATENATED MODULE: external "@upbond/upbond-embed"
const upbond_embed_namespaceObject = require("@upbond/upbond-embed");
var upbond_embed_default = /*#__PURE__*/__webpack_require__.n(upbond_embed_namespaceObject);
;// CONCATENATED MODULE: external "@wagmi/core"
const core_namespaceObject = require("@wagmi/core");
;// CONCATENATED MODULE: external "ethers"
const external_ethers_namespaceObject = require("ethers");
;// CONCATENATED MODULE: external "viem"
const external_viem_namespaceObject = require("viem");
;// CONCATENATED MODULE: ./src/config/index.ts

const initialUpbondConfig = {
  buildEnv: upbond_embed_namespaceObject.UPBOND_BUILD_ENV.DEVELOPMENT,
  network: {
    host: 'mainnet',
    chainId: 1,
    networkName: 'Ethereum Mainnet',
    blockExplorer: 'https://etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com'
  },
  whiteLabel: {
    walletTheme: {
      lang: `${window.navigator.language}`,
      logo: 'https://i.ibb.co/L6vHB5d/company-logo-sample.png',
      name: 'Company',
      buttonLogo: 'https://i.ibb.co/wBmybLc/company-button-logo-sample.png',
      isActive: true,
      modalColor: '#fffff',
      bgColor: '#4B68AE',
      bgColorHover: '#214999',
      textColor: '#f3f3f3',
      textColorHover: '#214999',
      upbondLogin: {
        globalBgColor: '#ffffff',
        globalTextColor: '#4B68AE'
      }
    }
  },
  widgetConfig: {
    showAfterLoggedIn: true,
    showBeforeLoggedIn: false
  }
};
;// CONCATENATED MODULE: ./src/lib/connector.ts

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { defineProperty_default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }





const IS_SERVER = typeof window === 'undefined';
function normalizeChainId(chainId) {
  if (typeof chainId === 'string') return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10);
  if (typeof chainId === 'bigint') return Number(chainId.toString(10));
  return chainId;
}
class UpbondWagmiConnector extends core_namespaceObject.Connector {
  constructor(config) {
    var _this;
    super({
      options: config.options,
      chains: config.chains
    });
    _this = this;
    defineProperty_default()(this, "ready", !IS_SERVER);
    defineProperty_default()(this, "id", 'upbond');
    defineProperty_default()(this, "name", 'Upbond Wallet');
    defineProperty_default()(this, "provider", null);
    defineProperty_default()(this, "upbondInstance", void 0);
    defineProperty_default()(this, "isConnected", void 0);
    defineProperty_default()(this, "isConnectorInitialized", true);
    defineProperty_default()(this, "upbondInitialParams", initialUpbondConfig);
    defineProperty_default()(this, "network", initialUpbondConfig.network);
    defineProperty_default()(this, "onAccountsChanged", function () {
      for (var _len = arguments.length, accounts = new Array(_len), _key = 0; _key < _len; _key++) {
        accounts[_key] = arguments[_key];
      }
      _this.emit('change', {
        account: accounts[0]
      });
    });
    defineProperty_default()(this, "onChainChanged", chainId => {
      const id = normalizeChainId(chainId);
      const unsupported = this.isChainUnsupported(id);
      this.emit('change', {
        chain: {
          id,
          unsupported
        }
      });
    });
    defineProperty_default()(this, "onDisconnect", () => {
      console.log(`onDisconnect`);
      // this.disconnect();
    });
    defineProperty_default()(this, "onConnect", () => {
      this.emit('connect', {});
    });
    const _chainId = config.options.chainId ? config.options.chainId : 1;
    const host = config.options.host ? config.options.host : 'mainnet';
    this.upbondInstance = new (upbond_embed_default())({});
    this.isConnected = false;

    // set network according to chain details provided
    const chain = this.chains.find(x => x.id === _chainId);
    if (chain) {
      var _chain$nativeCurrency, _chain$nativeCurrency2, _chain$blockExplorers;
      this.network = {
        host,
        chainId: _chainId,
        networkName: chain.name,
        tickerName: (_chain$nativeCurrency = chain.nativeCurrency) === null || _chain$nativeCurrency === void 0 ? void 0 : _chain$nativeCurrency.name,
        ticker: (_chain$nativeCurrency2 = chain.nativeCurrency) === null || _chain$nativeCurrency2 === void 0 ? void 0 : _chain$nativeCurrency2.symbol,
        blockExplorer: (_chain$blockExplorers = chain.blockExplorers) === null || _chain$blockExplorers === void 0 || (_chain$blockExplorers = _chain$blockExplorers.default) === null || _chain$blockExplorers === void 0 ? void 0 : _chain$blockExplorers.url
      };
    } else {
      console.warn(`ChainId ${_chainId} not found in chain list`);
      this.emit('disconnect');
    }
    this.isConnectorInitialized = true;
    if (config.upbondInitialParams && Object.keys(config.upbondInitialParams).length > 0) {
      this.upbondInitialParams = _objectSpread(_objectSpread({}, this.upbondInitialParams), config.upbondInitialParams);
    }
  }
  async initConnector() {
    this.emit('message', {
      type: 'connecting'
    });
    await this.upbondInstance.init(this.upbondInitialParams);
    const isUpbondLoggedIn = this.upbondInstance.isLoggedIn && this.upbondInstance.isInitialized;
    if (isUpbondLoggedIn) {
      this.isConnected = true;
      this.onConnect();
      const provider = this.upbondInstance.provider;
      if (provider.on) {
        provider.on('connect', this.onConnect);
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', res => this.onChainChanged(res));
        provider.on('disconnect', this.onDisconnect);
      }
    }
  }
  setStorage(storage) {
    return true;
  }
  async getWalletClient() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
    const chain = this.chains.find(x => x.id === chainId);
    if (!provider) throw new Error('provider is required.');
    return (0,external_viem_namespaceObject.createWalletClient)({
      account,
      chain,
      transport: (0,external_viem_namespaceObject.custom)(provider)
    });
  }
  async connect() {
    try {
      this.emit('message', {
        type: 'connecting'
      });
      if (!this.upbondInstance.isInitialized) {
        await this.upbondInstance.init(_objectSpread(_objectSpread({}, this.upbondInitialParams), {}, {
          network: this.network
        }));
      }
      if (!this.upbondInstance.isLoggedIn) await this.upbondInstance.login();
      const provider = this.upbondInstance.provider;
      if (provider.on) {
        provider.on('connect', () => {
          // TODO: do anything with on connect emitter
        });
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', async res => {
          this.onChainChanged(res);
        });
        provider.on('disconnect', this.onDisconnect);
      }

      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      // Check if we have a chainId, in case of error just assign 0 for legacy
      // if there is a user logged in, return the user
      if (isAuthenticated) {
        this.onConnect();
        const account = await this.getAccount();
        const getChainId = async () => {
          try {
            return await this.getChainId();
          } catch (error) {
            return 0;
          }
        };
        const chainId = await getChainId();
        return {
          account,
          chain: {
            id: chainId,
            unsupported: false
          }
        };
      }
      throw new Error('Failed to login, Please try again');
    } catch (error) {
      console.error(error, '@connectError');
      throw new external_viem_namespaceObject.UserRejectedRequestError(new Error('Something went wrong'));
    }
  }
  async getAccount() {
    try {
      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: 'eth_accounts'
      });
      return (0,external_viem_namespaceObject.getAddress)(accounts[0]);
    } catch (error) {
      console.error('Error: Cannot get account:', error);
      throw error;
    }
  }
  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    if (!this.upbondInstance.isInitialized) {
      await this.upbondInstance.init(this.upbondInitialParams);
    }
    this.provider = this.upbondInstance.provider;
    return this.provider;
  }
  async getSigner() {
    try {
      const provider = new external_ethers_namespaceObject.ethers.providers.Web3Provider(await this.getProvider());
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error('Error: Cannot get signer:', error);
      throw error;
    }
  }
  async isAuthorized() {
    if (!this.upbondInstance.isInitialized) {
      await this.upbondInstance.init(this.upbondInitialParams);
    }
    return this.upbondInstance.isLoggedIn && !!this.upbondInstance.provider;
  }
  async getChainId() {
    try {
      var _this$network;
      const provider = await this.getProvider();
      if (!provider && (_this$network = this.network) !== null && _this$network !== void 0 && _this$network.chainId) {
        return normalizeChainId(this.network.chainId);
      } else if (provider) {
        const chainId = await provider.request({
          method: 'eth_chainId'
        });
        if (chainId) {
          return normalizeChainId(chainId);
        }
      }
      throw new Error('Chain ID is not defined');
    } catch (error) {
      console.error('Error: Cannot get Chain Id from the network.', error);
      throw error;
    }
  }
  async switchChain(chainId) {
    try {
      const upbondSupportedNetworks = [{
        name: 'Ethereum Mainnet',
        chainId: 1,
        host: 'mainnet'
      }, {
        name: 'Goerli',
        chainId: 5,
        host: 'goerli'
      }, {
        name: 'Polygon',
        chainId: 137,
        host: 'matic'
      }, {
        name: 'Mumbai',
        chainId: 80001,
        host: 'mumbai'
      }, {
        name: 'Astar Mainnet',
        chainId: 80001,
        host: 'astar_mainnet'
      }];
      const selectedNetwork = upbondSupportedNetworks.find(network => network.chainId === chainId);
      const wagmiSelectedNetwork = this.chains.find(chain => chain.id === chainId);
      if (!wagmiSelectedNetwork) {
        throw new Error(`Network with chain id ${chainId} is not available, please configure your network first`);
      }
      if (!selectedNetwork) {
        throw new Error(`Hold up! upbond does not support this network -> ${chainId}`);
      }
      if (!this.isAuthorized()) throw new Error('Please login first');
      await this.upbondInstance.setProvider({
        host: selectedNetwork.host,
        chainId,
        networkName: selectedNetwork.name
      });
      return wagmiSelectedNetwork;
    } catch (error) {
      console.error('Error: Cannot change chain', error);
      throw error;
    }
  }
  async disconnect() {
    await this.upbondInstance.logout();
    await this.upbondInstance.cleanUp();
    localStorage.clear();
    window.location.reload();
  }
  isChainUnsupported(chainId) {
    return !this.chains.some(x => x.id === chainId);
  }
}
;// CONCATENATED MODULE: ./src/index.ts

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=wagmiConnector.cjs.js.map