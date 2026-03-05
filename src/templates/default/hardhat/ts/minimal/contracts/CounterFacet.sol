// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CounterFacet {
    uint256 private _counter;

    function increment() external {
        _counter += 1;
    }
}
