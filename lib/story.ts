/**
 * Story Protocol Integration
 *
 * Official Documentation:
 * - https://docs.story.foundation/developers/typescript-sdk/setup
 * - https://docs.story.foundation/developers/typescript-sdk/register-ip-asset
 *
 * Block Explorer: https://aeneid.explorer.story.foundation
 *
 * This module handles IP asset registration on Story Protocol for music sessions.
 * Each uploaded track is registered as intellectual property with metadata.
 */

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { Address, Hex } from 'viem'
import { privateKeyToAccount, Account } from 'viem/accounts'
import { createHash } from 'crypto'

// Story Protocol SPG NFT Collection (public testnet collection)
// For production, create your own collection with client.nftClient.createNFTCollection()
const SPG_NFT_CONTRACT = '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as Address

// Initialize Story client (lazy initialization to avoid errors in dev)
let storyClient: StoryClient | null = null

function getStoryClient(): StoryClient {
  if (!storyClient) {
    // Check for required environment variables
    const privateKey = process.env.STORY_PRIVATE_KEY
    const rpcUrl = process.env.STORY_RPC_URL || 'https://aeneid.storyrpc.io'

    if (!privateKey) {
      console.warn('⚠️  STORY_PRIVATE_KEY not configured. Using mock IP registration.')
      throw new Error('Story Protocol credentials not configured')
    }

    try {
      // Create account from private key following official Story Protocol setup
      // Docs: https://docs.story.foundation/developers/typescript-sdk/setup
      const account: Account = privateKeyToAccount(
        (privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`) as Address
      )

      // Configure Story client with Aeneid testnet settings
      const config: StoryConfig = {
        account: account,
        transport: http(rpcUrl),
        chainId: 'aeneid', // Story Aeneid testnet
      }

      storyClient = StoryClient.newClient(config)
      console.log('✅ Story Protocol client initialized')
      console.log(`   Chain: Aeneid testnet`)
      console.log(`   RPC: ${rpcUrl}`)
      console.log(`   Wallet: ${account.address}`)
    } catch (error) {
      console.error('❌ Failed to initialize Story client:', error)
      throw new Error('Story Protocol client initialization failed. Check your credentials.')
    }
  }
  return storyClient
}

export interface RegisterSessionParams {
  title: string
  description: string
  audioUrl: string
  ownerWallet: Address
  contentType: 'JAM' | 'REHEARSAL' | 'PRODUCED'
  moodTags?: string[]
}

export interface RegisterSessionResult {
  storyAssetId: string
  txHash: string
  ipId?: string
  explorerUrl: string
}

/**
 * Register a music session as IP on Story Protocol
 *
 * This uses registerIpAsset which:
 * 1. Mints an NFT (if using SPG)
 * 2. Registers it as an IP Asset
 * 3. Returns the IP ID and transaction details
 *
 * Reference: https://docs.story.foundation/developers/typescript-sdk/register-ip-asset
 */
export async function registerSessionAsIp(
  params: RegisterSessionParams
): Promise<RegisterSessionResult> {
  const { title, description, audioUrl, ownerWallet, contentType, moodTags = [] } = params

  // Development mode fallback (mock registration when Story keys not configured)
  if (!process.env.STORY_PRIVATE_KEY) {
    console.warn('⚠️  Story Protocol not configured. Using mock IP registration.')
    console.log('📝 Would register IP:', { title, contentType })

    const mockAssetId = `mock-ip-${Date.now()}`
    return {
      storyAssetId: mockAssetId,
      txHash: `0xmock${Date.now()}` as Hex,
      explorerUrl: `https://aeneid.explorer.story.foundation/tx/0xmock${Date.now()}`,
    }
  }

  try {
    const client = getStoryClient()

    console.log('🎵 Registering IP on Story Protocol Aeneid testnet...')
    console.log(`   Title: "${title}"`)
    console.log(`   Type: ${contentType}`)
    console.log(`   Description: "${description.substring(0, 50)}..."`)

    // Create metadata for the music session
    const ipMetadata = {
      title: title,
      description: description,
      contentType: contentType,
      audioUrl: audioUrl,
      moodTags: moodTags.join(', '),
      platform: 'Side B Sessions',
      createdAt: new Date().toISOString(),
    }

    const nftMetadata = {
      name: title,
      description: description,
      image: '', // Could add album art URL here
      attributes: [
        { trait_type: 'Content Type', value: contentType },
        { trait_type: 'Platform', value: 'Side B Sessions' },
      ],
    }

    console.log('   IP Metadata:', ipMetadata)

    // Compute SHA-256 hashes for metadata (required by Story Protocol - bytes32 format)
    // Docs: https://docs.story.foundation/developers/typescript-sdk/register-ip-asset
    const ipMetadataHash = `0x${createHash('sha256')
      .update(JSON.stringify(ipMetadata))
      .digest('hex')}` as Hex

    const nftMetadataHash = `0x${createHash('sha256')
      .update(JSON.stringify(nftMetadata))
      .digest('hex')}` as Hex

    console.log('   IP Hash:', ipMetadataHash)
    console.log('   NFT Hash:', nftMetadataHash)

    // Register IP Asset using Story Protocol
    // Docs: https://docs.story.foundation/developers/typescript-sdk/register-ip-asset
    const response = await client.ipAsset.registerIpAsset({
      nft: {
        type: 'mint',
        spgNftContract: SPG_NFT_CONTRACT,
      },
      ipMetadata: {
        ipMetadataURI: '', // In production, upload to IPFS and use: `https://ipfs.io/ipfs/${hash}`
        ipMetadataHash: ipMetadataHash,
        nftMetadataURI: '', // In production, upload to IPFS and use: `https://ipfs.io/ipfs/${hash}`
        nftMetadataHash: nftMetadataHash,
      },
    })

    const ipId = response.ipId as string
    const txHash = response.txHash as string

    console.log('✅ IP registered successfully on Story Protocol!')
    console.log(`   IP ID: ${ipId}`)
    console.log(`   Transaction: ${txHash}`)
    console.log(`   Explorer: https://aeneid.explorer.story.foundation/tx/${txHash}`)

    return {
      storyAssetId: ipId,
      txHash: txHash,
      ipId: ipId,
      explorerUrl: `https://aeneid.explorer.story.foundation/tx/${txHash}`,
    }
  } catch (error) {
    console.error('❌ Story Protocol registration failed:', error)

    // Provide helpful error messages
    if (error instanceof Error) {
      console.error('   Error details:', error.message)

      if (error.message.includes('insufficient funds') || error.message.includes('insufficient balance')) {
        throw new Error('Insufficient funds in wallet. Please get testnet tokens from the Story faucet.')
      }
      if (error.message.includes('nonce')) {
        throw new Error('Transaction nonce error. Please try again.')
      }
      if (error.message.includes('revert')) {
        throw new Error('Transaction reverted. Check your wallet has the required permissions.')
      }
      throw new Error(`Failed to register IP: ${error.message}`)
    }

    throw new Error('Failed to register IP on Story Protocol. Please check your configuration and try again.')
  }
}

/**
 * Retrieve IP asset details from Story Protocol
 *
 * For now, this returns basic explorer info. In production, you can use
 * client.ipAsset.ipAssetRegistryClient to query on-chain IP asset data.
 *
 * Reference: https://docs.story.foundation/developers/typescript-sdk/read-ip-data
 */
export async function getIpAssetDetails(ipId: string) {
  return {
    ipId: ipId,
    chainId: 'aeneid',
    explorerUrl: `https://aeneid.explorer.story.foundation/address/${ipId}`,
  }
}

/**
 * Get the explorer URL for a transaction or IP asset
 */
export function getExplorerUrl(txHashOrIpId: string): string {
  if (txHashOrIpId.startsWith('0x')) {
    return `https://aeneid.explorer.story.foundation/tx/${txHashOrIpId}`
  }
  return `https://aeneid.explorer.story.foundation/address/${txHashOrIpId}`
}
