# Networks

## Igra Mainnet

| Field | Value |
|---|---|
| Network name | Igra Mainnet |
| Chain ID | **38833** (`0x97B1`) |
| Native currency | iKAS (18 decimals) |
| RPC URL | `https://rpc.igralabs.com:8545` |
| Explorer | https://explorer.igralabs.com |
| Status | Active |

## Galleon Testnet

| Field | Value |
|---|---|
| Network name | Igra Galleon Testnet |
| Chain ID | **38836** (`0x97B4`) |
| Native currency | iKAS (18 decimals) |
| RPC URL | `https://galleon-testnet.igralabs.com:8545` |
| Explorer | https://explorer.galleon-testnet.igralabs.com |
| Faucet | https://faucet.igralabs.com |
| Status | Active |

> Older sunset networks are deprecated. Use Mainnet or Galleon only.

## Add to MetaMask

Settings → Networks → Add network → Add manually. Use the values above. iKAS is the native asset, no token contract needed.

## Add via `wallet_addEthereumChain`

```js
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x97B4', // 38836 testnet — use 0x97B1 for mainnet
    chainName: 'Igra Galleon Testnet',
    nativeCurrency: { name: 'iKAS', symbol: 'iKAS', decimals: 18 },
    rpcUrls: ['https://galleon-testnet.igralabs.com:8545'],
    blockExplorerUrls: ['https://explorer.galleon-testnet.igralabs.com'],
  }],
});
```

## Block parameters

| Param | Value |
|---|---|
| Block time | ~1 second |
| Practical finality | ~30 seconds |
| Formal finality | 12 hours |
| Block gas limit | 10,000,000,000 |
| Base fee | 1 wei |
| Min gas price (mainnet) | 1000 Gwei |
| Min gas price (testnet) | ~2000 Gwei |
| Max tx size | ~21 KB |

See [GAS_GUIDE.md](GAS_GUIDE.md) for the full pricing rules.
