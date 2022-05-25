// SPDX-License-Identifier: MIT License

pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract LotteryToken {
    //using SafeERC20 for IERC20;


    /* Attributes */
    address[] public players;
    bool[] public isGift;
    address[] public winners;
    uint256 public ticketPrice;
    uint256 public prizeAmount;
    uint256 public currentRound;
    //uint256 public lastTime;
    //uint256 private lotteryRoundTime;
    uint256 private minRoundPlayers;
    address public owner;
    ERC20Burnable token;
    //uint256 public balance;

    /* Events */
    event PlayerJoined(
        uint256 ticketIndex,
        address player,
        uint256 round,
        bool isGifted,
        uint256 prizeAmount
    );
    event LotteryResult(
        uint256 ticketIndex,
        address winner,
        uint256 round,
        bool isGifted,
        uint256 prizeAmount,
        uint256 timestamp
    );

    /** 
        Constructor function only stores the timestamp
    */
    constructor(address token_) {
        owner = msg.sender;

        //lastTime = block.timestamp;
        //lotteryRoundTime = 5;
        currentRound = 1;
        ticketPrice = 1;
        minRoundPlayers = 5;
        token = ERC20Burnable(token_);
    }


    /**
       Join the Lottery and Pick Winner if conditions are met
    */

    function joinLottery(address _token, uint256 _amount) public {

        // Mark as not gift
        isGift.push(false);
        // Enter Lottery
        enterLottery(msg.sender, _token, _amount);
    }

    // function tokenBalance(address _token) public view returns(uint256 balance) {
    //     balance = IERC20(_token).balanceOf(address(this));
    //     return balance;
    // }

    /**
       Gift a the Lottery entry
    */
    function giftTicket(address _recipient, address _token, uint256 _amount) public {
        // Mark as gift
        isGift.push(true);
        // Enter Lottery
        enterLottery(_recipient, _token, _amount);
    }

    /**
        Enter lottery
    */
    function enterLottery(address _entry, address _token, uint256 _amount) internal {
        require(_amount >= ticketPrice, "Amount sent less than minimum");
        require(_amount <= ticketPrice, "Amount sent more than minimum");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // Add the address entry as a player
        players.push(_entry);
        // Update prize Amount
        prizeAmount = IERC20(_token).balanceOf(address(this));

        // Emit event
        emit PlayerJoined(
            players.length - 1, // index
            _entry, // player address
            currentRound,   // round
            isGift[isGift.length - 1],  // bool
            prizeAmount // prize amount 
        );

        
        // Pick Winner if conditions are met
        if (
            //block.timestamp >= lastTime + lotteryRoundTime &&
            players.length >= minRoundPlayers
        ) {
            pickWinner(_token);
        }
    }

    /**
        Pick winner
    */
    function pickWinner(address _token) internal {
        // Pick a pseudo-random winner
        uint256 ticketIndex = random() % players.length;
        address winner = players[ticketIndex];

        // Burn Amount
        uint256 burnAmount = 1;

        // Approve burn
        token.approve(address(this), burnAmount);

        // Burn
        token.burnFrom(address(this), burnAmount);

        // Deduct
        prizeAmount = prizeAmount - burnAmount;

        // Transfer remaining funds
        IERC20(_token).transfer(winner, prizeAmount);
        // Emit event
        emit LotteryResult(
            ticketIndex,
            winner,
            currentRound,
            isGift[ticketIndex],
            prizeAmount,
            block.timestamp
        );
        // Update variables
        winners.push(winner);
        currentRound++;
        //lastTime = block.timestamp;
        // Reset variables
        delete players;
        delete isGift;
        prizeAmount = 0;
    }

    /**
        Getter for private attribute lotteryRoundTime
    */
    // function getLotteryRoundTime() public view returns (uint256) {
    //     require(
    //         msg.sender == owner,
    //         "This method is restricted just for the owner"
    //     );
    //     return lotteryRoundTime;
    // }

    /** 
        Getter for private attribute minRoundPlayers
    */
    function getMinRoundPlayers() public view returns (uint256) {
        require(
            msg.sender == owner,
            "This method is restricted just for the owner"
        );
        return minRoundPlayers;
    }

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.number, block.timestamp, players)
                )
            );
    }

   
}