const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/TreasuryDefi.sol/TreasuryDefi.json")

// const x_api_endpoint=process.env.INFURA_KOVAN_ID
// const treasury_contract_address=process.env.TREASURY_KOVAN_CONTRACT_ADDRESS

const x_api_id=process.env.RINKEBY_ID
const treasury_contract_address=process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS


async function main() {
    const abi = treasury_JSON.abi

    //const provider = new ethers.providers.InfuraProvider("kovan", x_api_id)
    const provider = new ethers.providers.AlchemyProvider("rinkeby", x_api_id)
    

    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)

    const x_treasury = new ethers.Contract(treasury_contract_address, abi, signer)

    try {

        console.log("Distribute")
        const txDistReward=await x_treasury.distributeShareholderTokens()
        txReceipt=await txDistReward.wait() 
        console.log(txReceipt)

      
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
  

