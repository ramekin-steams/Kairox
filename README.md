# Kairox

---

## What this repository does
Kairox prints a quick Base Sepolia health report: RPC chainId confirmation, optional wallet balance reads, latest block and gas signals, plus bytecode checks for a curated address list.

Built for Base.

---

## Why it exists
When you are wiring up tooling, you often need proof that reads work end-to-end before you add anything interactive. Kairox is meant to be a lightweight validation layer you can run locally or in CI to confirm your environment can observe Base Sepolia reliably.

---

## What it collects
- RPC response sanity via eth_chainId
- Wallet address discovery through Coinbase Wallet (when available)
- ETH balance reads for discovered addresses
- Latest block number and timestamp
- Current gas price estimate
- Bytecode existence checks for targets listed in samples/targets.json
- Direct Basescan links for every inspected item

---

## Safety boundaries
- No transactions are sent
- No messages are signed
- No onchain state is written
- No private keys are required

---

## Processing path
1) Load Base Sepolia configuration and explorer roots  
2) Run a minimal RPC probe to confirm the endpoint answers  
3) Initialize Coinbase Wallet SDK provider and viem clients  
4) Read balances only if wallet addresses are available  
5) Read block and gas signals from the public client  
6) Check bytecode for each target and print Basescan code links  

---

## Base sepolia profile
- network: Base Sepolia  
- chainId (decimal): 84532  
- explorer: https://sepolia.basescan.org  

---

## Layout map
- README.md  
- app/Kairox.mjs  
- package.json  
- contracts/BytecodeRegistry.sol  
- contracts/SepoliaSignalLens.sol  
- config/base-sepolia.json  
- samples/targets.json  

---

## Author Contacts
- GitHub: https://github.com/ramekin-steams

- Email: ramekin_steams_0i@icloud.com

---

## License
BSD 3-Clause License

---

## Testnet Deployment (Base Sepolia)
the following deployments are used only as validation references.

network: base sepolia  
chainId (decimal): 84532  
explorer: https://sepolia.basescan.org  

BytecodeRegistry.sol address:  
0x4B7c2a4f3D1a9B1c7b5E2B1A0f6e3dA2C4cA1B90  

deployment and verification:
- https://sepolia.basescan.org/address/0x4B7c2a4f3D1a9B1c7b5E2B1A0f6e3dA2C4cA1B90
- https://sepolia.basescan.org/0x4B7c2a4f3D1a9B1c7b5E2B1A0f6e3dA2C4cA1B90/0#code  

SepoliaSignalLens.sol address:  
0xA1d9b3E4c2F7a8B6D0e1c9F4b2A7c6D5E9f1A2B3  

deployment and verification:
- https://sepolia.basescan.org/address/0xA1d9b3E4c2F7a8B6D0e1c9F4b2A7c6D5E9f1A2B3
- https://sepolia.basescan.org/0xA1d9b3E4c2F7a8B6D0e1c9F4b2A7c6D5E9f1A2B3/0#code  
