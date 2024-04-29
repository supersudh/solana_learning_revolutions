// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { TestProject } from '../target/types/test_project';
import { IDL as TestProjectIDL } from '../target/types/test_project';

// Re-export the generated IDL and type
export { TestProject, TestProjectIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const TEST_PROJECT_PROGRAM_ID = new PublicKey(
  'CEJrN3Ko8aVJjdv11KqJ68bciXsVRnuMDhBCbCB9snac'
);

// This is a helper function to get the program ID for the TestProject program depending on the cluster.
export function getTestProjectProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return TEST_PROJECT_PROGRAM_ID;
  }
}
