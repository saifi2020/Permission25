# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry:latest
 
# Copy our source code into the container
WORKDIR /app

# Build and test the source code
COPY . .

EXPOSE 8545
ENV ANVIL_IP_ADDR="0.0.0.0"

ENTRYPOINT ["bash", "entrypoint.sh"]
