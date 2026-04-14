# EVM Compatibility

Igra is **fully EVM-equivalent** at the Prague/Pectra fork level from genesis. If your contract compiles for Ethereum mainnet, it compiles and runs identically on Igra.

## What works without modification

- Solidity ≥ 0.8.24
- Hardhat, Foundry, Truffle
- ethers.js (v5 & v6), viem, web3.js
- MetaMask, WalletConnect, Rabby, Frame
- OpenZeppelin Contracts
- Standard precompiles (`ecrecover`, `sha256`, `ripemd160`, `identity`, `modexp`, `ecadd`, `ecmul`, `ecpairing`, `blake2f`)
- All EVM opcodes (including `PUSH0`, `MCOPY`, transient storage `TLOAD`/`TSTORE`)
- EIP-4844 blob transaction *type* (data availability is provided by Kaspa L1 itself)

## What's different

| Topic | Ethereum behavior | Igra behavior |
|---|---|---|
| Fee market | EIP-1559 (`maxFeePerGas`, `maxPriorityFeePerGas`) | Legacy `gasPrice` only — see [GAS_GUIDE](GAS_GUIDE.md) |
| Mempool ordering | Priority fee auction | Strict FIFO |
| Replacement tx | Higher fee replaces | Not supported |
| Block time | ~12 s | ~1 s |
| Finality | ~6.4 min (2 epochs) | ~30 s practical / 12 h formal |
| Native asset | ETH | iKAS |

## Gotchas when porting Ethereum projects

1. **Hardhat `gasPrice: "auto"`** → set explicit value (see [HARDHAT_SETUP.md](HARDHAT_SETUP.md)).
2. **Test fixtures using `hardhat_setNextBlockBaseFeePerGas`** → no-op on Igra.
3. **viem `prepareTransactionRequest`** → pass `type: 'legacy'` and your own `gasPrice`.
4. **OpenZeppelin Defender / tenderly relayers** → confirm legacy tx support is enabled.
5. **MEV/flashbots-style bundlers** → don't apply, no priority auction.

## What's NOT different (don't over-engineer)

- `block.basefee` returns 1 wei — fine, but useless for fee calculation.
- `block.chainid` returns 38833 / 38836 — use this for chain checks.
- `tx.gasprice` returns the legacy gas price you set.
- Address checksumming, RLP, signature schemes — all standard.

## Verification

Use Blockscout (no API key). See [VERIFICATION.md](VERIFICATION.md).
