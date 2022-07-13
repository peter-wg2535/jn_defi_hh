// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./TreasuryToken.sol";

import "hardhat/console.sol";

contract Treasury {
    address payable public owner;

    // ERC20 Token addresses on Ropsten network
    address private immutable wethAddress = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address private immutable usdcAddress = 0xb7a4F3E9097C08dA09517b5aB877F7a917224ede;
    IERC20 private weth;
    IERC20 private usdc;
    // keeps track of individuals' treasury WETH balances
    mapping(address => uint) public wethBalances;
    // keeps track of individuals' treasury USDC balances
    mapping(address => uint) public usdcBalances;

    AggregatorV3Interface internal priceFeed;
    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */

    int public ethPriceInUSD = 0;

    // Treasury Token
    IERC20 public token;

    constructor() {
        owner = payable(msg.sender);
        weth = IERC20(wethAddress);
        usdc = IERC20(usdcAddress);
        token = new TreasuryToken(1000000);
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    // deposit WETH into the treasury
    function depositWeth(uint _amount) external depositGreaterThanZero(_amount) payable {
        // update depositor's treasury WETH balance
        // update state before transfer of funds to prevent reentrancy attacks
        wethBalances[msg.sender] += _amount;

        // deposit WETH into treasury
        uint256 allowance = weth.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        weth.transferFrom(msg.sender, address(this), _amount);
    }

    // deposit USDC into the treasury
    function depositUsdc(uint _amount) external depositGreaterThanZero(_amount) payable {
        // update depositor's treasury USDC balance
        // update state before transfer of funds to prevent reentrancy attacks
        usdcBalances[msg.sender] += _amount;

        // deposit USDC into treasury
        uint256 allowance = usdc.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        usdc.transferFrom(msg.sender, address(this), _amount);
    }

    function getWethBalance() public view returns (uint) {
        return weth.balanceOf(address(this));
    }

    function getUsdcBalance() public view returns (uint) {
        return usdc.balanceOf(address(this));
    }

    function getTokenBalance() public view returns (uint) {
        return token.balanceOf(address(this));
    }
      function getTokenAddress() public view returns (address) {
        return address(token);
    }
    function getInvestorTokenBalance() public view returns (uint) {
        return token.balanceOf(msg.sender);
    }

    function getInvestorWETH(address investor_address ) public view returns(uint){
        return   wethBalances[investor_address];

    }

    function getInvestorUSDC(address investor_address ) public view returns(uint){
        return   usdcBalances[investor_address];

    }
    function getLatestETHPrice() public view returns (int) {
        return ethPriceInUSD;

    }

    function getInvestorPoolShare() public view returns (uint) {

        require(ethPriceInUSD > 0, "We must have the current Eth price to calculate invetor pool share. PlLease call 'getLatestPrice()'.");
        // get pool WETH balance
        uint poolWethBal = getWethBalance();
        // get pool usdc balance ..convert to ETH
        uint poolUsdcBal = getUsdcBalance();

        
        uint poolUsdcBalToEth = poolUsdcBal / uint(ethPriceInUSD);
        // add pool weth & usdc (ETH val)
        uint poolBalance = poolWethBal + poolUsdcBalToEth;

        //console.log("poolWeth - %s , poolUsd - %s, poolUsdcBalToEth - %s" ,poolWethBal,poolUsdcBal,poolUsdcBalToEth);

        // get investor WETH balance
        uint investorWethBal = wethBalances[msg.sender];
        // get investor usdc balance ..convert to ETH
        uint investorUsdcBal = usdcBalances[msg.sender] / uint(ethPriceInUSD);
        // add investor weth & usdc (ETH val)
        uint investorBalance = investorWethBal + investorUsdcBal;

        // pool balance / investor balance = percent of total
        uint investorPercentOfPool = (investorBalance * 100) / poolBalance;
        return investorPercentOfPool;
    }

    function distributeShareholderTokens() external returns (bool) {
        //setLatestETHPrice(); 
        // V2 , you need to call setETHPrice manually first before calculate  distributeShareholderTokens


        uint investorPercent = getInvestorPoolShare();
        require(investorPercent > 0, "The shareholder must have deposited some funds into the Treasury.");
        uint treasuryTokenBalance = getTokenBalance();
        uint investorTokenShare = (treasuryTokenBalance * investorPercent) / 100;
        bool transferSucceeded = token.transfer(msg.sender, investorTokenShare);
        return transferSucceeded;
    }

    /**
     * Returns the latest price
     */
    function setLatestETHPrice() public {
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        ethPriceInUSD = price;
        
    }

    modifier depositGreaterThanZero(uint _amount) {
      require(_amount > 0, "Deposit amount must be greater than zero");
      _;
   }

    modifier onlyOwner {
    	//is the message sender owner of the contract?
        require(msg.sender == owner);
        
        _;
    }

    function withdraw() payable onlyOwner public {
    
    	// If you are using version eight (v0.8) of chainlink aggregator interface,
    // By transfer
	// you will need to change the code below to
	// payable(msg.sender).transfer(address(this).balance);
    payable(msg.sender).transfer(address(this).balance);

      // By Call
        // (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        // uint256 balance = address(this).balance;
        // (bool success, ) = (msg.sender).call{value: balance}("transfered financier");
        // require(success, "Failed to withdraw money from contract.");

    }

    receive() external payable {}
}