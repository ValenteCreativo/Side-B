# Side B Smart Contracts

Automated payment splitting smart contracts for the Side B music licensing platform on Base Network.

## Overview

The `SideBPaymentSplitter` contract enables trustless, automated payment splitting between musicians (97%) and the Side B platform (3%) for every license purchase. Supports both ETH and USDC payments.

## Features

- **Automated Payment Splitting**: 97% to musician, 3% to platform
- **Multi-Currency Support**: ETH and USDC (6 decimals)
- **Security First**: ReentrancyGuard, SafeERC20, Ownable patterns
- **Gas Optimized**: Direct transfers, unchecked math where safe
- **Configurable**: Adjustable platform fee (max 5%) and platform wallet
- **Event Tracking**: Comprehensive event emission for off-chain verification

## Installation

```bash
# Install dependencies
forge install

# Compile contracts
forge build

# Run tests (25/25 passing ✅)
forge test
```

## Deployment

### Prerequisites

Set up `.env` in project root:
```bash
PRIVATE_KEY="your_private_key_here"
PLATFORM_WALLET_ADDRESS="0x...your_platform_wallet"
BASE_RPC_URL="https://mainnet.base.org"
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

### Deploy to Base Sepolia Testnet

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify
```

### Deploy to Base Mainnet

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url base --broadcast --verify
```

## Network Addresses

**Base Mainnet (Chain ID: 8453)**
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Explorer: https://basescan.org

**Base Sepolia Testnet (Chain ID: 84532)**
- USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Explorer: https://sepolia.basescan.org

## Testing

```bash
forge test              # Run all tests
forge test -vv         # Verbose output
forge test --gas-report # Gas usage report
forge coverage         # Coverage report
```

**Test Coverage**: 25/25 tests passing ✅

## License

MIT - See LICENSE file for details
