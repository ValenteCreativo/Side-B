/**
 * Centralized Network Configuration for Side-B
 * 
 * This file contains all network-specific settings for easy switching
 * between testnet and mainnet environments.
 */

// Environment toggle - set to 'mainnet' for production
export const NETWORK_ENV = 'testnet' as const

// Network configurations
const NETWORKS = {
    testnet: {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: process.env.BASE_RPC_URL || 'https://sepolia.base.org',
        explorerUrl: 'https://sepolia.basescan.org',
        explorerName: 'BaseScan (Sepolia)',
        // Base Sepolia USDC (Circle's official testnet USDC)
        usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`,
        // CDP network identifier
        cdpNetwork: 'base-sepolia' as const,
        // Faucet for test tokens
        faucetUrl: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet',
        usdcFaucetUrl: 'https://faucet.circle.com/',
    },
    mainnet: {
        name: 'Base',
        chainId: 8453,
        rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
        explorerUrl: 'https://basescan.org',
        explorerName: 'BaseScan',
        // Base Mainnet USDC
        usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
        // CDP network identifier
        cdpNetwork: 'base' as const,
        faucetUrl: null,
        usdcFaucetUrl: null,
    },
} as const

// Export current network config
export const NETWORK = NETWORKS[NETWORK_ENV]

// Helper functions
export function getExplorerAddressUrl(address: string): string {
    return `${NETWORK.explorerUrl}/address/${address}`
}

export function getExplorerTxUrl(txHash: string): string {
    return `${NETWORK.explorerUrl}/tx/${txHash}`
}

export function isTestnet(): boolean {
    return NETWORK_ENV === 'testnet'
}
