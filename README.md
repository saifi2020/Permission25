# _Dev Readme - Public Readme below_
## Smart Contracts
Our smart contracts implement the onchain logic for creating a campaign and claiming rewards.
This is found in [smart-contracts/](smart-contracts/)

To build and test the smart contract, we use Foundry within Docker.
`cd smart-contracts && ./build_and_test.sh`

To deploy a localnet, we use anvil within Docker.
`cd smart-contracts/deployment && ./deploy_localnet.sh`

## Dapp Frontend
We will build a web user interface for those who want to run a campaign and for those who want to participate to interact with our project.

This is found in [frontend-uiux/](frontend-uiux/).

## Claim Prover
The claim prover is used to allow participants to prove their involvement in the campaign and 

# _Public readme_
# Private Onchain Rewards 
This architecture defines a modular and secure framework to perform onchain distribution of rewards to users based on complex eligibility rules that may involve onchain behavior, offchain events, or a combination of both. The system ensures privacy, compliance, and scalability by leveraging a combination of Trusted Execution Environments (TEE), Zero-Knowledge Proofs (ZKPs), and smart contract composability.

## Goals for the Hackathon
1. Build a POC for one or two (if time permits) campaign, use TEE attestation and a client side zero knowledge proof to claim rewards by eligible users. Build a simple dAPP for just one campaign flow. 
2. Integrate with Forte for Compliance Rules check and deploy the application on Binance Chain
3. Use PYUSD as the final rewards token that every user will claim. Native token can be swapped for PYUSD so Users are able to utilize the rewards amounts to pay for real world services using Pay Pal payment checkout. 

# System Components
## 1. Secure Evaluation of Eligibility Criteria & Merkle Tree Generation
A TEE (e.g., Intel SGX, AWS Nitro) securely evaluates user eligibility based on:
Onchain data (blockchain activity)
Offchain data (external APIs, event participation, social identity, KYC status)

The TEE computes a Merkle tree of eligible user addresses and corresponding reward amounts.
The Merkle root is signed and posted onchain by the TEE enclave.
Input data and tree generation are attested using remote attestation.

## 2. Zero Knowledge Proof
Privacy-preserving Proof of Eligibility

Users obtain a Merkle proof of their eligibility offchain.
They generate a Zero Knowledge Proof (e.g., zkSNARK/zkSTARK) attesting:
Their inclusion in the Merkle tree
The validity of their claim (reward amount, address)
No leakage of identity or other users' data

The onchain verifier contract validates this ZK proof before releasing rewards.

The advantage of doing this is that there is no need to reveal entire Merkle paths or user-specific data to the public chain.

## 3. Factory Smart Contract System
The Facorty Smart Contract allows Campaign Deployment, Reward Holding, and Controlled Distribution of the rewards distribution
### 3.1 CampaignFactory:
Deploys new RewardCampaign instances, storing:
Merkle root
TEE signature
Metadata hash (IPFS pointer)
Forte compliance requirements (KYC/KYT)

### 3.2 RewardCampaign:
Campaign-specific contract that:

Verifies ZKPs of claims
Verifies inclusion in the Merkle tree
Interfaces with Forte's compliance service
Releases ERC-20 or native tokens to verified users

### 3.3 ZKVerifier:
Onchain verifier contract (e.g., Plonk or Groth16 verifier). We are using Groth16 proof created by the browser using Noir
Security Check: Merkle root commitment is signed and attested by the TEE enclave’s public key, validated by the contract.

## 4. Forte Rules Compliance Layer
Enforce Onchain Compliance via Forte's KYC/KYT APIs

Forte configuration defines:
KYC level (e.g., basic, enhanced)
KYT checks (sanctions screening, wallet risk scoring)

During claim:
Smart contract queries Forte's onchain adapter (or oracle relayed data)
Verifies if the claimant wallet has met configured compliance checks
Rejects claims failing compliance
KYC data is never exposed onchain—only cryptographic attestations from Forte are used.

## 5. dApp Frontend 
This will be the interface for Campaign creators and users to claim the rewards 

### 5.1 For Campaign Creators:
Connect wallet (e.g., MetaMask)
Upload eligibility criteria (YAML/JSON format)

Choose compliance settings (KYC/KYT)

Fund the reward pool (ERC-20 or native)

Submit campaign (sends data to TEE backend, returns campaign contract address)

## 5.2 For Users:
Connect wallet
See eligible campaigns (queried via Graph or contract events)

Generate ZK proof locally in browser or via light prover service

Submit claim with proof

Frontend facilitates KYC verification with Forte, if not already completed
