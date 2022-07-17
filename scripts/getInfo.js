const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/TreasuryDefi.sol/TreasuryDefi.json")


const api_id = process.env.RINKEBY_ID //process.env.INFURA_KOVAN_ID  
const contract_address = process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS //process.env.TREASURY_KOVAN_CONTRACT_ADDRESS
const weth_address = process.env.WETH_RINKEBY_ADDRESS     //process.env.WETH_KOVAN_ADDRESS
const dai_address = process.env.DAI_RINKEBY_ADDRESS    //process.env.DAI_KOVAN_ADDRESS
async function main() {
    const abi = treasury_JSON.abi

    //const provider = new ethers.providers.InfuraProvider("kovan", api_id )
    const provider = new ethers.providers.AlchemyProvider('rinkeby', api_id )
    // Way#1  open wallte  and connect to get signer
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const signer = wallet.connect(provider)
    
    // Way#2  get signer from wallet directly
    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)

    const x_treasury = new ethers.Contract(contract_address, abi, signer)
    const myweth = await x_treasury.wethBalances("0x9130aC7AeB7e74E7C3fc64B315DbD0EcAFe69e63")
    console.log(ethers.utils.formatEther(myweth))

        // const x_token= await ethers.getContractAt("TreasuryToken",process.env.MOJO1_KOVAN_TOKEN)
        // let my_xtoken_bal  =  await x_token.balanceOf(signer.address)

          //  console.log("=================Call Chainliknk PriceFeed to set/get ETH for calculation==============")  
      //  const tx_ETHPrice=await x_treasury.setLatestETHPrice()
      //  await tx_ETHPrice.wait()
      //  ethPrice=await x_treasury.getLatestETHPrice()
      //  console.log("ETH price : "+ethPrice) 

    // const listHolder=   await x_treasury.listAllTokenHolder()
    // console.log(listHolder)
    // const pool_info={
    //   ethPriceInUSD : await x_treasury.getLatestETHPrice(),
    //   poolWethBal : await x_treasury.getWethBalance(),
    //   poolDaiBal :await x_treasury.getUsdcBalance(),
    //   treasuryAllRewardToken :await x_treasury.getTokenBalance(),
      
     
    // }
    // const new_no_distribution=100
    // const tx_change_noDist=await x_treasury.setNoTokenDistToHolderEachTime(ethers.utils.parseEther(new_no_distribution.toString()))
    // await tx_change_noDist.wait()

    // investorWethBal :await x_treasury.getInvestorWETH(),
    //   investorUsdcBal :await x_treasury.getInvestorUSDC(),
    //   InvestorRewardToken :await x_treasury.getInvestorRewardToken(),
    //console.log(pool_info)

    
    // const xtoken= await ethers.getContractAt("TreasuryToken",process.env.MOJO1_KOVAN_TOKEN)
    // const xtoken_symbol  =  await xtoken.symbol()
    // const my_xtoken_bal  =  await xtoken.balanceOf(signer.address)
    // console.log(xtoken_symbol)
    // console.log(my_xtoken_bal)
    

    // const xtoken_address = await x_treasury.getTokenAddress()
    // const xtoken_total_supply = await x_treasury.getTokenBalance()
    // console.log("Total Reward Token :"+xtoken_address +"  Balance : "+ ethers.utils.formatEther(xtoken_total_supply) )

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
