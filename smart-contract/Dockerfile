# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry
 
# Copy our source code into the container
WORKDIR /app
 
# Pre-cache solc
COPY foundry.toml .
RUN forge build

# RUN git init
# RUN forge install OpenZeppelin/openzeppelin-contracts-upgradeable
# RUN forge install OpenZeppelin/openzeppelin-contracts

# Build and test the source code
COPY . .

ENTRYPOINT [ "bash", "entrypoint.sh" ]