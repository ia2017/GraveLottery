// SDPX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract SomeCoin is ERC20 {
    constructor() ERC20("SC", "Some Coin") {
        _mint(msg.sender, 1000000000);
    }
}