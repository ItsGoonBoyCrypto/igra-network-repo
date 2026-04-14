// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleNFT — ERC-721 with owner mint and per-token URI.
contract SimpleNFT is ERC721URIStorage, Ownable {
    uint256 private _nextId;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {}

    /// @notice Mint a new NFT to `to` with metadata `tokenURI_`.
    /// @return tokenId The newly minted token id.
    function mint(address to, string memory tokenURI_) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    function totalMinted() external view returns (uint256) {
        return _nextId;
    }
}
