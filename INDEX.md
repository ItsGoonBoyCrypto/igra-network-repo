# Repository Index

## Root
- [README.md](README.md) — Overview, quick start, the five rules
- [FAQ.md](FAQ.md) — Common questions and gotchas
- [INDEX.md](INDEX.md) — This file
- [LICENSE](LICENSE) — MIT
- [.gitignore](.gitignore)

## Documentation (`docs/`)

### Setup
- [HARDHAT_SETUP.md](docs/HARDHAT_SETUP.md) — Hardhat config, network setup, common scripts
- [FOUNDRY_SETUP.md](docs/FOUNDRY_SETUP.md) — `foundry.toml`, `forge` flags for Igra
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — End-to-end deployment walkthrough
- [VERIFICATION.md](docs/VERIFICATION.md) — Blockscout verification (no API key)

### Core reference
- [NETWORKS.md](docs/NETWORKS.md) — Mainnet & Testnet config, faucets, MetaMask
- [GAS_GUIDE.md](docs/GAS_GUIDE.md) — **READ FIRST** — gas pricing, finality
- [EVM_COMPAT.md](docs/EVM_COMPAT.md) — What works, what differs vs Ethereum
- [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) — RPC, addresses, gas, one-liners

### Advanced
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Based rollup design, attestation system
- [GOVERNANCE.md](docs/GOVERNANCE.md) — DAO, $IGRA voting power
- [CONTRACTS.md](docs/CONTRACTS.md) — Mainnet protocol contract addresses
- [BRIDGE.md](docs/BRIDGE.md) — KAS ↔ iKAS bridging

## Examples (`examples/`)

### Contracts
- [SimpleToken.sol](examples/SimpleToken.sol) — ERC-20 (OpenZeppelin)
- [Counter.sol](examples/Counter.sol) — Minimal counter
- [SimpleNFT.sol](examples/SimpleNFT.sol) — ERC-721 (OpenZeppelin)

### Hardhat tooling
- [hardhat.config.js](examples/hardhat.config.js)
- [package.json](examples/package.json)
- [.env.example](examples/.env.example)

### Deployment scripts
- [deploy-token.js](examples/deploy-token.js)
- [deploy-counter.js](examples/deploy-counter.js)
- [deploy-nft.js](examples/deploy-nft.js)

### Integration patterns
- [integration-examples.js](examples/integration-examples.js) — 14 ethers.js patterns: send tx, read events, batch reads, wait for finality, etc.

## Foundry (`script/`)
- [Deploy.s.sol](script/Deploy.s.sol) — Foundry deploy script for all 3 contracts
- [foundry.toml](script/foundry.toml)
