// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "../src/KYCRulesEngineIntegration.sol";

/**
 * An example contract that does nothing.
 * This contract is used to demonstrate the use of the `transfer` function.
 */

contract Transact is RulesEngineClientCustom {
    function transfer(address to, uint256 value) public checkRulesBeforetransfer(to, value) returns (bool) {
        // this function is purposefully empty
        return true;
    }
}
