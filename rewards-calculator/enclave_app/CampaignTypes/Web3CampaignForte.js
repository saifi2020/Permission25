// Classical web3 rewards campagin criteria

// We can use Forte with KYC to prevent sybil attack as well as block any malicious addresses
// So why not encourage others to join the Forte KYC network and get rewarded for it?
// Whoever calls the Forte Rules Engine as it makes its debut on BSC testnet
// and causes any event to be emitted will be able to claim 100 points!

import { ethers } from "ethers";

const increment = 500;

async function listenEvents(
  rpc_url,
  contractAddress,
  startBlock
) {
  //Initializing reward mapping
  let rewardMapping = {};

  // Initializing the provider with the RPC URL
  const provider = new ethers.JsonRpcProvider(rpc_url, undefined, {batchMaxCount: 500});

  // Go all the way up to the present
  const endBlock = await provider.getBlockNumber();

  for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += increment) {
    const toBlock = Math.min(fromBlock + increment - 1, endBlock);
    console.log(`Querying from block ${fromBlock} to ${toBlock}...`);

    try {
      const logs = await provider.getLogs({
        address: contractAddress,
        fromBlock: fromBlock,
        toBlock: toBlock,
      });
      for (const log of logs) {
        const { transactionHash } = log;

        // Whoever calls the Forte Rules Engine and emits any event
        // will be rewarded with 100 points!
        const tx = await provider.getTransaction(transactionHash);
        const caller = tx.from.toLowerCase();
        if (!(caller in rewardMapping)) {
          rewardMapping[caller] = BigInt(100);
        }
      }
    } catch (err) {
      console.error(
        `Error fetching logs from block ${fromBlock} to ${toBlock}:`,
        err
      );
    }
  }

  return rewardMapping;
}

export const rewards_mapping = await listenEvents(
      "https://rpc.ankr.com/bsc_testnet_chapel/fe69fe605d8ef2fc6680f6c578f7b8e3b8932a9586ff87fe988874a66c7f49b9",
      "0xDf1e7dC43e4f56a21780bd2cb9d9eCA9912EAC96", // Forte Rules Engine on BSC Testnet
      55812600, // All the way back to the beginning of the engine's life!
    ).catch((error) => {
      console.error("Error listening to events:", error);
    });
