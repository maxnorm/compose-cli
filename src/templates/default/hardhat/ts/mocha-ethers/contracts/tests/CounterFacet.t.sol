// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {CounterFacet} from "../../contracts/facets/CounterFacet.sol";
import {Diamond} from "../../contracts/Diamond.sol";

contract CounterFacetTest is Test {
    CounterFacet internal counter;
    Diamond internal diamond;

    address internal owner = makeAddr("owner");

    function setUp() public {
        CounterFacet counterFacet = new CounterFacet();

        address[] memory facets = new address[](3);
        facets[0] = address(counterFacet);

        diamond = new Diamond(facets, owner);
        counter = CounterFacet(address(diamond));
    }

    function test_increment() public {
        counter.increment();
        assertEq(counter.getCounter(), 1);
    }
}
