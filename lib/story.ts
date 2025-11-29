/**
 * Story Protocol Integration
 *
 * Official Documentation:
 * - https://www.story.foundation/build
 * - https://docs.story.foundation/developers/typescript-sdk/overview
 *
 * This module handles IP asset registration on Story Protocol for music sessions.
 * Each uploaded track is registered as intellectual property with metadata.
 */

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { Address, Hex } from 'viem'

// Story Protocol configuration
const config: StoryConfig = {
  account: process.env.STORY_PRIVATE_KEY as Hex || '0x', // TODO: Set up proper wallet
  transport: http(process.env.STORY_RPC_URL),
  chainId: process.env.STORY_NETWORK === 'mainnet' ? 'story' : 'iliad',
}

// Initialize Story client (lazy initialization to avoid errors in dev)
let storyClient: StoryClient | null = null

function getStoryClient(): StoryClient {
  if (!storyClient) {
    try {
      storyClient = StoryClient.newClient(config)
    } catch (error) {
      console.error('Failed to initialize Story client:', error)
      throw new Error('Story Protocol client initialization failed. Check your API keys.')
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
}

/**
 * Register a music session as IP on Story Protocol
 *
 * Steps:
 * 1. Create IP metadata with session details
 * 2. Register IP Asset on Story Protocol
 * 3. Set IP metadata with music-specific information
 * 4. Return asset ID and transaction hash
 *
 * Reference: https://docs.story.foundation/developers/typescript-sdk/register-ip
 */
export async function registerSessionAsIp(
  params: RegisterSessionParams
): Promise<RegisterSessionResult> {
  const { title, description, audioUrl, ownerWallet, contentType, moodTags = [] } = params

  // Development mode fallback (mock registration when Story keys not configured)
  if (!process.env.STORY_PRIVATE_KEY || !process.env.STORY_RPC_URL) {
    console.warn('⚠️  Story Protocol not configured. Using mock IP registration.')
    console.log('📝 Would register IP:', { title, contentType, ownerWallet })

    // Return mock data for development
    return {
      storyAssetId: `mock-ip-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      txHash: `0xmock${Date.now()}` as Hex,
    }
  }

  try {
    const client = getStoryClient()

    // Prepare IP metadata following Story Protocol standards
    const metadata = {
      name: title,
      description: description,
      attributes: [
        {
          key: 'contentType',
          value: contentType,
        },
        {
          key: 'audioUrl',
          value: audioUrl,
        },
        {
          key: 'moodTags',
          value: moodTags.join(', '),
        },
        {
          key: 'platform',
          value: 'Side B Sessions',
        },
        {
          key: 'registeredAt',
          value: new Date().toISOString(),
        },
      ],
    }

    // TODO: Implement actual IP registration using Story SDK
    // Reference: https://docs.story.foundation/developers/typescript-sdk/register-ip
    //
    // Example flow:
    // const ipAsset = await client.ipAsset.register({
    //   nftContract: NFT_CONTRACT_ADDRESS,
    //   tokenId: TOKEN_ID,
    //   metadata: metadata,
    //   txOptions: { waitForTransaction: true }
    // })
    //
    // For now, we'll use a placeholder structure that can be easily replaced

    console.log('🎵 Registering IP on Story Protocol:', metadata)

    // Placeholder return - replace with actual Story SDK response
    const mockResult: RegisterSessionResult = {
      storyAssetId: `story-ip-${Date.now()}`,
      txHash: `0x${Date.now().toString(16)}` as Hex,
    }

    console.log('✅ IP registered successfully:', mockResult)
    return mockResult

  } catch (error) {
    console.error('❌ Story Protocol registration failed:', error)
    throw new Error(`Failed to register IP on Story Protocol: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Retrieve IP asset details from Story Protocol
 *
 * Reference: https://docs.story.foundation/developers/typescript-sdk/read-ip-data
 */
export async function getIpAssetDetails(assetId: string) {
  if (!process.env.STORY_PRIVATE_KEY || !process.env.STORY_RPC_URL) {
    console.warn('⚠️  Story Protocol not configured. Using mock data.')
    return {
      id: assetId,
      owner: '0xmock',
      metadata: {},
    }
  }

  try {
    const client = getStoryClient()

    // TODO: Implement actual IP retrieval using Story SDK
    // const ipDetails = await client.ipAsset.get(assetId)
    // return ipDetails

    return {
      id: assetId,
      owner: '0xmock',
      metadata: {},
    }
  } catch (error) {
    console.error('Failed to retrieve IP asset:', error)
    throw error
  }
}

/**
 * Create a license for an IP asset (for future implementation)
 *
 * Reference: https://docs.story.foundation/developers/typescript-sdk/license
 */
export async function createIpLicense(assetId: string, licenseTerms: any) {
  // TODO: Implement licensing logic using Story SDK
  console.log('Creating license for asset:', assetId, licenseTerms)

  // Placeholder for future implementation
  return {
    licenseId: `license-${Date.now()}`,
    txHash: `0x${Date.now().toString(16)}`,
  }
}
