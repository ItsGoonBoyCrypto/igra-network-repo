# Hardhat Setup

A working Hardhat config for Igra Mainnet and Galleon Testnet.

## Install

```bash
cd examples
npm install
```

`package.json` already pins:
- `hardhat` (latest 2.x)
- `@nomicfoundation/hardhat-toolbox`
- `@openzeppelin/contracts`
- `dotenv`

## `.env`

Copy `.env.example` to `.env`:
```
PRIVATE_KEY=0xyourprivatekey
```

Never commit `.env` (it's in `.gitignore`).

## `hardhat.config.js`

The shipped config (`examples/hardhat.config.js`) sets:
- Solidity 0.8.24
- Both `igraMainnet` and `igraTestnet` networks
- **Explicit `gasPrice`** per network (not `auto`)
- Blockscout-compatible `etherscan` (custom chains) for verification

```js
networks: {
  igraMainnet: {
    url: 'https://rpc.igralabs.com:8545',
    chainId: 38833,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: 1100_000_000_000, // 1100 Gwei
  },
  igraTestnet: {
    url: 'https://galleon-testnet.igralabs.com:8545',
    chainId: 38836,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: 2200_000_000_000, // 2200 Gwei
  },
},
```

> ⚠️ Do **not** set `gasPrice: 'auto'`. Hardhat will call `eth_gasPrice` and get an under-priced floor. Hard-code the value above.

## Common commands

```bash
npx hardhat compile
npx hardhat test
npx hardhat run deploy-token.js --network igraTestnet
npx hardhat run deploy-counter.js --network igraTestnet
npx hardhat run deploy-nft.js --network igraTestnet

# Verify
npx hardhat verify --network igraTestnet 0xCONTRACT "MyToken" "MTK" 1000000
```

## Sending arbitrary tx via Hardhat console

```bash
npx hardhat console --network igraTestnet
> const [signer] = await ethers.getSigners();
> await signer.sendTransaction({ to: '0x...', value: ethers.parseEther('0.1'), gasPrice: ethers.parseUnits('2200', 'gwei') });
```

The network-level `gasPrice` is the default for transactions sent via Hardhat. When constructing tx objects manually, still pass `gasPrice` for safety.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Tx hangs forever | Auto gas | Set explicit `gasPrice` (above) |
| `transaction underpriced` | Below 1000/2000 Gwei | Raise to 1100/2200 Gwei |
| `replacement fee too low` | Tried to RBF | Not supported — wait for tx |
| `nonce too low` | Stale nonce in cache | Restart provider / use `tx.nonce` explicitly |
| Verification fails | Wrong constructor args | Pass exact args used at deploy |
