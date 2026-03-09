# maroo-assets

A tool that generates [Blockscout](https://github.com/blockscout/blockscout) explorer-ready JSON for precompile contracts deployed on Maroo Chain (EVM-compatible testnet).

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Installation

```bash
pnpm install
```

## Usage

Generate precompile definition JSON:

```bash
pnpm run generate
```

Output file: `output/precompiles-maroo.json`  
Raw URL for use with Blockscout (after pushing to GitHub):

`https://raw.githubusercontent.com/<owner>/<repo>/<branch>/output/precompiles-maroo.json`

(Replace `<owner>`, `<repo>`, and `<branch>` with your GitHub user/org, repository, and branch.)

Use this URL as the precompiles asset path in Blockscout settings so the explorer can read and decode each precompile’s ABI and source.

## Precompile list

| Name | Address | ABI/source |
|------|---------|------------|
| P256 | `0x0000000000000000000000000000000000000100` | Defined in this repo (EIP-7212 / Cosmos EVM) |
| Bech32 | `0x0000000000000000000000000000000000000400` | cosmos-evm-contracts |
| Staking | `0x0000000000000000000000000000000000000800` | cosmos-evm-contracts |
| Distribution | `0x0000000000000000000000000000000000000801` | cosmos-evm-contracts |
| Bank | `0x0000000000000000000000000000000000000804` | cosmos-evm-contracts |
| Gov | `0x0000000000000000000000000000000000000805` | cosmos-evm-contracts |
| Slashing | `0x0000000000000000000000000000000000000806` | cosmos-evm-contracts |
| OKRW | `0x1000000000000000000000000000000000000001` | maroo-contracts |
| PCL | `0x1000000000000000000000000000000000000005` | maroo-contracts |

## Adding new precompiles

When new precompiles are added to the chain, follow these steps.

### 1. Register address and name (`src/config.ts`)

- Add the address to `PRECOMPILE_ADDRESSES` as `Name: "0x..."`.
- If the precompile comes from **cosmos-evm-contracts** → add the name to the `COSMOS_EVM_NAMES` array.
- If it comes from **maroo-contracts** → add the name to the `MAROO_NAMES` array.
- If it’s **custom** (not from either package) → add the name to `COSMOS_EVM_NAMES` and define ABI/source in a separate module (see step 2).

### 2. Wire ABI and source

- **From cosmos-evm-contracts**  
  - In `src/cosmos-evm.ts`, import the module (e.g. `abi/precompiles/<module>/<Interface>`).  
  - Add the name and paths to `COSMOS_ABI_MAP` and `COSMOS_SOL_PATHS`.  
  - If the name is already in `COSMOS_EVM_NAMES`, it will be picked up automatically by `collectCosmosEvmPrecompiles()`.

- **From maroo-contracts**  
  - In `src/maroo.ts`, import the module (e.g. `abi/precompiles/<module>/<Interface>`).  
  - Add the name and paths to `MAROO_ABI_MAP` and `MAROO_SOL_PATHS`.  
  - `collectMarooPrecompiles()` iterates over `MAROO_NAMES`, so adding the name in step 1 is enough for it to be collected.

- **Custom** (precompile not in any package)  
  - Create a new file under `src/` (e.g. `src/NewPrecompile.ts`) and export the ABI array and Solidity source string.  
  - In `src/cosmos-evm.ts` (or a dedicated collector), import that export and push an entry manually (similar to the P256 handling at the start of `collectCosmosEvmPrecompiles()`).

### 3. Generate and verify

```bash
pnpm run generate
```

Confirm the new precompile appears in `output/precompiles-maroo.json`, then add a row to the **Precompile list** table in this README (name, address, source).

## Dependencies

- **[cosmos-evm-contracts](https://www.npmjs.com/package/cosmos-evm-contracts)** — P256 (manual), Bech32, Staking, Distribution, Bank, Gov, Slashing interfaces/ABI
- **[maroo-contracts](https://www.npmjs.com/package/maroo-contracts)** — OKRW, PCL interfaces/ABI
