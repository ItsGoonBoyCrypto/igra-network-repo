require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const PK = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    igraMainnet: {
      url: 'https://rpc.igralabs.com:8545',
      chainId: 38833,
      accounts: PK,
      // EXPLICIT legacy gasPrice — Igra rejects EIP-1559 below the floor.
      // 1100 Gwei = 1100 * 1e9 wei
      gasPrice: 1100_000_000_000,
    },
    igraTestnet: {
      url: 'https://galleon-testnet.igralabs.com:8545',
      chainId: 38836,
      accounts: PK,
      // 2200 Gwei = 2200 * 1e9 wei
      gasPrice: 2200_000_000_000,
    },
  },
  etherscan: {
    apiKey: {
      igraMainnet: 'blockscout',
      igraTestnet: 'blockscout',
    },
    customChains: [
      {
        network: 'igraMainnet',
        chainId: 38833,
        urls: {
          apiURL: 'https://explorer.igralabs.com/api',
          browserURL: 'https://explorer.igralabs.com',
        },
      },
      {
        network: 'igraTestnet',
        chainId: 38836,
        urls: {
          apiURL: 'https://explorer.galleon-testnet.igralabs.com/api',
          browserURL: 'https://explorer.galleon-testnet.igralabs.com',
        },
      },
    ],
  },
};
