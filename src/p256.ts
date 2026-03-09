/**
 * P256 precompile (secp256r1 verification) at 0x100.
 * Not exported by cosmos-evm-contracts; defined per Cosmos EVM / EIP-7212.
 * Input: 160 bytes (hash, r, s, x, y). Output: 32 bytes (1 = success, 0 = fail).
 */
export const P256_ABI = [
  {
    type: "function",
    inputs: [
      { name: "hash", internalType: "bytes32", type: "bytes32" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
      { name: "x", internalType: "bytes32", type: "bytes32" },
      { name: "y", internalType: "bytes32", type: "bytes32" },
    ],
    name: "verify",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const P256_SOURCE = `// SPDX-License-Identifier: Apache-2.0
// P256 precompile: secp256r1 signature verification (EIP-7212 / Cosmos EVM).
// Address: 0x0000000000000000000000000000000000000100
// Input: 160 bytes (messageHash, r, s, pubkey x, pubkey y). Output: 32 bytes (1 = success).

pragma solidity >=0.4.21 <0.9.0;

interface IP256 {
    /// @notice Verifies a P256 (secp256r1) signature.
    /// @param hash Message hash (32 bytes)
    /// @param r Signature r component (32 bytes)
    /// @param s Signature s component (32 bytes)
    /// @param x Public key x coordinate (32 bytes)
    /// @param y Public key y coordinate (32 bytes)
    /// @return 1 if signature is valid, 0 otherwise
    function verify(
        bytes32 hash,
        bytes32 r,
        bytes32 s,
        bytes32 x,
        bytes32 y
    ) external view returns (uint256);
}
`;
