import { useAppContext, useEnsMetadata,useRainbowKitAccountContext } from "@/composables";
import { Dialog } from "@/components/Common/Dialog";
import { ProfileDetail } from "@/components/AccountModal/ProfileDetail";
import { Address, GetEnsAvatarReturnType, GetEnsNameReturnType } from "@/types";
import { defineComponent, h, ref, SlotsType } from "vue";
import { useConfig, useConnections, useDisconnect } from "@wagmi/vue";
import { getConnections } from "@wagmi/vue/actions";

export const createAccontModalProps = {
    open: {
        type: Boolean,
        required: true,
    },
} as const;

export const AccountModal = defineComponent({
    props: createAccontModalProps,
    slots: Object as SlotsType<{
        default: {
            ensName: GetEnsNameReturnType | undefined,
            ensAvatar: GetEnsAvatarReturnType | undefined,
            onDisconnect: (()=> void),
            address: Address | undefined,
            onClosed: (()=> void),
            formattedBalance: string | undefined,
            symbol: string | undefined,
            abbreviatedBalance: string | undefined,
            balance: BigInt | undefined
        }
    }>,
    emits: [ 'closed' ],
    setup(props,{ slots, emit }) {
        const titleId = 'rk_account_modal_title'
        const { address } = useRainbowKitAccountContext();
        const { name, avatar } = useEnsMetadata();
        const { disconnect  } = useDisconnect();
        const { accountModalTeleportTarget:target } = useAppContext();
        const config = useConfig();
        const disconnectAll = ()=>{
            const connections = getConnections(config);
            connections.map((connection)=> disconnect({ connector: connection.connector }))
        }

        return ()=>{
            return h(Dialog,{
                onClosed: () => emit('closed'),
                open: props.open,
                identifier: titleId,
                padding: '0',
                bottomSheetOnMobile: true,
                target: target?.value ?? "body"
            },()=>h(ProfileDetail,{
                onDisconnect: disconnectAll,
                ensName: name.value,
                ensAvatar: avatar.value,
                address: address.value,
                onClosed: ()=>emit('closed')
            },{
                default: slots.default ? (props: { 
                    ensName: GetEnsNameReturnType | undefined; 
                    ensAvatar: GetEnsAvatarReturnType | undefined; 
                    onDisconnect: () => void; 
                    address: `0x${string}` | undefined; 
                    onClosed: () => void; 
                    formattedBalance: string | undefined; 
                    symbol: string | undefined; 
                    abbreviatedBalance: string | undefined; 
                    balance: BigInt | undefined; 
                }) => slots.default(props) : undefined
            }))
        }
    },
});