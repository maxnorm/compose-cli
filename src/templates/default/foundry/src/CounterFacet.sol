// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CounterFacet {
    uint256 private _counter;

    function increment() external {
        _counter += 1;
    }

    function getCounter() external view returns (uint256) {
        return _counter;
    }
}
