const hre = require("hardhat");
async function main() {
//https://rinkeby.etherscan.io/address/0x1B6891E4Cfd948d7Efc674F13Decad3F44bB65a7#code
//https://rinkeby.etherscan.io/address/0x8eEb30D5163D6513Fb636961852b765558D8e3d3#code
  const chain_network='rinkeby'
  const Treasury = await hre.ethers.getContractFactory("DualTreasuryDefi");
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
