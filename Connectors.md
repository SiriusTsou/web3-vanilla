# Connectors

Connectors are Javascript classes that define how your dApp will interact with the Ethereum blockchain and user accounts. Connectors are _fully extensible_, meaning that if you don't like any of the options documented below, you can implement your own! `web3-vanilla` will work just the same. For more information, see [Custom-Connectors.md](./Custom-Connectors.md).

Note: Some Connectors throw specific errors that can be identified and handled appropriately by your dApp. In general, these error codes are available in the `.errorCodes` property of any Connector.

## `InjectedConnector`

Manages connectivity to injected web3 providers such as [MetaMask](https://metamask.io/) (or [Trust](https://trustwallet.com/)/[Tokenary](https://tokenary.io/)/etc.).

```javascript
import { Connectors } from 'web3-vanilla'

const MetaMask = Connectors.InjectedConnector({
  supportedNetworks: [...]
})
```

Arguments:

- `supportedNetworks: number[]` (optional): Enforces that the injected connector is connected to a particular network, throwing an error if not.

Throws:

- `Connector.UNSUPPORTED_NETWORK`: Thrown if a `supportedNetworks` array is provided, and the user is not on one of those networks.

- `InjectedConnector.ETHEREUM_ACCESS_DENIED`: Thrown when a user denies permission for your dApp to access their account.

- `InjectedConnector.LEGACY_PROVIDER`: Thrown when no global `ethereum` object is available, only the deprecated `web3` object.

- `InjectedConnector.NO_WEB3`: Thrown when visiting from a non-web3 browser.

- `InjectedConnector.UNLOCK_REQUIRED`: Thrown when a user's account is locked.

## `NetworkOnlyConnector``

Manages connectivity to a remote web3 provider such as [Infura](https://infura.io/) (or [Quiknode](https://quiknode.io/)/etc.).

```javascript
import { Connectors } from 'web3-vanilla'

const Infura = Connectors.NetworkOnlyConnector({
  providerURL: ...
})
```

Arguments:

- `providerURL` - The URL of a remote node.

Throws:

- `Connector.UNSUPPORTED_NETWORK`: Thrown if a `supportedNetworks` array is provided, and the user is not on one of those networks.

## `PrivateKeyConnector``

Inject PrivateKey for fake account & Manages connectivity to a remote web3 provider such as [Infura](https://infura.io/) (or [Quiknode](https://quiknode.io/)/etc.).

```javascript
import { Connectors } from 'web3-vanilla'

const PrivateKey = Connectors.PrivateKeyConnector({
  providerURL: ...,
  privateKey: ...,
})
```

Arguments:

- `providerURL` - The URL of a remote node.
- `privateKey` - The PrivateKey for fake account.

Throws:

- `Connector.UNSUPPORTED_NETWORK`: Thrown if a `supportedNetworks` array is provided, and the user is not on one of those networks.

## `WalletConnectConnector`

### IMPORTANT: To use WalletConnectConnector, you must install the SDK:

```bash
npm install @walletconnect/web3-subprovider@^1.0.0-beta.38
```

Manages connectivity to a [WalletConnect](https://walletconnect.org/) wallet.

```javascript
import { Connectors } from 'web3-vanilla'
import WalletConnectApi from '@walletconnect/web3-subprovider'

const WalletConnect = Connectors.WalletConnectConnector({
  api: WalletConnectApi,
  bridge: ...,
  qrcode: ...,
  supportedNetworkURLs: ...,
  defaultNetwork: ...
})
```

Arguments:

- `api: any` - An instance of the [`@walletconnect/web3-subprovider`](https://github.com/WalletConnect/walletconnect-monorepo) API, version `^1.0.0-beta.1`.

- `bridge: string` - The URL of the WalletConnect bridge.

- `qrcode: boolean` - The qrcode of the WalletConnect qrcode.

- `supportedNetworkURLs: any` - An object whose keys are network IDs, and values are remote nodes that can connect to that network ID.

- `defaultNetwork: number` - The network ID that the connector will use by default.
