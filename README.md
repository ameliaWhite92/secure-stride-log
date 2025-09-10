# Secure Stride Log

A privacy-preserving fitness tracking application built with FHE (Fully Homomorphic Encryption) technology.

## Features

- **Privacy-First Design**: All fitness data is encrypted using FHE technology
- **Wallet Integration**: Connect with multiple wallet providers (Rainbow, MetaMask, etc.)
- **Secure Data Storage**: Fitness logs are stored encrypted on-chain
- **Real-time Tracking**: Track workouts, steps, and fitness metrics securely
- **Impact Reporting**: Generate encrypted impact reports for fitness achievements

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum, FHEVM
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity with FHE encryption

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ameliaWhite92/secure-stride-log.git
cd secure-stride-log
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Smart Contract

The application uses FHE-enabled smart contracts to ensure privacy:

- **SecureStrideLog.sol**: Main contract for storing encrypted fitness data
- **FHE Encryption**: All sensitive data is encrypted using FHE technology
- **Privacy Preservation**: Data remains encrypted even during computation

## Wallet Integration

The application supports multiple wallet providers:

- Rainbow Wallet
- MetaMask
- WalletConnect
- Coinbase Wallet

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI components (shadcn/ui)
│   └── WalletComponent.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── main.tsx           # Application entry point
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.