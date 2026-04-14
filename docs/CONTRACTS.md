# Mainnet Contract Addresses (Chain ID 38833)

All addresses are checksummed. Always confirm against the explorer before sending real funds.

## Core Protocol

| Contract | Address |
|---|---|
| Diamond Proxy | `0xc24Df70E408739aeF6bF594fd41db4632dF49188` |
| IGRA Token (ERC-20) | `0x093d77d397F8acCbaee0820345E9E700B1233cD1` |
| Vesting Pools | `0xc9c88C5b4a0E5ae4C0812F3bc04A5FeA9ffC580b` |
| Stake Rewards Controller | `0xF4BF5afdCC70eD80737778625Ddb1c0Ce89EC42c` |
| Fee Proxy | `0x0000000000000000000000000000000000000FEE` |
| Fee Implementation | `0x3b34f39f49aF761615Aa569713f96c04112969d2` |

## Attestation System

| Contract | Address |
|---|---|
| Config Init | `0x87f01B5fe0BA991EEA5b78904E920Fd8290925b8` |
| Config Facet | `0x852423E5222ABBB88173452bBd83446fa526346e` |
| Staking | `0xBc8fD7c21a0A3CbbE7e57366D648C62DFAe32c4B` |
| Attester | `0xe01A13ab23AaeCE1c80419595E1cF1cFC8DF662C` |
| Challenger | `0x051214558d2c3c5cA49162E4B6C93638713A6040` |
| L2 Oracle | `0x7c8edd6eB8959cCcDA63D7A3e956Bb9C00BaD67c` |

## Governance

| Contract | Address |
|---|---|
| Governance | `0xB3300fcC2F3EF3DeCdF8B1f710c21666f33Cbf18` |
| IGRA Voting Power | `0x50BAc71D1B32Fa6030007b5E72dbBB4fF48c1B39` |

## Oracles

| Contract | Address |
|---|---|
| Quex Oracle Core (price feeds) | `0xC3546441897D9c87B3808c9402Bcb0655F238541` |

Supported price pairs are fixed at the protocol level — query the Quex Core for the live registry.

## ABIs

ABIs are not bundled here to avoid drift. Pull them at runtime from the explorer:
```
https://explorer.igralabs.com/api?module=contract&action=getabi&address=0xc24Df70E408739aeF6bF594fd41db4632dF49188
```

Or import directly:
```js
const res  = await fetch(`https://explorer.igralabs.com/api?module=contract&action=getabi&address=${addr}`);
const json = await res.json();
const abi  = JSON.parse(json.result);
const contract = new ethers.Contract(addr, abi, provider);
```

## Galleon Testnet

Testnet protocol addresses differ from mainnet. Use the testnet explorer to look them up:
```
https://explorer.galleon-testnet.igralabs.com
```
Don't hard-code testnet addresses — they're subject to change between deployments.
