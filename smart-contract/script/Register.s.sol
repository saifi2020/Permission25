// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Register} from "../src/Register.sol";

contract ExampleUserScript is Script {
    Register public example;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        example = new Register();

        vm.stopBroadcast();
    }
}
