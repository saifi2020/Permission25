// A zero-knowledge proof that the claimant deserves some rewards
// To be verified by claimRewards() onchain in the ParticipationChecker contract

use dep::std;

// Zero-knowledge proof for campaign creation validation
// Proves the creator has authority to create campaigns without revealing sensitive data

fn main(
    // Private inputs - kept secret during proof generation
    creator_address: Field,     // Creator's wallet address (private)
    campaign_id: Field,         // Unique campaign identifier (private) 
    secret_key: Field,          // Creator's secret key (private)
    
    // Public inputs - visible in proof verification
    pub campaign_hash: Field,   // Public commitment to campaign data
    pub creator_hash: Field     // Public commitment to creator identity
) {
    // 1. Validate creator identity by computing hash of address + secret
    let computed_creator_hash = std::hash::pedersen_hash([creator_address, secret_key]);
    assert(computed_creator_hash[0] == creator_hash);
    
    // 2. Generate campaign commitment by hashing campaign_id + creator_address
    let computed_campaign_hash = std::hash::pedersen_hash([campaign_id, creator_address]);
    assert(computed_campaign_hash[0] == campaign_hash);
    
    // 3. Validate secret key format (must be non-zero)
    assert(secret_key != 0);
    
    // 4. Validate campaign_id uniqueness (must be non-zero)
    assert(campaign_id != 0);
    
    // 5. Additional validation: creator_address must be valid Ethereum address format
    // In a real implementation, you might add more sophisticated address validation
    assert(creator_address != 0);
}

// Test function for development
#[test]
fn test_campaign_creation() {
    let creator_addr = 0x1234567890abcdef;
    let campaign_id = 0xfedcba0987654321;
    let secret = 0x1111111111111111;
    
    // Compute expected public values
    let creator_hash = std::hash::pedersen_hash([creator_addr, secret]);
    let campaign_hash = std::hash::pedersen_hash([campaign_id, creator_addr]);
    
    // This should pass validation
    main(creator_addr, campaign_id, secret, campaign_hash[0], creator_hash[0]);
}