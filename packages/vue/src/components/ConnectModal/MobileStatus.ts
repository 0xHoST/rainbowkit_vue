import { useWalletButtonContext, useLocale } from "@/composables";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { CloseButton } from "@/components/Buttons/CloseButton";
import { MobileWalletButton } from "@/components/Buttons/MobileWalletButton";
import { computed, defineComponent, h, PropType, SlotsType } from "vue";

export const createMobileStatusProps = {
    onClosed:{
        type: Function as PropType<()=>void>,
        required: true
    }
} as const;

export const MobileStatus = defineComponent({
    props: createMobileStatusProps,
    slots: Object as SlotsType<{
        default: {
            connectorName: string,
            onClosed: (()=> void)
        }
    }>,
    setup(props, { slots }) {
        const { connector } = useWalletButtonContext()
        const { t } = useLocale()
        const connectorName = computed(() => connector.value?.name || '')

        return ()=>{
            if(slots.default){
                return slots.default({
                    connectorName: connectorName.value,
                    onClosed: props.onClosed
                });
            }

            return h(Container,
                ()=>h(Container,{
                    display: 'flex',
                    paddingBottom: '32',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'profileForeground',
                    flexDirection: 'column'
                },()=>[
                    h(Container,{
                        width: 'full',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '18',
                        marginRight: '24'
                    },()=>h(CloseButton,{ onClick: props.onClosed })),

                    h(Container,{
                        width: '60'
                    },()=>[
                        ...connector.value !== undefined ? [
                            h(MobileWalletButton,{
                                connecting: true,
                                onClosed: props.onClosed,
                                wallet: connector.value!
                            })
                        ] : [],
                    ]),

                    h(Container,{
                        marginTop: '20'
                    },()=>h(Text,{
                        textAlign: 'center',
                        color: 'modalText',
                        size: '18',
                        weight: 'semibold'
                    },()=> t('connect.status.connect_mobile',{ wallet: connectorName.value }) )),
                    
                    h(Container,{
                        maxWidth: 'full',
                        marginTop: '8'
                    },()=>h(Text,{
                        textAlign: 'center',
                        color: 'modalText',
                        size: '16',
                        weight: 'medium'
                    },()=> t('connect.status.confirm_mobile', { wallet: connectorName.value })))
                ]
            ))
        }
    },
});