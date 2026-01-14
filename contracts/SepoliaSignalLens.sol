// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.20;

contract SepoliaSignalLens {
    function chainSignals()
        external
        view
        returns (
            uint256 blockNumber,
            uint256 timestamp,
            uint256 basefee,
            uint256 gaslimit,
            address coinbaseAddress
        )
    {
        blockNumber = block.number;
        timestamp = block.timestamp;
        basefee = block.basefee;
        gaslimit = block.gaslimit;
        coinbaseAddress = block.coinbase;
    }

    function runtimeCodeSize(address target) external view returns (uint256 size) {
        assembly {
            size := extcodesize(target)
        }
    }

    function hasBytecode(address target) external view returns (bool) {
        return this.runtimeCodeSize(target) > 0;
    }
}
