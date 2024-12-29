// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import {Paymaster} from "../src/Paymaster.sol";
import {console2} from "forge-std/console2.sol";

contract DeployPaymaster is Script {
    function run() public {
        vm.startBroadcast();

        Paymaster pm = new Paymaster();
        console2.log("Paymaster deployed at", address(pm));
        vm.stopBroadcast();
    }
}
