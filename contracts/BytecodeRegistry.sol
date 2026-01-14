// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.20;

contract BytecodeRegistry {
    struct Entry {
        bytes32 tag;
        uint256 createdAt;
    }

    mapping(address => Entry) private entries;

    event Registered(address indexed target, bytes32 indexed tag, uint256 createdAt);

    function register(address target, bytes32 tag) external {
        require(target != address(0), "zero target");
        require(entries[target].createdAt == 0, "already registered");

        entries[target] = Entry({ tag: tag, createdAt: block.timestamp });
        emit Registered(target, tag, block.timestamp);
    }

    function get(address target) external view returns (bytes32 tag, uint256 createdAt) {
        Entry memory e = entries[target];
        return (e.tag, e.createdAt);
    }

    function isRegistered(address target) external view returns (bool) {
        return entries[target].createdAt != 0;
    }
}
