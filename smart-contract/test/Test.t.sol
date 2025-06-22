pragma solidity ^0.8.29;

import {Test, console} from "forge-std/Test.sol";
import {RewardContract} from "../src/RewardContract.sol";

contract RewardContractTest is Test {
    RewardContract public rewardContract;

    function setUp() public {
        rewardContract = new RewardContract(0x0);
    }

    function test_one() public {

    }
}