import { AsyncImageSrc, ContainerProps } from "@/types";
import { Container } from "@/components/Common/Container";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Text } from "@/components/Common/Text";
import { MenuButton } from "@/components/Buttons/MenuButton";
import { useLocale , useRainbowKitChainContext } from "@/composables";
import { isMobile } from "@/utils";
import { useSwitchChain } from "@wagmi/vue";
import { computed, defineComponent, h, PropType } from "vue";

export const createChainBoxProps = {
    chainId: {
        type: Number as PropType<number>,
        required: true
    },
    currentChainId: {
        type: [Number,undefined] as PropType<number|undefined>,
        required: true
    },
    switchChain: {
        type: Function as PropType<ReturnType<typeof useSwitchChain>['switchChain']>,
        required: true
    },
    chainIconSize: {
        type: String as PropType<ContainerProps<'div'>['height']>,
        required: true
    },
    isLoading: {
        type: Boolean as PropType<boolean>,
        required: true,
        default: false
    },
    iconBackground: {
        type: [String, undefined ] as PropType<string|undefined>,
        required: true
    },
    isConnected: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    src: [String, Object] as PropType<string | AsyncImageSrc>,
    idx: Number as PropType<number>,
    name: String as PropType<string>
} as const;

export const ChainBox = defineComponent({
    props: createChainBoxProps,
    setup(props) {
        const { t } = useLocale()
        const { rainbowKitChains: chains } = useRainbowKitChainContext()
        const isCurrentChain = computed(() => props.currentChainId === props.chainId)
        const executeSwitchChain = () => {
            if (isCurrentChain.value) return
            props.switchChain({ chainId: props.chainId })
        }

        return () => {
            return h(()=>[
                h(MenuButton, {
                    currentlySelected: isCurrentChain.value,
                    onAction: executeSwitchChain
                },()=>h(Container,{
                    fontFamily: 'body',
                    fontSize: '16',
                    fontWeight: 'bold'
                },()=>h(Container,{
                    alignItems: 'center',
                    display:'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                },()=>[
                    h(Container,{
                        alignItems: 'center',
                        display:'flex',
                        flexDirection: 'row',
                        gap: '4',
                        height: props.chainIconSize
                    },()=>[
                        ...props.src ? [
                            h(Container,{
                                height: 'full',
                                marginRight: '8',
                            },()=>h(AsyncImage,{
                                src: props.src,
                                height: props.chainIconSize,
                                width: props.chainIconSize,
                                alt: props.name,
                                background: props.iconBackground,
                                borderRadius: 'full',
                            },))
                        ] :[],

                        h(Container,()=> props.name)
                    ]),

                    ...isCurrentChain.value && props.isConnected ? [
                        h(Container,{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            marginRight: '6'
                        },()=>[
                            h(Text,{
                                color: 'accentColorForeground',
                                size: '14',
                                weight: 'medium'
                            },()=> t('chains.connected')),
                            h(Container,{
                                background: 'connectionIndicator',
                                borderColor: 'selectedOptionBorder',
                                borderRadius: 'full',
                                borderWidth: '1',
                                height: '8',
                                width: '8',
                                marginLeft: '8'
                            })
                        ]),
                    ] : [],

                    ...props.isLoading ? [
                        h(Container,{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            marginRight: '6'
                        },()=>[
                            h(Text,{
                                color: 'modalText',
                                size: '14',
                                weight: 'medium'
                            },()=> t('chains.confirm')),

                            h(Container,{
                                background: 'standby',
                                borderRadius: 'full',
                                height: '8',
                                width: '8',
                                marginLeft: '8'
                            })
                        ])
                    ] : [],
                ]))),

                ...(chains?.value !== undefined && isMobile && (props.idx ?? 0 < chains.value.length - 1)) ? [
                    h(Container,{
                        background: 'generalBorderDim',
                        height: '1',
                        marginX: '8'
                    })
                ] : [],
            ]);
        }
    },
});