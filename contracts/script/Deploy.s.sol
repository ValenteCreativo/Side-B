// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {SideBPaymentSplitter} from "../src/SideBPaymentSplitter.sol";

contract DeployScript is Script {
    // Base Network USDC address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    address public constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // Base Sepolia Testnet USDC address: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    address public constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    uint256 public constant PLATFORM_FEE_BPS = 300; // 3%

    function run() external {
        // Read environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address platformWallet = vm.envAddress("PLATFORM_WALLET_ADDRESS");

        // Determine which network we're on and select the appropriate USDC address
        uint256 chainId = block.chainid;
        address usdcAddress;

        if (chainId == 8453) {
            // Base Mainnet
            usdcAddress = BASE_USDC;
            console2.log("Deploying to Base Mainnet (Chain ID: 8453)");
        } else if (chainId == 84532) {
            // Base Sepolia Testnet
            usdcAddress = BASE_SEPOLIA_USDC;
            console2.log("Deploying to Base Sepolia Testnet (Chain ID: 84532)");
        } else {
            revert("Unsupported network. Deploy to Base Mainnet (8453) or Base Sepolia (84532)");
        }

        console2.log("Platform Wallet:", platformWallet);
        console2.log("Platform Fee:", PLATFORM_FEE_BPS, "basis points (3%)");
        console2.log("USDC Address:", usdcAddress);

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the payment splitter
        SideBPaymentSplitter splitter = new SideBPaymentSplitter(
            platformWallet,
            PLATFORM_FEE_BPS,
            usdcAddress
        );

        console2.log("SideBPaymentSplitter deployed at:", address(splitter));
        console2.log("");
        console2.log("===== Deployment Summary =====");
        console2.log("Contract:", address(splitter));
        console2.log("Platform Wallet:", splitter.platformWallet());
        console2.log("Platform Fee:", splitter.platformFeeBps(), "BPS");
        console2.log("USDC Address:", splitter.USDC());
        console2.log("Max Platform Fee:", splitter.MAX_PLATFORM_FEE_BPS(), "BPS");
        console2.log("");
        console2.log("Next steps:");
        console2.log("1. Verify contract on BaseScan");
        console2.log("2. Update .env with CONTRACT_ADDRESS=", address(splitter));
        console2.log("3. Test payment flow on testnet before mainnet");

        vm.stopBroadcast();
    }
}
