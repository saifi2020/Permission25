import { policyModifierGeneration } from "@thrackle-io/forte-rules-engine-sdk";

const modifiersPath = "src/RulesEngineClientCustom.sol";
const yourContract = "src/RewardContract.sol";

policyModifierGeneration("forte/policy.json", modifiersPath, [yourContract]);