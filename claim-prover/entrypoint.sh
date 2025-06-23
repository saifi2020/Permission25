#!/bin/bash
set -e

cd noir_circuits

# build-circuit:
nargo build

# execute-circuit:
nargo execute

# compile-circuit: 
nargo compile

# prove-circuit:
bb prove -b ./target/noir_circuits.json -w ./target/noir_circuits.gz -o ./target --oracle_hash keccak

# generate-vk:
bb write_vk -b ./target/noir_circuits.json -o ./target --oracle_hash keccak

# verify-proof: 
bb verify -k ./target/vk -p ./target/proof --oracle_hash keccak

# generate-solidity-verifier:
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol
