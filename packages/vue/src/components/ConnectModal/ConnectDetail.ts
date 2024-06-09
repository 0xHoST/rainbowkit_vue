import { useLocale, useWindow } from "@/composables";
import { ConnectDetailSecondaryAction, ContainerProps, WalletConnector, WalletStep } from "@/types";
import { isSafari } from "@/utils";
import { Container } from "@/components/Common/Container";
import { QrCode } from "@/components/Common/QrCode";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Text } from "@/components/Common/Text";
import { SpinnerIcon } from "@/components/Icons/SpinnerIcon";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { computed, defineComponent, ExtractPropTypes, h, PropType } from "vue";

export const createConnectDetailProps = {
    changeWalletStep: {
        type: Function as PropType<(step: WalletStep)=>void>,
        required: true
    },
    reconnect: {
        type: Function as PropType<(wallet: WalletConnector)=>void>,
        required: true
    },
    onClosed: {
        type: Function as PropType<()=>void>,
        required: true
    },
    connectionError: {
        type: Boolean,
        required: true,
        default: false,
    },
    qrCodeUri: {
        type: String,
    },
    compactModeEnabled: {
        type: Boolean,
        required: true,
        default: false
    },
    wallet: {
        type: Object as PropType<WalletConnector>
    }
} as const;

export type ConnectDetailProps = ExtractPropTypes<typeof createConnectDetailProps>;

export const ConnectDetail = defineComponent({
    props:createConnectDetailProps,
    setup(props) {
        const logoSize: ContainerProps<'div'>['height'] = '44';
        const { t } = useLocale()
        const windownSize = useWindow()

        const smallWindow = computed(() => windownSize.value !== undefined && windownSize.value?.width < 768)
        const isDesktopDeepLinkAvailable = computed(() => !!props.wallet?.getDesktopUri)
        const hasExtension = computed(() => !!props.wallet?.extensionDownloadUrl)
        const hasQrCodeAndExtension = computed(() => props.wallet?.downloadUrls?.qrCode !== undefined && hasExtension.value)
        const hasQrCodeAndDesktop = computed(() => props.wallet?.downloadUrls?.qrCode !== undefined && !!props.wallet.desktopDownloadUrl)
        const hasQrCode = computed(() => props.wallet?.qrCode !== undefined && props.qrCodeUri !== undefined)
        const secondaryAction = computed<ConnectDetailSecondaryAction | undefined>(() => {
            if (props.wallet?.showWalletConnectModal) {
              const onClick = () => {
                props.onClosed()
                props.wallet?.showWalletConnectModal?.()
              }
              const description = !props.compactModeEnabled
                ? t('connect.walletconnect.description.full')
                : t('connect.walletconnect.description.compact')
              const label = t('connect.walletconnect.open.label')
              return { label, description, onClick }
            }
        
            if (hasQrCode.value) {
              const description = t('connect.secondary_action.get.description', { wallet: props.wallet?.name })
              const onClick = () =>{
                props.changeWalletStep(
                  hasQrCodeAndExtension.value || hasQrCodeAndDesktop.value
                    ? WalletStep.DownloadOptions
                    : WalletStep.Download
                )
             }
              const label = t('connect.secondary_action.get.label')
              return { label, onClick, description }
            }
            return
        })

        const onDesktopUri = async () => {
            const uri = await props.wallet?.getDesktopUri?.()
            window.open(uri, isSafari ? '_blank' : '_self')
        }
        const retryOnClick = async () => {
            if (isDesktopDeepLinkAvailable.value) onDesktopUri()
            if (!props.wallet) return;
            props.reconnect(props.wallet)
        }
               
        return ()=>{
            
            return h(Container,{
                display: 'flex',
                flexDirection: 'column',
                height: 'full',
                width: 'full'
            },()=>[
                ...hasQrCode.value ? [
                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        height: 'full',
                        justifyContent: 'center'
                    },()=>[
                        h(QrCode,{
                            logoBackground: props.wallet?.iconBackground,
                            logoSize: props.compactModeEnabled ? 60:72,
                            logo: props.wallet?.iconUrl,
                            size: props.compactModeEnabled? 318 : smallWindow.value ? Math.max(280, Math.min((windownSize?.value?.width ?? 0) - 308, 382)) : 382,
                            uri: props.qrCodeUri
                        })
                    ])
                ] : [

                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        style: { flexGrow: 1 }
                    },()=>h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8'
                    },()=>[
                        h(Container,{
                            borderRadius: '10',
                            height: logoSize,
                            overflow: 'hidden'
                        },()=>h(AsyncImage,{
                            useAsImage: props.wallet?.isRainbowKitConnector,
                            width: logoSize,
                            height: logoSize,
                            src: props.wallet?.iconUrl
                        })),

                        h(Container,{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4',
                            paddingX: '32',
                            style: { textAlign: 'center' }
                        },()=>[
                            ...props.wallet?.ready ? [
                                h(Text,{
                                    color: 'modalText',
                                    size: '18',
                                    weight: 'bold'
                                },()=> t('connect.status.opening', { wallet: props.wallet?.name }))
                            ] : hasExtension.value ? [
                                h(Text,{
                                    color: 'modalText',
                                    size: '18',
                                    weight: 'bold'
                                },()=> t('connect.status.not_installed', { wallet: props.wallet?.name }))
                            ] : [
                                h(Text,{
                                    color: 'modalText',
                                    size: '18',
                                    weight: 'bold'
                                },()=> t('connect.status.not_available', { wallet: props.wallet?.name }))
                            ],
                            
                            ...!props.wallet?.ready && hasExtension.value ? [
                                h(Container,{
                                    paddingTop: '20',
                                },()=>h(ActionButton,{
                                    href: props.wallet?.extensionDownloadUrl,
                                    label: t('connect.secondary_action.install.label'),
                                    type: 'secondary'
                                }))
                            ] : [],

                            ...props.wallet?.ready && !hasQrCode.value ? [
                                h(Container,{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                },()=>h(Text,{
                                    size: '14',
                                    textAlign: 'center',
                                    weight:'medium',
                                    color: 'modalTextSecondary'
                                },()=> t('connect.status.confirm')))
                            ] : [],

                            h(Container,{
                                alignItems: 'center',
                                color: 'modalText',
                                display: 'flex',
                                flexDirection: 'row',
                                height: '32',
                                marginTop: '8'
                            }, props.connectionError ?()=> [
                                h(ActionButton,{
                                    label: t('connect.secondary_action.retry.label'),
                                    onClick: retryOnClick,
                                })
                            ] : ()=>[
                                h(Container,{
                                    color: 'modalTextSecondary'
                                },()=>h(SpinnerIcon))
                            ])
                        ])


                    ])),

                    h(Container,{
                        alignItems: 'center',
                        borderRadius: '10',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8',
                        height: '28',
                        justifyContent: 'space-between',
                        marginTop: '12'
                    },()=>[
                        ...props.wallet?.ready && secondaryAction.value ? [
                            h(Text,{
                                color: 'modalTextSecondary',
                                size: '14',
                                weight: 'medium'
                            },()=> secondaryAction.value?.description),
                            h(ActionButton,{
                                label: secondaryAction.value.label,
                                onClick: secondaryAction.value.onClick,
                                type: 'secondary'
                            })
                        ] : [],
                    ])
                ],

                h(Container,{
                    alignItems: 'center',
                    borderRadius: '10',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8',
                    height: '28',
                    justifyContent: 'space-between',
                    marginTop: '12'
                },()=>[
                    ...secondaryAction.value ? [
                        h(Text,{
                            color: 'modalTextSecondary',
                            size: '14',
                            weight: 'medium',
                        },()=>secondaryAction.value?.description),
                        h(ActionButton,{
                            label: secondaryAction.value?.label,
                            onAction: secondaryAction.value?.onClick,
                            type: 'secondary'
                        })
                    ] : []
                ])
            ])
        }
    },
});