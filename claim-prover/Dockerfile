FROM ubuntu

WORKDIR /app

# When you feel like running a long build process, combine these
RUN apt update && apt install -y \
    curl \
    git
RUN apt install -y \
    jq

# Set PATH for noir and barretenberg
ENV PATH="/root/.nargo/bin:/root/.bb:$PATH"

# Install Noir
RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
RUN noirup --version 1.0.0-beta.3

# Install Barretenberg
RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
RUN bbup

COPY . .

ENTRYPOINT ["bash", "entrypoint.sh"]