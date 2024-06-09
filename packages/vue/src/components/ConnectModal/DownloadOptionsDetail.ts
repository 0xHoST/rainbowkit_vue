import { useLocale,  useModalSizeContext } from "@/composables";
import { WalletConnector, WalletStep } from "@/types";
import { getBrowser, getBrowserSrc, getPlatformType, getPlatformTypeSrc } from "@/utils";
import { Container } from "@/components/Common/Container";
import { DownloadOptionsBox } from "@/components/ConnectModal/DownloadOptionsBox";
import { defineComponent, ExtractPropTypes, h, PropType } from "vue";

export const createDownloadOptionsDetail = {
    changeWalletStep: {
        type: Function as PropType<(step:WalletStep)=> void>,
        required: true
    },
    wallet: {
        type: Object as PropType<WalletConnector>,
        required: false
    },
} as const;

export type DownloadOptionsDetailProps = ExtractPropTypes<typeof createDownloadOptionsDetail>;

export const DownloadOptionsDetail = defineComponent({
    props: createDownloadOptionsDetail,
    setup(props){
        const { compactModeEnabled } = useModalSizeContext()
        const { t } = useLocale()
        const browser = getBrowser()
        const platform = getPlatformType()
        const platformIcon = getPlatformTypeSrc(platform)
        const browserIcon = getBrowserSrc(browser)
        return ()=>{
            return h(Container,{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '24',
                height: 'full',
                width: 'full',
                marginBottom: '4',
                marginTop: '4'
            },()=>h(Container,{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                width: 'full',
                height: 'full',
                justifyContent:'center',
                gap: '8'
            },()=>[
                ...props.wallet?.extensionDownloadUrl ? [
                    h(DownloadOptionsBox,{
                        isCompact: compactModeEnabled.value,
                        actionLabel: t('get_options.extension.download.label',{ browser }),
                        description: t('get_options.extension.description'),
                        title: t('get_options.extension.title',{ wallet: props.wallet.name, browser }),
                        iconUrl: browserIcon,
                        url: props.wallet.extensionDownloadUrl,
                        variant: 'browser',
                        onAction: ()=> props.changeWalletStep(props.wallet?.extensions?.instructions 
                            ? WalletStep.InstructionsExtension: WalletStep.Connect)
                    })
                ] : [],
                ...props.wallet?.desktopDownloadUrl ? [
                    h(DownloadOptionsBox,{
                        isCompact: compactModeEnabled.value,
                        actionLabel: t('get_options.desktop.download.label',{ platform }),
                        description: t('get_options.desktop.description'),
                        title: t('get_options.desktop.title',{ wallet: props.wallet.name, browser }),
                        iconUrl: platformIcon,
                        url: props.wallet.desktopDownloadUrl,
                        variant: 'desktop',
                        onAction: ()=> props.changeWalletStep(props.wallet?.deskstop?.instructions 
                            ? WalletStep.InstructionsDesktop: WalletStep.Connect)
                    })
                ] : [],
                ...props.wallet?.mobileDownloadUrl ? [
                    h(DownloadOptionsBox,{
                        isCompact: compactModeEnabled.value,
                        actionLabel: t('get_options.mobile.download.label',{ wallet: props.wallet?.name }),
                        description: t('get_options.mobile.description'),
                        title: t('get_options.mobile.title',{ wallet: props.wallet?.name, browser }),
                        iconUrl: props.wallet.iconUrl,
                        iconAccent: props.wallet.iconAccent,
                        iconBackground: props.wallet.iconBackground,
                        url: props.wallet.desktopDownloadUrl,
                        variant: 'app',
                        onAction: ()=> props.changeWalletStep(WalletStep.Download)
                    })
                ] : [],

            ]));
        }
    }
});