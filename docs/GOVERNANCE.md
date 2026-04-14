# Governance

Igra is fully decentralized at launch — no admin keys, no kill switch, no upgrade backdoor. Protocol parameters that *can* change are gated by an on-chain DAO using $IGRA voting power.

## Contracts

| Role | Mainnet address |
|---|---|
| Governance | `0xB3300fcC2F3EF3DeCdF8B1f710c21666f33Cbf18` |
| IGRA Voting Power | `0x50BAc71D1B32Fa6030007b5E72dbBB4fF48c1B39` |
| IGRA Token | `0x093d77d397F8acCbaee0820345E9E700B1233cD1` |
| Vesting Pools | `0xc9c88C5b4a0E5ae4C0812F3bc04A5FeA9ffC580b` |
| Stake Rewards Controller | `0xF4BF5afdCC70eD80737778625Ddb1c0Ce89EC42c` |

## What the DAO controls

Only the **upgradable parameter set** — things like:
- Attestation system thresholds & slashing parameters
- Fee distribution ratios
- Minimum gas price (within hard-coded protocol bounds)
- Bridge limits
- Stake reward emission curve

The DAO **cannot**:
- Stop the chain
- Confiscate funds
- Change the EVM
- Override the based-rollup ordering
- Modify the bridge contract logic itself

These are immutable.

## Voting power

`$IGRA` voting power = staked $IGRA + vesting $IGRA (both contribute, with weights set by the Voting Power contract). Tokens that are liquid but unstaked do **not** vote.

Read your voting power:
```js
const vp = new ethers.Contract(
  '0x50BAc71D1B32Fa6030007b5E72dbBB4fF48c1B39',
  ['function votingPower(address) view returns (uint256)'],
  provider,
);
const power = await vp.votingPower(walletAddress);
```

## Proposal lifecycle

1. **Submit** — anyone with sufficient voting power posts a proposal to the Governance contract
2. **Voting period** — token holders cast `for` / `against` / `abstain`
3. **Quorum check** — must meet minimum participation
4. **Execution delay** — passed proposals enter timelock
5. **Execute** — anyone can trigger execution after timelock

Vote with:
```js
const gov = new ethers.Contract(
  '0xB3300fcC2F3EF3DeCdF8B1f710c21666f33Cbf18',
  ['function castVote(uint256 proposalId, uint8 support)'],
  wallet,
);
await gov.castVote(proposalId, 1, { gasPrice: ethers.parseUnits('1100', 'gwei') });
```

`support` values: `0` = against, `1` = for, `2` = abstain.

## Staking & rewards

Staked $IGRA earns:
- A share of protocol fees (via `Fee Proxy` → `Stake Rewards Controller`)
- Voting power
- Eligibility to run an attester (separate stake to the Staking contract: `0xBc8fD7c21a0A3CbbE7e57366D648C62DFAe32c4B`)

Slashing applies to **attester stake** if a fraud proof succeeds — regular voting/staking is not at risk from governance behavior, only from attester misbehavior.

## See also
- [ARCHITECTURE.md](ARCHITECTURE.md) — Why the attestation system exists
- [CONTRACTS.md](CONTRACTS.md) — All protocol addresses
