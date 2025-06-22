#!/bin/bash

# Exit on any error
set -e

forge build
forge test
