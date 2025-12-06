// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {SideBPaymentSplitter} from "../src/SideBPaymentSplitter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock USDC contract for testing
contract MockUSDC is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "Insufficient allowance");
        _allowances[from][msg.sender] = currentAllowance - amount;
        _balances[from] -= amount;
        _balances[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }
}

contract SideBPaymentSplitterTest is Test {
    SideBPaymentSplitter public splitter;
    MockUSDC public usdc;

    address public platformWallet = makeAddr("platform");
    address public musician = makeAddr("musician");
    address public buyer = makeAddr("buyer");

    uint256 public constant PLATFORM_FEE_BPS = 300; // 3%
    uint256 public constant BPS_DENOMINATOR = 10000;

    event PaymentSplit(
        address indexed payer,
        address indexed musician,
        address indexed token,
        uint256 totalAmount,
        uint256 musicianAmount,
        uint256 platformFeeAmount,
        string sessionId
    );

    event PlatformWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    function setUp() public {
        usdc = new MockUSDC();
        splitter = new SideBPaymentSplitter(platformWallet, PLATFORM_FEE_BPS, address(usdc));

        // Give buyer some ETH and USDC for testing
        vm.deal(buyer, 100 ether);
        usdc.mint(buyer, 1_000_000 * 1e6); // 1M USDC (6 decimals)
    }

    // ============ Constructor Tests ============

    function test_Constructor() public {
        assertEq(splitter.platformWallet(), platformWallet);
        assertEq(splitter.platformFeeBps(), PLATFORM_FEE_BPS);
        assertEq(splitter.USDC(), address(usdc));
        assertEq(splitter.MAX_PLATFORM_FEE_BPS(), 500); // 5%
        assertEq(splitter.BPS_DENOMINATOR(), 10000);
    }

    function test_RevertWhen_ConstructorInvalidPlatformWallet() public {
        vm.expectRevert(SideBPaymentSplitter.InvalidPlatformWallet.selector);
        new SideBPaymentSplitter(address(0), PLATFORM_FEE_BPS, address(usdc));
    }

    function test_RevertWhen_ConstructorInvalidPlatformFee() public {
        vm.expectRevert(SideBPaymentSplitter.InvalidPlatformFee.selector);
        new SideBPaymentSplitter(platformWallet, 501, address(usdc)); // Over 5% max
    }

    function test_RevertWhen_ConstructorInvalidUSDC() public {
        vm.expectRevert(SideBPaymentSplitter.InvalidMusicianAddress.selector); // Error name reused
        new SideBPaymentSplitter(platformWallet, PLATFORM_FEE_BPS, address(0));
    }

    // ============ ETH Payment Tests ============

    function test_PayWithETH_Success() public {
        uint256 paymentAmount = 10 ether;
        uint256 expectedPlatformFee = (paymentAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR; // 0.3 ETH
        uint256 expectedMusicianAmount = paymentAmount - expectedPlatformFee; // 9.7 ETH

        uint256 platformBalanceBefore = platformWallet.balance;
        uint256 musicianBalanceBefore = musician.balance;

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit PaymentSplit(
            buyer,
            musician,
            address(0), // ETH
            paymentAmount,
            expectedMusicianAmount,
            expectedPlatformFee,
            "session_123"
        );
        splitter.payWithETH{value: paymentAmount}(payable(musician), "session_123");

        assertEq(platformWallet.balance, platformBalanceBefore + expectedPlatformFee);
        assertEq(musician.balance, musicianBalanceBefore + expectedMusicianAmount);
    }

    function test_PayWithETH_CorrectSplitCalculation() public {
        uint256 paymentAmount = 100 ether;
        uint256 expectedPlatformFee = 3 ether; // 3% of 100
        uint256 expectedMusicianAmount = 97 ether; // 97% of 100

        vm.prank(buyer);
        splitter.payWithETH{value: paymentAmount}(payable(musician), "session_456");

        assertEq(platformWallet.balance, expectedPlatformFee);
        assertEq(musician.balance, expectedMusicianAmount);
    }

    function test_RevertWhen_PayWithETH_InvalidMusician() public {
        vm.prank(buyer);
        vm.expectRevert(SideBPaymentSplitter.InvalidMusicianAddress.selector);
        splitter.payWithETH{value: 1 ether}(payable(address(0)), "session_789");
    }

    function test_RevertWhen_PayWithETH_ZeroAmount() public {
        vm.prank(buyer);
        vm.expectRevert(SideBPaymentSplitter.InvalidAmount.selector);
        splitter.payWithETH{value: 0}(payable(musician), "session_000");
    }

    // ============ USDC Payment Tests ============

    function test_PayWithUSDC_Success() public {
        uint256 paymentAmount = 10 * 1e6; // 10 USDC (6 decimals)
        uint256 expectedPlatformFee = (paymentAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR; // 0.3 USDC
        uint256 expectedMusicianAmount = paymentAmount - expectedPlatformFee; // 9.7 USDC

        // Approve splitter to spend buyer's USDC
        vm.prank(buyer);
        usdc.approve(address(splitter), paymentAmount);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit PaymentSplit(
            buyer,
            musician,
            address(usdc),
            paymentAmount,
            expectedMusicianAmount,
            expectedPlatformFee,
            "session_usdc_123"
        );
        splitter.payWithUSDC(musician, paymentAmount, "session_usdc_123");

        assertEq(usdc.balanceOf(platformWallet), expectedPlatformFee);
        assertEq(usdc.balanceOf(musician), expectedMusicianAmount);
    }

    function test_PayWithUSDC_LargeAmount() public {
        uint256 paymentAmount = 1000 * 1e6; // 1000 USDC
        uint256 expectedPlatformFee = 30 * 1e6; // 30 USDC (3%)
        uint256 expectedMusicianAmount = 970 * 1e6; // 970 USDC (97%)

        vm.prank(buyer);
        usdc.approve(address(splitter), paymentAmount);

        vm.prank(buyer);
        splitter.payWithUSDC(musician, paymentAmount, "session_large");

        assertEq(usdc.balanceOf(platformWallet), expectedPlatformFee);
        assertEq(usdc.balanceOf(musician), expectedMusicianAmount);
    }

    function test_RevertWhen_PayWithUSDC_InvalidMusician() public {
        vm.prank(buyer);
        usdc.approve(address(splitter), 10 * 1e6);

        vm.prank(buyer);
        vm.expectRevert(SideBPaymentSplitter.InvalidMusicianAddress.selector);
        splitter.payWithUSDC(address(0), 10 * 1e6, "session_fail");
    }

    function test_RevertWhen_PayWithUSDC_ZeroAmount() public {
        vm.prank(buyer);
        vm.expectRevert(SideBPaymentSplitter.InvalidAmount.selector);
        splitter.payWithUSDC(musician, 0, "session_zero");
    }

    function test_RevertWhen_PayWithUSDC_InsufficientAllowance() public {
        // Don't approve, should fail
        vm.prank(buyer);
        vm.expectRevert("Insufficient allowance");
        splitter.payWithUSDC(musician, 10 * 1e6, "session_no_approval");
    }

    // ============ Admin Function Tests ============

    function test_UpdatePlatformWallet_Success() public {
        address newPlatformWallet = makeAddr("new_platform");

        vm.expectEmit(true, true, false, false);
        emit PlatformWalletUpdated(platformWallet, newPlatformWallet);
        splitter.updatePlatformWallet(newPlatformWallet);

        assertEq(splitter.platformWallet(), newPlatformWallet);
    }

    function test_RevertWhen_UpdatePlatformWallet_InvalidAddress() public {
        vm.expectRevert(SideBPaymentSplitter.InvalidPlatformWallet.selector);
        splitter.updatePlatformWallet(address(0));
    }

    function test_RevertWhen_UpdatePlatformWallet_NotOwner() public {
        vm.prank(buyer);
        vm.expectRevert();
        splitter.updatePlatformWallet(makeAddr("hacker"));
    }

    function test_UpdatePlatformFee_Success() public {
        uint256 newFeeBps = 400; // 4%

        vm.expectEmit(false, false, false, true);
        emit PlatformFeeUpdated(PLATFORM_FEE_BPS, newFeeBps);
        splitter.updatePlatformFee(newFeeBps);

        assertEq(splitter.platformFeeBps(), newFeeBps);
    }

    function test_UpdatePlatformFee_ToMaximum() public {
        uint256 maxFeeBps = 500; // 5%

        splitter.updatePlatformFee(maxFeeBps);
        assertEq(splitter.platformFeeBps(), maxFeeBps);
    }

    function test_RevertWhen_UpdatePlatformFee_ExceedsMaximum() public {
        vm.expectRevert(SideBPaymentSplitter.InvalidPlatformFee.selector);
        splitter.updatePlatformFee(501); // Over 5% max
    }

    function test_RevertWhen_UpdatePlatformFee_NotOwner() public {
        vm.prank(buyer);
        vm.expectRevert();
        splitter.updatePlatformFee(400);
    }

    // ============ Receive Function Tests ============

    function test_RevertWhen_DirectETHTransfer() public {
        vm.prank(buyer);
        vm.expectRevert("Use payWithETH() function");
        payable(address(splitter)).transfer(1 ether);
    }

    // ============ Reentrancy Tests ============

    function test_PayWithETH_ReentrancyProtection() public {
        // Deploy a malicious contract that tries to reenter
        MaliciousMusician malicious = new MaliciousMusician(address(splitter));
        vm.deal(address(malicious), 0);

        vm.prank(buyer);
        // Should revert with ReentrancyGuard error
        vm.expectRevert();
        splitter.payWithETH{value: 1 ether}(payable(address(malicious)), "reentrancy_test");
    }

    // ============ Fuzz Tests ============

    function testFuzz_PayWithETH_CorrectSplit(uint256 paymentAmount) public {
        // Bound payment amount to reasonable range
        paymentAmount = bound(paymentAmount, 1, 100 ether);

        uint256 expectedPlatformFee = (paymentAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 expectedMusicianAmount = paymentAmount - expectedPlatformFee;

        vm.deal(buyer, paymentAmount);

        vm.prank(buyer);
        splitter.payWithETH{value: paymentAmount}(payable(musician), "fuzz_test");

        assertEq(platformWallet.balance, expectedPlatformFee);
        assertEq(musician.balance, expectedMusicianAmount);
    }

    function testFuzz_PayWithUSDC_CorrectSplit(uint256 paymentAmount) public {
        // Bound to USDC range (max supply ~80B USDC with 6 decimals)
        paymentAmount = bound(paymentAmount, 1, 1_000_000 * 1e6);

        uint256 expectedPlatformFee = (paymentAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 expectedMusicianAmount = paymentAmount - expectedPlatformFee;

        usdc.mint(buyer, paymentAmount);

        vm.prank(buyer);
        usdc.approve(address(splitter), paymentAmount);

        vm.prank(buyer);
        splitter.payWithUSDC(musician, paymentAmount, "fuzz_usdc");

        assertEq(usdc.balanceOf(platformWallet), expectedPlatformFee);
        assertEq(usdc.balanceOf(musician), expectedMusicianAmount);
    }

    function testFuzz_UpdatePlatformFee(uint256 newFeeBps) public {
        // Bound to valid range (0-500 BPS = 0-5%)
        newFeeBps = bound(newFeeBps, 0, 500);

        splitter.updatePlatformFee(newFeeBps);
        assertEq(splitter.platformFeeBps(), newFeeBps);
    }
}

// Malicious contract for reentrancy testing
contract MaliciousMusician {
    SideBPaymentSplitter public splitter;
    bool public attacked;

    constructor(address _splitter) {
        splitter = SideBPaymentSplitter(payable(_splitter));
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            // Try to reenter
            splitter.payWithETH{value: msg.value}(payable(address(this)), "reentrant");
        }
    }
}
