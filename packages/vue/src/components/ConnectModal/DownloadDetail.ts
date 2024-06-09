import { useLocale } from "@/composables";
import { WalletConnector, WalletStep } from "@/types";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { QrCode } from "@/components/Common/QrCode";
import { defineComponent, ExtractPropTypes, h, PropType } from "vue";

export const createDownloadDetail = {
    changeWalletStep: {
        type: Function as PropType<(step:WalletStep)=> void>,
        required: true
    },
    wallet: {
        type: Object as PropType<WalletConnector>,
        required: false
    },
} as const;

export type DownloadDetailProps = ExtractPropTypes<typeof createDownloadDetail>;

export const DownloadDetail = defineComponent({
    props: createDownloadDetail,
    setup(props) {
        const { t } = useLocale()
        const onClickChangeWalletStep = () => props.changeWalletStep(props.wallet?.qrCode?.instructions ? WalletStep.InstructionsMobile : WalletStep.Connect)
        return ()=>{
            return h(Container,{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '24',
                height: 'full',
                width: 'full'
            },()=>[
                h(Container,{
                    style: { maxWidth: '220px', textAlign: 'center' }, 
                },()=>h(Text,{
                    color: 'modalTextSecondary',
                    size: '14',
                    weight: 'semibold',
                },()=>t('get_mobile.description'))),

                ...props.wallet?.downloadUrls?.qrCode !== undefined ? [
                    h(Container,{
                        height: 'full'
                    },()=>h(QrCode,{
                        uri: props.wallet?.downloadUrls?.qrCode,
                        logoSize: 0,
                        size:268
                    }))
                ] : [],

                h(Container,{
                    alignItems: 'center',
                    borderRadius: '10',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8',
                    height: '34',
                    justifyContent: 'space-between',
                    marginBottom: '12',
                    paddingY: '8'
                },()=>h(ActionButton,{
                    label: t('get_mobile.continue.label'),
                    onClick: onClickChangeWalletStep
                })),
            ])
        }
    },
});