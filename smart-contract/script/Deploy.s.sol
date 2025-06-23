// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
// import {PYUSD} from "paxosglobal/pyusd-contract/contracts/PYUSD.sol";
import {PYUSDToken} from "../src/PYUSDToken.sol";
import {ERC20} from "@openzeppelin-contracts/token/ERC20/ERC20.sol";
import {RewardContract} from "../src/RewardContract.sol";

contract Deploy is Script {
    RewardContract public rewardContract;

    function setUp() public {    }

    function run() external {
        vm.startBroadcast();

        PYUSDToken PYUSD_Token = new PYUSDToken();

        rewardContract = new RewardContract(0x0, PYUSD_Token);
        vm.stopBroadcast();
    }
}
