import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRECOMPILE_ADDRESSES, type CosmosEvmPrecompileName } from "./config.js";
import { P256_ABI, P256_SOURCE } from "./p256.js";
import { iBankAbi } from "cosmos-evm-contracts/abi/precompiles/bank/IBank";
import { bech32IAbi } from "cosmos-evm-contracts/abi/precompiles/bech32/Bech32I";
import { stakingIAbi } from "cosmos-evm-contracts/abi/precompiles/staking/StakingI";
import { distributionIAbi } from "cosmos-evm-contracts/abi/precompiles/distribution/DistributionI";
import { iGovAbi } from "cosmos-evm-contracts/abi/precompiles/gov/IGov";
import { iSlashingAbi } from "cosmos-evm-contracts/abi/precompiles/slashing/ISlashing";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type AbiEntry = readonly unknown[];

function readCosmosSol(subpath: string): string {
  const root = join(__dirname, "..", "node_modules", "cosmos-evm-contracts");
  // cosmos-evm-contracts 0.0.13+: dist/precompiles/<name>.sol
  // older layouts used dist/precompiles/precompiles/<name>.sol (same as maroo-contracts)
  const candidates = [
    join(root, "dist", "precompiles", subpath),
    join(root, "dist", "precompiles", "precompiles", subpath),
  ];
  for (const full of candidates) {
    if (existsSync(full)) return readFileSync(full, "utf-8");
  }
  return "";
}

const COSMOS_ABI_MAP: Record<
  Exclude<CosmosEvmPrecompileName, "P256">,
  AbiEntry
> = {
  Bech32: bech32IAbi,
  Staking: stakingIAbi,
  Distribution: distributionIAbi,
  Bank: iBankAbi,
  Gov: iGovAbi,
  Slashing: iSlashingAbi,
};

const COSMOS_SOL_PATHS: Partial<Record<CosmosEvmPrecompileName, string>> = {
  Bech32: "bech32/Bech32I.sol",
  Staking: "staking/StakingI.sol",
  Distribution: "distribution/DistributionI.sol",
  Bank: "bank/IBank.sol",
  Gov: "gov/IGov.sol",
  Slashing: "slashing/ISlashing.sol",
};

export interface CosmosEvmEntry {
  name: CosmosEvmPrecompileName;
  address: string;
  abi: AbiEntry;
  source: string;
}

export function collectCosmosEvmPrecompiles(): CosmosEvmEntry[] {
  const entries: CosmosEvmEntry[] = [];

  entries.push({
    name: "P256",
    address: PRECOMPILE_ADDRESSES.P256,
    abi: [...P256_ABI],
    source: P256_SOURCE,
  });

  for (const name of ["Bech32", "Staking", "Distribution", "Bank", "Gov", "Slashing"] as const) {
    const abi = COSMOS_ABI_MAP[name];
    const solPath = COSMOS_SOL_PATHS[name];
    const source = solPath ? readCosmosSol(solPath) : "";
    entries.push({
      name,
      address: PRECOMPILE_ADDRESSES[name],
      abi: [...abi],
      source,
    });
  }

  return entries;
}
