#!/bin/bash
set -e

cd noir_circuits

# Only build the verifier circuits; don't do any proving here.
# Clients will prove browser-side.

# build-circuit:
nargo build

# compile-circuit: 
nargo compile

# generate-vk:
bb write_vk -b ./target/noir_circuits.json -o ./target --oracle_hash keccak

# generate-solidity-verifier:
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol
