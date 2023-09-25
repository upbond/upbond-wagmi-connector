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

- This @wagmi-connector only works with @wagmi version 1.x.x
- See running example in our [demo site](https://rainbowkit-connector-sample.upbond.io). You can refer to the demo source code in the example folder.
- Setup your wagmi into your project, see [docs](https://wagmi.sh/core/getting-started)
- Import upbond wagmi connector

```javascript
import UpbondWalletConnector from '@upbond/wagmi-connector';
import { createConfig, WagmiConfig, configureChains } from 'wagmi';
import { mainnet, polygon, polygonMumbai, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// ... your imports
```

- Configure your wagmi with `@upbond/wagmi-connector`

```javascript
const { chains, publicClient } = configureChains(
  [mainnet, polygon, goerli, polygonMumbai],
  [publicProvider()]
);

const upbondConnector = new UpbondWalletConnector({
  chains: chains,
  options: {
    host: 'goerli',
    chainId: 5,
    buttonPosition: 'bottom-left',
    // ... your upbond configuration
  },
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [upbondConnector /** or another connectors */],
  publicClient,
});
```

## Related docs

[Upbond Embed](https://www.npmjs.com/package/@upbond/upbond-embed)

[Wagmi](https://wagmi.sh/core/getting-started)

[Thidweb](https://portal.thirdweb.com/)
