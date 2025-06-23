// A zero-knowledge proof that the claimant deserves some rewards
// To be verified by claimRewards() onchain in the ParticipationChecker contract

use trees::merkle::MerkleTree;
use std::{field::bytes32_to_field, string};
use std::hash;


fn hasher(leaves: [Field; 2]) -> Field {
    std::hash::poseidon::bn254::hash_2(leaves)
}

fn main(
    root: Field,
    index: Field,
    siblings: [Field;12],
    nullifier: Field,
    leaf: pub Field,
    value: pub Field,
    target_address: pub Field,
    user_address: Field,
    pub_x: [u8;32],
    pub_y: [u8;32],
    hashed_message: [u8;32],
    signature: [u8;64]
){

    // Checking if the target address is same as hashed message
    let hash_message_field_element = hash_padded_address(target_address);
    assert(hash_message_field_element == hashed_message);

    // Checking the signature
    let valid_signature = std::ecdsa_secp256k1::verify_signature(pub_x, pub_y, signature, hashed_message);
    assert(valid_signature);

    // Matching the user address with the public key
    let address = get_pubkey(pub_x, pub_y);
    let address_bytes: [u8;20] = field_to_bytes20(user_address);
    assert(address == address_bytes);

    // Verifying merkle proof
    let mt = MerkleTree::from(root, hasher);
    let calculated_leaf = hasher([user_address, value+nullifier]);
    assert(leaf == calculated_leaf);
    mt.membership(leaf, index, siblings);

}

pub fn get_pubkey(pub_x: [u8; 32], pub_y: [u8; 32]) -> [u8; 20] {
    // Concatenate pub_x and pub_y (64 bytes)
    let mut pubkey_bytes: [u8; 64] = [0; 64];
    for i in 0..32 {
        pubkey_bytes[i] = pub_x[i];
        pubkey_bytes[32 + i] = pub_y[i];
    }

    // Compute keccak256 hash of pubkey_bytes (64 bytes)
    let hash: [u8; 32] = std::hash::keccak256(pubkey_bytes, 64);

    // Take the last 20 bytes of the hash
    let mut eth_address: [u8; 20] = [0; 20];
    for i in 0..20 {
        eth_address[i] = hash[12 + i]; // last 20 bytes
    }

    eth_address
}


fn to_32_bytes_padded(address: [u8; 20]) -> [u8; 32] {
    let mut padded: [u8; 32] = [0; 32];
    // Pad left with 12 zero bytes, then copy address bytes
    for i in 0..20 {
        padded[12 + i] = address[i];
    }
    padded
}

pub fn hash_padded_address(field_address: Field) -> [u8; 32] {

    let address = field_to_bytes20(field_address);
    // Prefix as bytes array of length 28
    let prefix: [u8; 28] = [
        0x19, // \x19
        0x45, 0x74, 0x68, 0x65, 0x72, 0x65, 0x75, // "Ethereum"
        0x6D, 0x20, 0x53, 0x69, 0x67, 0x6E, 0x65, // "m Signe"
        0x64, 0x20, 0x4D, 0x65, 0x73, 0x73, 0x61, // "d Messa"
        0x67, 0x65, 0x3A, 0x0A, // "ge:\n"
        0x33, 0x32  // "32"
    ];

    let padded_address = to_32_bytes_padded(address);

    // Allocate 60 bytes buffer for prefix + padded address
    let mut full_message: [u8; 60] = [0; 60];

    // Copy prefix into full_message
    for i in 0..28 {
        full_message[i] = prefix[i];
    }

    // Copy padded address after prefix
    for i in 0..32 {
        full_message[28 + i] = padded_address[i];
    }

    // Keccak256 hash of full_message (prefix + padded address)
    std::hash::keccak256(full_message, 60)
}

fn field_to_bytes20(address: Field) -> [u8; 20] {
    // Convert the field element to 32 bytes (big endian)
    let full_bytes: [u8; 32] = address.to_be_bytes();

    let mut addr_bytes: [u8; 20] = [0; 20];

    // Copy last 20 bytes from full_bytes into addr_bytes
    for i in 0..20 {
        addr_bytes[i] = full_bytes[12 + i]; // last 20 bytes of 32
    }
    addr_bytes
}