import { ethers } from "ethers";

export function toPaddedBytes32(addr) {
  const bytes = ethers.getBytes(addr);
  const padded = new Uint8Array(32);
  padded.set(bytes, 12); // pad with 12 zeros on the left
  return padded;
}

export function getRandomBigInt(
  max = 1234567890123456789012345678901234567890n
) {
  if (max < 1n) throw new Error("Maximum must be at least 1");

  // Calculate how many bits are needed
  const bits = max.toString(2).length;

  let rand;
  do {
    // Generate random bits
    const bytes = Math.ceil(bits / 8);
    let randomBytes = new Uint8Array(bytes);
    crypto.getRandomValues(randomBytes);

    // Convert randomBytes to BigInt
    rand = 0n;
    for (let i = 0; i < bytes; i++) {
      rand = (rand << 8n) + BigInt(randomBytes[i]);
    }
  } while (rand < 1n || rand > max); // Keep trying until in range

  return rand;
}