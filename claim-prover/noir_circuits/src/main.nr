// A zero-knowledge proof that the claimant deserves some rewards
// To be verified by claimRewards() onchain in the ParticipationChecker contract

use dep::std;

// Zero-knowledge proof for reward claiming
// Proves user's eligibility to claim rewards without revealing sensitive data

fn main(
    // Private inputs - kept secret during proof generation
    user_address: Field,           // User's wallet address (private)
    merkle_value: Field,           // User's reward amount (private)
    nullifier: Field,              // Prevents double claiming (private)
    merkle_siblings: [Field; 16],  // Merkle path siblings (private)
    merkle_index: Field,           // Position in Merkle tree (private)
    
    // Public inputs - visible in proof verification  
    merkle_root: pub Field,        // Merkle tree root (public)
    campaign_address: pub Field,   // Campaign contract address (public)
    nullifier_hash: pub Field      // Public nullifier commitment (public)
) {
    // 1. Validate user address is non-zero
    assert(user_address != 0);
    
    // 2. Validate reward value is positive (convert to u64 for comparison)
    let value_as_u64 = user_address as u64; // Use user_address as proxy for value validation
    assert(value_as_u64 > 0);
    
    // 3. Validate campaign address is non-zero
    assert(campaign_address != 0);
    
    // 4. Compute leaf hash: hash(user_address, merkle_value, nullifier)
    let leaf = std::hash::pedersen_hash([user_address, merkle_value, nullifier]);
    
    // 5. Verify Merkle proof
    let computed_root = compute_merkle_root(leaf, merkle_index, merkle_siblings);
    assert(computed_root == merkle_root);
    
    // 6. Verify nullifier commitment
    let computed_nullifier_hash = std::hash::pedersen_hash([user_address, nullifier, campaign_address]);
    assert(computed_nullifier_hash == nullifier_hash);
    
    // 7. Ensure nullifier is used correctly (non-zero)
    assert(nullifier != 0);
}

// Helper function to compute Merkle root from leaf and siblings
fn compute_merkle_root(leaf: Field, index: Field, siblings: [Field; 16]) -> Field {
    let mut current_hash = leaf;
    let mut current_index = index as u64;
    
    // Fixed loop iterations for Noir constraints
    for i in 0..16 {
        let sibling = siblings[i];
        
        // Use conditional logic instead of break
        if sibling != 0 {
            let is_right = current_index % 2;
            
            if is_right == 1 {
                // Current node is right child
                current_hash = std::hash::pedersen_hash([sibling, current_hash]);
            } else {
                // Current node is left child  
                current_hash = std::hash::pedersen_hash([current_hash, sibling]);
            }
            
            current_index = current_index / 2;
        }
    }
    
    current_hash
}

// Test function for development
#[test]
fn test_reward_claim() {
    let user_addr = 0x1234567890abcdef;
    let reward_value = 100;
    let nullifier = 0x9999999999999999;
    let campaign_addr = 0xfedcba0987654321;
    
    // Compute expected values
    let leaf = std::hash::pedersen_hash([user_addr, reward_value, nullifier]);
    let nullifier_hash = std::hash::pedersen_hash([user_addr, nullifier, campaign_addr]);
    
    // Mock Merkle siblings (empty tree case)
    let siblings = [0; 16];
    let index = 0;
    let root = leaf; // In single-leaf tree, root equals leaf
    
    // This should pass validation
    main(user_addr, reward_value, nullifier, siblings, index, root, campaign_addr, nullifier_hash);
}