const { ethers} = require("hardhat")
const  treasury_JSON=require("../artifacts/contracts/Treasury.sol/Treasury.json")

async function main() {
    const abi = treasury_JSON.abi

    //https://kovan.etherscan.io/address/0xd0A1E359811322d97991E03f863a0C30C2cF029C#code
    const wethTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

    const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_KOVAN_ID)
    const signer =new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    console.log("Wallet "+signer.address+": sign status is "+signer._isSigner)

    const x_treasury = new ethers.Contract(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY, abi, signer)
    const x_weth=new ethers.Contract(process.env.WETH_KOVAN_ADDRESS, wethTokenAbi, signer)

    const amount_x=0.1
    const amountWETH=ethers.utils.parseEther(amount_x.toString())
    const action=0  // 1=statke 2=unstake 
    try {
      
        console.log("=================Before=========================") 
        let my_bal_weth=await x_weth.balanceOf(signer.address)
        console.log("Before My WETH in wallet : "+ethers.utils.formatEther(my_bal_weth))
        let weth_defi=await x_treasury.getInvestorWETH( )
        console.log("My WETH in defi : "+ethers.utils.formatEther(weth_defi))

        if (action==1){
        console.log("Approve and Deposite  in sequence")
        const txApprove=await x_weth.approve(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY , amountWETH)
        await txApprove.wait() 
        console.log("Approved...")
         
        // const txDeposite=await x_treasury.depositWeth(amountWETH, { gasLimit: 500000})
        const txDeposite=await x_treasury.depositWeth(amountWETH)
        console.log(txDeposite)
        const txDeposite_Receipt= await txDeposite.wait()
        console.log(txDeposite_Receipt)   
        console.log("Deposited...")

        }
        else    if (action==2){
           
          console.log("Withdrawing")
          const tx=await x_treasury.withdrawWeth(amountWETH)
          console.log(tx)
          const tx_Receipt= await tx.wait()
          console.log(tx_Receipt)   
          console.log("Withdrawed...")
  
          }

        console.log("=================After=========================") 
        my_bal_weth=await x_weth.balanceOf(signer.address)
        console.log("My WETH in wallet : "+ethers.utils.formatEther(my_bal_weth))
        weth_defi=await x_treasury.getInvestorWETH( )
        console.log("My WETH in defi : "+ethers.utils.formatEther(weth_defi))
       

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
  

