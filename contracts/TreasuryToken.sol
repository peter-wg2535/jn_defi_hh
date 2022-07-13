// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TreasuryToken is ERC20 {
  address payable public owner;
  constructor(uint256 initialSupply) ERC20("TreasuryToken", "MOJO1") {
    owner = payable(msg.sender);
    _mint(msg.sender, initialSupply * (10 ** decimals()));
  }
}