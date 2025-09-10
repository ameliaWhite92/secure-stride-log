import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Secure Stride Log',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [sepolia, mainnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const supportedChains = [sepolia, mainnet];
export const defaultChain = sepolia;
