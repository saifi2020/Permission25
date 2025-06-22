# Permission25

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