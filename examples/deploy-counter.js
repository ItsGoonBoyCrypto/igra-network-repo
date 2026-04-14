// Deploy Counter to Igra.
//   npx hardhat run deploy-counter.js --network igraTestnet

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying Counter from ${deployer.address} on ${hre.network.name}`);

  const Counter = await hre.ethers.getContractFactory('Counter');
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  const addr = await counter.getAddress();
  console.log(`✅ Counter deployed at ${addr}`);
  console.log(`\nVerify:`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${addr}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
