import { useAppContext,useLocale } from "@/composables";
import { touchable } from "@/css";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { LoginIcon } from "@/components/Icons/LoginIcon";
import { AssetsIcon } from "@/components/Icons/AssetsIcon";
import { defineComponent, ExtractPropTypes, h, PropType, RenderFunction, SetupContext, EmitsOptions, SlotsType } from "vue";
import { createDisclaimerComponent } from "@/types";
import { DisclaimerLink } from "../Common/DisclaimerLink";
import { DisclaimerText } from "../Common/DisclaimerText";

export const createConnectModalIntro = {
    compactModalEnabled: Boolean,
    getWallet:{
        type: Function as PropType<(()=> void)>,
        required: true
    }
} as const;

export type ConnectModalIntroProps = ExtractPropTypes<typeof createConnectModalIntro>;
export type ConnectModalIntroComponentSetupFn<E extends EmitsOptions = {}, S extends SlotsType = SlotsType> = (props: ConnectModalIntroProps, ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>;
export function createConnectModalIntroComponent(setup:ConnectModalIntroComponentSetupFn){
    return defineComponent({props: createConnectModalIntro,setup});
}
export const ConnectModalIntro = defineComponent({
    props: createConnectModalIntro,
    setup(props) {
        const { disclaimer: DisclaimerFn, learnMoreUrl } = useAppContext();
        const Disclaimer = DisclaimerFn?.value !== undefined ? createDisclaimerComponent(DisclaimerFn.value) : undefined;
        const { t } = useLocale();

        return ()=>{
            return h(Container,{
                alignItems: 'center',
                color: 'accentColor',
                display: 'flex',
                flexDirection: 'column',
                height: 'full',
                justifyContent: 'space-around'
            },()=>[
                ...!props.compactModalEnabled ? [
                    h(Container,{ marginBottom: '10' }, 
                        ()=>h(Text,{ color: 'modalText', size: '18', weight: 'heavy' },()=> t('intro.title')))
                ] : [],
                
                h(Container,{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32',
                    justifyContent: 'center',
                    marginY: '20',
                    style: { maxWidth: '312px' }
                },()=>[
                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16'
                    },()=>[
                        h(Container,{
                            borderRadius: '6',
                            height: '48',
                            width: '48',
                            minWidth: '48'
                        },()=>h(AssetsIcon)),

                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap:'4'
                        },()=>[
                            h(Text,{
                                color: 'modalText',
                                size: '14',
                                weight: 'bold'
                            },()=> t('intro.digital_asset.title')),

                            h(Text,{
                                color: 'modalTextSecondary',
                                size: '14',
                                weight: 'medium'
                            },()=> t('intro.digital_asset.description'))
                        ])
                    ]),

                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16'
                    },()=>[
                        h(Container,{
                            borderRadius: '6',
                            height: '48',
                            width: '48',
                            minWidth: '48'
                        },()=>h(LoginIcon)),

                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap:'4'
                        },()=>[
                            h(Text,{
                                color: 'modalText',
                                size: '14',
                                weight: 'bold'
                            },()=> t('intro.login.title')),

                            h(Text,{
                                color: 'modalTextSecondary',
                                size: '14',
                                weight: 'medium'
                            },()=> t('intro.login.description'))
                        ])
                    ])
                ]),

                h(Container,{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12',
                    justifyContent: 'center',
                    margin: '10'
                },()=>[
                    h(ActionButton,{
                        label: t('intro.get.label'),
                        onClick: props.getWallet
                    }),

                    h(Container,{
                        as: 'a',
                        display: 'block',
                        paddingX: '12',
                        paddingY: '4',
                        rel: 'noreferrer',
                        target: '_blank',
                        transition: 'default',
                        class: touchable({ active:'shrink', hover:'grow' }),
                        href: learnMoreUrl
                    }, ()=>h(Text,{
                        color: 'accentColor',
                        size: '14',
                        weight: 'bold'
                    },()=> t('intro.learn_more.label')))
                ]),

                ...Disclaimer !== undefined ? [
                    h(Container,{
                        marginBottom: '8',
                        marginTop: '12',
                        textAlign: 'center'
                    },()=>h(Disclaimer,{ text: DisclaimerText, link: DisclaimerLink }))
                ] : []
            ])
        }
    },
}); 