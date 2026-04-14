# Bridge — KAS ↔ iKAS

Igra's bridge moves value between Kaspa L1 (KAS) and Igra L2 (iKAS, 1:1 backed).

## Mainnet entry address (KAS → iKAS)

```
kaspa:ppvnxxzm0rr37zpnwux2f2ntvfpr4uqdpm7zsvsztg3en92r7gs0wkmr72q9n
```

Send KAS to this address from any Kaspa wallet (Kasware, KSPR, etc.). The bridge picks it up, mints iKAS at your **L2 address derived from your KAS sender**, and credits it after L2 confirmation.

> ⚠️ Always verify the address against the official docs before sending. Phishing addresses targeting bridge users do appear.

## Limits

| Limit | Value |
|---|---|
| Minimum deposit | **100 KAS** |
| Recommended max (early stage) | **300 KAS** |

Sending below 100 KAS will not be processed and may be unrecoverable. The early-stage cap exists to limit blast radius until the bridge has accumulated more operating history — check official docs for the current limit.

## Address derivation

Your L2 (iKAS) address is **deterministically derived** from your KAS sending address using a documented mapping. Check the official docs / Gitbook for the exact derivation — don't guess.

## Withdrawing (iKAS → KAS)

Withdrawals are initiated on L2 by interacting with the bridge contract on Igra. The withdrawal:
1. Burns iKAS on L2
2. Waits for finality (formal — 12 h, or attested finality if your bridge UI exposes it)
3. Releases KAS on L1 to your designated Kaspa address

Use the official bridge UI for withdrawals — building a custom withdrawal flow requires understanding the attestation system and is not recommended.

## Testnet

For Galleon testnet iKAS:
- **Faucet**: https://faucet.igralabs.com (drip testnet iKAS to your L2 address)
- **KatBridge**: third-party bridge for testnet KAS ↔ iKAS

## Confirmation guidance

| Action | Wait for |
|---|---|
| Small dev test | 30 confirmations |
| Significant deposit | 250 confirmations |
| Treating as final / accounting | 500 confirmations OR `finalized` block tag |
| Compliance / formal | 12 hours from inclusion |

```js
const receipt = await provider.waitForTransaction(depositTxHashOnL2, 500);
```

Or query at the safest tag:
```js
const block = await provider.getBlock('finalized');
```

## Common bridge issues

| Problem | Cause | Resolution |
|---|---|---|
| Deposit < 100 KAS sent | Below minimum | Funds may be unrecoverable — contact support |
| iKAS not received after 30 min | L1 reorg or pending L2 finality | Wait, then check explorer |
| Sent to wrong address | Phishing or typo | No reversal possible — verify address every time |
| Withdrawal pending > 12 h | Awaiting formal finality | Wait — this is normal for high-value |

## Sources

- Official bridge docs: https://igra-labs.gitbook.io/igralabs-docs/
- Always confirm addresses & limits there before sending mainnet funds.
