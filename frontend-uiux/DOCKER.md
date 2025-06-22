# Docker Setup for Private Onchain Rewards Frontend

## Building the Docker Image

```bash
docker build -t private-rewards-frontend .
```

## Running the Container

### Basic Run
```bash
docker run -p 80:80 private-rewards-frontend
```

### Run with Environment Variables
```bash
docker run -p 80:80 \
  -e VITE_API_URL=https://api.your-domain.com \
  -e VITE_CHAIN_ID=137 \
  -e VITE_RPC_URL=https://polygon-rpc.com \
  -e VITE_FACTORY_CONTRACT_ADDRESS=0x123... \
  -e VITE_VERIFIER_CONTRACT_ADDRESS=0x456... \
  -e VITE_FORTE_API_URL=https://api.forte.io \
  -e VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/ \
  -e VITE_TEE_ENDPOINT=https://tee.your-domain.com \
  -e VITE_ENABLE_TESTNET=true \
  private-rewards-frontend
```

### Run with Environment File
```bash
# Create a .env file with your configuration
docker run -p 80:80 --env-file .env private-rewards-frontend
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000/api` | Yes |
| `VITE_CHAIN_ID` | Blockchain network ID | `1` | Yes |
| `VITE_RPC_URL` | Blockchain RPC endpoint | `https://eth-mainnet.g.alchemy.com/v2/your-api-key` | Yes |
| `VITE_FACTORY_CONTRACT_ADDRESS` | Campaign Factory contract address | `0x0000...` | Yes |
| `VITE_VERIFIER_CONTRACT_ADDRESS` | ZK Verifier contract address | `0x0000...` | Yes |
| `VITE_FORTE_API_URL` | Forte compliance API endpoint | `https://api.forte.io` | Yes |
| `VITE_IPFS_GATEWAY` | IPFS gateway URL | `https://gateway.pinata.cloud/ipfs/` | Yes |
| `VITE_TEE_ENDPOINT` | Trusted Execution Environment endpoint | `http://localhost:8080` | Yes |
| `VITE_ENABLE_TESTNET` | Enable testnet features | `false` | No |

## Health Check

The container includes a health check that verifies the nginx server is responding:

```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Manual health check
curl http://localhost/health
```

## Multi-Architecture Build

To build for multiple architectures (AMD64 and ARM64):

```bash
# Enable Docker buildx
docker buildx create --use

# Build and push multi-arch image
docker buildx build --platform linux/amd64,linux/arm64 -t your-registry/private-rewards-frontend:latest --push .
```

## Security Notes

- The nginx configuration includes security headers (X-Frame-Options, CSP, etc.)
- Static assets are cached for 1 year
- API calls can be proxied through nginx to avoid CORS issues
- Environment variables are injected at runtime for flexibility

## Production Deployment

For production deployment:

1. Use a reverse proxy (nginx, traefik) with SSL termination
2. Set appropriate environment variables for your production environment
3. Consider using a CDN for static assets
4. Monitor the `/health` endpoint with your monitoring solution
5. Use container orchestration (Kubernetes, Docker Swarm) for high availability