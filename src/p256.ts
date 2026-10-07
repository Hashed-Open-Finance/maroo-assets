/**
 * P256 precompile (secp256r1 verification) at 0x100.
 * Not exported by cosmos-evm-contracts; defined per Cosmos EVM / RIP-7212.
 *
 * The precompile has NO function selector: it reads exactly 160 raw bytes
 * (hash || r || s || x || y). Any other input length returns empty output.
 * An ABI-encoded `verify(bytes32,...)` call prepends a 4-byte selector
 * (164 bytes) and therefore always returns empty, so no function is exposed
 * in the ABI. Output: 32 bytes `...01` on a valid signature, empty otherwise.
 */
export const P256_ABI = [] as const;

export const P256_SOURCE = `// SPDX-License-Identifier: Apache-2.0
// P256 precompile: secp256r1 signature verification (RIP-7212 / Cosmos EVM).
// Address: 0x0000000000000000000000000000000000000100
//
// This precompile has NO function selector, so it cannot be called through
// an ABI-encoded function. Call it with exactly 160 raw bytes:
//   hash (32) || r (32) || s (32) || x (32) || y (32)
// Output: 32 bytes with value 1 if the signature is valid; EMPTY output
// (not 0) if it is invalid or the input length is not 160 bytes.

pragma solidity >=0.8.0 <0.9.0;

library P256 {
    address internal constant PRECOMPILE = 0x0000000000000000000000000000000000000100;

    function verify(bytes32 hash, bytes32 r, bytes32 s, bytes32 x, bytes32 y)
        internal
        view
        returns (bool)
    {
        (bool ok, bytes memory out) = PRECOMPILE.staticcall(abi.encodePacked(hash, r, s, x, y));
        return ok && out.length == 32 && abi.decode(out, (uint256)) == 1;
    }
}
`;
