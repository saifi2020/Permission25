import { policyModifierGeneration } from "@thrackle-io/forte-rules-engine-sdk";

const modifiersPath = "src/RulesEngineClientCustom.sol";
const yourContract = "src/RewardContract.sol";

/* Test Parser for https://github.com/thrackle-io/forte-rules-engine-sdk/issues/133 */
import * as fs from 'fs';
import * as path from 'path';
function fileContainsFunction(filePath: string, callingFunction: string): boolean {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract function name and parameters from the signature
    const functionNameMatch = callingFunction.match(/^([^(]+)\s*\(/);
    if (!functionNameMatch) return false;
    
    const functionName = functionNameMatch[1].trim();
    
    // Create a regex pattern that looks for the function name followed by parameters
    // This is a simplified approach and might need refinement for complex cases
    const regexPattern = `function\\s+${functionName}\\s*\\([^)]*\\)`;
    const regex = new RegExp(regexPattern, 'i');
    
    return regex.test(fileContent);
}

interface ForeignCall {
    name: string;
    address: string;
    function: string;
    returnType: string;
    valuesToPass: string;
}

interface Tracker {
    name: string;
    type: string;
    initialValue: any;
}

interface Rule {
    condition: string;
    positiveEffects: string[];
    negativeEffects: string[];
    callingFunction: string;
    encodedValues: string;
}

interface PolicyConfig {
    Policy: string;
    ForeignCalls: ForeignCall[];
    Trackers: Tracker[];
    Rules: Rule[];
}
const configPath = "forte/policies/reward-limit.json"
const configData = fs.readFileSync(configPath, 'utf-8');
const policyConfig: PolicyConfig = JSON.parse(configData);

console.log(policyConfig);
console.log(fileContainsFunction("src/RewardContract.sol", policyConfig.Rules[0].callingFunction))
console.log(policyConfig.Rules[0].callingFunction.split("(")[0]);

let variables = policyConfig.Rules[0].encodedValues;
let funcName = policyConfig.Rules[0].callingFunction.split("(")[0].trim();

// Find Function and place modifier
var functionName = "function ";
var data = fs.readFileSync("src/RewardContract.sol", 'utf-8');
var modifiedData = data;
var argListUpdate = variables.replace(/address /g, '')
    .replace(/uint256 /g, '')
    .replace(/string /g, '')
    .replace(/bool /g, '')
    .replace(/bytes /g, '');

const modifierToAdd = `checkRulesBefore${funcName}(${argListUpdate})`;
const regex = new RegExp(`${functionName}\\s*${funcName}\\s*\\([^)]*\\)\\s*(public|private|internal|external)[^{]*`, 'g');
const funcMatches = data.matchAll(regex);

for (const match of funcMatches) {
    console.log("match", match);
    const fullFuncDecl = match[0];

    console.log("fullFuncDecl", fullFuncDecl);

    // Only add modifier if it's not already present in the full function declaration
    if (!fullFuncDecl.includes(modifierToAdd)) {
        const visibilityKeywordRegex = /(public|private|internal|external)\s*/;
        const newDecl = fullFuncDecl.replace(
            visibilityKeywordRegex,
            `$1 ${modifierToAdd} `
        );
        console.log("modifiedData a", modifiedData);
        modifiedData = modifiedData.replace(fullFuncDecl, newDecl);
    }
    break;
}
console.log("modifiedData b", modifiedData);
/* End Parser Test */

policyModifierGeneration("forte/policies/reward-limit.json", modifiersPath, [yourContract]);