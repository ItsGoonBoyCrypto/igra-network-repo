// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleToken — ERC-20 with owner mint
/// @notice Minimal ERC-20 for Igra Network examples.
contract SimpleToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ERC20(name_, symbol_)
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /// @notice Mint additional supply (owner only).
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
