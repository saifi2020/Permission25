pragma solidity ^0.8.29;

import {Test, console} from "forge-std/Test.sol";
import {RewardContract} from "../src/RewardContract.sol";
import {PYUSD} from "paxosglobal/pyusd-contract/contracts/PYUSD.sol";

contract RewardContractTest is Test {
    PYUSD public PYUSD;
    RewardContract public rewardContract;

    function setUp() public {
        address PYUSD = new PYUSD();

        rewardContract = new RewardContract(0x0, PYUSD);
    }

    function test_one() public {

    }
}