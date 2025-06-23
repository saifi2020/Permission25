FROM ubuntu

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential

RUN apt-get install -y \
    llvm \
    clang \
    libclang-dev \
    pkg-config \
    cmake

WORKDIR /app/src

# Install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Clone the repository
RUN git clone https://github.com/Dstack-TEE/dstack.git

WORKDIR /app/src/dstack/sdk/simulator

# Build the TEE
RUN ./build.sh

# The TEE will create the following socket files:
#   tappd.sock   // Legacy TEE service interface (recommended)
#   dstack.sock  // New TEE service interface (in development)
#   external.sock
#   guest.sock

# Run the TEE
ENTRYPOINT [ "./dstack-simulator" ]

