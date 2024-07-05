import { useConnectionStatus } from "@/composables/connection";
import { useAuthenticationConfigContext } from "@/composables/authentication";
import { useAccount } from '@wagmi/vue'
import { ref, watch } from 'vue'

export function useRainbowKitAccountContext(){  
  const { connector, isConnected, isConnecting, chainId, isDisconnected, isReconnecting, chain, address, addresses,status } = useAccount();
  const { status: authenticationStatus, adapter } = useAuthenticationConfigContext();
  const connectorUID = ref<string>()
  const connectionStatus = useConnectionStatus();
  
  watch(
    [ ()=> connector.value?.id, ()=> connector.value?.emitter, ()=>authenticationStatus?.value, ()=> connectorUID.value ],
    async ([newConnectoruID, newEmitter, newStatus, newConnectorUID]) => {
      if(!newEmitter) return;

      if (typeof newEmitter.on === 'function' && newStatus === 'authenticated') {
        connectorUID.value = newConnectoruID;
        if(newConnectoruID !== newConnectorUID){
          connectorUID.value = undefined
          await adapter?.value?.signOut();
        }
        
        newEmitter.on('change', async (data) => {
          if (data.accounts) {
            connectorUID.value = undefined
            await adapter?.value?.signOut()
          }
        })
      }
    }
  );

  return {
    connector,
    address,
    addresses,
    isConnected,
    isConnecting,
    chainId,
    isDisconnected,
    isReconnecting,
    chain,
    connectionStatus,
    status,
    connectorUID,
  }
}
