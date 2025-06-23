// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "../src/KYCRulesEngineIntegration.sol";

/**
 * An simlutates a user registering / getting KYC'd.
 */

contract Register is RulesEngineClientCustom {
    function transfer(address to, uint256 value) public checkRulesBeforetransfer(to, value) returns (bool) {
        // this function is purposefully empty
        return true;
    }
}
