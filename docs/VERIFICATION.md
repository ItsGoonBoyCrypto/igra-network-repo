# Contract Verification

Igra uses **Blockscout** as its block explorer. **No API key required.**

## Hardhat

`hardhat.config.js` ships with the right `etherscan` block:
```js
etherscan: {
  apiKey: { igraTestnet: 'blockscout', igraMainnet: 'blockscout' },
  customChains: [
    {
      network: 'igraTestnet', chainId: 38836,
      urls: { apiURL: 'https://explorer.galleon-testnet.igralabs.com/api',
              browserURL: 'https://explorer.galleon-testnet.igralabs.com' },
    },
    {
      network: 'igraMainnet', chainId: 38833,
      urls: { apiURL: 'https://explorer.igralabs.com/api',
              browserURL: 'https://explorer.igralabs.com' },
    },
  ],
},
```

Verify:
```bash
npx hardhat verify --network igraTestnet 0xCONTRACT "ConstructorArg1" 42
```

For contracts with complex constructor args (structs, arrays), use the `--constructor-args` flag pointing at a JS file:
```bash
npx hardhat verify --network igraTestnet 0xCONTRACT --constructor-args args.js
```
Where `args.js`:
```js
module.exports = ['MyToken', 'MTK', 1_000_000n];
```

## Foundry

```bash
forge verify-contract 0xCONTRACT path/to/Source.sol:ContractName \
  --chain-id 38836 \
  --verifier blockscout \
  --verifier-url https://explorer.galleon-testnet.igralabs.com/api \
  --constructor-args $(cast abi-encode "constructor(string,string,uint256)" "MyToken" "MTK" 1000000)
```

Or in `foundry.toml` add:
```toml
[etherscan]
igra_testnet = { key = "blockscout", url = "https://explorer.galleon-testnet.igralabs.com/api", chain = 38836 }
igra_mainnet = { key = "blockscout", url = "https://explorer.igralabs.com/api", chain = 38833 }
```

Then `forge verify-contract --chain igra_testnet ...` works.

## Manual upload (if CLI fails)

Open the contract page on the explorer:
```
https://explorer.galleon-testnet.igralabs.com/address/0xCONTRACT
```
Click the **Contract** tab → **Verify & Publish**. Choose Solidity (single file) or Standard JSON. Paste source/JSON, set compiler version & optimizer settings to match your build, submit.

## Compiler settings checklist

Verification fails when settings don't match the deployed bytecode. Make sure:
- Solidity version matches exactly (`0.8.24` ≠ `0.8.25`)
- Optimizer enabled/disabled matches
- Optimizer runs match (default 200)
- EVM version matches (Igra: `prague` or `cancun` are both fine; default works)
- Constructor args ABI-encoded correctly

## Multi-file projects

Use Hardhat's verifier or `forge verify-contract --watch` — both auto-resolve imports. Don't try to flatten unless verification fails: flattening can break SPDX/license comments.
