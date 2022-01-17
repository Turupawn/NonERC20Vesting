// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenTimelock is Ownable {
  mapping(address=>uint) public coins;
  function buy() public
  {
    coins[msg.sender] += 300;
  }
}