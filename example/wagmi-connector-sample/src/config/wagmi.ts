import { goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains';
import { configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [polygon, polygonMumbai, goerli, mainnet],
  [publicProvider()]
);

export { chains, provider };
