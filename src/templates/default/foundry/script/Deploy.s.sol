// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {CounterFacet} from "../src/CounterFacet.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        new CounterFacet();
        vm.stopBroadcast();
    }
}
