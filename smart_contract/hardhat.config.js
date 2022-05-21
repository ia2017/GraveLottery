require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.GOERLI,
      accounts:
        process.env.PRIVATE_KEY !== undefined
        ? [process.env.PRIVATE_KEY]
        : [],
    },
    rinkeby: {
      url: process.env.RINKEBY,
      accounts:
        process.env.PRIVATE_KEY !== undefined
        ? [process.env.PRIVATE_KEY]
        : [],
    }
  }
};
