# Gas Guide — Read This First

Igra's fee model is **not** Ethereum's. Get this wrong and your tx never confirms (or worse — gets stranded).

## The rule

> Always set **explicit legacy `gasPrice`**. Never use `maxFeePerGas` / `maxPriorityFeePerGas`.

| Network | Protocol minimum | Recommended (safety margin) |
|---|---|---|
| Mainnet (38833) | 1000 Gwei | **1100 Gwei** |
| Galleon Testnet (38836) | ~2000 Gwei | **2200 Gwei** |

Base fee is technically 1 wei but the protocol won't include a tx below the minimum above.

## Why RPC `eth_gasPrice` is dangerous

`eth_gasPrice` and `eth_feeHistory` return values reflecting the 1 wei base fee, not the actual inclusion floor. Letting your library auto-fill these will produce a tx that's instantly under-priced and never gets included.

## Correct examples

### ethers.js v6
```js
const tx = await wallet.sendTransaction({
  to: recipient,
  value: ethers.parseEther('1'),
  gasPrice: ethers.parseUnits('1100', 'gwei'), // mainnet
});
```

### viem
```ts
import { parseGwei } from 'viem';

await walletClient.sendTransaction({
  to,
  value: parseEther('1'),
  gasPrice: parseGwei('1100'),  // legacy field; do NOT pass maxFeePerGas
});
```

### Hardhat (network config)
See [HARDHAT_SETUP.md](HARDHAT_SETUP.md). The `gasPrice` field on the network entry is sufficient.

### Foundry / `cast`
Always pass `--legacy --with-gas-price 1100000000000` (mainnet) or `2200000000000` (testnet).

```bash
cast send 0x... "transfer(address,uint256)" 0xabc... 1 \
  --rpc-url $RPC \
  --private-key $PK \
  --legacy \
  --with-gas-price 2200000000000
```

## FIFO ordering

Igra orders transactions strictly first-in-first-out. There is **no** fee-bidding, **no** MEV from gas auctions, **no** speed-up. Sending a higher-priced tx at the same nonce does not replace a pending one.

If you have a pending tx that's actually under-priced (e.g. you forgot the rule), the only fix is to wait it out or cancel by sending a **same-nonce, zero-value self-transfer at the same `gasPrice`** — which only works because of nonce, not fee.

## Finality

| Use case | Confirmations | Approx. time |
|---|---|---|
| Low-value transfers | 10 | ~10 seconds |
| DEX swaps / DeFi | 30 | ~30 seconds |
| High-value transfers | 250 | ~4 minutes |
| Exchange deposits | 500 or `finalized` tag | ~8 minutes |
| Formal compliance | — | 12 hours |

Use `provider.waitForTransaction(hash, confirmations)` in ethers, or query at the `finalized` block tag for exchange-grade safety.

```js
const receipt = await provider.waitForTransaction(tx.hash, 30); // DeFi swap
```

## Reorgs

Reorged transactions are **discarded**, not requeued. Your client must re-send. For high-value flows, never act on a tx until it has the confirmation count above.
