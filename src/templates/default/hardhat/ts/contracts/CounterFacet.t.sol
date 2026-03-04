// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { CounterFacet } from "./CounterFacet.sol";

contract CounterFacetTest {
    CounterFacet counter;

    function setUp() public {
        counter = new CounterFacet();
    }

    function test_InitialValueIsZero() public view {
        require(counter.getCounter() == 0, "counter should start at 0");
    }

    function test_IncrementIncreasesByOne() public {
        counter.increment();
        require(counter.getCounter() == 1, "increment should increase by 1");
    }
}
