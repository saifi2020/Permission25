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


    function test_setreward() public {
        // fund
        uint256 campaign_rewards_fund = 10_000 * 10 ** PYUSD_Token.decimals();
        PYUSD_Token.approve(address(rewardContract), campaign_rewards_fund);
        rewardContract.fund(campaign_rewards_fund);

        // set rewards
        rewardContract.setRewards(0x0, 1000);
    }

    function test_claim() public {
        // fund
        uint256 campaign_rewards_fund = 10_000 * 10 ** PYUSD_Token.decimals();
        PYUSD_Token.approve(address(rewardContract), campaign_rewards_fund);
        rewardContract.fund(campaign_rewards_fund);

        // set rewards
        rewardContract.setRewards(0x0, 1000);

        // Attempt to claim rewards
        bytes memory proof = hex"01020304";
        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = 0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca; // leaf
        publicInputs[1] = bytes32(uint256(123)); // points
        publicInputs[2] = bytes32(uint256(uint160(0x123deadbeef))); // target address
        rewardContract.claimRewards(proof, publicInputs);
    }
}