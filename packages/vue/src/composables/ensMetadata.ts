import { useRainbowKitAccountContext } from "@/composables/account";
import { GetEnsAvatarReturnType, GetEnsNameReturnType, } from "@/types";
import { formatAddress } from "@/utils";
import { normalize } from "viem/ens";
import { useConfig } from "@wagmi/vue";
import { getEnsAvatar, getEnsName } from "@wagmi/vue/actions";
import { watch,ref } from "vue";

export function useEnsMetadata(){
    const config = useConfig();
    const { chainId, address } = useRainbowKitAccountContext();
    const name = ref<GetEnsNameReturnType | undefined>(address.value ? formatAddress(address.value) : undefined);
    const avatar = ref<GetEnsAvatarReturnType | undefined>();
    watch([ address, chainId ], ([ address, chainId])=>{
        try{
            if(!address) return;
            getEnsName(config,{ address,chainId }).then((ensName)=>{
                if(!ensName){
                    name.value = formatAddress(address);
                    return;
                }

                getEnsAvatar(config, { name: normalize(ensName), chainId}).then((ensAvatar)=>{
                    avatar.value = ensAvatar;
                })
            });
        }catch(ex){
            if(!address) return;
            name.value = formatAddress(address);
        }
    });

    return { name, avatar };
}