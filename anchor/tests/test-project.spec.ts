import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { TestProject } from '../target/types/test_project';

describe('test-project', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.TestProject as Program<TestProject>;

  const testProjectKeypair = Keypair.generate();

  it('Initialize TestProject', async () => {
    await program.methods
      .initialize()
      .accounts({
        testProject: testProjectKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([testProjectKeypair])
      .rpc();

    const currentCount = await program.account.testProject.fetch(
      testProjectKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment TestProject', async () => {
    await program.methods
      .increment()
      .accounts({ testProject: testProjectKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testProject.fetch(
      testProjectKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment TestProject Again', async () => {
    await program.methods
      .increment()
      .accounts({ testProject: testProjectKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testProject.fetch(
      testProjectKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement TestProject', async () => {
    await program.methods
      .decrement()
      .accounts({ testProject: testProjectKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testProject.fetch(
      testProjectKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set testProject value', async () => {
    await program.methods
      .set(42)
      .accounts({ testProject: testProjectKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.testProject.fetch(
      testProjectKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the testProject account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        testProject: testProjectKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.testProject.fetchNullable(
      testProjectKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
