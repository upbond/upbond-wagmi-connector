# upbond-wagmi-connector

manage the interaction of your Dapp with [Upbond Embed](https://www.npmjs.com/package/@upbond/upbond-embed)

![Upbond logo](https://nftasset.s3.ap-northeast-1.amazonaws.com/UPBOND+LOGO.png)

## Installation

```terminal
npm install @upbond/wagmi-connector
```

or

```terminal
yarn add @upbond/wagmi-connector
```

## Getting started

- See running example in our [demo site](https://rainbowkit-connector-sample.upbond.io). You can refer to the demo source code in the example folder.
- Setup your wagmi into your project, see [docs](https://wagmi.sh/core/getting-started)
- Import upbond wagmi connector

```javascript
import UpbondWagmiConnector from '@upbond/wagmi-connector';
import { configureChains, createClient, useSigner, WagmiConfig } from 'wagmi';
// ... your imports
```

- Configure your wagmi with `@upbond/wagmi-connector`

```javascript
const { chains, provider } = configureChains(
  [polygon, polygonMumbai, goerli, mainnet],
  [publicProvider()]
);

const upbondConnector = new UpbondWagmiConnector({
  chains: chains,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left',
    // ... your upbond configuration
  },
});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [upbondConnector /** or another connectors */],
});
```

## Related docs

[Upbond Embed](https://www.npmjs.com/package/@upbond/upbond-embed)

[Wagmi](https://wagmi.sh/core/getting-started)

[Thidweb](https://portal.thirdweb.com/)
