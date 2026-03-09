import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectCosmosEvmPrecompiles } from "./cosmos-evm.js";
import { collectMarooPrecompiles } from "./maroo.js";
import { toBlockscoutEntry } from "./blockscout.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export function generatePrecompilesJson(): string {
  const cosmos = collectCosmosEvmPrecompiles();
  const maroo = collectMarooPrecompiles();

  const entries = [
    ...cosmos.map((e) =>
      toBlockscoutEntry(e.name, e.address, e.abi, e.source)
    ),
    ...maroo.map((e) =>
      toBlockscoutEntry(e.name, e.address, e.abi, e.source)
    ),
  ];

  return JSON.stringify(entries, null, 2);
}

function main(): void {
  const outDir = join(__dirname, "..", "output");
  mkdirSync(outDir, { recursive: true });
  const json = generatePrecompilesJson();
  const outPath = join(outDir, "precompiles-maroo.json");
  writeFileSync(outPath, json, "utf-8");
  console.log("Wrote", outPath);
}

main();
