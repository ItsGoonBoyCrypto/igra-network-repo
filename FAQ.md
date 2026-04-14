# FAQ

### My transaction is stuck / never confirms.
Almost always a gas issue. RPC's `eth_gasPrice` returns dangerously low values. Set `gasPrice` explicitly to **1100 Gwei (mainnet)** or **2200 Gwei (testnet)**. EIP-1559 fields (`maxFeePerGas`, `maxPriorityFeePerGas`) are ignored — use legacy transactions.

### Can I speed up a pending transaction with a higher gas price?
**No.** Igra is strict FIFO. Replacement-by-fee and gas auctions don't exist here. If a tx is genuinely stuck due to nonce gap, you can replace by sending a new tx at the same nonce with the same `gasPrice` — but you cannot outbid.

### Why did my transaction get reorged / dropped?
Reorged transactions are **discarded**, not requeued. For high-value actions wait for the [confirmation count](docs/GAS_GUIDE.md#finality) appropriate to the value (≥250 for high-value, ≥500 or `finalized` tag for exchange deposits).

### What's the minimum bridge amount from KAS?
**100 KAS minimum**, recommended max 300 KAS in the early-stage period. Bridge entry: `kaspa:ppvnxxzm0rr37zpnwux2f2ntvfpr4uqdpm7zsvsztg3en92r7gs0wkmr72q9n`. See [BRIDGE.md](docs/BRIDGE.md).

### Does my Solidity / Hardhat / Foundry / ethers / viem code work as-is?
Yes — Igra is fully EVM-equivalent (Prague/Pectra from genesis). The only adjustment is the **legacy `gasPrice`** override. See [EVM_COMPAT.md](docs/EVM_COMPAT.md).

### How do I verify a contract?
Blockscout, no API key needed. Hardhat:
```bash
npx hardhat verify --network igraTestnet 0xCONTRACT "constructor" "args"
```
Or Foundry: `--verifier blockscout --verifier-url https://explorer.galleon-testnet.igralabs.com/api`. Full guide: [VERIFICATION.md](docs/VERIFICATION.md).

### Is there a sequencer / admin key / pause switch?
No. Igra is a based rollup — no sequencer, no admin keys, no kill switch. Only DAO-controlled upgradable parameters.

### Where do I get testnet iKAS?
https://faucet.igralabs.com

### What's the block time?
~1 second. Practical finality ~30 seconds. Formal finality 12 hours.

### What's the max tx size?
~21 KB. Watch large constructor args, big call data, and oversized contract bytecode.

### Why does `eth_feeHistory` return weird values?
Because Igra's base fee is 1 wei but the **protocol minimum** to be included is ~1000 Gwei. The fee market fields exist for tooling compatibility but you must override `gasPrice` manually.

### Can I use MetaMask?
Yes — add the network manually using values from [NETWORKS.md](docs/NETWORKS.md). When sending from the MetaMask UI it should auto-detect legacy gas; when sending programmatically via injected provider, set `gasPrice` explicitly.

### Where are the official docs?
- https://igra-labs.gitbook.io/igralabs-docs/
- Gitbook MCP: https://igra-labs.gitbook.io/~gitbook/mcp
