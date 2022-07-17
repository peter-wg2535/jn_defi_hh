const hre = require("hardhat");
async function main() {

  const chain_network='rinkeby'
  const Treasury = await hre.ethers.getContractFactory("TreasuryDefi");
  const treasury = await Treasury.deploy(1000000,10
    ,process.env.WETH_RINKEBY_ADDRESS,process.env.DAI_RINKEBY_ADDRESS
    ,process.env.RINKEBY_ETHUSD_AGG_PRICE_ADDRESS);

  await treasury.deployed();

  console.log("Treasury deployed to :"+chain_network+" : " +treasury.address);
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
