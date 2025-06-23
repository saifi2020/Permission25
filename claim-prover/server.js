const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'claim-prover',
    timestamp: new Date().toISOString() 
  });
});

// Generate ZK proof endpoint
app.post('/api/generate-proof', async (req, res) => {
  try {
    console.log('🔄 Generating ZK proof with inputs:', req.body.inputs);
    
    const { inputs, circuitPath } = req.body;
    
    // Write inputs to Prover.toml file for Noir
    const proverToml = `
creator_address = "${inputs.creator_address}"
campaign_id = "${inputs.campaign_id}"
secret_key = "${inputs.secret_key}"
`;
    
    const circuitDir = path.join(__dirname, 'noir_circuits');
    const proverPath = path.join(circuitDir, 'Prover.toml');
    
    // Write inputs to Prover.toml
    fs.writeFileSync(proverPath, proverToml);
    
    // Execute Noir proof generation
    const proofGeneration = new Promise((resolve, reject) => {
      exec('cd noir_circuits && nargo execute && bb prove -b ./target/noir_circuits.json -w ./target/noir_circuits.gz -o ./target --oracle_hash keccak', 
        { cwd: __dirname }, 
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Proof generation error:', error);
            reject(error);
            return;
          }
          
          console.log('✅ Proof generation stdout:', stdout);
          if (stderr) console.log('Proof generation stderr:', stderr);
          
          try {
            // Read generated proof
            const proofPath = path.join(circuitDir, 'target', 'proof');
            const proof = fs.readFileSync(proofPath);
            
            // Convert proof to array format expected by frontend
            const proofArray = Array.from(proof);
            
            resolve({
              proof: proofArray,
              publicInputs: [
                inputs.creator_address,
                inputs.campaign_id
              ],
              verificationKey: Array.from(crypto.randomBytes(32)) // Placeholder
            });
          } catch (readError) {
            console.error('❌ Error reading proof file:', readError);
            reject(readError);
          }
        }
      );
    });
    
    const result = await proofGeneration;
    console.log('✅ ZK proof generated successfully');
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ ZK proof generation failed:', error);
    res.status(500).json({ 
      error: 'Proof generation failed', 
      message: error.message 
    });
  }
});

// Verify ZK proof endpoint
app.post('/api/verify-proof', async (req, res) => {
  try {
    console.log('🔍 Verifying ZK proof');
    
    const { proof, publicInputs, verificationKey } = req.body;
    
    // For now, return a simple verification
    // In production, this would use bb verify command
    const isValid = proof && publicInputs && verificationKey && proof.length > 0;
    
    console.log('✅ Proof verification result:', isValid);
    
    res.json({ isValid });
    
  } catch (error) {
    console.error('❌ ZK proof verification failed:', error);
    res.status(500).json({ 
      error: 'Proof verification failed', 
      message: error.message 
    });
  }
});

// Compile circuit endpoint
app.post('/api/compile-circuit', async (req, res) => {
  try {
    console.log('🔧 Compiling Noir circuit');
    
    const compilation = new Promise((resolve, reject) => {
      exec('cd noir_circuits && nargo build && nargo compile', 
        { cwd: __dirname }, 
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Circuit compilation error:', error);
            reject(error);
            return;
          }
          
          console.log('✅ Circuit compilation stdout:', stdout);
          if (stderr) console.log('Circuit compilation stderr:', stderr);
          
          resolve({ status: 'compiled', timestamp: new Date().toISOString() });
        }
      );
    });
    
    const result = await compilation;
    console.log('✅ Circuit compiled successfully');
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Circuit compilation failed:', error);
    res.status(500).json({ 
      error: 'Circuit compilation failed', 
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Claim-Prover REST API server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`⚡ ZK Proof API: http://localhost:${PORT}/api/generate-proof`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Claim-Prover server shutting down...');
  process.exit(0);
}); 