import { useAppContext, useLocale, useClearRecentTransactions, useRecentTransactions } from "@/composables";
import { chainToExplorerUrl, isMobile } from "@/utils";
import { Address } from "@/types";
import { touchable } from  "@/css";
import { ExternalLinkIcon } from "@/components/Icons/ExternalLinkIcon";
import { Text } from "@/components/Common/Text";
import { Container } from "@/components/Common/Container";
import { TransactionItem } from "@/components/AccountModal/TransactionItem";
import { useAccount } from "@wagmi/vue";
import { computed, defineComponent, h, PropType } from "vue";

export const createTransactionsProps = {
    address: {
        type: String as PropType<Address>,
        required: true
    },
} as const

export const Transactions = defineComponent({
    props: createTransactionsProps,
    setup(props) {
        const NUMBER_OF_VISIBLE_TRANSACTIONS = 5
        const recentTransactions = useRecentTransactions()
        const clearRecentTransactions = useClearRecentTransactions()

        const { chain } = useAccount()
        const { t } = useLocale()
        const { name: appName } = useAppContext()
        const explorer = computed(() => chainToExplorerUrl(chain.value))
        const visibleTransactions = computed(() => recentTransactions.value.slice(0, NUMBER_OF_VISIBLE_TRANSACTIONS))
        const hasTransactions = computed(() => visibleTransactions.value.length > 0);
        return () => {
            return [
                h(Container, {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10',
                    paddingBottom: '2',
                    paddingTop: '16',
                    paddingX: isMobile ? '8' : '18'
                }, ()=>[
                    ...hasTransactions.value ? [
                        h(Container, {
                            paddingBottom: isMobile ? '4' : '0',
                            paddingTop: '8',
                            paddingX: isMobile ? '12' : '6'
                        }, ()=>h(Container, {
                            display: 'flex',
                            justifyContent: 'space-between'
                        }, ()=>[
                            h(Text, {
                                color: 'modalTextSecondary',
                                size: isMobile ? '16' : '14',
                                weight: 'semibold'
                            }, () => t('profile.transactions.recent.title')),

                            h(Container, {
                                style: {
                                    marginBottom: '-6px',
                                    marginLeft: '-10px',
                                    marginRight: '-10px',
                                    marginTop: '-6px'
                                },
                            }, ()=>h(Container, {
                                as: 'button',
                                background: { hover: 'profileForeground' },
                                borderRadius: 'actionButton',
                                class: touchable({ active: 'shrink' }),
                                paddingX: isMobile ? '8' : '12',
                                paddingY: isMobile ? '4' : '5',
                                transition: 'default',
                                type: 'button',
                                onClick: clearRecentTransactions
                            }, ()=>h(Text, {
                                color: 'modalTextSecondary',
                                size: isMobile ? '16' : '14',
                                weight: 'semibold'
                            }, () => t('profile.transactions.clear.label'))))
                        ]),)
                    ] : [],

                    h(Container, {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4'
                    },()=> [
                        ...hasTransactions.value ? [
                            ...visibleTransactions.value.map((transaction) => {
                                return h(TransactionItem, {
                                    key: transaction.hash,
                                    transaction
                                });
                            })
                        ] : [
                            h(Container, {
                                padding: isMobile ? '12' : '8'
                            }, ()=>h(Text, {
                                color: 'modalTextDim',
                                size: isMobile ? '16' : '14',
                                weight: isMobile ? 'medium' : 'bold'
                            }, () => appName?.value !== undefined 
                                ? t('profile.transactions.description', { appName: appName.value })
                                : t('profile.transactions.description_fallback'))),
                        ],
                    ])
                ]),
                ...explorer.value ? [
                    h(Container, {
                        paddingBottom: '18',
                        paddingX: isMobile ? '8' : '18'
                    }, ()=>h(Container, {
                        alignItems: 'center',
                        as: 'a',
                        background: { hover: 'profileForeground' },
                        borderRadius: 'menuButton',
                        class: touchable({ active: 'shrink' }),
                        color: 'modalTextDim',
                        display: 'flex',
                        flexDirection: 'row',
                        href: `${explorer.value}/address/${props.address}`,
                        justifyContent: 'space-between',
                        paddingX: '8',
                        paddingY: '12',
                        rel: 'noreferrer noopener',
                        style: { willChange: 'transform' },
                        target: '_blank',
                        transition: 'default',
                        width: 'full',
                        paddingLeft: isMobile ? '12' : undefined
                    }, ()=>[
                        h(Text, {
                            color: 'modalText',
                            font: 'body',
                            weight: isMobile ? 'semibold' : 'bold',
                            size: isMobile ? '16' : '14'
                        }, () => t('profile.explorer.label')),
                        h(ExternalLinkIcon)
                    ]))
                ] : [],
            ];
        }
    },
});