import { Container } from "@/components/Common/Container";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { SpinnerIcon } from "@/components/Icons/SpinnerIcon";
import { addLatestWalletId, getLatestWalletId, isMobile } from "@/utils";
import { WalletConnector } from "@/types";
import { useConnectionStatus } from "@/composables/connection";
import { useLocale } from "@/composables/locale";
import { useModalContext } from "@/composables/modal";
import { useWalletButtonContext } from "@/composables/button";
import { useWalletConectors } from "@/composables/connectors";

import { useAccount, useAccountEffect } from "@wagmi/vue";
import { computed, defineComponent, h, ref, SlotsType, watch } from "vue";
import { border, maxWidth, touchable } from "@/css";
import { useThemeContext } from "@/composables";

export const WalletButton = defineComponent({
    props: {
        wallet: {
            type: String,
            default: 'rainbow'
        }
    } as const,
    slots: Object as SlotsType<{
        custom: {
            error: boolean,
            loading: boolean,
            connected: boolean,
            ready: boolean,
            connector?: WalletConnector,
            connect: () => Promise<void>
        }
    }>,
    setup(props, { slots }) {

        const { openConnectModal, connectModalOpen } = useModalContext()
        const { connector: selectedConnector } = useWalletButtonContext()
        const { t } = useLocale()
        const { isConnected, isConnecting } = useAccount()
        const loading = ref<boolean>(false)
        const isError = ref<boolean>(false)
        const connectors = useWalletConectors()
        const connectionStatus = useConnectionStatus(isConnected,isConnecting)

        const filteredConnectors = computed(() =>
            connectors.value
                .filter((wallet) => wallet.isRainbowKitConnector)
                .filter((w) => w.id.trim().toLowerCase() === props.wallet.trim().toLowerCase())
        )
        const connector = computed(() =>
            filteredConnectors.value.length <= 0 ? undefined : filteredConnectors.value[0]
        )
        const isDisabled = computed(() => loading.value)
        const connectorName = computed(() => connector?.value?.name || '')
        const isStatusLoading = computed(() => connectionStatus.value === 'loading')
        const ready = computed(
            () => !isConnecting.value && !!openConnectModal?.value && connector.value !== undefined && !isStatusLoading.value
        )
        const isNotSupported = computed(() => !connector.value?.installed)
        const isLastWalletIdConnected = computed(() => {
            const lastWalletId = getLatestWalletId()
            if (!lastWalletId || !connector.value || !connector.value.id) {
                return false
            }

            if (!isConnected) return false
            return lastWalletId === connector.value.id
        })

        const connectWallet = async () => {
            try {
                loading.value = true
                if (isError.value) isError.value = false
                await connector.value?.connect?.()
            } catch {
                isError.value = true
            } finally {
                loading.value = false
            }
        }
        const connect = async () => {
            addLatestWalletId(connector?.value?.id || '')
            if (isMobile || isNotSupported.value) {
                openConnectModal.value();
                if (connector.value) {
                    selectedConnector.value = connector.value
                }
                return;
            }
            await connectWallet()
        }

        watch([connectModalOpen, selectedConnector], ([newConnectModalOpen, newButtonConnector]) => {
            if (!newConnectModalOpen && newButtonConnector) {
                selectedConnector.value = null
            }
        })

        useAccountEffect({
            onConnect(_) {
                if (!isError.value) return
                isError.value = false
            }
        })

        return () => {
            if (slots.custom) {
                return h(slots.custom({
                    loading: loading.value,
                    error: isError.value,
                    connected: isLastWalletIdConnected.value,
                    connector: connector.value,
                    ready: ready.value,
                    connect: connect
                }))
            }

            return h(Container,{  'data-rk-vue': true },()=>h(Container, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                disabled: isDisabled.value,
                pointerEvents: isDisabled.value ? 'none' : 'all'
            }, ()=>h(Container, {
                as: 'button',
                borderRadius: 'menuButton',
                borderStyle: 'solid',
                borderWidth: '1',
                class: [maxWidth, border, touchable({ active: 'shrink', hover: 'grow' })],
                minHeight: '44',
                width: 'full',
                disabled: isDisabled.value,
                padding: '6',
                transition: 'default',
                background: 'connectButtonBackground',
                style: { willChange: 'transform' },
                onClick: async () => await connect()
            },()=>h(Container, {
                color: 'modalText',
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '16',
                transition: 'default',
                display: 'flex',
                alignItems: 'center'
            },()=>h(Container, {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                gap: '12',
                paddingRight: '6'
            },()=>[
                h(Container,()=>[
                    ...loading.value ? [
                        h(SpinnerIcon),
                    ] : [
                        h(AsyncImage, {
                            background: connector.value?.iconBackground,
                            borderRadius: '6',
                            height: '28',
                            width: '28',
                            src: connector.value?.iconUrl
                        })
                    ],
                ]),

                h(Container, {
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'modalText'
                }, ()=>h(Container, () => loading.value ? t('connect.status.connecting', { wallet: connectorName.value }) : connectorName.value)),

                ...isLastWalletIdConnected.value ? [
                    h(Container, {
                        background: 'connectionIndicator',
                        borderColor: 'selectedOptionBorder',
                        borderRadius: 'full',
                        borderStyle: 'solid',
                        borderWidth: '1',
                        height: '8',
                        width: '8'
                    })
                ] : [],
            ])))));
        }
    },
})