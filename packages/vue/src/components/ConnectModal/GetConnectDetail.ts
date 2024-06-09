import { useWalletConectors, useLocale } from "@/composables";
import { Container } from "@/components/Common/Container";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Text } from "@/components/Common/Text";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { computed, defineComponent, ExtractPropTypes, h, PropType } from "vue";

export const createGetConnectDetailProps = {
    getWalletDownload: {
        type: Function as PropType<(walletId:string)=>void>,
        required: true
    },
    compactModeEnabled: {
        type: Boolean,
        required: false,
    }
} as const;

export type GetConnectDetailProps = ExtractPropTypes<typeof createGetConnectDetailProps>;

export const GetConnectDetail = defineComponent({
    props: createGetConnectDetailProps,
    setup(props) {
        const connectors = useWalletConectors()
        const { t } = useLocale()
        
        const wallets = computed(() => {
          let filteredWallets = connectors.value
          filteredWallets = filteredWallets.filter((wallet) => wallet.isRainbowKitConnector &&
              (wallet.extensionDownloadUrl || wallet.desktopDownloadUrl || (wallet.qrCode && wallet.downloadUrls?.qrCode))
          )
          return filteredWallets.splice(0, 5)
        })
        
        const options = computed(() => {
          return wallets.value.map((wallet) => {
            const hasMobileCompanionApp: boolean = wallet.downloadUrls?.qrCode !== undefined && wallet.qrCode != undefined
            const hasExtension: boolean = !!wallet.extensionDownloadUrl
            const hasMobileExtension: boolean =
              wallet.downloadUrls?.qrCode !== undefined && hasExtension;
            const hasMobileAndDesktop: boolean =
              wallet.downloadUrls?.qrCode !== undefined && !!wallet.desktopDownloadUrl

            return {
              wallet,
              hasMobileCompanionApp,
              hasMobileExtension,
              hasMobileAndDesktop,
              hasExtension
            }
          })
        })

        return ()=>{

            return h(Container,{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: 'full',
                width: 'full',
                marginTop: '18'
            },()=>[
                h(Container,{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '28',
                    height: 'full',
                    width: 'full'
                },()=>options.value.map((e)=>{
                    return h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        gap: '16',
                        justifyContent: 'space-between',
                        width: 'full',
                        key: e.wallet.id
                    },()=>[
                        h(Container,{
                            alignItems:'center',
                            display:'flex',
                            flexDirection: 'row',
                            gap: '16'
                        },()=>[
                            h(AsyncImage,{
                                background: e.wallet.iconBackground,
                                src: e.wallet.iconUrl,
                                width: 48,
                                height: 48
                            }),

                            h(Container,{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2'
                            },()=>[
                                h(Text,{
                                    color: 'modalText',
                                    size: '14',
                                    weight: 'bold'
                                },()=> e.wallet.name),

                                h(Text,{
                                    color: 'modalTextSecondary',
                                    size: '14',
                                    weight: 'medium'
                                },()=> 
                                    e.hasMobileExtension ? t('get.mobile_and_extension.description') : 
                                    e.hasMobileAndDesktop ?  t('get.mobile_and_desktop.description') : 
                                    e.hasMobileCompanionApp ? t('get.mobile.description') : 
                                    e.hasExtension ? t('get.extension.description'): t('get.extension.description')),
                            ])
                        ]),
                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4'
                        },()=>h(ActionButton,{
                            label: t('get.action.label'),
                            onClick: ()=> props.getWalletDownload(e.wallet.id),
                            type: 'secondary'
                        }))
                    ])
                })),

                h(Container,{
                    alignItems: 'center',
                    display: 'flex',
                    borderRadius: '10',
                    flexDirection: 'column',
                    gap: '8',
                    justifyContent: 'space-between',
                    marginBottom: '8',
                    paddingY: '8',
                    style: { 'max-width': '275px', 'text-align': 'center' } 
                },()=>[
                    h(Text,{
                        color: 'modalText',
                        size: '14',
                        weight: 'bold'
                    },()=> t('get.looking_for.title')),
                    ...props.compactModeEnabled ? [
                        h(Text,{
                            color: 'modalTextSecondary',
                            size: '14',
                            weight: 'medium'
                        },()=> t('get.looking_for.desktop.compact_description'))
                    ] : [
                        h(Text,{
                            color: 'modalTextSecondary',
                            size: '14',
                            weight: 'medium'
                        },()=> t('get.looking_for.desktop.wide_description'))
                    ],
                ])
            ]);

        }
    },
});