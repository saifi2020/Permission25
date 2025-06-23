pragma solidity ^0.8.29;

import {Test, console} from "forge-std/Test.sol";
import {RewardContract} from "../src/RewardContract.sol";
import {PYUSDToken} from "../src/PYUSDToken.sol";
// import {PYUSD} from "paxosglobal/pyusd-contract/contracts/PYUSD.sol";
import {ERC20} from "@openzeppelin-contracts/token/ERC20/ERC20.sol";

contract RewardContractTest is Test {
    PYUSDToken public PYUSD_Token;
    RewardContract public rewardContract;

    function setUp() public {
        PYUSD_Token = new PYUSDToken();

        rewardContract = new RewardContract(0x0, PYUSD_Token);
    }

    function test_fund() public {
        uint256 campaign_rewards_fund = 10_000 * 10 ** PYUSD_Token.decimals();
        PYUSD_Token.approve(address(rewardContract), campaign_rewards_fund);
        rewardContract.fund(campaign_rewards_fund);
    }
}