require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    kovan: {
      url: process.env.INFURA_KOVAN_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby: {
      url: process.env.RINKEBY_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
