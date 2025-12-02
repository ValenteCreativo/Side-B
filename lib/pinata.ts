/**
 * Pinata IPFS Storage Integration
 *
 * Handles uploading session metadata and audio files to IPFS via Pinata
 */

export interface PinataUploadResult {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  ipfsUrl: string
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<PinataUploadResult> {
  const jwt = process.env.PINATA_JWT

  if (!jwt) {
    throw new Error('Pinata JWT not configured')
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `session-metadata-${Date.now()}.json`,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Pinata upload failed: ${error}`)
  }

  const data = await response.json()

  return {
    ...data,
    ipfsUrl: `ipfs://${data.IpfsHash}`,
  }
}

/**
 * Upload file to IPFS
 */
export async function uploadFileToIPFS(file: File): Promise<PinataUploadResult> {
  const jwt = process.env.PINATA_JWT

  if (!jwt) {
    throw new Error('Pinata JWT not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('pinataMetadata', JSON.stringify({
    name: file.name,
  }))

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Pinata file upload failed: ${error}`)
  }

  const data = await response.json()

  return {
    ...data,
    ipfsUrl: `ipfs://${data.IpfsHash}`,
  }
}

/**
 * Get IPFS gateway URL for viewing content
 */
export function getIPFSGatewayURL(ipfsHash: string): string {
  // Use Pinata's dedicated gateway
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash.replace('ipfs://', '')}`
}
