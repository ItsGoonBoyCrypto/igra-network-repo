// 14 ethers.js v6 integration patterns for Igra Network.
// Each pattern is a self-contained async function. Run with:
//   node integration-examples.js <pattern_number>
// Or import and use individually.
//
// All write operations include the EXPLICIT legacy gasPrice required by Igra.

require('dotenv').config();
const { ethers } = require('ethers');

// ─── Network ────────────────────────────────────────────────────────────────
const NET = {
  mainnet: {
    rpc: 'https://rpc.igralabs.com:8545',
    chainId: 38833,
    gasPrice: ethers.parseUnits('1100', 'gwei'),
    explorer: 'https://explorer.igralabs.com',
  },
  testnet: {
    rpc: 'https://galleon-testnet.igralabs.com:8545',
    chainId: 38836,
    gasPrice: ethers.parseUnits('2200', 'gwei'),
    explorer: 'https://explorer.galleon-testnet.igralabs.com',
  },
}.testnet; // change to .mainnet for prod

const provider = new ethers.JsonRpcProvider(NET.rpc);
const wallet = process.env.PRIVATE_KEY ? new ethers.Wallet(process.env.PRIVATE_KEY, provider) : null;

// 1. Connect & verify chain
async function example1_connect() {
  const net = await provider.getNetwork();
  console.log('Connected to chainId', net.chainId.toString());
  if (Number(net.chainId) !== NET.chainId) throw new Error('Wrong network!');
}

// 2. Read native balance
async function example2_balance(addr) {
  const wei = await provider.getBalance(addr);
  console.log(`${addr}: ${ethers.formatEther(wei)} iKAS`);
}

// 3. Send native iKAS (correct gas)
async function example3_sendNative(to, amountIkas) {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountIkas),
    gasPrice: NET.gasPrice, // CRITICAL
  });
  console.log('Submitted:', tx.hash);
  const receipt = await tx.wait(30); // 30 confirmations ≈ DeFi-grade
  console.log('Confirmed in block', receipt.blockNumber);
}

// 4. Read an ERC-20 balance
async function example4_erc20Balance(tokenAddr, holder) {
  const abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)', 'function symbol() view returns (string)'];
  const t = new ethers.Contract(tokenAddr, abi, provider);
  const [bal, dec, sym] = await Promise.all([t.balanceOf(holder), t.decimals(), t.symbol()]);
  console.log(`${holder}: ${ethers.formatUnits(bal, dec)} ${sym}`);
}

// 5. Approve + transferFrom (two-tx flow)
async function example5_erc20Transfer(tokenAddr, recipient, amountWhole) {
  const abi = ['function decimals() view returns (uint8)', 'function transfer(address,uint256) returns (bool)'];
  const t = new ethers.Contract(tokenAddr, abi, wallet);
  const dec = await t.decimals();
  const tx = await t.transfer(recipient, ethers.parseUnits(amountWhole, dec), { gasPrice: NET.gasPrice });
  await tx.wait(30);
  console.log('Transferred. Tx:', tx.hash);
}

// 6. Listen for ERC-20 Transfer events
async function example6_listenTransfers(tokenAddr) {
  const abi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
  const t = new ethers.Contract(tokenAddr, abi, provider);
  console.log('Listening for transfers on', tokenAddr);
  t.on('Transfer', (from, to, value, ev) => {
    console.log(`block ${ev.log.blockNumber}: ${from} → ${to}: ${value.toString()}`);
  });
}

// 7. Query historical events
async function example7_queryEvents(tokenAddr, fromBlock = -10000) {
  const abi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
  const t = new ethers.Contract(tokenAddr, abi, provider);
  const latest = await provider.getBlockNumber();
  const events = await t.queryFilter('Transfer', latest + fromBlock, latest);
  console.log(`Found ${events.length} Transfer events in last ${-fromBlock} blocks`);
  return events;
}

// 8. Wait for a tx to reach 'finalized' (exchange-grade)
async function example8_waitFinalized(txHash) {
  await provider.waitForTransaction(txHash, 500);
  const fin = await provider.getBlock('finalized');
  console.log(`Finalized at block ${fin.number}`);
}

// 9. Batch reads with Promise.all (use a multicall library for >5 calls)
async function example9_batchReads(tokenAddr, holders) {
  const abi = ['function balanceOf(address) view returns (uint256)'];
  const t = new ethers.Contract(tokenAddr, abi, provider);
  const balances = await Promise.all(holders.map((h) => t.balanceOf(h)));
  holders.forEach((h, i) => console.log(`${h}: ${balances[i]}`));
}

// 10. Estimate gas (then add buffer)
async function example10_estimate(to, data) {
  const gas = await provider.estimateGas({ from: wallet.address, to, data });
  const buffered = (gas * 12n) / 10n; // +20%
  console.log(`Estimated ${gas}, sending with ${buffered}`);
  return buffered;
}

// 11. Manual nonce control (for parallel sends)
async function example11_manualNonce(to) {
  let nonce = await provider.getTransactionCount(wallet.address, 'pending');
  const txs = [];
  for (let i = 0; i < 3; i++) {
    txs.push(wallet.sendTransaction({
      to, value: 1n, nonce: nonce + i, gasPrice: NET.gasPrice, gasLimit: 21000,
    }));
  }
  const results = await Promise.all(txs);
  console.log('Sent:', results.map((r) => r.hash));
}

// 12. Subscribe to new blocks
async function example12_blockSub() {
  provider.on('block', (n) => console.log('New block:', n));
}

// 13. Encode/decode raw call data
async function example13_encode() {
  const iface = new ethers.Interface(['function transfer(address,uint256)']);
  const data = iface.encodeFunctionData('transfer', ['0x0000000000000000000000000000000000000001', 1000n]);
  console.log('Encoded:', data);
  const decoded = iface.decodeFunctionData('transfer', data);
  console.log('Decoded:', decoded);
}

// 14. Sign & verify message (off-chain signature)
async function example14_sign() {
  const msg = 'Hello Igra';
  const sig = await wallet.signMessage(msg);
  const recovered = ethers.verifyMessage(msg, sig);
  console.log('Signed by:', recovered, recovered === wallet.address ? '✅' : '❌');
}

// ─── CLI dispatch ───────────────────────────────────────────────────────────
const examples = [
  example1_connect, example2_balance, example3_sendNative, example4_erc20Balance,
  example5_erc20Transfer, example6_listenTransfers, example7_queryEvents,
  example8_waitFinalized, example9_batchReads, example10_estimate,
  example11_manualNonce, example12_blockSub, example13_encode, example14_sign,
];

if (require.main === module) {
  const n = parseInt(process.argv[2], 10);
  if (!n || !examples[n - 1]) {
    console.log('Usage: node integration-examples.js <1-14>');
    console.log('Examples:');
    examples.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}`));
    process.exit(1);
  }
  examples[n - 1](...process.argv.slice(3)).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { examples, NET, provider, wallet };
