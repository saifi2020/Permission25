// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {RewardContract} from "../src/RewardContract.sol";

contract Deploy is Script {
    RewardContract public rewardContract;

    function setUp() public {}

    function run() external {
        vm.startBroadcast();
        rewardContract = new RewardContract(0x0);
        vm.stopBroadcast();
    }
}
