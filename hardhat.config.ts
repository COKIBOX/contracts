// import { HardhatUserConfig } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';


import { node_url, accounts } from './utils/network';
const bscscanApiKey = process.env.BSC_API_KEY as string;
const config: HardhatUserConfig = {
  solidity: "0.8.16",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
    opBNBTestnet: {
      url: `https://opbnb-testnet-rpc.bnbchain.org`,
      chainId: 5611,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      // gas: 120000000,
      blockGasLimit: 0x1fffffffffffff,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      // allowUnlimitedContractSize: true,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    mainnet: {
      url: "https://bsc-dataseed1.ninicoin.io/",
      chainId: 56,
      gasPrice: 5000000000,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

  },
  etherscan: {
    apiKey: {
      bsc: bscscanApiKey,
      bscTestnet: bscscanApiKey
    },
    customChains: [
    ]
  }
};

export default config;
