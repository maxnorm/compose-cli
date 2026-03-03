// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CounterFacet} from "../src/CounterFacet.sol";

contract CounterFacetTest is Test {
    CounterFacet internal facet;

    function setUp() external {
        facet = new CounterFacet();
    }

    function test_increment() external {
        facet.increment();
        assertEq(facet.getCounter(), 1);
    }
}
