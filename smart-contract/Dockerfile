# Build Forte First
FROM node:20 AS node-builder
WORKDIR /app

# Install Forte Rules Engine and SDK
RUN npm install @thrackle-io/forte-rules-engine
RUN npm install @thrackle-io/forte-rules-engine-sdk

# Copy Forte rules to the build context
COPY . .
RUN cd forte && npm install
RUN npx tsx forte/injectModifiers.ts

# # # # # # # # # # # # # #

# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry
WORKDIR /app

# Pre-cache solc
COPY foundry.toml .
RUN forge build

# Build and test the source code
COPY . .

# Copy Forte output to the final image
# COPY --from=node-builder /app/node_modules/@thrackle-io/forte-rules-engine ./node_modules/@thrackle-io/forte-rules-engine
COPY --from=node-builder /app/node_modules ./node_modules/
COPY --from=node-builder /app/forte/node_modules ./forte/node_modules/
COPY --from=node-builder /app/src/RulesEngineClientCustom.sol ./src/RulesEngineClientCustom.sol
COPY --from=node-builder /app/src/RewardContract.sol ./src/RewardContract.sol

ENTRYPOINT [ "bash", "entrypoint.sh" ]