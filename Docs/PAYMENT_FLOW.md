# P2P Payment Flow with Platform Fee

## Overview

Side B uses a **peer-to-peer (P2P) payment model** with a **3% platform fee** on each transaction. This means:

- **97%** of the payment goes directly to the artist
- **3%** goes to the Side B platform as a service fee
- **No custody**: Side B never holds user funds

## Payment Flow

### 1. User Initiates Purchase

When a buyer clicks "License" on a track:

```typescript
// User clicks License button on SessionCard
handleLicense() →
  POST /api/payments →
  Calculate fee split (97% artist, 3% platform)
```

### 2. Payment Details Calculation

The backend calculates the payment split:

```typescript
// /api/payments/route.ts
const PLATFORM_FEE_PERCENTAGE = 0.03
const totalAmount = session.priceUsd
const platformFee = totalAmount * 0.03  // 3% platform fee
const artistAmount = totalAmount - platformFee  // 97% to artist

Returns:
{
  artistPayment: {
    recipient: "0x...artist_wallet",
    amount: 9.70  // for $10 track
  },
  platformFee: {
    recipient: "0x...platform_wallet",
    amount: 0.30  // for $10 track
  },
  total: {
    amount: 10.00
  }
}
```

### 3. Wallet Transaction

The frontend triggers a wallet transaction using Coinbase Wallet SDK:

```typescript
// SessionCard.tsx
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: user.walletAddress,
    to: artist.walletAddress,
    value: amountInWei,
  }]
})
```

**Important Notes:**
- Current implementation sends full amount to artist
- Platform fee is tracked off-chain
- Production implementation should use a smart contract for atomic split

### 4. License Creation

Once the transaction is confirmed:

```typescript
POST /api/payments/confirm →
  Create License record →
  Link to Story Protocol IP asset →
  Return license details
```

## Production Recommendations

### Option 1: Smart Contract Payment Splitter

Deploy a smart contract that automatically splits payments:

```solidity
contract PaymentSplitter {
    address public platformWallet;
    uint256 public platformFeePercentage = 3; // 3%

    function purchaseLicense(address artist, uint256 amount) external payable {
        uint256 platformFee = (amount * platformFeePercentage) / 100;
        uint256 artistAmount = amount - platformFee;

        // Transfer to artist
        payable(artist).transfer(artistAmount);

        // Transfer platform fee
        payable(platformWallet).transfer(platformFee);

        emit LicensePurchased(msg.sender, artist, amount, platformFee);
    }
}
```

**Benefits:**
- Atomic transaction (both payments happen or neither)
- On-chain verification
- Transparent fee calculation
- No trust required

### Option 2: Two Sequential Transactions

Send two separate transactions:

```typescript
// Transaction 1: Pay artist (97%)
await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{ to: artistWallet, value: artistAmount }]
})

// Transaction 2: Pay platform (3%)
await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{ to: platformWallet, value: platformFee }]
})
```

**Drawbacks:**
- User must approve two transactions
- If second fails, platform loses fee
- More gas costs

### Option 3: Off-Chain Settlement (Current)

Artist receives full amount, platform fee settled separately:

```typescript
// User pays artist full amount
// Platform tracks fees owed
// Periodic settlement with artists
```

**Drawbacks:**
- Requires trust
- Manual reconciliation
- Potential disputes

## Price Conversion

Currently using placeholder price conversion:

```typescript
// USDC has 6 decimals
const amountInWei = '0x' + (priceUsd * 1e6).toString(16)
```

**Production needs:**
- Real-time price oracle (e.g., Chainlink)
- Support multiple tokens (USDC, ETH, etc.)
- Slippage protection
- Price expiration

## Configuration

Add to `.env`:

```bash
# Platform wallet receives 3% fee from each transaction
PLATFORM_WALLET_ADDRESS="0x...your_platform_wallet"
NEXT_PUBLIC_PLATFORM_WALLET="0x...your_platform_wallet"
```

## Story Protocol Integration

Each purchase creates a license NFT linked to the original IP asset:

```
User purchases track →
  Payment confirmed →
  License NFT minted on Story Protocol →
  License linked to original IP asset (storyAssetId)
```

## Security Considerations

1. **Transaction Verification**
   - Verify transaction on-chain before creating license
   - Check payment amounts match expected values
   - Verify recipients are correct

2. **Price Manipulation**
   - Use time-locked prices
   - Implement slippage protection
   - Monitor for front-running

3. **Smart Contract Audit**
   - If using smart contracts, get professional audit
   - Test extensively on testnet
   - Implement upgrade mechanisms

## Testing

### Development Mode

Without platform wallet configured:

```bash
# Missing PLATFORM_WALLET_ADDRESS
console.warn('⚠️  Platform wallet not configured. Using mock payment.')
```

### Testnet Testing

1. Deploy to Story Protocol Aeneid testnet
2. Use testnet tokens (not real money)
3. Verify full payment flow
4. Check license creation on StoryScan

### Production Checklist

- [ ] Platform wallet configured
- [ ] Smart contract deployed (if using)
- [ ] Smart contract audited (if using)
- [ ] Price oracle integrated
- [ ] Transaction verification implemented
- [ ] Error handling tested
- [ ] Gas optimization completed
- [ ] Documentation updated
- [ ] Legal terms reviewed

## API Endpoints

### POST /api/payments

Calculate payment split and return details.

**Request:**
```json
{
  "sessionId": "session_id",
  "buyerId": "user_id",
  "buyerWalletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "paymentRequired": true,
  "paymentDetails": {
    "artistPayment": {
      "recipient": "0x...artist",
      "amount": 9.70
    },
    "platformFee": {
      "recipient": "0x...platform",
      "amount": 0.30
    },
    "total": { "amount": 10.00 }
  }
}
```

### POST /api/payments/confirm

Confirm payment and create license.

**Request:**
```json
{
  "sessionId": "session_id",
  "buyerId": "user_id",
  "txHash": "0x...transaction_hash"
}
```

**Response:**
```json
{
  "success": true,
  "license": {
    "id": "license_id",
    "sessionId": "session_id",
    "txHash": "0x...",
    "session": {
      "title": "Track Title",
      "audioUrl": "https://...",
      "storyAssetId": "0x...ip_asset"
    }
  }
}
```

## Future Enhancements

1. **Multi-Currency Support**
   - ETH, USDC, USDT, DAI
   - Auto-conversion
   - Best rate selection

2. **Batch Purchases**
   - Buy multiple tracks in one transaction
   - Save on gas fees

3. **Subscriptions**
   - Monthly access to catalog
   - Recurring payments

4. **Revenue Sharing**
   - Split between multiple artists
   - Royalty distribution
   - Producer splits

5. **Refund Mechanism**
   - Time-limited refunds
   - Dispute resolution
   - Escrow period
