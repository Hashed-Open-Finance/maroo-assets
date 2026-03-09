import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRECOMPILE_ADDRESSES, type MarooPrecompileName } from "./config.js";
import { iOkrwAbi } from "maroo-contracts/abi/precompiles/okrw/IOkrw";
import { iPclAbi } from "maroo-contracts/abi/precompiles/pcl/IPcl";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type AbiEntry = readonly unknown[];

function readMarooSol(subpath: string): string {
  const root = join(__dirname, "..", "node_modules", "maroo-contracts");
  const full = join(root, "dist", "precompiles", "precompiles", subpath);
  if (existsSync(full)) return readFileSync(full, "utf-8");
  return "";
}

const MAROO_ABI_MAP: Record<MarooPrecompileName, AbiEntry> = {
  OKRW: iOkrwAbi,
  PCL: iPclAbi,
};

const MAROO_SOL_PATHS: Record<MarooPrecompileName, string> = {
  OKRW: "okrw/IOkrw.sol",
  PCL: "pcl/IPcl.sol",
};

export interface MarooEntry {
  name: MarooPrecompileName;
  address: string;
  abi: AbiEntry;
  source: string;
}

export function collectMarooPrecompiles(): MarooEntry[] {
  const entries: MarooEntry[] = [];

  for (const name of ["OKRW", "PCL"] as const) {
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
