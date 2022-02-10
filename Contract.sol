// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is Ownable {

  uint public ENTRY_PRICE = 300 ether;
  uint public COIN_REWARD = 1000 ether;

  ERC20 busd = ERC20(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56);

  mapping(address=>uint) public beneficiary_coins;

  mapping(address=>bool) public whitelist;
  mapping(address => bool) public is_beneficiary;

  mapping(uint=>address) public beneficiaries;
  uint public beneficiaries_count;

  // Public Functions

  function buy() public
  {
    require(whitelist[msg.sender], "You must be whitelisted.");
    require(!is_beneficiary[msg.sender], "You already are a beneficiary.");
    
    is_beneficiary[msg.sender] = true;
    beneficiary_coins[msg.sender] += COIN_REWARD;
    beneficiaries_count += 1;

    busd.transferFrom(msg.sender, address(this), ENTRY_PRICE);
  }

  // OWNER FUNCTIONS

  function setCoinReward(uint coin_reward) public onlyOwner
  {
    COIN_REWARD = coin_reward;
  }

  function setEntryPrice(uint entry_price) public onlyOwner
  {
    ENTRY_PRICE = entry_price;
  }

  function editWhitelist(address[] memory addresses, bool value) public onlyOwner
  {
    for(uint i; i < addresses.length; i++){
      whitelist[addresses[i]] = value;
    }
  }

  function withdrawBUSD() public onlyOwner
  {
    busd.transfer(address(owner()), busd.balanceOf(address(this)));
  }
}