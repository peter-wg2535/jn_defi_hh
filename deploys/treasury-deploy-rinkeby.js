const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Treasury = await hre.ethers.getContractFactory("TreasuryRinkeby");
  const treasury = await Treasury.deploy();

  await treasury.deployed();

  console.log("Treasury deployed rinkeby testnet to:", treasury.address);
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
