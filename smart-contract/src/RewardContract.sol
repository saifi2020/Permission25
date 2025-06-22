pragma solidity 0.8.29;

contract RewardContract {
    uint256 rewardValidationKey;
    constructor(uint256 _rewardValidationKey) {
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