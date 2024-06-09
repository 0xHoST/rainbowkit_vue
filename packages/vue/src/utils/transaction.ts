import { Address, Client, PublicClient } from 'viem';
import { TransactionStatus, TransactionUpdateFn, TransactionVoidFunc, type NewTransaction, type Transaction, type TransactionData } from '../types'
import { useWaitForTransactionReceipt } from '@wagmi/vue';
import { waitForTransactionReceipt } from 'viem/actions';

function safeParseJsonData(string: string | null): TransactionData {
  try {
    const value = string ? (JSON.parse(string) as TransactionData) : {}
    return typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

export const transactionStorageKey = 'rk-transactions';

export function getTransactions(): TransactionData {
  return safeParseJsonData(
    typeof localStorage !== 'undefined' ? localStorage.getItem(transactionStorageKey) : null
  )
}

export function validate(transaction: Transaction | NewTransaction): Array<string> {
  const errors: Array<string> = []
  const transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/

  if (!transactionHashRegex.test(transaction.hash)) {
    errors.push('Invalid transaction hash')
  }

  if (typeof transaction.description !== 'string') {
    errors.push('Transaction must have a description')
  }

  if (
    typeof transaction.confirmations !== 'undefined' &&
    (!Number.isInteger(transaction.confirmations) || transaction.confirmations < 1)
  ) {
    errors.push('Transaction confirmations must be a positiver integer')
  }

  return errors
}

export function createTransactionStore({ provider }: { provider: Client | undefined}) {
  //if(provider === undefined) return;
  const transactionRequestCache: Map<string, Promise<void>> = new Map()
  const listeners: Set<TransactionVoidFunc> = new Set()
  const transactions = getTransactions();
  const save = (): void => localStorage.setItem(transactionStorageKey, JSON.stringify(transactions));

  const createNewPublicClientProvider = (newProvider: Client) => {
    provider = newProvider;
  }

  const getTransactionsByAddressAndChainId = (address: string, chainId: number): Array<Transaction> => {
    if(!transactions) return [];
    if(Object.keys(transactions).length <= 0) return [];
    return transactions[address][chainId] ?? [];
  }

  const setTransactionStatus = (
    account: string,
    chainId: number,
    hash: string,
    status: TransactionStatus
  ): void => {
    updateTransactions(account, chainId, (transactions) => {
      return transactions.map((transaction) =>
        transaction.hash === hash ? { ...transaction, status } : transaction
      )
    })
  }

  const clearTransactions = (account: string, chainId: number): void => {
    updateTransactions(account, chainId, () => {
      return [];
    });
  }

  const addTransaction = (address: string, chainId: number, transaction: NewTransaction): void => {
    const errors = validate(transaction)
    if (errors.length > 0) {
      throw new Error(['Unable to add transaction', ...errors].join('\n'))
    }

    updateTransactions(address, chainId, (transactions) => {
      return [
        { ...transaction, status: 'pending' },
        ...transactions.filter(({ hash }) => {
          return hash !== transaction.hash
        })
      ]
    })
  }

  const updateTransactions = (
    address: string,
    chainId: number,
    updater: TransactionUpdateFn
  ): void => {
    transactions[address] = transactions[address] ?? {}
    let completedTransactionCount = 0
    const MAX_COMPLETED_TRANSACTIONS = 10
    const currentTransactions = updater(transactions[address][chainId] ?? []).filter(
      (transaction) => {
        return transaction.status === 'pending'
          ? true
          : completedTransactionCount++ <= MAX_COMPLETED_TRANSACTIONS
      }
    )

    transactions[address][chainId] = currentTransactions

    save();
    notifyListeners();
    waitForPendingTransactions(address, chainId);
  }

  const waitForPendingTransactions = async (address: string, chainId: number) : Promise<void> => {
    await Promise.all(
      getTransactionsByAddressAndChainId(address, chainId)
        .filter(({ status }) => status === 'pending')
        .map(async (transaction) => {
          const { confirmations, hash } = transaction
          const existingRequest = transactionRequestCache.get(hash)

          if (existingRequest) {
            return await existingRequest
          }
          
          const requestPromise = waitForTransactionReceipt(provider!,{
              confirmations,
              hash: hash as Address,
              timeout: 300_000 // 5 minutes
            })
            .then(({ status }) => {
              transactionRequestCache.delete(hash)
              if (status === undefined) return
              setTransactionStatus(
                address,
                chainId,
                hash,
                // @ts-ignore - types changed with viem@1.1.0
                status === 0 || status === 'reverted' ? 'failed' : 'confirmed'
              )
            })
            .catch(() => {
              setTransactionStatus(address, chainId, hash, 'failed')
            })

          transactionRequestCache.set(hash, requestPromise)
          return await requestPromise
        })
    )
  }

  const notifyListeners = (): void => {
    for (const listener of listeners) {
      listener()
    }
  }

  const subscribe = (fn: TransactionVoidFunc): TransactionVoidFunc => {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }

  return {
    subscribe,
    addTransaction,
    clearTransactions,
    getTransactionsByAddressAndChainId,
    createNewPublicClientProvider,
    waitForPendingTransactions
  }
}

