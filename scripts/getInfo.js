const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/Treasury.sol/Treasury.json")

async function main() {
    const abi = treasury_JSON.abi
    //console.log(JSON.stringify (abi))
    //https://kovan.etherscan.io/address/0xd0A1E359811322d97991E03f863a0C30C2cF029C#code
    const wethTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
    //const usdcTokenAbi
  
    const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_KOVAN_ID)
    // Way#1  open wallte  and connect to get signer
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const signer = wallet.connect(provider)
    
    // Way#2  get signer from wallet directly
    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)
    
    const xtoken= await ethers.getContractAt("TreasuryToken",process.env.MOJO1_KOVAN_TOKEN)
    const xtoken_symbol  =  await xtoken.symbol()
    const my_xtoken_bal  =  await xtoken.balanceOf(signer.address)
    console.log(xtoken_symbol)
    console.log(my_xtoken_bal)
    


    // const x_treasury = new ethers.Contract(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY, abi, signer)
    // const x_weth=new ethers.Contract(process.env.WETH_KOVAN_ADDRESS, wethTokenAbi, signer)

    
    
    // const xtoken_address = await x_treasury.getTokenAddress()
    // const xtoken_total_supply = await x_treasury.getTokenBalance()
    // console.log("Total Reward Token :"+xtoken_address +"  Balance : "+ ethers.utils.formatEther(xtoken_total_supply) )

    // const weth_bal_defi=await x_treasury.getInvestorWETH(signer.address)
    // console.log("My wETH in farm: "+ ethers.utils.formatEther(weth_bal_defi) )
    // const weth_bal_wallet=await x_weth.balanceOf(signer.address)
    // console.log("My WETH is "+ethers.utils.formatEther(weth_bal_wallet))

    // const token_bal_defi=await x_treasury.getInvestorWETH(signer.address)
    // console.log("My wETH in farm: "+ ethers.utils.formatEther(weth_bal_defi) )
    // const weth_bal_wallet=await x_weth.balanceOf(signer.address)
    // console.log("My WETH is "+ethers.utils.formatEther(weth_bal_wallet))



    
    // ethPrice=await x_treasury.getLatestETHPrice()
    // console.log("ETH price : "+ethPrice)




  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
