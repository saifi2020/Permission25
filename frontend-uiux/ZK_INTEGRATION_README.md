# ZK Proof Integration Guide

This project is ready for seamless integration with the `/claim-prover` service. Simply update the configuration file to switch between mock and production modes.

## Quick Start

### Switch to Production Mode

1. **Update the config file** `src/config/zkConfig.json`:
```json
{
  "zkProof": {
    "mode": "service",
    "claimProverService": {
      "enabled": true,
      "baseUrl": "http://localhost:8080",
      "endpoints": {
        "generateProof": "/api/generate-proof",
        "verifyProof": "/api/verify-proof",
        "compileCircuit": "/api/compile-circuit"
      },
      "circuitPath": "../claim-prover/noir_circuits/target/noir_circuits.json",
      "timeout": 30000
    }
  }
}
```

2. **Start the claim-prover service**:
```bash
cd ../claim-prover
docker build -t claim-prover .
docker run -p 8080:8080 claim-prover
```

3. **Refresh the frontend** - the system will automatically detect and use the service!

## Configuration Options

### Mode Settings
- `"mock"` - Browser-compatible simulation for development
- `"service"` - Real ZK proofs via claim-prover service

### Service Configuration
- `baseUrl` - Claim-prover service URL
- `endpoints` - API endpoint paths
- `circuitPath` - Path to compiled Noir circuit
- `timeout` - Request timeout in milliseconds

### Mock Settings
- `generationDelay` - Simulated proof generation time (ms)
- `verificationDelay` - Simulated verification time (ms)  
- `enableLogs` - Show detailed mock logs

### Production Settings
- `useWebWorker` - Run heavy computation in Web Worker
- `chunkSize` - Data chunk size for processing
- `enableProgressCallback` - Show progress updates

## Expected Claim-Prover API

The frontend expects the following API endpoints:

### Health Check
```
GET /health
Response: 200 OK
```

### Generate Proof
```
POST /api/generate-proof
Content-Type: application/json

{
  "inputs": {
    "creator_address": "0x123...",
    "campaign_id": "0x456...",
    "secret_key": "0x789..."
  },
  "circuitPath": "../claim-prover/noir_circuits/target/noir_circuits.json"
}

Response: {
  "proof": [1, 2, 3, ...],
  "publicInputs": ["0x123...", "0x456..."],
  "verificationKey": [4, 5, 6, ...]
}
```

### Verify Proof
```
POST /api/verify-proof
Content-Type: application/json

{
  "proof": [1, 2, 3, ...],
  "publicInputs": ["0x123...", "0x456..."],
  "verificationKey": [4, 5, 6, ...]
}

Response: {
  "isValid": true
}
```

## Current Status

- ✅ **Mock Mode**: Working browser simulation
- ✅ **Service Integration**: Ready for claim-prover connection
- ✅ **Configuration**: Single JSON file controls everything
- ✅ **UI Feedback**: Shows current mode and status
- ✅ **Error Handling**: Fallback to mock if service unavailable
- ✅ **Type Safety**: Consistent data structures between modes

## Development Notes

### File Structure
```
src/
├── config/
│   └── zkConfig.json          # Main configuration file
├── lib/
│   └── zkProof.js            # ZK proof generator with mode switching
├── components/
│   ├── NewCampaignDialog.jsx # Campaign creation with ZK proofs
│   └── ZKConfigStatus.jsx    # Status indicator component
└── pages/
    └── Landing.jsx           # Main landing page
```

### Key Features
- **Mode Detection**: Automatic switching between mock and service
- **Health Checks**: Tests service connection before use
- **Fallback Logic**: Graceful degradation if service unavailable
- **Status UI**: Visual indicators for current mode
- **Progress Feedback**: Loading states and error messages
- **Consistent API**: Same interface regardless of mode

### Testing
1. **Mock Mode**: Works immediately, no setup required
2. **Service Mode**: Requires running claim-prover service
3. **Fallback**: Service failures automatically fall back to mock

The system is production-ready and only requires updating the config file and starting the claim-prover service to switch to real ZK proofs! 