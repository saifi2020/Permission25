FROM ubuntu

WORKDIR /app

# Install system dependencies
RUN apt update && apt install -y \
    curl \
    git \
    jq \
    nodejs \
    npm

# Set PATH for noir and barretenberg
ENV PATH="/root/.nargo/bin:/root/.bb:$PATH"

# Install Noir
RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
RUN noirup --version 1.0.0-beta.3

# Install Barretenberg
RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
RUN bbup

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy all files
COPY . .

# Build the Noir circuit initially
RUN cd noir_circuits && nargo build && nargo compile

# Expose the API port
EXPOSE 8080

# Start the REST API server instead of running entrypoint.sh
CMD ["npm", "start"]