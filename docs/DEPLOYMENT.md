# Deployment Walkthrough

End-to-end: from zero to deployed-and-verified on Galleon Testnet.

## Prereqs

- Node 18+ (for Hardhat) or Foundry installed
- A funded testnet wallet — get iKAS at https://faucet.igralabs.com
- Your private key in `.env` (NEVER commit it)

## Path A — Hardhat

### 1. Install
```bash
cd examples
npm install
cp .env.example .env
# edit .env: PRIVATE_KEY=0x...
```

### 2. Compile
```bash
npx hardhat compile
```

### 3. Deploy a contract
```bash
npx hardhat run deploy-token.js --network igraTestnet
# prints: ✅ MyToken deployed at 0x...
```

### 4. Verify on Blockscout
```bash
npx hardhat verify --network igraTestnet 0xDEPLOYED_ADDRESS "MyToken" "MTK" 1000000
```
Open https://explorer.galleon-testnet.igralabs.com/address/0xDEPLOYED_ADDRESS — verified source should appear within ~30 seconds.

### 5. Interact
```bash
npx hardhat console --network igraTestnet
> const t = await ethers.getContractAt('SimpleToken', '0xDEPLOYED_ADDRESS');
> await t.totalSupply();
> await t.transfer('0xrecipient', ethers.parseUnits('10', 18), { gasPrice: ethers.parseUnits('2200', 'gwei') });
```

## Path B — Foundry

### 1. Setup
```bash
cd script
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 2. Build
```bash
forge build
```

### 3. Deploy via script
```bash
export PRIVATE_KEY=0x...

forge script Deploy.s.sol:DeployScript \
  --rpc-url igra_testnet \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  --with-gas-price 2200000000000
```

The script deploys `Counter`, `SimpleToken`, and `SimpleNFT`, and prints all three addresses.

### 4. Verify
```bash
forge verify-contract 0xDEPLOYED ../examples/Counter.sol:Counter \
  --chain-id 38836 \
  --verifier blockscout \
  --verifier-url https://explorer.galleon-testnet.igralabs.com/api
```

## Going to Mainnet

Same commands, swap:
- network: `igraTestnet` → `igraMainnet` (Hardhat) / `igra_mainnet` (Foundry)
- gas price: `2200000000000` → `1100000000000`
- explorer: `galleon-testnet` → no prefix

**Before mainnet:**
- Test the exact same contract on Galleon
- Verify your `.env` doesn't have a testnet key in it
- Pre-fund the deployer with enough iKAS (~0.5 iKAS covers most deployments)
- For high-value deploys, wait for `finalized` tag before treating addresses as live

## Wait-for-finality pattern

```js
const tx = await factory.deploy('MyToken', 'MTK', 1_000_000);
console.log('Submitted:', tx.deploymentTransaction().hash);
await tx.waitForDeployment();
const address = await tx.getAddress();
console.log('Mined at:', address);

// For high-value flows, also wait for finality:
await provider.waitForTransaction(tx.deploymentTransaction().hash, 250);
console.log('Final.');
```
