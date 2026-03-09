import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectCosmosEvmPrecompiles } from "../src/cosmos-evm.js";
import { collectMarooPrecompiles } from "../src/maroo.js";
import { toBlockscoutEntry } from "../src/blockscout.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const outDir = join(__dirname, "..", "output");
mkdirSync(outDir, { recursive: true });

const cosmos = collectCosmosEvmPrecompiles();
const maroo = collectMarooPrecompiles();

const entries = [
  ...cosmos.map((e) => toBlockscoutEntry(e.name, e.address, e.abi, e.source)),
  ...maroo.map((e) => toBlockscoutEntry(e.name, e.address, e.abi, e.source)),
];

const json = JSON.stringify(entries, null, 2);
const outPath = join(outDir, "precompiles-maroo.json");
writeFileSync(outPath, json, "utf-8");

console.log("Wrote", outPath);
