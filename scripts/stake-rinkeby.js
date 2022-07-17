const { ethers } = require("hardhat")
const treasury_JSON = require("../artifacts/contracts/TreasuryRinkeby.sol/TreasuryRinkeby.json")

async function main() {
  
  
  const acc=process.env.PRIVATE_KEY
  const action = 0 // 1=statke 2=unstake 
  const token_symbol = 'weth'  // weth and dai
  const amount_x = 0.02

    
  //https://rinkeby.etherscan.io/token/0xc778417E063141139Fce010982780140Aa0cD5Ab
  const wethTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

  const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_ID)
  const signer = new ethers.Wallet(acc, provider)
  console.log("Wallet " + signer.address + ": sign status is " + signer._isSigner)
  const abi = treasury_JSON.abi
  const x_treasury = new ethers.Contract(process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS, abi, signer)
  const x_weth = new ethers.Contract(process.env.WETH_RINKEBY_ADDRESS, wethTokenAbi, signer)


 let  amountXYZ = ethers.utils.parseEther(amount_x.toString())

  try {
    console.log("=================Before Transaction=========================")
    await ShowBalance()

    if (action == 1) {
      console.log("Approve and Deposite " + token_symbol + " = " + amountXYZ)
      // //const txDeposite=await x_treasury.depositWeth(amountXYZ, { gasLimit: 500000})
      let txDeposite
      let txApprove

        txApprove = await x_weth.approve(process.env.TREASURY_RINKEBY_CONTRACT_ADDRESS, amountXYZ)
        await txApprove.wait()
        console.log(txApprove)
        console.log("==================Approved Transaction================")

        txDeposite = await x_treasury.depositWeth(amountXYZ)
        await txDeposite.wait()
        const txDeposite_Receipt = await txDeposite.wait()
        console.log(txDeposite_Receipt)
        console.log("==================Deposited Transaction================")


   
  }
    else if (action == 2) {

      console.log("Withdrawing")
      let tx
      tx = await x_treasury.withdrawWeth(amountXYZ)
      console.log(tx)
      const tx_Receipt = await tx.wait()
      console.log(tx_Receipt)
      console.log("Withdrawed...")

    }
    console.log("=================After Transaction=========================")
    await ShowBalance()
    
    console.log("List All Holder")
    const listHolder=   await x_treasury.listAllTokenHolder()
    console.log(listHolder)

  } catch (error) {
    console.log(error.toString())
  }


  async function ShowBalance() {

    let my_bal_x = 0
    if (token_symbol == 'weth')
      my_bal_x = await x_weth.balanceOf(signer.address)


    let x_defi = 0
    let all_X_inpool = 0
    if (token_symbol == 'weth') {
      x_defi = await x_treasury.getInvestorWETH()
      all_X_inpool = await x_treasury.getWethBalance()
    }

    console.log("My " + token_symbol + " in defi : " + ethers.utils.formatEther(x_defi))
    console.log("All of " + token_symbol + " in defi : " + ethers.utils.formatEther(all_X_inpool))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


