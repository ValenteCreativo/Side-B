import { LightNodeOptions } from '@waku/sdk'

// Waku node configuration for Side B
export const WAKU_NODE_OPTIONS: Partial<LightNodeOptions> = {
  defaultBootstrap: true,
  // Add specific bootstrap nodes for production reliability
  // These will be automatically discovered via DNS if not specified
}

// Network configuration
export const WAKU_CONFIG = {
  // Application identifier for Waku network
  appName: 'side-b-messaging',
  // Protocol version
  protocolVersion: '1',
  // Base content topic prefix
  contentTopicPrefix: '/side-b/1',
} as const
