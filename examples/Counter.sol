// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Counter — minimal stateful contract for Igra examples.
contract Counter {
    uint256 public count;

    event Incremented(address indexed by, uint256 newCount);
    event Reset(address indexed by);

    function increment() external {
        unchecked { count += 1; }
        emit Incremented(msg.sender, count);
    }

    function add(uint256 n) external {
        count += n;
        emit Incremented(msg.sender, count);
    }

    function reset() external {
        count = 0;
        emit Reset(msg.sender);
    }
}
