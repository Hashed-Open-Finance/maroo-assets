type AbiEntry = readonly unknown[];

export interface BlockscoutPrecompileEntry {
  address: string;
  name: string;
  bytecode: string;
  compiler: string;
  source: string;
  abi: string;
}

const BYTECODE = "0xfe";
const COMPILER = "Maroo Precompile";

export function toBlockscoutEntry(
  name: string,
  address: string,
  abi: AbiEntry,
  source: string
): BlockscoutPrecompileEntry {
  return {
    address,
    name,
    bytecode: BYTECODE,
    compiler: COMPILER,
    source,
    abi: JSON.stringify(abi),
  };
}
