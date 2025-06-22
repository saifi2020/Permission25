# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry
 
# Copy our source code into the container
WORKDIR /app
 
# Build and test the source code
COPY . .
# RUN anvil --fork-url "${RPC_URL}"
CMD ["anvil", "--load-state", "anvilState.json"]