// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Counter} from "../examples/Counter.sol";
import {SimpleToken} from "../examples/SimpleToken.sol";
import {SimpleNFT} from "../examples/SimpleNFT.sol";

/// @title DeployScript
/// @notice Deploys Counter, SimpleToken, and SimpleNFT to Igra.
/// @dev Run with:
///   forge script script/Deploy.s.sol:DeployScript \
///     --rpc-url igra_testnet \
///     --private-key $PRIVATE_KEY \
///     --broadcast \
///     --legacy \
///     --with-gas-price 2200000000000
contract DeployScript is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        console2.log("Deployer:", deployer);
        console2.log("Balance: ", deployer.balance);

        vm.startBroadcast(pk);

        Counter counter = new Counter();
        console2.log("Counter:    ", address(counter));

        SimpleToken token = new SimpleToken("MyToken", "MTK", 1_000_000);
        console2.log("SimpleToken:", address(token));

        SimpleNFT nft = new SimpleNFT("IgraDemoNFT", "IDN");
        console2.log("SimpleNFT:  ", address(nft));

        vm.stopBroadcast();
    }
}
