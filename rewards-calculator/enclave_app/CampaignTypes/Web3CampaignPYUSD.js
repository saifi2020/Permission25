import { ethers } from "ethers";

const RPC_URL   = "https://eth-mainnet.g.alchemy.com/v2/fbbULX-Bu6w8eBTgG2TCTwd6J21s-kKy";
const TOKEN     = "0x6c3ea9036406852006290770bedfcaba0e23a0e8"; // PYUSD
const END_BLOCK = 22_768_522;
const LOOKBACK  = 1_000;
const BATCH     = 500;
const A_PENNY   = 10n ** 4n;   // 0.01 PYUSD (6-decimals)

async function listenEvents() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const abi      = ["event Transfer(address indexed from,address indexed to,uint256 value)"];
  const contract = new ethers.Contract(TOKEN, abi, provider);
  const iface    = contract.interface;

  const rewards = {};

  for (let from = END_BLOCK - LOOKBACK; from <= END_BLOCK; from += BATCH) {
    const to = Math.min(from + BATCH - 1, END_BLOCK);

    const logs = await provider.getLogs({
      address: TOKEN,
      topics:  [iface.getEvent("Transfer").topicHash],
      fromBlock: from,
      toBlock:   to,
    });

    for (const log of logs) {
      const { args: [sender, recipient, value] } = iface.parseLog(log);
      if (value >= A_PENNY) {
        rewards[sender]    = (rewards[sender]    ?? 0n) + 10n;
        rewards[recipient] = (rewards[recipient] ?? 0n) + 20n;
      }
    }
  }
  return rewards;
}

export const rewards_mapping = await listenEvents();
