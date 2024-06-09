import type { createTransactionStore } from "@/utils";

export interface Transaction {
  hash: string;
  description: string;
  status: TransactionStatus;
  confirmations?: number;
}
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type NewTransaction = Omit<Transaction, 'status'>;
export type TransactionData = Record<string, Record<number, Array<Transaction> | undefined>>;
export type TransactionUpdateFn = (transactions:Array<Transaction>)=>Array<Transaction>;
export type TransactionVoidFunc = ()=>void;
export type TransactionStoreContext = ReturnType<typeof createTransactionStore> | null;

