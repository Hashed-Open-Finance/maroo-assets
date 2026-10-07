import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MAROO_NAMES, PRECOMPILE_ADDRESSES, type MarooPrecompileName } from "./config.js";
import { iOkrwAbi } from "@maroo-chain/contracts/abi/precompiles/okrw/IOkrw";
import { iPclAbi } from "@maroo-chain/contracts/abi/precompiles/pcl/IPcl";
import { iEasAbi } from "@maroo-chain/contracts/abi/precompiles/eas/IEas";
import { iAgentAbi } from "@maroo-chain/contracts/abi/precompiles/agent/IAgent";
import { iPrivacyAbi } from "@maroo-chain/contracts/abi/precompiles/privacy/IPrivacy";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type AbiEntry = readonly unknown[];

function readMarooSol(subpath: string): string {
  const root = join(__dirname, "..", "node_modules", "@maroo-chain", "contracts");
  // @maroo-chain/contracts ships sources at <pkg>/precompiles/<name>.sol;
  // the legacy maroo-contracts package used dist/precompiles/precompiles/.
  const candidates = [
    join(root, "precompiles", subpath),
    join(root, "dist", "precompiles", "precompiles", subpath),
  ];
  for (const full of candidates) {
    if (existsSync(full)) return readFileSync(full, "utf-8");
  }
  // Fail loudly: silently publishing an empty source hides layout changes.
  throw new Error(`Solidity source not found for ${subpath} in @maroo-chain/contracts`);
}

const MAROO_ABI_MAP: Record<MarooPrecompileName, AbiEntry> = {
  OKRW: iOkrwAbi,
  PCL: iPclAbi,
  EAS: iEasAbi,
  AGENT: iAgentAbi,
  PRIVACY: iPrivacyAbi,
};

const MAROO_SOL_PATHS: Record<MarooPrecompileName, string> = {
  OKRW: "okrw/IOkrw.sol",
  PCL: "pcl/IPcl.sol",
  EAS: "eas/IEas.sol",
  AGENT: "agent/IAgent.sol",
  PRIVACY: "privacy/IPrivacy.sol",
};

export interface MarooEntry {
  name: MarooPrecompileName;
  address: string;
  abi: AbiEntry;
  source: string;
}

export function collectMarooPrecompiles(): MarooEntry[] {
  const entries: MarooEntry[] = [];

  for (const name of MAROO_NAMES) {
    const abi = MAROO_ABI_MAP[name];
    const solPath = MAROO_SOL_PATHS[name];
    const source = readMarooSol(solPath);
    entries.push({
      name,
      address: PRECOMPILE_ADDRESSES[name],
      abi: [...abi],
      source,
    });
  }

  return entries;
}
