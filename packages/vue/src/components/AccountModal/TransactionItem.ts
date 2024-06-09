import { Transaction } from "@/types";
import { touchable } from "@/css";
import { isMobile, chainToExplorerUrl } from "@/utils";
import { SpinnerIcon } from "@/components/Icons/SpinnerIcon";
import { SuccessIcon } from "@/components/Icons/SuccessIcon";
import { CancelIcon } from "@/components/Icons/CancelIcon";
import { ExternalLinkIcon } from "@/components/Icons/ExternalLinkIcon";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { computed, defineComponent, h, PropType } from "vue";
import { useAccount } from "@wagmi/vue";

export const createTransactionItemProps = {
    transaction: {
        type: Object as PropType<Transaction>,
        required: true
    },
} as const;

export const TransactionItem = defineComponent({
    props: createTransactionItemProps,
    setup(props) {
        const getTransactionStatusIcon = (status: Transaction['status']) => {
            switch (status) {
                case 'pending':
                    return SpinnerIcon;
                case 'confirmed':
                    return SuccessIcon;
                case 'failed':
                    return CancelIcon;
                default:
                    return SpinnerIcon;
            }
        };

        const { chain } = useAccount();
        const Icon = computed(() => getTransactionStatusIcon(props.transaction.status));
        const color = computed(() => props.transaction.status === 'failed' ? 'error' : 'accentColor');
        const confirmationStatus = computed(() => props.transaction.status === 'confirmed' ? 'Confirm' : props.transaction.status === 'failed' ? 'Failed' : 'Pending');
        const explorer = computed(() => chainToExplorerUrl(chain.value));

        return () => {
            return h(Container, explorer.value ?
                {
                    as: 'a',
                    background: { hover: 'profileForeground' },
                    borderRadius: 'menuButton',
                    class: touchable({ active: 'shrink' }),
                    href: `${explorer.value}/tx/${props.transaction.hash}`,
                    rel: 'noreferrer noopener',
                    target: '_blank',
                    transition: 'default',
                    color: 'modalText',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '8',
                    width: 'full'
                } : 
                {
                    as: 'div',
                    color: 'modalText',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '8',
                    width: 'full'
                }, ()=>[

                    h(Container,{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: isMobile? '16': '14'
                    },()=>[
                        h(Container,{
                            color: color.value
                        },()=>h(Icon.value)),
                        h(Container,{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile? '3': '1'
                        },()=>[
                            h(Container,()=>h(Text,{
                                color: 'modalText',
                                font: 'body',
                                size: isMobile ? '16': '14',
                                weight: 'bold'
                            },()=> props.transaction.description)),
                            h(Container,()=>h(Text,{
                                color: props.transaction.status == 'pending'? 'modalTextSecondary' : color.value,
                                font: 'body',
                                size: '14',
                                weight: isMobile ? 'medium' : 'regular'
                            },()=> confirmationStatus.value))
                        ])
                    ]),
                    h(Container,()=>h(ExternalLinkIcon))
                ]
            )
        }

    },
});