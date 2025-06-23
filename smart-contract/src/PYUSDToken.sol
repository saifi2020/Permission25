pragma solidity ^0.8.29;

import "@openzeppelin-contracts/token/ERC20/ERC20.sol";

contract PYUSDToken is ERC20 {
    constructor() ERC20("PayPal USD", "PYUSD") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}