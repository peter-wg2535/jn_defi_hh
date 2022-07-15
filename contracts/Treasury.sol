// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./TreasuryToken.sol";

import "hardhat/console.sol";

contract Treasury {
    address payable public owner;

    address private immutable wethAddress =
        0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    IERC20 private weth;
    mapping(address => uint) public wethBalances; // keeps track of individuals' treasury WETH balances

    // Replace usdc with dai but all variables keep using USDC
    //address private immutable usdcAddress = 0xb7a4F3E9097C08dA09517b5aB877F7a917224ede;  // usdc-kovan
    address private immutable usdcAddress =
        0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa; //dai-kovan
    IERC20 private usdc;
    mapping(address => uint) public usdcBalances; // keeps track of individuals' treasury USDC balances

    // Network: Kovan ,Aggregator: ETH/USD  ,Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
    AggregatorV3Interface internal priceFeed;
    int public ethPriceInUSD = 0;

    //event  to distribute reward
    event DistributeReward(
        address indexed _staker,
        uint _investorWethBal,
        uint _investorUsdcBal,
        uint _investorTokenShare
    );

    // Treasury Token
    IERC20 public token;

    constructor() {
        owner = payable(msg.sender);
        weth = IERC20(wethAddress);
        usdc = IERC20(usdcAddress);
        token = new TreasuryToken(1000000);
        priceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
        );
    }

    // deposit WETH into the treasury
    function depositWeth(uint _amount)
        external
        payable
        depositGreaterThanZero(_amount)
    {
        // update depositor's treasury WETH balance
        // update state before transfer of funds to prevent reentrancy attacks
        wethBalances[msg.sender] += _amount;

        // deposit WETH into treasury
        uint256 allowance = weth.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        weth.transferFrom(msg.sender, address(this), _amount);
    }

    // deposit DAI into the treasury
    function depositUsdc(uint _amount)
        external
        payable
        depositGreaterThanZero(_amount)
    {
        // update depositor's treasury DAI balance
        // update state before transfer of funds to prevent reentrancy attacks
        usdcBalances[msg.sender] += _amount;

        // deposit USDC into treasury
        uint256 allowance = usdc.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        usdc.transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawWeth(uint _amount) external payable {
        require(
            _amount <= wethBalances[msg.sender],
            "Withdraw WETH amount must be less than or equal Balance"
        );
        wethBalances[msg.sender] -= _amount;
        weth.transfer(msg.sender, _amount);
    }

    function withdrawUsdc(uint _amount) external payable {
        require(
            _amount <= usdcBalances[msg.sender],
            "Withdraw DAI amount must be less than or equal Balance"
        );
        usdcBalances[msg.sender] -= _amount;
        usdc.transfer(msg.sender, _amount);
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

    function getInvestorRewardToken() public view returns (uint) {
        return token.balanceOf(msg.sender);
    }

    function getInvestorWETH() public view returns (uint) {
        return wethBalances[msg.sender];
    }

    function getInvestorUSDC() public view returns (uint) {
        return usdcBalances[msg.sender];
    }

    function getLatestETHPrice() public view returns (int) {
        return ethPriceInUSD;
    }

    function distributeShareholderTokens() external returns (bool) {
        
        setLatestETHPrice();

        require(
            ethPriceInUSD > 0,
            "We must have the current Eth price to calculate invetor pool share. PlLease call 'getLatestPrice()'."
        );
        // 1-Find out Total item in Pool
        // get pool WETH balance
        uint poolWethBal = getWethBalance();
        // get pool DAI balance and convert to ETH
        uint poolUsdcBal = getUsdcBalance();
        uint poolUsdcBalToEth = poolUsdcBal / uint(ethPriceInUSD);
        // add pool weth & dai (ETH val)
        uint poolBalance = poolWethBal + poolUsdcBalToEth;

        // 2-Find out Total item  of investor
        // get investor WETH balance
        uint investorWethBal = wethBalances[msg.sender];
        // get investor DAI balance ..convert to ETH
        uint investorUsdcBal = usdcBalances[msg.sender] / uint(ethPriceInUSD);
        // add investor weth & dai (ETH val)
        uint investorBalance = investorWethBal + investorUsdcBal;

        // pool balance / investor balance = percent of total
        uint investorPercent = (investorBalance * 100) / poolBalance;

        if (investorPercent > 0) {
            uint treasuryTokenBalance = getTokenBalance();
            uint investorTokenShare = (treasuryTokenBalance * investorPercent) /
                100;

            bool transferSucceeded = token.transfer(
                msg.sender,
                investorTokenShare
            );

            emit DistributeReward(
                msg.sender,
                investorWethBal,
                investorUsdcBal,
                investorTokenShare
            );

            return transferSucceeded;
        } else {
            return false;
        }
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

    receive() external payable {}
}
