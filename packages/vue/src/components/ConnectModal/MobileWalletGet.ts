import { useLocale } from '@/composables'
import { WalletConnector } from '@/types'
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { computed, defineComponent, h, PropType } from 'vue'

export const createMobileWalletGet = {
  wallets: {
    type: Array as PropType<Array<WalletConnector>>,
    required: true
  },
  isIOS: {
    type: Boolean,
    default: false,
    required: true
  }
} as const

export const MobileWalletGet = defineComponent({
  props: createMobileWalletGet,
  setup(props) {
    const { t } = useLocale()
    const mobileWallets = computed<Array<WalletConnector>>(() =>
      props.wallets.filter((wallet) => wallet.downloadUrls?.ios || wallet.downloadUrls?.android || wallet.downloadUrls?.mobile || 
      (!wallet.downloadUrls?.ios && !wallet.downloadUrls?.android && !wallet.downloadUrls?.mobile)).splice(0, 3))

    return () => {
        return h(Container,()=>[
            h(Container,{
                width: 'full',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: 'full',
                marginBottom: '36',
                marginTop: '5',
                paddingTop: '12'
            },()=>mobileWallets.value.map((e)=>{
                return h(Container,{
                    display: 'flex',
                    gap: '16',
                    key: e.id,
                    paddingX: '20',
                    width: 'full'
                },()=>[
                    h(Container,{
                        style: { minHeight: `48px`, minWidth: `48px` }
                    },()=>h(AsyncImage,{
                        background: e.iconBackground,
                        borderColor: 'generalBorder',
                        borderRadius: '10',
                        height: '48',
                        width: '48',
                        src: e.iconUrl
                    })),

                    h(Container,{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 'full'
                    },()=>[
                        h(Container,{
                            alignItems: 'center',
                            display: 'flex',
                            height: '48'
                        },()=>[
                            h(Container,{
                                width: 'full'
                            },()=>h(Text,{
                                color: 'modalText',
                                size: '18',
                                weight: 'bold',
                            },()=> e.name)),

                            h(ActionButton,{
                                href: props.isIOS ? e.downloadUrls?.ios : e.downloadUrls?.android || e.downloadUrls?.mobile,
                                label: t('get.action.label'),
                                size: 'small',
                                type: 'secondary'
                            })
                        ]),

                        ...mobileWallets.value.indexOf(e) < (mobileWallets.value.length - 1) ? [
                            h(Container,{
                                background: 'generalBorderDim',
                                height: '1',
                                marginY: '10',
                                width: 'full'
                            })
                        ] : []
                    ]),
                ]);
            })),

            h(Container,{
                style: { marginBottom: '42px' }
            }),

            h(Container,{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '36',
                paddingX: '36',
                style: { textAlign: 'center' }
            },()=>h(Container,{
                display: 'flex',
                flexDirection: 'column',
                gap: '12',
                textAlign: 'center'
            },()=>[
                h(Text,{
                    color: 'modalText',
                    size: '16',
                    weight: 'bold' 
                },()=> t('get.looking_for.title')),

                h(Text,{
                    color: 'modalTextSecondary',
                    size: '16'
                },()=> t('get.looking_for.mobile.description'))
            ]))
        ])
    }
  }
})
