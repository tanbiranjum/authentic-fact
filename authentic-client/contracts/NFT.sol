// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    event nftMinted(uint256 tokenId);

    constructor(address marketplaceAddress) ERC1155("https://61604640faa03600179fb993.mockapi.io/api/v1/nft/{id}") {
        contractAddress = marketplaceAddress;
    }

    function setURI(string memory newuri) public {
        _setURI(newuri);
    }

    function createToken() public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, 1, "");
        setApprovalForAll(contractAddress, true);
        emit nftMinted(newItemId);
        return newItemId;
    }

    function getTokenId() public view returns (uint256 tokenID) {
        uint256 newItemId = _tokenIds.current();
        return newItemId;
    }
}
