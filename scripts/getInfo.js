const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/Treasury.sol/Treasury.json")

async function main() {
    const abi = treasury_JSON.abi
    //console.log(JSON.stringify (abi))
  
    const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_KOVAN_ID)

    // Way#1  open wallte  and connect to get signer
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const signer = wallet.connect(provider)
    
    // Way#2  get signer from wallet directly
    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)
    


    const x_treasury = new ethers.Contract(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY, abi, signer)
    
    const xtoken_address = await x_treasury.getTokenAddress()
    const xtoken_bal = await x_treasury.getTokenBalance()
    console.log("Token :"+xtoken_address +"  and Balance : "+ ethers.utils.formatEther(xtoken_bal) )
    
    

    const txResponse_GetPrice=await x_treasury.setLatestETHPrice()
    //console.log(txResponse_GetPrice)
    const txReceipt_GetPrice= await txResponse_GetPrice.wait()
    //console.log(txReceipt_GetPrice)    

    ethPrice=await x_treasury.getLatestETHPrice()
    console.log("After invokding price : "+ethPrice)




  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
