import { useLocale,useShowRecentTransactionContext } from "@/composables";
import { abbreviateETHBalance, isMobile } from "@/utils";
import { GetEnsAvatarReturnType, GetEnsNameReturnType, Address } from "@/types";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { Avatar } from "@/components/AccountModal/Avatar";
import { ProfileDetailAction } from "@/components/AccountModal/ProfileDetailAction";
import { Transactions } from "@/components/AccountModal/Transactions";
import { CopiedIcon } from "@/components/Icons/CopiedIcon";
import { CopyIcon } from "@/components/Icons/CopyIcon";
import { DisconnectIcon } from "@/components/Icons/DisconnectIcon"
import { CloseIcon } from "@/components/Icons/CloseIcon"
import { useBalance } from "@wagmi/vue";
import { formatUnits } from "viem";
import { defineComponent, h, PropType, ref, SlotsType, watch } from "vue";

const createProfileDetailProps = {
    address: String as PropType<Address>,
    ensAvatar: String as PropType<GetEnsAvatarReturnType>,
    ensName: String as PropType<GetEnsNameReturnType>
} as const;

export const ProfileDetail = defineComponent({
    props: createProfileDetailProps,
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
    emits: [ 'closed', 'disconnect' ],
    setup(props,{ slots, emit }) {
        const titleId = "rk_profile_title";
        const copiedAddress = ref<boolean>(false);
        const abbreviatedBalance = ref<string | undefined>();
        const symbol = ref<string | undefined>();
        const showRecentTransaction = useShowRecentTransactionContext();
        const { data: balance } = useBalance({ address: props.address });
    
        const { t } = useLocale();
        watch(() => balance.value, (newBalance) => {
            if (!newBalance) return;
            const currentBalance = formatUnits(newBalance.value, newBalance.decimals);
            abbreviatedBalance.value = abbreviateETHBalance(parseFloat(currentBalance));
            symbol.value = newBalance.symbol;
        })
    
        const copyAddressAction = () => {
            if (!props.address) return;
            navigator.clipboard.writeText(props.address);
            copiedAddress.value = true;
        }
    
        watch(() => copiedAddress.value, (newCopiedAddress, _, onCleanup) => {
            if (!newCopiedAddress) return;
            const timer = setTimeout(() => {
                copiedAddress.value = false;
            }, 1500);
            onCleanup(() => clearTimeout(timer));
        });

        return ()=>{
            if(slots.default){
                return h(slots.default({ 
                    onDisconnect: ()=> emit('disconnect'), 
                    onClosed: ()=>emit('closed'),  
                    ensName: props.ensName, 
                    ensAvatar: props.ensAvatar, 
                    address: props.address, 
                    formattedBalance: `${abbreviatedBalance.value}${symbol.value}`,
                    symbol: symbol.value,
                    abbreviatedBalance: abbreviatedBalance.value,
                    balance: balance.value?.value
                }));
            }

            return h(Container,{
                display: 'flex',
                flexDirection: 'column'
            },()=>[
                h(Container,{
                    background: 'profileForeground',
                    padding: '16'
                },()=>[
                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile? '16': '12',
                        justifyContent: 'center',
                        margin: '8',
                        style: { textAlign: 'center' }
                    },()=>[
                        h(Container,{
                           style: {
                                position: 'absolute',
                                right: '16px',
                                top: '16px',
                                willChange: 'transform'
                           } 
                        },()=>h(CloseIcon,{ onClick: ()=>emit('closed') })),

                        ...props.address ? [
                            h(Container,{
                                marginTop: isMobile? '24': '0',                      
                            },()=>h(Avatar,{
                                size: isMobile ? 82 : 74,
                                address: props.address!,
                                imageUrl: props.ensAvatar
                            }))
                        ] : [],

                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '4': '0',
                            textAlign: 'center'
                        },()=>[
                            h(Container,{
                                textAlign: 'center'
                            },()=>h(Text,{
                                tag: 'h1',
                                color: 'modalText',
                                id: titleId,
                                size: isMobile? '20': '18',
                                weight: 'heavy'
                            },()=> props.ensName)),

                            ...balance.value ? [
                                h(Container,{
                                    textAlign: 'center'
                                },()=>h(Text,{
                                    tag: 'h1',
                                    color: 'modalTextSecondary',
                                    id: titleId,
                                    size: isMobile? '16': '14',
                                    weight: 'semibold'
                                },()=> `${abbreviatedBalance.value}${symbol.value}`))
                            ] : []
                        ]),
                    ]),

                    h(Container,{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8',
                        margin: '12',
                        marginTop: '16'
                    },()=>[
                        h(ProfileDetailAction,{
                            onAction: copyAddressAction,
                            icon: copiedAddress.value ? CopiedIcon : CopyIcon,
                            label: copiedAddress.value ? t('profile.copy_address.copied') : t('profile.copy_address.label')
                        }),
                        h(ProfileDetailAction,{
                            onAction: ()=>emit('disconnect'),
                            icon: DisconnectIcon,
                            label: t('profile.disconnect.label')
                        })
                    ]),
                ]),
                ...showRecentTransaction ? [
                    h(Container,{
                        background: 'generalBorder',
                        height: '1',
                        marginTop: '-1'
                    }),

                    ...props.address ? [
                        h(Container, ()=>h(Transactions,{
                            address: props.address!,
                        }))
                    ] : [],
                ] : []
            ]);
        }
    },
});