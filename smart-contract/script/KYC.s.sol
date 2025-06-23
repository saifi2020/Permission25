// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "lib/forge-std/src/Script.sol";
import {KYC} from "../src/KYC.sol";

contract DeployKYC is Script {
    function run() external {
        vm.startBroadcast();
        new KYC();
        vm.stopBroadcast();
    }
}
