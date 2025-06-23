pragma solidity 0.8.29;
import "src/RewardsRulesEngineIntegration.sol";

import "@openzeppelin-contracts/token/ERC20/extensions/ERC4626.sol";

error RewardContract__transferFailed();
error RewardContract__campaignNotFinalized();
error RewardContract__campaignAlreadyFinalized();
error RewardContract__alreadyClaimed();

contract RewardContract is RulesEngineClientCustom, ERC4626 {
    uint256 rewardValidationKey;

    bool finalized;
    mapping(bytes32 => bool) public hasClaimed;

    constructor(uint256 _rewardValidationKey, IERC20 _rewardToken) ERC20("rewardPoints", "POINTS") ERC4626(_rewardToken) {
        rewardValidationKey = _rewardValidationKey;
    }

    function fund(uint256 amount) external {
        IERC20 token = IERC20(asset());
        bool transfered = token.transferFrom(msg.sender, address(this), amount);

        if (!transfered) {
            revert RewardContract__transferFailed();
        }
    }

    function claimRewards(bytes calldata proof, bytes32[] calldata publicInputs) public {
        // Parse the public inputs
        bytes32 leaf = publicInputs[0];
        uint256 points = uint256(publicInputs[1]);
        address targetAddress = address(uint160(uint256(publicInputs[2])));

        // Campaign must be finalized before participants may claim rewards
        if (!finalized) { revert RewardContract__campaignNotFinalized(); }
        
        // Rewards may not be double-claimed
        if (hasClaimed[leaf]) { revert RewardContract__alreadyClaimed(); }

        // Verify whether the rewards have been earned
        require(_isValidClaim(proof, publicInputs), "Invalid Claim");

        // TODO Verify Forte Rules

        // If so, distribute rewards in a privacy-preserving manner
        hasClaimed[leaf] = true;

        _approve(address(this), _msgSender(), points);
        redeem(points, targetAddress, address(this));
    }
    
    function setRewards(uint256 rewards, uint256 _totalPoints) public checkRulesBeforesetRewards(rewards, _totalPoints) {
        // Rewards may be set only once
        if (finalized) { revert RewardContract__campaignAlreadyFinalized(); }

        // Validate succinct zero-knowledge proof that rewards
        // correctly reflect the established campaign criteria
        require(_isValidRewards(rewards), "Invalid Rewards");

        _mint(address(this), _totalPoints);
        finalized = true;
    }
    
    function _isValidRewards(uint256 rewards) internal view returns (bool) {
        // Check if the rewards are accurate
        // Using rewardValidationKey
        return true;
    }
    function _isValidClaim(bytes calldata proof, bytes32[] calldata publicInputs) internal view returns (bool) {
        // Checks claim
        return true;
    }
}