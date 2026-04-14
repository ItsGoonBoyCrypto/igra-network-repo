// Deploy SimpleNFT to Igra.
//   npx hardhat run deploy-nft.js --network igraTestnet

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying SimpleNFT from ${deployer.address} on ${hre.network.name}`);

  const NFT = await hre.ethers.getContractFactory('SimpleNFT');
  const nft = await NFT.deploy('IgraDemoNFT', 'IDN');
  await nft.waitForDeployment();

  const addr = await nft.getAddress();
  console.log(`✅ SimpleNFT deployed at ${addr}`);
  console.log(`\nVerify:`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${addr} "IgraDemoNFT" "IDN"`);
}

main().catch((e) => { console.error(e); process.exit(1); });
