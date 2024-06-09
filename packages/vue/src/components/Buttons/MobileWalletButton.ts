import { createElementCool, useCoolModeContext, useLocale } from '@/composables'
import { WalletConnector } from '@/types'
import { Container } from "@/components/Common/Container";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Text } from "@/components/Common/Text";
import { LoadingSpinnerIcon } from "@/components/Icons/LoadingSpinnerIcon";
import { setWalletConnectDeepLink } from '@/utils'
import { ComponentPublicInstance, DeepReadonly, defineComponent, h, onMounted, onUnmounted, PropType, ref, watch, withModifiers } from 'vue'

export const createMobileWalletButtonProps = {
    wallet: {
        type: Object as PropType<WalletConnector>,
        required: true
    },
    connecting: {
        type: Boolean,
        default: false
    }
} as const

export const MobileWalletButton = defineComponent({
    props: createMobileWalletButtonProps,
    emits: [ 'closed' ],
    setup(props, { emit }) {
        const enableCoolMode = useCoolModeContext()

        const imageUrl = ref<string>(props.wallet.iconUrl as string)
        const initialized = ref<boolean>(false)
        const CoolModeContainer = ref<ComponentPublicInstance<typeof Container & { element: HTMLElement }>>()
        const { t } = useLocale()

        let removalElementCodeFn: () => void = () => { }
        const onConnect = async () => {
            const onMobileUri = async () => {
                const mobileUri = await props.wallet.getMobileUri?.()
                if (!mobileUri) return

                setWalletConnectDeepLink({ mobileUri, name: props.wallet.name })
                if (mobileUri.startsWith('http')) {
                    const link = document.createElement('a')
                    link.href = mobileUri
                    link.target = '_blank'
                    link.rel = 'noreferrer noopener'
                    link.click()
                    return
                }

                window.location.href = mobileUri
            }

            if (props.wallet.id !== 'walletConnect') await onMobileUri()
            if (props.wallet.showWalletConnectModal) {
                props.wallet.showWalletConnectModal()
                emit('closed');
                return
            }
            await props.wallet.connect()
        }

        watch(
            () => props.connecting,
            async (newConnecting, _) => {
                if (!newConnecting || initialized.value) return
                await onConnect()
                initialized.value = true
            }
        )

        onMounted(() => {
            if (enableCoolMode.value && CoolModeContainer.value?.element) {
                removalElementCodeFn = createElementCool(CoolModeContainer.value.element, imageUrl.value);
            }
        })

        onUnmounted(() => {
            removalElementCodeFn();
        })

        return () => {
            return h(Container, {
                as: 'button',
                color: props.wallet.ready ? 'modalText' : 'modalTextSecondary',
                disabled: !props.wallet.ready,
                key: props.wallet.id,
                fontFamily: 'body',
                type: 'button',
                width: 'full',
                ref: 'CoolModeContainer',
                style: { overflow: 'visible', textAlign: 'center' },
                onClick: async () => await onConnect(),
            }, ()=>h(Container, {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },()=>[
                h(Container, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '8',
                    paddingTop: '0',
                    position: 'relative'
                },()=>[
                    ...props.connecting ? [
                        h(LoadingSpinnerIcon, { wallet: props.wallet })
                    ] : [],

                    h(AsyncImage, {
                        background: props.wallet.iconBackground,
                        src: props.wallet.iconUrl,
                        borderRadius: '13',
                        height: '60',
                        width: '60',
                    }),
                ]),

                ...!props.connecting ? [
                    h(Container, {
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center'
                    }, ()=>[
                        h(Text, {
                            tag: 'h2',
                            size: '13',
                            weight: 'medium',
                            color: props.wallet.ready ? 'modalText' : 'modalTextSecondary',
                        },()=> h(Container, {
                            as: 'span',
                            position: 'relative',
                        },()=>`${props.wallet.shortName ?? props.wallet.name} ${props.wallet.ready ? '' : ' (unsupported)'}`)),

                        ...props.wallet.recent ? [
                            h(Text, {
                                color: 'accentColor',
                                size: '12',
                                weight: 'medium',
                            },()=> t('connect.recent'))
                        ] : [],     
                    ])
                ] : [],
            ]))
        }
    },
})