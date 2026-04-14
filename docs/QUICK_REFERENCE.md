# Quick Reference

## Networks
```
Mainnet      Chain ID 38833 (0x97B1)   https://rpc.igralabs.com:8545
Galleon      Chain ID 38836 (0x97B4)   https://galleon-testnet.igralabs.com:8545
Faucet       https://faucet.igralabs.com
```

## Gas (legacy `gasPrice`, NOT EIP-1559)
```
Mainnet  recommended  1100 Gwei  (1100000000000 wei)
Testnet  recommended  2200 Gwei  (2200000000000 wei)
```

## Finality
```
Low value    10 conf   ~10 s
DeFi swap    30 conf   ~30 s
High value   250 conf  ~4 min
Exchange     500 conf or `finalized` tag  ~8 min
Compliance   12 hours
```

## ethers.js v6 — sample tx
```js
const provider = new ethers.JsonRpcProvider('https://rpc.igralabs.com:8545');
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tx = await wallet.sendTransaction({
  to: '0x...',
  value: ethers.parseEther('1'),
  gasPrice: ethers.parseUnits('1100', 'gwei'),
});
const receipt = await provider.waitForTransaction(tx.hash, 30);
```

## Foundry one-liners
```bash
forge create src/Counter.sol:Counter \
  --rpc-url https://rpc.igralabs.com:8545 \
  --private-key $PK --legacy --with-gas-price 1100000000000

cast send 0xCONTRACT "increment()" \
  --rpc-url https://rpc.igralabs.com:8545 \
  --private-key $PK --legacy --with-gas-price 1100000000000

cast call 0xCONTRACT "count()(uint256)" \
  --rpc-url https://rpc.igralabs.com:8545
```

## Mainnet protocol contracts (Chain 38833)
```
Diamond Proxy           0xc24Df70E408739aeF6bF594fd41db4632dF49188
IGRA Token              0x093d77d397F8acCbaee0820345E9E700B1233cD1
Vesting Pools           0xc9c88C5b4a0E5ae4C0812F3bc04A5FeA9ffC580b
Stake Rewards Ctrl      0xF4BF5afdCC70eD80737778625Ddb1c0Ce89EC42c
Fee Proxy               0x0000000000000000000000000000000000000FEE
Governance              0xB3300fcC2F3EF3DeCdF8B1f710c21666f33Cbf18
IGRA Voting Power       0x50BAc71D1B32Fa6030007b5E72dbBB4fF48c1B39
Quex Oracle Core        0xC3546441897D9c87B3808c9402Bcb0655F238541
```
Full list: [CONTRACTS.md](CONTRACTS.md).

## Bridge
```
Mainnet entry (KAS L1)  kaspa:ppvnxxzm0rr37zpnwux2f2ntvfpr4uqdpm7zsvsztg3en92r7gs0wkmr72q9n
Min:                    100 KAS
Recommended max:        300 KAS (early-stage)
Testnet:                Faucet or KatBridge
```

## Verification
```bash
npx hardhat verify --network igraTestnet 0xCONTRACT "ConstructorArg1" 42

forge verify-contract 0xCONTRACT src/Counter.sol:Counter \
  --verifier blockscout \
  --verifier-url https://explorer.galleon-testnet.igralabs.com/api
```
