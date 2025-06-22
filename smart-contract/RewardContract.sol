contract RewardContract {
    constructor() {

    };
    function claimRewards() public {
        // check if msg.sender is owed some rewards
        // if so, give rewards
    };
    function setRewards(uint256 rewards) public {
        _isValid(rewards);
    };
    function _isValid(uint256 rewards) internal {
        // Check if the rewards are accurate
    };
}