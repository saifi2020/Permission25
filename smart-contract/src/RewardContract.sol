pragma solidity 0.8.29;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

contract RewardContract is ERC4626{
    uint256 rewardValidationKey;

    constructor(uint256 _rewardValidationKey, address _rewardToken) {
        __ERC20_init("rewardPoints", "POINTS");
        __ERC4626_init(_rewardToken);

        rewardValidationKey = _rewardValidationKey;

    }

    function claimRewards(uint256 claim) public {
        // check if msg.sender is owed some rewards
        require(_isValidClaim(claim), "Invalid Claim");
        // if so, give rewards
    }
    function setRewards(uint256 rewards) public {
        require(_isValidRewards(rewards), "Invalid Rewards");
    }
    
    function _isValidRewards(uint256 rewards) internal returns (bool) {
        // Check if the rewards are accurate
        // Using rewardValidationKey
    }
    function _isValidClaim(uint256 claim) internal returns (bool) {
        // Checks claim
    }
}