// Deploy SimpleToken to Igra (mainnet or testnet — selected by --network).
//
// Usage:
//   npx hardhat run deploy-token.js --network igraTestnet
//   npx hardhat run deploy-token.js --network igraMainnet

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`Deploying from: ${deployer.address}`);
  console.log(`Network:        ${network} (chainId ${hre.network.config.chainId})`);
  console.log(`Balance:        ${hre.ethers.formatEther(balance)} iKAS`);

  const Token = await hre.ethers.getContractFactory('SimpleToken');
  const token = await Token.deploy('MyToken', 'MTK', 1_000_000n);
  await token.waitForDeployment();

  const addr = await token.getAddress();
  console.log(`✅ SimpleToken deployed at ${addr}`);

  const explorer = network === 'igraMainnet'
    ? 'https://explorer.igralabs.com'
    : 'https://explorer.galleon-testnet.igralabs.com';
  console.log(`   ${explorer}/address/${addr}`);
  console.log(`\nVerify with:`);
  console.log(`   npx hardhat verify --network ${network} ${addr} "MyToken" "MTK" 1000000`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
