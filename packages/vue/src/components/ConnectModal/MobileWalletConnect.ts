import { useLocale } from "@/composables";
import { MobileWalletSteps, WalletConnector } from "@/types";
import { Container } from "@/components/Common/Container";
import { MobileWalletButton } from "@/components/Buttons/MobileWalletButton";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { Text } from "@/components/Common/Text";
import { scroll }  from "@/css";
import { Component, defineComponent, h, PropType } from "vue";
import { DisclaimerText } from "../Common/DisclaimerText";
import { DisclaimerLink } from "../Common/DisclaimerLink";

export const createMobileWalletConnectProps = {
    disclaimer: Object as PropType<Component>,
    learnMoreUrl: String as PropType<string>,
    walletStep: {
        type: String as PropType<MobileWalletSteps>,
        required: true,
    },
    wallets: {
        type: Array as PropType<Array<WalletConnector>>,
        required: true,
    },
    onClosed: {
        type: Function as PropType<()=>void>,
        required: true,
    },
    changeWalletStep: {
        type: Function as PropType<(step: MobileWalletSteps)=> void>,
        required: true,
    }
} as const;

export const MobileWalletConnect = defineComponent({
    props: createMobileWalletConnectProps,
    setup(props, { slots }) {
        const { t } = useLocale()
        return ()=>{
            return h(Container,()=>[
                h(Container,{
                    display: 'flex',
                    paddingBottom: '20',
                    paddingTop: '6',
                    background: 'profileForeground',
                    class: scroll
                },()=>[
                    h(Container,{
                        display: 'flex',
                        style: { margin: '0 auto' }
                    },()=>props.wallets.filter(wallet => wallet.ready).map(e=>{
                        return h(Container,{
                            paddingX: '20',
                            key: e.id
                        },()=>h(Container,{ width: '60' },()=>h(MobileWalletButton,{
                            onClosed: props.onClosed,
                            wallet: e
                        })))
                    }))
                ]),

                h(Container,{
                    background: 'generalBorder',
                    height: '1',
                    marginBottom: '12',
                    marginTop: '-1'
                 }),

                 h(Container,{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32',
                    paddingX: '32',
                    style: { textAlign: 'center' },
                 },()=> h(Container,{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8',
                    textAlign: 'center'
                 },()=>[
                    h(Text,{
                        color: 'modalText',
                        size: '16',
                        weight: 'bold'
                    },()=> t('intro.title')),

                    h(Text,{
                        color: 'modalTextSecondary',
                        size: '16'
                    },()=> t('intro.description'))
                 ]),
                ),
                 
                h(Container,{
                    paddingTop: '32',
                    paddingX: '20'
                },()=>h(Container,{
                    display: 'flex',
                    gap: '14',
                    justifyContent: 'center'
                },()=>[
                    h(ActionButton,{
                        size: 'large',
                        type: 'secondary',
                        label: t('intro.get.label'),
                        onAction: ()=> props.changeWalletStep(MobileWalletSteps.Get)
                    }),

                    h(ActionButton,{
                        size: 'large',
                        type: 'secondary',
                        label: t('intro.learn_more.label'),
                        href: props.learnMoreUrl
                    })
                ])),

                ...props.disclaimer !== undefined ? [
                    h(Container,{
                        marginTop: '28',
                        marginX: '32',
                        textAlign: 'center'
                    }, ()=> h(props.disclaimer!,{ text: DisclaimerText, link: DisclaimerLink } ,()=> slots.default ? slots.default() : undefined))
                ] : []
            ])
        }
    },
});