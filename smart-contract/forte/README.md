# Forte demo

This guide provides a step-by-step process for integrating, deploying, and testing smart contracts using the **Forte Rules Engine (FRE)** in a local **Anvil** development environment with the **Forte Rules Engine SDK**.

Also deployed and tested on **BNB**
Register contract: 0xBA1178B2BbB515375dF4142cD66e7FD053Ff1Fd4
KYC contract: 0x2726d390b1DAEe86e7141c758D9eBec6ab4C376D
Reward policy ID: 27
KYC policy ID: 28
BSC user Address: 0x86d8ca61c43093c17c2f03164226dd6fc1BC2b7E
Rules engine access: 0xdf1e7dc43e4f56a21780bd2cb9d9eca9912eac96


## Rules created

- KYC level > 2
- KYC'd after Jan 1st 2025
- Not FRE and OFAC listed
- User count hitting register < 10

## Contracts created
- Register: users must hit that register contract to be enrolled
- KYC: Set and Get KYC level for a user (By admin user) + track timestamp for each user

---

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `anvil`, etc.)
- Node.js & npm
- TypeScript (`tsx` or `ts-node`)
- RPC URL and Private Key for transaction broadcasting
- Forte Rules Engine SDK
- `anvilState.json` file with predeployed FRE & OFAC contract

**FOR BNB**
- Use BNB configs that are found in .env.sample
- Remove ForeignCalls **freOfacSanctioned** and Rules **FC:freOfacSanctioned == false** from ./policies/kyc.json
  - This is due to the FRE and OFAC contract not being on BNB chain
- Forte Rules Engine SDK: 0xdf1e7dc43e4f56a21780bd2cb9d9eca9912eac96


---

## Step-by-Step Setup + Run through

### 1. Integrate & Deploy the Example Contracts

#### Inject modifiers into contracts:
```bash
npx tsx index.ts injectModifiers ./policies/kyc-level.json ../src/KYCRulesEngineIntegration.sol ../src/Register.sol
```

#### Deploy the `Register` contract:
```bash
forge script ../script/Register.s.sol --ffi --broadcast -vvv --non-interactive --rpc-url $RPC_URL --private-key $PRIV_KEY
```

Set your contract address:
```bash
REGISTER_ADDRESS=<deployed_address>
```

---

### 2. Deploy the KYC Contract

```bash
forge script ../script/KYC.s.sol --ffi --broadcast -vvv --non-interactive --rpc-url $RPC_URL --private-key $PRIV_KEY
```

Set your contract address:
```bash
KYC_ADDRESS=<deployed_address>
```

Update ForeignCalls KYC address in kyc-level.json with KYC_ADDRESS

---

### 3. Create Policies in the Rules Engine

#### Create the Reward Policy:
```bash
npx tsx index.ts setupPolicy policies/reward.json
```
```bash
REWARD_POLICY_ID=<returned_policy_id>
```

#### Create the KYC Level Policy:
```bash
npx tsx index.ts setupPolicy policies/kyc-level.json
```
```bash
KYC_POLICY_ID=<returned_policy_id>
```

---

### 4. Link Rules Engine to Register Contract

#### Set the Rules Engine address:
```bash
cast send $REGISTER_ADDRESS "setRulesEngineAddress(address)" $RULES_ENGINE_ADDRESS --rpc-url $RPC_URL --private-key $PRIV_KEY
```

#### Verify the address was set:
```bash
cast call $REGISTER_ADDRESS "rulesEngineAddress()(address)" --rpc-url $RPC_URL
```

---

### 5. Set Calling Contract Admin

```bash
cast send $REGISTER_ADDRESS "setCallingContractAdmin(address)" $USER_ADDRESS_1 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

---

### 6. Subscribe the Contract to Policies

```bash
npx tsx index.ts applyPolicy $REWARD_POLICY_ID $CONTRACT_ADDRESS
npx tsx index.ts applyPolicy $KYC_POLICY_ID $CONTRACT_ADDRESS
```

---

### 7. Sanctions Check with Included FRE Adapter

The included `anvilState.json` contains the OFAC Sanctions Adapter at:

```text
0x0B306BF915C4d645ff596e518fAf3F9669b97016
```

You can verify a user's status:
```bash
cast call $FRE_OFAC_SACTIONS_CONTRACT "isDenied(address)(bool)" $USER_ADDRESS_3 --rpc-url $RPC_URL
```

---

## KYC + Register Flow

### Set KYC Level to 3
```bash
cast send $KYC_CONTRACT "setKycLevel(address,uint256)" $USER_ADDRESS_1 3 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

### Get KYC Level
```bash
cast call $KYC_CONTRACT "getKycLevel(address)(uint256)" $USER_ADDRESS_1 --rpc-url $RPC_URL
```

### Get KYC Timestamp
```bash
cast call $KYC_CONTRACT "getKycTimestamp(address)(uint256)" $USER_ADDRESS_1 --rpc-url $RPC_URL
```

---

## Example Registers

### ✅ Successful register (KYC'd User)
```bash
cast send $REGISTER_ADDRESS "transfer(address,uint256)" $USER_ADDRESS_1 40000 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

### ❌ Failed register (User Not KYC'd)
```bash
cast send $REGISTER_ADDRESS "transfer(address,uint256)" $USER_ADDRESS_2 40000 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

---
