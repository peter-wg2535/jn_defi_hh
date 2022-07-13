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

    try {
       // let ethPrice=await x_treasury.getLatestETHPrice()
       // console.log("ETH Price : "+ethPrice)
        
        const my_bal_weth=await x_weth.balanceOf(signer.address)
        console.log("My WETH is "+ethers.utils.formatEther(my_bal_weth))

        console.log("Set ETH Price")
        let ethPrice=await x_treasury.getLatestETHPrice()
        console.log("Before invokding price : "+ethPrice)
        
        // Approve and Deposite  in sequence
        const txApprove=await x_weth.approve(process.env.KOVAN_CONTRACT_ADDRESS_TREASURY , amountWETH)
        // console.log(txApprove)
        const txApprove_Receipt= await txApprove.wait()
        // console.log(txApprove_Receipt)   
        console.log("Approved...")
         
        // const txDeposite=await x_treasury.depositWeth(amountWETH, { gasLimit: 500000})
        const txDeposite=await x_treasury.depositWeth(amountWETH)
        console.log(txDeposite)
        const txDeposite_Receipt= await txDeposite.wait()
        console.log(txDeposite_Receipt)   
        console.log("Deposited...")

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
  

// Treasury = await ethers.getContractFactory("Treasury");
// [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

// // To deploy our contract, we just have to call Treasury.deploy() and await
// // for it to be deployed(), which happens once its transaction has been
// // mined.
// treasury = await Treasury.deploy();

//  //       await treasury.connect(addr1).depositWeth(1, { value: 30000 });