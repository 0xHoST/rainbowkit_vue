import {
  type NewTransaction,
  type Transaction,
  type Context,
  type RainbowKitPluginOptions,
  type TransactionStoreContext,
  TransactionStoreContextKey,
  ShowRecentTransactionsContextKey,
} from '@/types';
import { createTransactionStore } from '@/utils';
import { useRainbowKitAccountContext } from '@/composables/account';
import { useChainId, useClient } from '@wagmi/vue';
import { inject, ref, type Ref, watch } from 'vue';

//TODO: @wagmi/vue currently does not support usePublicClient.  
export function configureTransactionStore() {
  const context = useTransactionStoreContext();
  const { address } = useRainbowKitAccountContext();
  const provider = useClient();

  if(!provider?.value) return;
  
  const chainId = useChainId();
  const store = createTransactionStore({provider: provider.value});
    
  ///Remove when go live , just an example to test the UI
  /*watch(()=> address.value, (newAddress)=>{
    if(!newAddress) return;
    
    store?.addTransaction(newAddress,chainId.value,{
      hash: "0x5d15649e25d8f3e2c0374946078539d200710afc977cdfc6a977bd23f20fa8e8",
      description: "Transfer token #20 to others",
      confirmations: 20
    });

    store?.addTransaction(newAddress,chainId.value,{
      hash: "0x5d15649e25d8f3e2c0374946078539d200710afc977cdfc6a977bd23f20fa8e5",
      description: "Transfer token #20 to others",
      confirmations: 21
    });

    store?.addTransaction(newAddress,chainId.value,{
      hash: "0x5d15649e25d8f3e2c0374946078539d200710afc977cdfc6a977bd23f20fa8e4",
      description: "Transfer token #20 to others",
      confirmations: 22
    });

    store?.addTransaction(newAddress,chainId.value,{
      hash: "0x5d15649e25d8f3e2c0374946078539d200710afc977cdfc6a977bd23f20fa8e3",
      description: "Transfer token #20 to others",
      confirmations: 23
    });

    store?.addTransaction(newAddress,chainId.value,{
      hash: "0x5d15649e25d8f3e2c0374946078539d200710afc977cdfc6a977bd23f20fa8e8",
      description: "Transfer token #20 to others",
      confirmations: 25
    });
  });*/

  watch(()=>provider.value,(newProvider)=>{
    if(!newProvider) return;
    store?.createNewPublicClientProvider(newProvider);
    context.value = store;
  });

  watch([ ()=> provider, ()=> chainId.value ],([_,newChainId])=>{
    if(!newChainId) return; 
    if(!address.value) return;
    store?.waitForPendingTransactions(address.value,newChainId);
  });
  context.value = store;
}

export function createShowRecentTransactionContext(
  option: RainbowKitPluginOptions){
  const context = ref<boolean>(option.showRecentTransactions ?? false);
  return context;
}

export function createTransactionStoreContext():Context<TransactionStoreContext>{
  const context = ref<TransactionStoreContext>(null);
  return context;
}

export function useRecentTransactions() : Ref<Array<Transaction>>{
  const store = useTransactionStoreContext();
  const chainId = useChainId();
  const { address } = useRainbowKitAccountContext();

  const transactions = ref<Array<Transaction>>(store && store?.value && chainId?.value && address?.value ? store.value.getTransactionsByAddressAndChainId(address.value,chainId.value) : []);
  store.value?.subscribe(()=>{
    if(!store.value) return;
    if(!address.value) return;
    transactions.value = store.value.getTransactionsByAddressAndChainId(address.value,chainId.value)
  });
  
  watch([ ()=>address.value, ()=>chainId.value ],([ newAddress , newChainId ])=>{
      if(!newAddress || !newChainId) return;
      if(!store.value) return;
      store.value.subscribe(()=>{
        if(!store.value) return;
        transactions.value = store.value.getTransactionsByAddressAndChainId(newAddress,newChainId);
      });
  });
  return transactions;  
}

export function useTransactionStoreContext(){
  const context = inject(TransactionStoreContextKey);
  if(!context){
    throw Error(`Could not find injected '${String(TransactionStoreContextKey)}' instance.`);
  }
  return context;
}

export function useShowRecentTransactionContext(){
  const context = inject(ShowRecentTransactionsContextKey);
  if(!context){
    throw Error(`Could not find injected '${String(ShowRecentTransactionsContextKey)}' instance.`);
  }
  return context;
}

export function useClearRecentTransactions():()=>void{
  const store = useTransactionStoreContext();
  const chainId = useChainId();
  const { address } = useRainbowKitAccountContext();

  return ()=>{
    if (!address.value || !chainId.value) {
      throw new Error('No address or chain ID found');
    }
    if(!store.value){
      return;
    }
    store.value.clearTransactions(address.value, chainId.value);
  };
}

export function useAddRecentTransasction(transaction: NewTransaction):()=>void{
  const store = useTransactionStoreContext();
  const chainId = useChainId();
  const { address } = useRainbowKitAccountContext();

  return ()=>{
    if (!address.value || !chainId.value) {
      throw new Error('No address or chain ID found');
    }

    if(!store.value){
      return;
    }

    store.value.addTransaction(address.value, chainId.value, transaction);
  }
}
