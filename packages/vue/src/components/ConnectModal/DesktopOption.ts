import { createDisclaimerComponent, WalletConnector, WalletStep, WalletSummary } from "@/types";
import { useAppContext, useModalSizeContext, useLocale, useWalletButtonContext, useWalletConectors, useWindow } from "@/composables"
import { isSafari, addLatestWalletId } from "@/utils"
import { ConnectModalIntro, createConnectModalIntroComponent } from "@/components/ConnectModal/ConnectModalIntro";
import { ConnectDetail } from "@/components/ConnectModal/ConnectDetail";
import { DownloadDetail } from "@/components/ConnectModal/DownloadDetail";
import { DownloadOptionsDetail } from "@/components/ConnectModal/DownloadOptionsDetail";
import { InstructionDesktopDetail } from "@/components/ConnectModal/InstructionDesktopDetail";
import { InstructionMobileDetail  } from "@/components/ConnectModal/InstructionMobileDetail";
import { InstructionExtensionDetail } from "@/components/ConnectModal/InstructionExtensionDetail";
import { ModalSelection } from "@/components/ConnectModal/ModalSelection";
import { GetConnectDetail } from "@/components/ConnectModal/GetConnectDetail";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { BackIcon } from "@/components/Icons/BackIcon";
import { InfoButton } from "@/components/Buttons/InfoButton";
import { CloseButton } from "@/components/Buttons/CloseButton";
import { scrollClassName, touchable, sidebarCompactMode, sidebar } from '@/css'
import { Component, ComponentPublicInstance, computed, DefineComponent, defineComponent, h, onBeforeMount, PropType, ref, SlotsType, watch } from "vue";
import { DisclaimerLink } from "../Common/DisclaimerLink";
import { DisclaimerText } from "../Common/DisclaimerText";

export const DesktopOptions = defineComponent({
    props: {
        onClosed: {
            type: Function as PropType<(() => void)>
        }
    } as const,
    slots: Object as SlotsType<{
        default: {
            groupWallets: Record<string, Array<WalletConnector>>,
            wallets: Array<WalletConnector>,
            disclaimer: Component | undefined,
            fragment: WalletSummary,
            changeWalletStep: ((newWalletStep: WalletStep, isBack: boolean) => void),
            selectWallet: ((connector: WalletConnector) => void),
            qrCodeUri: string | undefined,
            compactModalEnabled: boolean,
            hasQrCode: boolean,
            hasExtension: boolean,
            hasExtensionAndMobile: boolean
        }
    }>,
    setup(props, { slots }) {
        const identifier = 'rk_connect_title'
        const selectedOptionId = ref<string | undefined>()
        const connectionError = ref<boolean>(false)
       
        const qrCodeUri = ref<string>()
        const supportedI18nGroupNames = ['Recommended', 'Other', 'Popular', 'More', 'Others', 'Installed']
        

        const { disclaimer: DisclaimerFn, connectModalIntro: ConnectModalIntroComponent } = useAppContext();
        const Disclaimer = DisclaimerFn?.value !== undefined ? createDisclaimerComponent(DisclaimerFn.value) : undefined;
        const { compactModeEnabled } = useModalSizeContext()
        const { t } = useLocale()
        const { connector } = useWalletButtonContext()
     
        const initialWalletStep = ref<WalletStep>(WalletStep.None)
        const walletStep = ref<WalletStep>(WalletStep.None)
        const selectedWallet = ref<WalletConnector | undefined>(connector.value != null ? connector.value :  undefined);
        const initialized = ref<boolean>(false)
        const mergeEIP6963WithRkConnectors = computed(() => !(connector.value))
        const wallets = useWalletConectors(mergeEIP6963WithRkConnectors.value)

        const filteredWallets = computed(() =>
            wallets.value
                .filter((wallet) => wallet.ready || !!wallet.extensionDownloadUrl)
                .sort((a, b) => a.groupIndex - b.groupIndex)
        )
        const groupWallets = computed(() => filteredWallets.value.groupBy((wallet) => wallet.groupName))
        const hasQrCode = computed<boolean>(
            () => !!selectedWallet.value?.qrCode && qrCodeUri.value !== null
        )
        const hasExtension = computed<boolean>(() => !!selectedWallet.value?.extensionDownloadUrl)
        const hasExtensionAndMobile = computed<boolean>(
            () => !!(hasExtension.value && selectedWallet.value?.mobileDownloadUrl)
        )
        const summary = computed<WalletSummary>(() => {
            return {
                [WalletStep.Connect]: {
                    headerLabel:
                        hasQrCode.value && selectedWallet.value?.name === 'WalletConnect'
                            ? t('connect_scan.fallback_title')
                            : t('connect_scan.title', { wallet: selectedWallet.value?.name }),
                    headerBackButtonCallback: compactModeEnabled.value
                        ? !connector.value
                            ? clearSelectedWallet
                            : () => { }
                        : () => { },
                    headerBackButtonLink: compactModeEnabled.value
                        ? !connector.value
                            ? WalletStep.None
                            : undefined
                        : undefined
                },
                [WalletStep.Download]: {
                    headerLabel: selectedWallet.value
                        ? t('get_mobile.title', { wallet: selectedWallet.value?.name })
                        : undefined,
                    headerBackButtonLink: hasExtensionAndMobile.value
                        ? WalletStep.DownloadOptions
                        : initialWalletStep.value
                },
                [WalletStep.DownloadOptions]: {
                    headerLabel: selectedWallet.value
                        ? t('get_options.short_title', { wallet: selectedWallet.value?.name }) : undefined,
                    headerBackButtonLink:
                        connector.value != null
                            ? WalletStep.Connect
                            : compactModeEnabled.value
                                ? WalletStep.None
                                : undefined
                },
                [WalletStep.Get]: {
                    headerLabel: t('get.title'),
                    headerBackButtonLink: compactModeEnabled.value ? WalletStep.LearnCompact : WalletStep.None
                },
                [WalletStep.InstructionsDesktop]: {
                    headerBackButtonLink: WalletStep.DownloadOptions,
                    headerLabel: selectedWallet.value
                        ? t('get_options.title', {
                            wallet: compactModeEnabled.value
                                ? selectedWallet.value?.shortName || selectedWallet.value?.name
                                : selectedWallet.value.name
                        }) : undefined
                },
                [WalletStep.InstructionsExtension]: {
                    headerBackButtonLink: WalletStep.DownloadOptions,
                    headerLabel: selectedWallet.value
                        ? t('get_options.title', {
                            wallet: compactModeEnabled.value
                                ? selectedWallet.value?.shortName || selectedWallet.value?.name
                                : selectedWallet.value.name
                        }) : undefined
                },
                [WalletStep.InstructionsMobile]: {
                    headerBackButtonLink: WalletStep.Download,
                    headerLabel: selectedWallet.value
                        ? t('get_options.title', {
                            wallet: compactModeEnabled.value
                                ? selectedWallet.value?.shortName || selectedWallet.value?.name
                                : selectedWallet.value.name
                        }) : undefined
                },
                [WalletStep.LearnCompact]: {
                    headerLabel: t('intro.title'),
                    headerBackButtonLink: WalletStep.None
                },
                [WalletStep.None]: {
                    headerLabel: undefined,
                    headerBackButtonLink: undefined
                },
            }[walletStep.value];
        })

        ///functions
        const changeWalletStep = (newWalletStep: WalletStep, isBack = false) => {
            if (isBack && newWalletStep === WalletStep.Get && initialWalletStep.value === WalletStep.Get) {
                clearSelectedWallet()
            } else if (!isBack && newWalletStep === WalletStep.Get) {
                initialWalletStep.value = WalletStep.Get
            } else if (!isBack && newWalletStep === WalletStep.Connect) {
                initialWalletStep.value = WalletStep.Connect
            }

            walletStep.value = newWalletStep
        }
        const clearSelectedWallet = () => {
            selectedWallet.value = undefined
            selectedOptionId.value = undefined
            qrCodeUri.value = undefined
        }
        const connectToWallet = (wallet: WalletConnector) => {
            connectionError.value = false
            if (!wallet.ready) return
            wallet
                .connect()
                .then((_) => {})
                .catch(() => {
                    connectionError.value = true
                })
        }
        const onDesktopUri = async (connector: WalletConnector) => {
            const selectedWallet = wallets.value.find((wallet) => wallet.id === connector.id)
            if (!selectedWallet?.getDesktopUri) return
            setTimeout(async () => {
                const uri = await selectedWallet?.getDesktopUri?.()
                if (uri) window.open(uri, isSafari ? '_blank' : '_self')
            }, 0)
        }
        const onQrCode = async (wallet: WalletConnector) => {
            const choosenWallet = wallets.value.find((w) => wallet.id === w.id)
            const uri = await choosenWallet?.getQrCodeUri?.()
            qrCodeUri.value = uri
            setTimeout(
                () => {
                    selectedWallet.value = choosenWallet
                    changeWalletStep(WalletStep.Connect)
                },
                uri ? 0 : 50
            )
        }
        const selectWallet = (wallet: WalletConnector) => {
            addLatestWalletId(wallet.id)
            if (wallet.ready) {
                onQrCode(wallet)
                onDesktopUri(wallet)
            }

            connectToWallet(wallet)
            selectedOptionId.value = wallet.id

            if (!wallet.ready) {
                selectedWallet.value = wallet
                changeWalletStep(wallet?.extensionDownloadUrl ? WalletStep.DownloadOptions : WalletStep.Connect)
            }
        }
        const getWalletDownload = (id: string) => {
            selectedOptionId.value = id
            const wallet = wallets.value.find((w) => id === w.id)
            const isMobile = wallet?.downloadUrls?.qrCode
            const isDesktop = !!wallet?.desktopDownloadUrl
            const isExtension = !!wallet?.extensionDownloadUrl

            selectedWallet.value = wallet as WalletConnector

            if (isMobile && (isExtension || isDesktop)) {
                changeWalletStep(WalletStep.DownloadOptions)
            } else if (isMobile) {
                changeWalletStep(WalletStep.Download)
            } else if (isDesktop) {
                changeWalletStep(WalletStep.InstructionsDesktop)
            } else {
                changeWalletStep(WalletStep.InstructionsExtension)
            }
        }

        watch([walletStep, selectedWallet], ([_newWalletStep, _newWalletSelected]) => {
            connectionError.value = false
        })

        onBeforeMount(()=>{
            if(connector.value){
                changeWalletStep(WalletStep.Connect)
                selectWallet(connector.value)
                initialized.value = true;
             }
        });

        const DefineConnectModalIntro = ConnectModalIntroComponent?.value !== undefined ? 
            createConnectModalIntroComponent(ConnectModalIntroComponent.value) : undefined;

        return () => {
            const fragment = walletStep.value === WalletStep.Connect ? h(ConnectDetail, {
                changeWalletStep,
                reconnect: connectToWallet,
                onClosed: props.onClosed ?? (() => {}),
                compactModeEnabled: compactModeEnabled.value,
                connectionError: connectionError.value,
                qrCodeUri: qrCodeUri.value,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.Download ?  h(DownloadDetail,{
                changeWalletStep: changeWalletStep,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.DownloadOptions ? h(DownloadOptionsDetail,{
                changeWalletStep: changeWalletStep,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.Get ? h(GetConnectDetail,{
                compactModeEnabled: compactModeEnabled.value,
                getWalletDownload
            }) : walletStep.value === WalletStep.InstructionsDesktop ? h(InstructionDesktopDetail,{
                connectWallet: selectWallet,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.InstructionsExtension ? h(InstructionExtensionDetail,{
                connectWallet: selectWallet,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.InstructionsMobile ? h(InstructionMobileDetail,{
                connectWallet: selectWallet,
                wallet: selectedWallet.value
            }) : walletStep.value === WalletStep.LearnCompact ? DefineConnectModalIntro !== undefined ? 
                h(DefineConnectModalIntro,{
                    compactModalEnabled: compactModeEnabled.value,
                    getWallet: ()=> changeWalletStep(WalletStep.Get)
                }) : 
                h(ConnectModalIntro,{
                    compactModalEnabled: compactModeEnabled.value,
                    getWallet: () => changeWalletStep(WalletStep.Get)
                }) : DefineConnectModalIntro !== undefined ? 
                h(DefineConnectModalIntro,{
                    compactModalEnabled: compactModeEnabled.value,
                    getWallet: ()=> changeWalletStep(WalletStep.Get)
                }) : 
                h(ConnectModalIntro,{
                    compactModalEnabled: compactModeEnabled.value,
                    getWallet: () => changeWalletStep(WalletStep.Get)
                });
            
            if (slots.default) {
                return slots.default({
                    groupWallets: groupWallets.value,
                    wallets: wallets.value,
                    disclaimer: Disclaimer,
                    fragment: summary.value,
                    qrCodeUri: qrCodeUri.value,
                    compactModalEnabled: compactModeEnabled.value,
                    hasQrCode: hasQrCode.value,
                    hasExtension: hasExtension.value,
                    hasExtensionAndMobile: hasExtensionAndMobile.value,
                    changeWalletStep,
                    selectWallet
                });
            }



            return h(Container, {
                display: 'flex',
                flexDirection: 'row',
                style: { maxHeight: compactModeEnabled.value ? '468px' : '504px' }
            }, ()=>[
                ...(compactModeEnabled.value ? walletStep.value === WalletStep.None : true) ? [
                    h(Container, {
                        display: 'flex',
                        flexDirection: 'column',
                        class: compactModeEnabled.value ? sidebarCompactMode : sidebar,
                        marginTop: '16'
                    }, ()=>[
                        h(Container, {
                            display: 'flex',
                            justifyContent: 'space-between'
                        }, ()=>[
                            ...compactModeEnabled.value && Disclaimer !== undefined ? [
                                h(Container, {
                                    marginLeft: '16',
                                    width: '28',
                                }, ()=>h(InfoButton, { onClick: () => changeWalletStep(WalletStep.LearnCompact) }))
                            ] : [],

                            ...compactModeEnabled.value && Disclaimer === undefined ? [
                                h(Container, {
                                    marginLeft: '16',
                                    width: '28'
                                })
                            ] : [],

                            h(Container, {
                                marginLeft: compactModeEnabled.value ? '0' : '6',
                                paddingBottom: '8',
                                paddingTop: '2',
                                paddingX: '18'
                            }, ()=>h(Text, {
                                color: 'modalText',
                                tag: 'h1',
                                size: '18',
                                weight: 'heavy',
                                id: identifier
                            }, () => t('connect.title'))),

                            ...compactModeEnabled.value ? [
                                h(Container, { marginRight: '16' }, ()=>h(CloseButton, { onClick: props.onClosed }))
                            ] : [],
                        ]),

                        h(Container, { class: scrollClassName, paddingBottom: '18' }, ()=>Object.entries(groupWallets.value).map(([groupName, wallets], groupIndex) => {
                            return wallets.length > 0 ? h(Container, {
                                key: groupIndex
                            }, ()=>[
                                ...groupName !== undefined ? [
                                    h(Container, {
                                        marginBottom: '8',
                                        marginTop: '16',
                                        marginX: '6'
                                    }, ()=>h(Text, {
                                        color: groupName === 'Installed' ? 'accentColor' : 'modalTextSecondary',
                                        size: '14',
                                        weight: 'bold'
                                    }, () => supportedI18nGroupNames.includes(groupName) ? t(`connector_group.${groupName.toLowerCase()}`) : groupName))
                                ] : [],

                                h(Container, {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4'
                                }, ()=>wallets.map((wallet, index) => {
                                    return h(ModalSelection, {
                                        as: 'button',
                                        currentlySelected: wallet.id === selectedOptionId.value,
                                        onSelectWallet: ()=>selectWallet(wallet),
                                        name: wallet.name,
                                        iconUrl: wallet.iconUrl,
                                        iconBackground: wallet.iconBackground,
                                        ready: wallet.ready,
                                        recent: wallet.recent,
                                        isRainbowKitConnector: wallet.isRainbowKitConnector,
                                        key: index,
                                    });
                                })),

                            ]) : undefined;
                        })),

                        ...compactModeEnabled.value ? [
                            h(Container, {
                                background: 'generalBorder',
                                height: '1',
                                marginTop: '-1'
                            })
                        ] : [],

                        ...compactModeEnabled.value && Disclaimer !== undefined ? [
                            h(Container, {
                                paddingX: '24',
                                paddingY: '16',
                                textAlign: 'center'
                            }, ()=>h(Disclaimer,{ text: DisclaimerText, link: DisclaimerLink }))
                        ] : [],

                        ...compactModeEnabled.value ? [
                            h(Container, {
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingX: '24',
                                paddingY: '16'
                            }, ()=>[
                                h(Container, { paddingY: '4' }, h(Text, {
                                    color: 'modalTextSecondary',
                                    size: '14',
                                    weight: 'medium'
                                }, () => t('connect.new_to_ethereum.description'))),

                                h(Container, {
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '4',
                                    justifyContent: 'center'
                                }, ()=>h(Container, {
                                    cursor: 'pointer',
                                    paddingY: '4',
                                    transition: 'default',
                                    class: touchable({ active: 'shrink', hover: 'grow' }),
                                    style: { willChange: 'transform' },
                                    onClick: () => changeWalletStep(WalletStep.LearnCompact)
                                }, ()=>h(Text, {
                                    color: 'accentColor',
                                    size: '14',
                                    weight: 'bold'
                                }, () => t('connect.new_to_ethereum.learn_more.label'))))
                            ])
                        ] : []
                    ])
                ] : [],
                ...((compactModeEnabled.value ? walletStep.value !== WalletStep.None : true) && !compactModeEnabled.value) ? [
                    h(Container, {
                        background: 'generalBorder',
                        minWidth: '1',
                        width: '1'
                    })
                ] : [],
                ...(compactModeEnabled.value ? walletStep.value !== WalletStep.None : true) ? [
                    h(Container, {
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '16',
                        style: { flexGrow: 1 }
                    }, ()=>[
                        h(Container, {
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '12'
                        },()=>[
                            h(Container, {
                                width: '28'
                            }, ()=>[
                                ...summary.value.headerBackButtonLink !== undefined ? [
                                    h(Container, {
                                        as: 'button',
                                        color: 'accentColor',
                                        paddingX: '8',
                                        paddingY: '4',
                                        transition: 'default',
                                        type: 'button',
                                        class: touchable({ active: 'shrinkSm', hover: 'growLg' }),
                                        style: { boxSizing: 'content-box', height: 17, willChange: 'transform' },
                                        onClick: () => {
                                            summary.value.headerBackButtonLink && changeWalletStep(summary.value.headerBackButtonLink, true)
                                            summary.value.headerBackButtonCallback?.()
                                        }
                                    }, ()=>h(BackIcon))
                                ] : [],

                            ]),

                            h(Container, {
                                display: 'flex',
                                justifyContent: 'center',
                                style: { flexGrow: 1 }
                            }, ()=>[
                                ...summary.value.headerLabel !== undefined ? [
                                    h(Text, {
                                        color: 'modalText',
                                        size: '18',
                                        textAlign: 'center',
                                        weight: 'heavy'
                                    }, () => summary.value.headerLabel)
                                ] : []
                            ]),

                            h(CloseButton, {
                                onClick: props.onClosed
                            })
                        ]),

                        h(Container, {
                            display: 'flex',
                            flexDirection: 'column',
                            style: { minHeight: compactModeEnabled.value ? '396px' : '432px' }
                        }, ()=>h(Container, {
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6',
                            height: 'full',
                            justifyContent: 'center',
                            marginX: '8'
                        }, ()=>fragment))
                    ])
                ] : [],
            ]);
        }
    },
})