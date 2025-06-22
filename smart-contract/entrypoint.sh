#!/bin/bash

# Exit on any error
set -e

export ANVIL_PK=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export ANVIL_ADDRESS=0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
export ANVIL_RPC_URL="http://anvil:8545"

forge build
forge test

# Wait for the Anvil node to be ready
sleep 1

cast balance $ANVIL_ADDRESS --rpc-url $ANVIL_RPC_URL

cast wallet address --private-key $ANVIL_PK

forge script script/Deploy.s.sol:Deploy \
  --fork-url $ANVIL_RPC_URL \
  --private-key $ANVIL_PK \
  --broadcast