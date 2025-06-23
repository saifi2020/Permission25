import {
  toPaddedBytes32,
  getRandomBigInt,
} from "./utils.js";
import { ethers } from "ethers";
import { poseidon2 } from "poseidon-lite";
import { IMT } from "@zk-kit/imt";
import { TappdClient } from '@phala/dstack-sdk';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

/** Dstack Client **/
async function testPhala() {
  const client = new TappdClient();

  // Check if service is reachable (500ms timeout, never throws)
  const isReachable = await client.isReachable();
  if (!isReachable) {
    console.log('Tappd service is not available');
    return;
  }

  // Get the information of the Base Image.
  await client.info();

  // Derive a key with optional path and subject
  const keyResult = await client.deriveKey('<unique-id>');
  // console.log(keyResult.key); // X.509 private key in PEM format
  // console.log(keyResult.certificate_chain); // Certificate chain
  const keyBytes = keyResult.asUint8Array(); // Get key as Uint8Array

  // Generate TDX quote
  const quoteResult = await client.tdxQuote('some-data', 'sha256');
  // console.log(quoteResult.quote); // TDX quote in hex format
  // console.log(quoteResult.event_log); // Event log
  const rtmrs = quoteResult.replayRtmrs(); // Replay RTMRs
}
await testPhala();
/*******************/

// Initializing the server
const app = express();
app.use(cors());
app.use(express.json());

// Initializing the Merkle Tree
const hash = (a, b) => poseidon2([a, b]);
const tree = new IMT(poseidon2, 16, 0, 2);
let rewards = {};
let nullifiers = {};
let totalPoints = BigInt(0);

app.post("/get-merkle-proof", async (req, res) => {
  const address = ethers.verifyMessage(
    toPaddedBytes32(req.body.message),
    req.body.signature
  );
  if (address !== req.body.address) {
    return res.status(400).json({ error: "Invalid signature" });
  }
  if (!Object.keys(rewards).includes(address)) {
    return res.status(404).json({ error: "Address not found in rewards" });
  }
  const value = rewards[address];
  const nullifer = nullifiers[address];
  const proof = tree.createProof(tree.indexOf(hash(address, value + nullifer)));
  res.json({
    root: proof.root.toString(),
    index: proof.leafIndex.toString(),
    leaf: proof.leaf.toString(),
    siblings: proof.siblings.flat().map((bn) => bn.toString()),
    value: value.toString(),
    nullifer: nullifer.toString(),
  });
});

app.get("/get-attestation", async(req, res) => {

  const client = new TappdClient();

  // Check if service is reachable (500ms timeout, never throws)
  const isReachable = await client.isReachable();
  if (!isReachable) {
    console.log('Tappd service is not available');
    return;
  }

  // Collect and attest to campaign finalization data
  const root = tree.root.toString();
  const report_data = Buffer.from(JSON.stringify({
    root: root,
    totalPoints: totalPoints.toString(),
  }), 'utf8').toString('hex');
  const attestation = await client.tdxQuote(report_data, 'keccak256');

  // Return campaign finalization data with attestation
  res.json({ root, totalPoints: totalPoints.toString(), attestation });
})

app.listen(3000, async () => {

  // Get rewards mapping depending on the custom campaign criteria
  const rewards_mapping = await import(process.env.CAMPAIGN).then((module) => module.rewards_mapping);

  console.log("Rewards mapping:", rewards_mapping);

  // Adding data to the Merkle Tree
  for (const [key, value] of Object.entries(rewards_mapping)) {
    totalPoints += value;
    let random = getRandomBigInt();
    nullifiers[key] = random;
    tree.insert(hash(key, value + random));
  }
  console.log("Merkle tree finalized !!!");

  console.log("Server is running on port 3000");
});
