import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-tracer";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";

dotenv.config();

if (!process.env.ETH_NODE_URL) throw new Error(`expected .env file with ETH_NODE_URL`)

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.web3.eth.getAccounts()

  for (const account of accounts) {
    console.log(account, await hre.web3.eth.getBalance(account));
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETH_NODE_URL!,
      },
      blockGasLimit: 12e6,
      accounts: {
        accountsBalance: "1000000000000000000000000",
      },
    }
  },
  typechain: {
    outDir: "typechain-hardhat",
    target: "web3-v1",
  },
  mocha: {
    timeout: 500_000,
    retries: 0,
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY!,
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
};

export default config;
