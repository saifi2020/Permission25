// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin-contracts/access/AccessControl.sol";

contract KYC is AccessControl {
    // Role for KYC administrators
    bytes32 public constant KYC_ADMIN_ROLE = keccak256("KYC_ADMIN_ROLE");

    // Mapping to store KYC levels (0-3)
    mapping(address => uint256) private kycLevels;

    // Mapping to store the timestamp when KYC was last set
    mapping(address => uint256) private kycTimestamps;

    // Events
    event KYCLevelSet(address indexed user, uint256 level, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(KYC_ADMIN_ROLE, msg.sender);
    }

    // Function to set KYC level for an address
    function setKycLevel(
        address user,
        uint256 level
    ) external onlyRole(KYC_ADMIN_ROLE) {
        require(level <= 3, "Invalid KYC level");
        kycLevels[user] = level;
        kycTimestamps[user] = block.timestamp;
        emit KYCLevelSet(user, level, block.timestamp);
    }

    // Function to get KYC level for an address
    function getKycLevel(address user) external view returns (uint256) {
        return kycLevels[user];
    }

    // Function to get KYC timestamp for an address
    function getKycTimestamp(address user) external view returns (uint256) {
        return kycTimestamps[user];
    }
}
