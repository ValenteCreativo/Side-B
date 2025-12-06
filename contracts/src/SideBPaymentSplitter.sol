// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SideBPaymentSplitter
 * @notice Automatically splits payments between musicians and Side B platform
 * @dev Supports both ETH and ERC-20 token (USDC) payments with configurable fee
 *
 * Security features:
 * - ReentrancyGuard prevents reentrancy attacks
 * - Ownable restricts admin functions
 * - SafeERC20 prevents token transfer issues
 * - Immutable musician address per payment prevents manipulation
 *
 * Gas optimizations:
 * - Direct transfers instead of pull pattern
 * - Unchecked math where overflow impossible
 * - Minimal storage reads
 * - No loops or complex logic
 */
contract SideBPaymentSplitter is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Platform wallet that receives the platform fee
    address public platformWallet;

    /// @notice Platform fee in basis points (300 = 3%)
    uint256 public platformFeeBps;

    /// @notice Maximum platform fee (500 = 5%)
    uint256 public constant MAX_PLATFORM_FEE_BPS = 500;

    /// @notice Basis points denominator (10000 = 100%)
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice USDC token address on Base Network
    address public immutable USDC;

    /// @notice Event emitted when a payment is split
    event PaymentSplit(
        address indexed payer,
        address indexed musician,
        address indexed token, // address(0) for ETH
        uint256 totalAmount,
        uint256 musicianAmount,
        uint256 platformFeeAmount,
        string sessionId
    );

    /// @notice Event emitted when platform wallet is updated
    event PlatformWalletUpdated(address indexed oldWallet, address indexed newWallet);

    /// @notice Event emitted when platform fee is updated
    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    error InvalidPlatformWallet();
    error InvalidMusicianAddress();
    error InvalidAmount();
    error InvalidPlatformFee();
    error TransferFailed();

    /**
     * @notice Constructor
     * @param _platformWallet Address that receives platform fees
     * @param _platformFeeBps Platform fee in basis points (300 = 3%)
     * @param _usdc USDC token address on Base Network
     */
    constructor(
        address _platformWallet,
        uint256 _platformFeeBps,
        address _usdc
    ) Ownable(msg.sender) {
        if (_platformWallet == address(0)) revert InvalidPlatformWallet();
        if (_platformFeeBps > MAX_PLATFORM_FEE_BPS) revert InvalidPlatformFee();
        if (_usdc == address(0)) revert InvalidMusicianAddress();

        platformWallet = _platformWallet;
        platformFeeBps = _platformFeeBps;
        USDC = _usdc;

        emit PlatformWalletUpdated(address(0), _platformWallet);
        emit PlatformFeeUpdated(0, _platformFeeBps);
    }

    /**
     * @notice Pay for a license with ETH
     * @param musician Address of the musician receiving payment
     * @param sessionId Session ID for tracking (off-chain reference)
     */
    function payWithETH(
        address payable musician,
        string calldata sessionId
    ) external payable nonReentrant {
        if (musician == address(0)) revert InvalidMusicianAddress();
        if (msg.value == 0) revert InvalidAmount();

        uint256 totalAmount = msg.value;

        // Calculate platform fee (3% = 300 basis points)
        uint256 platformFeeAmount = (totalAmount * platformFeeBps) / BPS_DENOMINATOR;

        // Calculate musician amount (97%)
        uint256 musicianAmount;
        unchecked {
            musicianAmount = totalAmount - platformFeeAmount;
        }

        // Transfer to musician
        (bool musicianSuccess, ) = musician.call{value: musicianAmount}("");
        if (!musicianSuccess) revert TransferFailed();

        // Transfer platform fee
        (bool platformSuccess, ) = payable(platformWallet).call{value: platformFeeAmount}("");
        if (!platformSuccess) revert TransferFailed();

        emit PaymentSplit(
            msg.sender,
            musician,
            address(0), // address(0) represents ETH
            totalAmount,
            musicianAmount,
            platformFeeAmount,
            sessionId
        );
    }

    /**
     * @notice Pay for a license with USDC
     * @param musician Address of the musician receiving payment
     * @param amount Amount of USDC to pay (in USDC wei, 6 decimals)
     * @param sessionId Session ID for tracking (off-chain reference)
     */
    function payWithUSDC(
        address musician,
        uint256 amount,
        string calldata sessionId
    ) external nonReentrant {
        if (musician == address(0)) revert InvalidMusicianAddress();
        if (amount == 0) revert InvalidAmount();

        IERC20 usdc = IERC20(USDC);

        // Calculate platform fee (3% = 300 basis points)
        uint256 platformFeeAmount = (amount * platformFeeBps) / BPS_DENOMINATOR;

        // Calculate musician amount (97%)
        uint256 musicianAmount;
        unchecked {
            musicianAmount = amount - platformFeeAmount;
        }

        // Transfer USDC from buyer to musician
        usdc.safeTransferFrom(msg.sender, musician, musicianAmount);

        // Transfer platform fee
        usdc.safeTransferFrom(msg.sender, platformWallet, platformFeeAmount);

        emit PaymentSplit(
            msg.sender,
            musician,
            USDC,
            amount,
            musicianAmount,
            platformFeeAmount,
            sessionId
        );
    }

    /**
     * @notice Update platform wallet address
     * @param newPlatformWallet New platform wallet address
     */
    function updatePlatformWallet(address newPlatformWallet) external onlyOwner {
        if (newPlatformWallet == address(0)) revert InvalidPlatformWallet();

        address oldWallet = platformWallet;
        platformWallet = newPlatformWallet;

        emit PlatformWalletUpdated(oldWallet, newPlatformWallet);
    }

    /**
     * @notice Update platform fee
     * @param newPlatformFeeBps New platform fee in basis points (max 500 = 5%)
     */
    function updatePlatformFee(uint256 newPlatformFeeBps) external onlyOwner {
        if (newPlatformFeeBps > MAX_PLATFORM_FEE_BPS) revert InvalidPlatformFee();

        uint256 oldFeeBps = platformFeeBps;
        platformFeeBps = newPlatformFeeBps;

        emit PlatformFeeUpdated(oldFeeBps, newPlatformFeeBps);
    }

    /**
     * @notice Receive function to reject direct ETH transfers
     * @dev Users must use payWithETH() function
     */
    receive() external payable {
        revert("Use payWithETH() function");
    }
}
