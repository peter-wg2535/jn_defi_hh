require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    kovan: {
      url: process.env.INFURA_KOVAN_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
