# Foundry Setup

Foundry works on Igra with two non-negotiable flags: `--legacy` and `--with-gas-price`.

## Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## `foundry.toml`

The shipped config in [`script/foundry.toml`](../script/foundry.toml) sets reasonable defaults. Key fields:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"

[rpc_endpoints]
igra_mainnet = "https://rpc.igralabs.com:8545"
igra_testnet = "https://galleon-testnet.igralabs.com:8545"

[etherscan]
igra_mainnet = { key = "blockscout", url = "https://explorer.igralabs.com/api", chain = 38833 }
igra_testnet = { key = "blockscout", url = "https://explorer.galleon-testnet.igralabs.com/api", chain = 38836 }
```

## Project layout

If you bring your own `src/`:
```
project/
├── foundry.toml
├── src/
│   └── Counter.sol
└── script/
    └── Deploy.s.sol
```

This repo's `script/Deploy.s.sol` references the contracts in `examples/` — adjust paths if you copy it into a fresh Foundry project.

## Deploy commands

### Testnet
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url igra_testnet \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  --with-gas-price 2200000000000
```

### Mainnet
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url igra_mainnet \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  --with-gas-price 1100000000000
```

## `forge create` (single-contract deploy)

```bash
forge create examples/Counter.sol:Counter \
  --rpc-url igra_testnet \
  --private-key $PRIVATE_KEY \
  --legacy \
  --with-gas-price 2200000000000
```

## `cast` interactions

```bash
# Read
cast call 0xCONTRACT "count()(uint256)" --rpc-url igra_testnet

# Write
cast send 0xCONTRACT "increment()" \
  --rpc-url igra_testnet \
  --private-key $PRIVATE_KEY \
  --legacy \
  --with-gas-price 2200000000000

# Send native iKAS
cast send 0xRECIPIENT \
  --value 0.1ether \
  --rpc-url igra_testnet \
  --private-key $PRIVATE_KEY \
  --legacy \
  --with-gas-price 2200000000000
```

## Verification (Blockscout, no key)

```bash
forge verify-contract 0xCONTRACT examples/Counter.sol:Counter \
  --chain-id 38836 \
  --verifier blockscout \
  --verifier-url https://explorer.galleon-testnet.igralabs.com/api
```

## Common errors

| Error | Cause |
|---|---|
| `--with-gas-price` ignored | You forgot `--legacy` |
| Tx submitted but pending forever | Gas below 1000/2000 Gwei minimum |
| `failed to estimate gas` | RPC issue — pass `--gas-limit 3000000` manually |
| `nonce too low` | Use `--slow` flag or wait for prior tx |
