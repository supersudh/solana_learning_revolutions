'use client';

import { TestProjectIDL, getTestProjectProgramId } from '@test-project/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useTestProjectProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getTestProjectProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(TestProjectIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['test-project', 'all', { cluster }],
    queryFn: () => program.account.testProject.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['test-project', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ testProject: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useTestProjectProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useTestProjectProgram();

  const accountQuery = useQuery({
    queryKey: ['test-project', 'fetch', { cluster, account }],
    queryFn: () => program.account.testProject.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['test-project', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ testProject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['test-project', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ testProject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['test-project', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ testProject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['test-project', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ testProject: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
