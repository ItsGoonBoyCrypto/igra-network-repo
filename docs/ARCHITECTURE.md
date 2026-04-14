# Architecture

Igra is a **based rollup** on the Kaspa BlockDAG. This document covers the high-level design, what makes it different, and what that means for builders.

## Stack

```
┌────────────────────────────────────┐
│   Apps & Smart Contracts (EVM)     │  ← your code
├────────────────────────────────────┤
│   Igra L2 (EVM, Prague/Pectra)     │  ~1 s blocks
├────────────────────────────────────┤
│   Attestation System (staked)      │  light-client security
├────────────────────────────────────┤
│   Kaspa L1 BlockDAG (consensus,    │  Selected Parent Chain
│   data availability, ordering)     │
└────────────────────────────────────┘
```

## Based rollup, not centralized

A "based rollup" derives its block ordering directly from the L1 — there is **no separate sequencer**, no admin, no kill switch, no upgrade key beyond the DAO. This has practical consequences:

- **Censorship resistance**: any Kaspa miner can include your tx — no single party can blacklist you
- **Liveness inherits L1**: as long as Kaspa is live, Igra is live
- **MEV is L1-style**: ordering is determined by the BlockDAG selection rules, not a sequencer's profit motive
- **No fast withdrawals via sequencer escrow**: withdrawals follow the bridge's own confirmation rules

## Block derivation

L2 blocks are derived deterministically from Kaspa's **Selected Parent Chain (SPC)** — the linearized ordering of blocks that Kaspa's GHOSTDAG protocol picks out of the BlockDAG. Igra nodes process L1 blocks in SPC order, extract Igra transactions embedded in them, and apply them to L2 state.

This means:
- **No reorgs at L2 unless the SPC reorgs at L1** — and the SPC is deeply finalized very quickly
- Block time tracks Kaspa's (~1 second)
- Practical finality of ~30 s = enough SPC depth to reorg-resist common cases

## Attestation system

To support light clients (wallets, bridges, third-party indexers) without forcing them to re-execute all of L2, Igra runs a **staked attestation system**:

| Role | Address (mainnet) | Function |
|---|---|---|
| Config Init | `0x87f01B5fe0BA991EEA5b78904E920Fd8290925b8` | Bootstrap params |
| Config Facet | `0x852423E5222ABBB88173452bBd83446fa526346e` | Param updates (DAO-gated) |
| Staking | `0xBc8fD7c21a0A3CbbE7e57366D648C62DFAe32c4B` | Attesters stake $IGRA |
| Attester | `0xe01A13ab23AaeCE1c80419595E1cF1cFC8DF662C` | Submit state attestations |
| Challenger | `0x051214558d2c3c5cA49162E4B6C93638713A6040` | Slash on fraud |
| L2 Oracle | `0x7c8edd6eB8959cCcDA63D7A3e956Bb9C00BaD67c` | Provides finalized roots |

Stakers attest to L2 state roots; challengers can dispute and slash. The attestation feed is what cross-chain bridges and exchanges should consume rather than re-running the L2 themselves.

## Finality model

| Layer | Latency | Reorg tolerance |
|---|---|---|
| L2 block included | ~1 s | could reorg with L1 SPC |
| Practical finality | ~30 s | very rare reorg past this |
| Attested finality | minutes | covered by attester slashing |
| Formal finality | 12 h | matches Kaspa formal finality |

For exchange deposits / bridge ops: query the `finalized` block tag, or wait ≥500 confirmations.

## Data availability

Transaction data is posted to Kaspa L1 itself — Kaspa's BlockDAG is the DA layer. There's no separate DA committee, no Celestia/EigenDA dependency.

## Fees & gas

- Base fee: 1 wei (effectively no EIP-1559)
- Inclusion floor: enforced at protocol level (1000 Gwei mainnet / 2000 Gwei testnet)
- Fee Proxy: `0x0000000000000000000000000000000000000FEE`
- Fees flow into the protocol fee pool, distributed per DAO rules

## Why FIFO instead of priority auction?

Based rollups can't run a private sequencer auction by design. Igra leans into this with strict FIFO: every observer sees the same ordering, no MEV from priority gas, and tooling becomes deterministic (your tx position is set the moment it's in a Kaspa block).

## See also
- [GOVERNANCE.md](GOVERNANCE.md) — DAO & voting power
- [BRIDGE.md](BRIDGE.md) — KAS ↔ iKAS
- [CONTRACTS.md](CONTRACTS.md) — Full mainnet protocol address list
