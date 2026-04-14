# Igra Network — Developer Repository

A practical, working starter for building on **Igra Network**, the EVM-compatible Layer 2 rollup built on the Kaspa BlockDAG.

> ⚠️ **Critical**: Igra requires **explicit legacy `gasPrice`** — never EIP-1559. See [`docs/GAS_GUIDE.md`](docs/GAS_GUIDE.md) before deploying.

## What's in here

| Path | Purpose |
|---|---|
| [`docs/`](docs/) | 12 guides covering networks, gas, deployment, architecture, governance, bridging |
| [`examples/`](examples/) | Solidity contracts (ERC-20, ERC-721, Counter), Hardhat config & scripts |
| [`script/`](script/) | Foundry deployment scripts |
| [`FAQ.md`](FAQ.md) | Common questions |
| [`INDEX.md`](INDEX.md) | Full file index |

## Quick start (Hardhat)

```bash
cd examples
npm install
cp .env.example .env   # add your PRIVATE_KEY
npx hardhat compile
npx hardhat run deploy-token.js --network igraTestnet
```

## Quick start (Foundry)

```bash
cd script
forge build
forge script Deploy.s.sol \
  --rpc-url https://galleon-testnet.igralabs.com:8545 \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  --with-gas-price 2200000000000
```

## Networks

| Network | Chain ID | RPC | Explorer |
|---|---|---|---|
| Mainnet | 38833 | `https://rpc.igralabs.com:8545` | https://explorer.igralabs.com |
| Galleon Testnet | 38836 | `https://galleon-testnet.igralabs.com:8545` | https://explorer.galleon-testnet.igralabs.com |

Native currency: **iKAS** (18 decimals). Get testnet iKAS from https://faucet.igralabs.com.

## The five rules you can't violate

1. **Always set explicit `gasPrice`** — 1100 Gwei mainnet / 2200 Gwei testnet minimum.
2. **No EIP-1559** — `maxFeePerGas` / `maxPriorityFeePerGas` will fail or strand your tx.
3. **Strict FIFO ordering** — speed-ups and gas auctions don't work.
4. **Wait for confirmations** appropriate to value (see [GAS_GUIDE](docs/GAS_GUIDE.md)).
5. **Tx size cap ~21 KB** — large constructor args or call data will be rejected.

## License

MIT — see [`LICENSE`](LICENSE).

## Sources

- Official docs: https://igra-labs.gitbook.io/igralabs-docs/
- Gitbook MCP: https://igra-labs.gitbook.io/~gitbook/mcp
