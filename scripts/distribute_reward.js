
const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/Treasury.sol/Treasury.json")

async function main() {
    const abi = treasury_JSON.abi

    const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_KOVAN_ID)
    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)

    const x_treasury = new ethers.Contract(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY, abi, signer)


    try {

       console.log("=================Call Chainliknk PriceFeed to set/get ETH for calculation==============")  
       const tx_ETHPrice=await x_treasury.setLatestETHPrice()
       await tx_ETHPrice.wait()
       ethPrice=await x_treasury.getLatestETHPrice()
       console.log("ETH price : "+ethPrice) 
      
        // const x_token= await ethers.getContractAt("TreasuryToken",process.env.MOJO1_KOVAN_TOKEN)
        // let my_xtoken_bal  =  await x_token.balanceOf(signer.address)
        let my_xtoken_bal=await x_treasury.getInvestorTokenReward() 
        console.log("Before Get Reward, My XToken in wallet : "+ethers.utils.formatEther(my_xtoken_bal))

        console.log("Distribute")
        const txDistReward=await x_treasury.distributeShareholderTokens()
        await txDistReward.wait() 

        my_xtoken_bal= await x_treasury.getInvestorTokenReward() 
        console.log("After Get Reward, ,My XToken in wallet : "+ethers.utils.formatEther(my_xtoken_bal))
         
       

    } catch (error) {
        console.log(error.toString())
    }

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

