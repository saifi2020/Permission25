// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {PYUSD} from "paxosglobal/pyusd-contract/contracts/PYUSD.sol";
import {RewardContract} from "../src/RewardContract.sol";

contract Deploy is Script {
    RewardContract public rewardContract;

    function setUp() public {
        address PYUSD = new PYUSD();
    }

    function run() external {
        vm.startBroadcast();

        uint256 rewardValidationKey = 0x0;
        address rewardToken = PYUSD;

        rewardContract = new RewardContract(0x0, rewardToken);
        vm.stopBroadcast();
    }
}
