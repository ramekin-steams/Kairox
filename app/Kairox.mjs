import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import axios from "axios";
import fs from "node:fs";
import { createPublicClient, createWalletClient, custom, formatEther, http, isAddress } from "viem";
import { baseSepolia } from "viem/chains";

const BASE_SEPOLIA = {
  name: "Base Sepolia",
  chainId: 84532,
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
};

function linkAddress(a) {
  return `${BASE_SEPOLIA.explorer}/address/${a}`;
}
function linkBlock(n) {
  return `${BASE_SEPOLIA.explorer}/block/${n}`;
}
function linkCode(a) {
  return `${BASE_SEPOLIA.explorer}/address/${a}#code`;
}
function short(a) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function loadTargets() {
  try {
    const raw = fs.readFileSync("samples/targets.json", "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.targets) ? parsed.targets : [];
  } catch {
    return [];
  }
}

async function rpcCheck() {
  const payload = { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] };
  const res = await axios.post(BASE_SEPOLIA.rpcUrl, payload, { timeout: 10_000 });
  return res?.data?.result ?? null;
}

async function safeGetAddresses(walletClient) {
  try {
    return await walletClient.getAddresses();
  } catch {
    return [];
  }
}

export async function run() {
  console.log("Built for Base");
  console.log(`Network: ${BASE_SEPOLIA.name}`);
  console.log(`chainId (decimal): ${BASE_SEPOLIA.chainId}`);
  console.log(`Explorer: ${BASE_SEPOLIA.explorer}`);
  console.log(`RPC: ${BASE_SEPOLIA.rpcUrl}`);
  console.log("");

  console.log("RPC probe:");
  try {
    const chainIdHex = await rpcCheck();
    console.log(`- eth_chainId: ${chainIdHex ?? "null"}`);
  } catch (e) {
    console.log(`- rpc probe failed: ${e?.message || String(e)}`);
  }
  console.log("");

  const sdk = new CoinbaseWalletSDK({
    appName: "Kairox",
    darkMode: false,
  });

  const provider = sdk.makeWeb3Provider(BASE_SEPOLIA.rpcUrl, BASE_SEPOLIA.chainId);

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_SEPOLIA.rpcUrl),
  });

  const targets = loadTargets();
  console.log(`Targets loaded: ${targets.length}`);
  console.log("");

  const addresses = await safeGetAddresses(walletClient);
  if (addresses.length) {
    console.log("Wallet balances:");
    for (const a of addresses) {
      const bal = await publicClient.getBalance({ address: a });
      console.log(`- ${short(a)}: ${formatEther(bal)} ETH`);
      console.log(`  ${linkAddress(a)}`);
    }
    console.log("");
  } else {
    console.log("Wallet balances: skipped (no addresses available)");
    console.log("");
  }

  const latest = await publicClient.getBlockNumber();
  const block = await publicClient.getBlock({ blockNumber: latest });
  const gasPrice = await publicClient.getGasPrice();

  console.log("Chain snapshot:");
  console.log(`- Latest block: ${latest.toString()}`);
  console.log(`  ${linkBlock(latest.toString())}`);
  console.log(`- Timestamp: ${new Date(Number(block.timestamp) * 1000).toISOString()}`);
  console.log(`- Gas price (gwei): ${(Number(gasPrice) / 1e9).toFixed(3)}`);
  console.log("");

  console.log("Bytecode presence:");
  for (const t of targets) {
    if (!isAddress(t)) {
      console.log(`- invalid address skipped: ${t}`);
      continue;
    }
    const code = await publicClient.getBytecode({ address: t });
    const has = !!code && code !== "0x";
    console.log(`- ${short(t)}: ${has ? "bytecode found" : "no bytecode"}`);
    console.log(`  ${linkCode(t)}`);
  }
}

run().catch((e) => console.error(e));
