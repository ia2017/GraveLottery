// SPDX-License-Identifier: MIT License

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LotteryToken {
    using SafeMath for uint256;

    /* Attributes */
    address[] public players;
    //bool[] public isGift;
    address[] public winners;
    uint256 public ticketPrice;
    uint256 public prizeAmount;
    uint256 public currentRound;
    //uint256 public lastTime;
    //uint256 private lotteryRoundTime;
    uint256 private minRoundPlayers;
    address public owner;
    uint256 private burnPercent;
    bool public startRound;
    bool public startNextRound;
    address public tokenAddress;
    ERC20Burnable token;

    /* Events */
    event PlayerJoined(
        uint256 ticketIndex,
        address player,
        uint256 round,
        uint256 prizeAmount
    );
    event LotteryResult(
        uint256 ticketIndex,
        address winner,
        uint256 round,
        uint256 prizeAmount,
        uint256 timestamp
    );

    /** 
        Constructor function only stores the timestamp
    */
    constructor(uint256 _ticketPrice, uint256 _players, address _token, uint256 _burnPercent, bool _round) {
        owner = msg.sender;

        currentRound = 1;
        ticketPrice = _ticketPrice;
        minRoundPlayers = _players;
        token = ERC20Burnable(_token);
        tokenAddress = _token;
        burnPercent = _burnPercent;
        startRound = _round;
        startNextRound = _round;
    }


    /**
       Join the Lottery and Pick Winner if conditions are met
    */
    function joinLottery(uint256 _amount) public {
        require(_amount >= ticketPrice, "Amount sent less than minimum");
        require(_amount <= ticketPrice, "Amount sent more than minimum");
        require(startRound == true, "Lottery round not open");

        // Enter Lottery
        enterLottery(msg.sender, _amount);
    }


    /**
        Enter lottery
    */
    function enterLottery(address _entry, uint256 _amount) internal {

        // Approve transfer
        IERC20(tokenAddress).approve(msg.sender, _amount);

        // Transfer
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        
        // Add the address entry as a player
        players.push(_entry);
        // Update prize Amount
        prizeAmount = IERC20(tokenAddress).balanceOf(address(this));

        // Emit event
        emit PlayerJoined(
            players.length - 1, // index
            _entry, // player address
            currentRound,   // round
            prizeAmount // prize amount 
        );

        
        // Pick Winner if conditions are met
        if (
            //block.timestamp >= lastTime + lotteryRoundTime &&
            players.length >= minRoundPlayers
        ) {
            pickWinner();
        }
    }

    /**
        Pick winner
    */
    function pickWinner() internal {
        // Pick a pseudo-random winner
        uint256 ticketIndex = random() % players.length;
        address winner = players[ticketIndex];

        // Burn Amount
        uint256 burnAmount = prizeAmount.mul(burnPercent).div(100); // SafeMath

        // Approve burn
        token.approve(address(this), burnAmount);

        // Burn
        token.burnFrom(address(this), burnAmount);

        // Deduct burn amount from prize amount
        prizeAmount = prizeAmount - burnAmount;

        // Transfer remaining funds
        IERC20(tokenAddress).transfer(winner, prizeAmount);

        // Emit event
        emit LotteryResult(
            ticketIndex,
            winner,
            currentRound,
            prizeAmount,
            block.timestamp
        );

        // Update variables
        winners.push(winner);
        currentRound++;

        // Reset variables
        delete players;
        prizeAmount = 0;
        startRound = startNextRound;
    }

    

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.number, block.timestamp, players)
                )
            );
    }

    /* ------------ Owner Functions ---------------- */

    /** 
        Getter for private attribute minRoundPlayers
    */
    function getMinRoundPlayers() public view returns (uint256) {
        require(msg.sender == owner, "This method is restricted just for the owner");

        return minRoundPlayers;
    }

    // Entries
    function setMinRoundPlayers(uint256 _nplayers) external {
        require(msg.sender == owner, "This method is restricted just for the owner");
        require(_nplayers > 0, "Cannot have zero players");

        minRoundPlayers=_nplayers;
    }

    // prize pool
    function setTicketPrice(uint256 _amount) public {
        require(msg.sender == owner, "This method is restricted just for the owner");
        
        ticketPrice=_amount;
    }

    // amount burned
    function setBurnPercent(uint256 _percent) external {
        require(msg.sender == owner, "This method is restricted just for the owner");
        require(_percent <= 100, "Cannot burn more than 100%");

        burnPercent=_percent;
    }

    // token address (grave/zombie)
    function setTokenAddress(address _token) external {
        require(msg.sender == owner, "This method is restricted just for the owner");

        tokenAddress=_token;
        token = ERC20Burnable(_token);

    }

    /**
        Start round - lock round (once round ends, locks next round)
    */

    function setStartRound(bool _start) external {
        require(msg.sender == owner, "This method is restricted just for the owner");

        if (players.length == 0) {
            startRound=_start;
            startNextRound=_start;
        } else {
            startNextRound=_start;
        }
    }

    // Force winner (if doesnt meet quota)

   function forceWinner() external {
        require(msg.sender == owner, "This method is restricted just for the owner");

        pickWinner();
    }

    function transferOwner(address _owner) external {
        require(msg.sender == owner, "This method is restricted just for the owner");

        owner = _owner;
    }
}

// 1,218,241 gas units ---------
// Average 27 nAVAX / 28 gwei
// 32.9 mil gwei
// ------ 84 dollars ------


