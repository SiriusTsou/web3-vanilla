# web3-vanilla 🧰

[![npm version](https://img.shields.io/npm/v/web3-vanilla/latest.svg)](https://www.npmjs.com/package/web3-vanilla/v/latest)

It's a vanilla version of [web3-react](https://github.com/NoahZinsmeister/web3-react).

## Introduction

`web3-vanilla` is a simple, powerful framework for building modern Ethereum dApps using VanillaJS. Its marquee features are:

- Full support for commonly used web3 providers, including [MetaMask](https://metamask.io/)/[Infura](https://infura.io/)/[WalletConnect](https://walletconnect.org/), and more.

- A dev-friendly context containing an instantiated [ethers.js](https://github.com/ethers-io/ethers.js/) or [web3.js](https://web3js.readthedocs.io/en/1.0/) instance, the current account and network id, and more.

- The ability to write custom, fully featured _Connectors_ that manage every aspect of your dApp's connectivity with the Ethereum blockchain and user accounts.

### 1. Install

Next, you'll have to install [ethers.js](https://github.com/ethers-io/ethers.js/). If you'd like to use [web3.js](https://web3js.readthedocs.io/en/1.0/) instead, you can _additionally_ install it (note that ethers.js is still required, as it's an internal dependency to the library).

```bash
# required
npm install ethers
# optional
npm install web3
```

Finally you're ready to use `web3-vanilla`:
### NodeJS
```bash
npm install web3-vanilla@latest
```

### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/web3-vanilla@latest/dist/web3-vanilla.min.js"></script>
```

### 2. Setup Connectors

Now, you'll need to decide how you want users to interact with your dApp. This is almost always with some combination of MetaMask, Infura, WalletConnect, etc. For more details on each of these options, see [Connectors.md](./Connectors.md).

```javascript
import { Connectors } from 'web3-vanilla'
const { InjectedConnector, NetworkOnlyConnector } = Connectors

const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] })

const Infura = new NetworkOnlyConnector({
  supportedNetworkURLs: {
    1: 'https://mainnet.infura.io/v3/...',
  },
  defaultNetwork: 1,
})

const connectors = { MetaMask, Infura }
```

### 3. Setup `Web3Provider`

The next step is to setup a `Web3Provider` at the root of your dApp.

```javascript
import Web3 from 'web3.js'
import Web3Provider from 'web3-vanilla'

const web3Provider = new Web3Provider({
  connectors: connectors,
  libraryName: 'web3.js',
  web3Api: Web3,
})
```

The `Web3Provider` takes 3 props:

1. `connectors: any` (required): An object mapping arbitrary `string` connector names to Connector objects (see [the previous section](#2-setup-connectors) for more detail).

1. `libraryName: string` (required): `ethers.js`|`web3.js`|`null` depending on which library you wish to use in your dApp. Passing `null` will expose the low-level provider object (you probably don't want this).

1. `web3Api: any` (optional): If you use `web3.js`, this prop must be defined, with the value of the default export of `web3` (e.g. `import Web3 from 'web3'`).

### 4. Activate

Now, you need to decide how/when you would like to activate your Connectors. For all options, please see [the manager functions](#manager-functions) section. The example code below attempts to automatically activate MetaMask, and falls back to infura.

```javascript
await web3Provider.setFirstValidConnector(['MetaMask', 'Infura'])
```

### 5. Using `web3-vanilla`

Finally, you're ready to use `web3-vanilla`!


## Web3Provider

Regardless of how you access the `web3-vanilla` Web3Provider, it will look like:

```typescript
{
  active: boolean
  connectorName?: string
  connector?: any
  library?: any
  networkId?: number
  account?: string | null
  error: Error | null

  setConnector: (connectorName: string, options?: SetConnectorOptions) => Promise<void>
  setFirstValidConnector: (connectorNames: string[], options?: SetFirstValidConnectorOptions) => Promise<void>
  unsetConnector: () => void
  setError: (error: Error, options?: SetFirstValidConnectorOptions) => void
}
```

### Variables

- `active`: A flag indicating whether `web3-vanilla` currently has an connector set.
- `connectorName`: The name of the currently active connector.
- `connector`: The currently active connector object.
- `library`: An instantiated [ethers.js](https://github.com/ethers-io/ethers.js/) or [web3.js](https://web3js.readthedocs.io/en/1.0/) instance (or the low-level provider object).
- `networkId`: The current active network ID.
- `account`: The current active account if one exists.
- `error`: The current active error if one exists.

### Manager Functions

- `setConnector(connectorName: string, { suppressAndThrowErrors?: boolean, networkId?: number })`: Activates a connector by name. The optional second argument has two keys: `suppressAndThrowErrors` (`false` by default) that controls whether errors, instead of bubbling up to `Web3Provider.error`, are instead thrown by this function, and `networkId`, an optional manual network id passed to the `getProvider` method of the connector.
- `setFirstValidConnector(connectorNames: string[], { suppressAndThrowErrors?: boolean, networkIds?: number[] })`: Tries to activate each connector in turn by name. The optional second argument has two keys: `suppressAndThrowErrors` (`false` by default) that controls whether errors, instead of bubbling up to `Web3Provider.error`, are instead thrown by this function, and `networkIds`, optional manual network ids passed to the `getProvider` method of the connector in turn.
- `unsetConnector()`: Unsets the currently active connector.
- `setError: (error: Error, { preserveConnector?: boolean, connectorName?: string }) => void`: Sets `Web3Provider.error`, optionally preserving the current connector if `preserveConnector` is `true` (default `true`), or setting a `connectorName` (note that if you're doing this, `preserveConnector` is ignored).

## Implementations

Projects using `web3-vanilla` include:

- [LOOM_BBS](https://github.com/pelith/LOOM_BBS)

Open a PR to add your project to the list! If you're interested in contributing, check out [Contributing-Guidelines.md](./docs/Contributing-Guidelines.md).
