import { useAppContext, useWalletConectors, useLocale } from '@/composables'
import { isIOS } from '@/utils'
import { touchable } from '@/css'
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { BackIcon } from "@/components/Icons/BackIcon";
import { CloseButton } from "@/components/Buttons/CloseButton";
import { MobileWalletConnect } from "@/components/ConnectModal/MobileWalletConnect";
import { MobileWalletGet } from "@/components/ConnectModal/MobileWalletGet";
import { createDisclaimerComponent, MobileWalletSteps, WalletConnector, type MobileWalletSummary, type MobileWalletSummaryReturnType } from '@/types'
import { computed, ref, defineComponent, h, PropType, SlotsType, DefineComponent, Component } from 'vue'
import { DisclaimerLink } from '../Common/DisclaimerLink';
import { DisclaimerText } from '../Common/DisclaimerText';

export const createMobileOptionProps = {
    onClosed:{
        type: Function as PropType<()=>void>,
        required: true
    }
} as const;

export const MobileOption = defineComponent({
    props: createMobileOptionProps,
    slots: Object as SlotsType<{
        default: {
            fragment: MobileWalletSummary,
            step: MobileWalletSteps,
            wallets: Array<WalletConnector>,
            disclaimer: Component | undefined,
            changeWalletStep: ((headerBackButtonLink: MobileWalletSteps)=> void),
            learnMoreUrl: string | undefined,
        }
    }>, 
    setup(props, { slots }) {
        const titleId = 'rk_connect_title'
        const { disclaimer: DisclaimerFn, learnMoreUrl } = useAppContext()
        const Disclaimer = DisclaimerFn?.value !== undefined ? createDisclaimerComponent(DisclaimerFn.value) : undefined;

        const { t } = useLocale()
    
        const step = ref<MobileWalletSteps>(MobileWalletSteps.Connect)
        const wallets = useWalletConectors().value.filter((wallet) => wallet.isRainbowKitConnector)
        const changeWalletStep = (headerBackButtonLink: MobileWalletSteps) => {
            step.value = headerBackButtonLink
        }
        const summary = computed<MobileWalletSummary>(() => {
            const mobileWalletSummary: MobileWalletSummaryReturnType = {
                [MobileWalletSteps.Connect]: {
                    headerLabel: t('connect.title'),
                    headerBackgroundContrast: true,
                    currentWalletStep: MobileWalletSteps.Connect
                },
                [MobileWalletSteps.Get]: {
                    headerBackButtonLink: MobileWalletSteps.Connect,
                    headerLabel: t('get.title'),
                    currentWalletStep: MobileWalletSteps.Get
                }
            }
            return mobileWalletSummary[step.value]
        })
        return () => {
            if(slots.default){
                return slots.default({
                    fragment: summary.value,
                    step: step.value,
                    disclaimer: Disclaimer?.value,
                    learnMoreUrl: learnMoreUrl?.value,
                    wallets,
                    changeWalletStep
                });
            }

            return h(Container,{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '36'
            },()=>[
                h(Container,{
                    background: summary.value.headerBackgroundContrast ?? false ? 'profileForeground' : 'modalBackground',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '4',
                    paddingTop: '14'
                },()=>h(Container,{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: '6',
                    paddingX: '20',
                    position: 'relative'
                },()=>[
                    ...summary.value.headerBackButtonLink ? [
                        h(Container,{
                            display: 'flex',
                            position: 'absolute',
                            style: {
                                left: 0,
                                marginBottom: '-20px',
                                marginTop: '-20px'
                            }
                        },()=>h(Container,{
                            as: 'button',
                            alignItems: 'center',
                            color:  'accentColor',
                            display: 'flex',
                            marginLeft: '4',
                            marginTop: '20',
                            padding: '16',
                            transition: 'default',
                            type: 'button',
                            style: {
                                height: '17px',
                                willChange: 'transform'
                            },
                            class: touchable({ active: 'shrinkSm', hover: 'growLg' }),
                            onClick: ()=> changeWalletStep(summary.value.headerBackButtonLink!)
                        },()=>h(BackIcon))),
                    ] : [],
                    
                    h(Container,{ 
                        marginTop: '4',
                        textAlign: 'center',
                        width: 'full'
                     },()=>h(Text,{
                        tag: 'h1',
                        color: 'modalText',
                        size: '20',
                        weight: 'bold',
                        id: titleId,
                     },()=> summary.value.headerLabel)),
    
                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        height: '32',
                        paddingRight: '14',
                        position: 'absolute',
                        right: '0'
                    },()=>h(Container,{
                        style: { marginBottom: '-20px', marginTop: '-20px' }
                    },()=>h(CloseButton,{ onClick: props.onClosed }))),
                ])),
    
                ...summary.value.currentWalletStep === MobileWalletSteps.Connect ? [
                    h(Container,{
                        display: 'flex',
                        flexDirection: 'column'
                    },()=>h(MobileWalletConnect,{
                        onClosed: props.onClosed,
                        disclaimer: Disclaimer,
                        changeWalletStep: changeWalletStep,
                        walletStep: summary.value.currentWalletStep,
                        learnMoreUrl: learnMoreUrl?.value,
                        wallets
                    }))
                ] : [],
    
                ...summary.value.currentWalletStep === MobileWalletSteps.Get ? [
                    h(Container,{
                        display: 'flex',
                        flexDirection: 'column'
                    },()=>h(MobileWalletGet,{
                        wallets,
                        isIOS
                    }))
                ] : [],
            ])
        };
    },
});