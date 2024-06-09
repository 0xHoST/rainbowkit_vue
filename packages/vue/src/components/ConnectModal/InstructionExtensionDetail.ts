import { WalletConnector } from "@/types"
import { touchable } from "@/css";
import { useLocale } from "@/composables"
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { StepIcon } from "@/components/Icons/StepIcon";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { defineComponent, ExtractPropTypes, h, PropType } from "vue"

export const createInstructionExtensionDetailProps = {
    wallet: {
        type: Object as PropType<WalletConnector>,
        required: false
    }
} as const;

export type InstructionExtensionDetailProps = ExtractPropTypes<typeof createInstructionExtensionDetailProps>;

export const InstructionExtensionDetail = defineComponent({
    props: createInstructionExtensionDetailProps,
    setup(props) {
        const  { t } = useLocale();
        const reload = () => window.location.reload;

        return ()=>{
            return h(Container,{
                alignItems: 'center',
                flexDirection: 'column',
                height: 'full',
                width: 'full',
                display: 'flex'
            },()=>h(Container,{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 'full',
                gap: '28',
                paddingY: '32',
                style: { maxWidth: '320px' } 
            },()=>[
                props.wallet?.extensions?.instructions?.steps.map((e)=>{
                    return h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16',
                        key: e.step
                    },()=>[
                        h(Container,{
                            borderRadius: '10',
                            height: '48',
                            width: '48',
                            minWidth: '48',
                            overflow: 'hidden',
                            position: 'relative'
                        },()=>h(StepIcon,{
                            step: e.step,
                            wallet: props.wallet
                        })),
                        
                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4',
                        },()=>[
                            h(Text,{
                                color: 'modalText',
                                size: '14',
                                weight: 'bold'
                            },()=> t(e.title)),

                            h(Text,{
                                color: 'modalTextSecondary',
                                size: '14',
                                weight: 'medium'
                            },()=> t(e.description))
                        ])
                    ])
                }),

                
                h(Container,{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12',
                    justifyContent: 'center',
                    marginBottom: '16'
                },()=>[
                    h(ActionButton,{
                        label: t('get_instructions.extension.refresh.label'),
                        onClick: reload,
                    }),
                    h(Container,{
                        as: 'a',
                        class: touchable({ active:'shrink', hover: 'grow' }),
                        display: 'block',
                        href: props.wallet?.extensions?.instructions?.learnMoreUrl,
                        paddingX: '12',
                        paddingY: '4',
                        rel: 'noreferrer',
                        style: { willChange: 'transform' },
                        target: '_blank',
                        transition: 'default',
                    },()=> h(Text,{
                        color: 'accentColor',
                        size: '14',
                        weight: 'bold'
                    },()=> t('get_instructions.extension.learn_more.label')))
                ])
            ]))
        }
    },
});