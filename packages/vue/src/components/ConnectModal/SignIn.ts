import { useRainbowKitAccountContext, useAuthenticationConfigContext, useLocale } from "@/composables";
import { SignInRefType,Address,Chain } from "@/types";
import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { CloseButton } from "@/components/Buttons/CloseButton";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { isMobile } from "@/utils/mobile";
import { touchable } from "@/css/touchable";
import { useSignMessage } from "@wagmi/vue";
import { UserRejectedRequestError } from "viem";
import { defineComponent, h, onMounted, PropType, ref, SlotsType } from "vue";
import {} from "@/assets/sign.png";
export const SignIn = defineComponent({
    props: {
        onClosed: {
            type: Function as PropType<() => void>,
            required: true,
        }, onClosedModal:{ 
            type: Function as PropType<() => void>,
            required: true,
        } 
    } as const,
    slots: Object as SlotsType<{
        default: {
            signIn: (() => Promise<void>),
            verify: ((message: any, signature: `0x${string}` | undefined) => Promise<void>),
            signMessage: ((message: any) => Promise<`0x${string}` | undefined>),
            getNonce: (() => Promise<void>),
            signInInfo: SignInRefType,
            address: Address | undefined,
            chain: Chain | undefined
        }
    }>,
    setup(props, { slots }) {
        const { adapter } = useAuthenticationConfigContext()
        const { address: addressRef, chain: chainRef } = useRainbowKitAccountContext()
        const { signMessageAsync } = useSignMessage()
        const { t } = useLocale()

        const signInRefs = ref<SignInRefType>({ status: 'idle' })
        const signInIcon = ref<string>(
            import.meta.glob<{ default: string }>('../../assets/sign.png', { eager: true })['../../assets/sign.png']
                .default
        )

        const getNonce = async () => {
            try {
                const nonce = await adapter?.value?.getNonce()
                signInRefs.value.nonce = nonce
            } catch (error) {
                signInRefs.value = { status: 'idle', errorMessage: t('sign_in.message.preparing_error') }
            }
        }
        const signMessage = async (message: any): Promise<`0x${string}` | undefined> => {
            try {
                const signature = await signMessageAsync({
                    message: adapter?.value?.getMessageBody({ message })
                })
                return signature
            } catch (error) {
                if (error instanceof UserRejectedRequestError) {
                    signInRefs.value.status = 'idle'
                }

                signInRefs.value = {
                    nonce: signInRefs.value.nonce,
                    errorMessage: t('sign_in.signature.signing_error'),
                    status: 'idle'
                }
                return undefined
            }
        }
        const verify = async (message: any, signature: `0x${string}` | undefined): Promise<void> => {
            try {
                if (!signature) return

                const verified = await adapter?.value?.verify({ message, signature })
                if (!verified) {
                    throw new Error()
                }

                props.onClosedModal()
            } catch (error) {
                signInRefs.value = {
                    nonce: signInRefs.value.nonce,
                    errorMessage: t('sign_in.signature.verifying_error'),
                    status: 'idle'
                }
            }
        }
        const signIn = async () => {
            try {
                const chainId = chainRef.value?.id
                const nonce = signInRefs.value.nonce
                const address = addressRef.value

                if (!address || !chainId || !nonce) return

                signInRefs.value.status = 'signing'
                const message = adapter?.value?.createMessage({ address, chainId, nonce })
                const signature = await signMessage(message)

                signInRefs.value.status = 'verifying'
                await verify(message, signature)
            } catch (ex) {
                signInRefs.value = {
                    errorMessage: t('sign_in.signature.oops_error'),
                    status: 'idle'
                }
            }
        }

        onMounted(async () => {
            ///load after component mounted: action button would show preparing status
            await getNonce()
        })

        return () => {
            if (slots.default) {
                return slots.default({ 
                    signInInfo: signInRefs.value, 
                    address: addressRef.value, 
                    chain: chainRef.value, 
                    signIn, 
                    verify, 
                    signMessage, 
                    getNonce 
                });
            }

            return h(Container, {
                position: 'relative'
            }, ()=>[
                h(Container, {
                    display: 'flex',
                    paddingRight: '16',
                    paddingTop: '16',
                    position: 'absolute',
                    right: "0"
                }, ()=>h(CloseButton, { onClosed: props.onClosed })),

                h(Container, {
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '24',
                    paddingX: '18',
                    gap: isMobile ? '32' : '24',
                    style: { paddingTop: isMobile ? '60px' : '32px' }
                }, ()=>h(Container, {
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: isMobile ? '6' : '4',
                    style: { maxWidth: isMobile ? '320px' : '280px' }
                }, ()=>[
                    h(Container, {
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '32' : '16'
                    }, ()=>[
                        h(AsyncImage, {
                            height: 40,
                            src: signInIcon.value,
                            width: 40
                        }),

                        h(Text, {
                            color: 'modalText',
                            textAlign: 'center',
                            weight: 'heavy',
                            size: isMobile ? '20' : '18'
                        }, () => t('sign_in.label'))
                    ]),

                    h(Container, {
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: isMobile ? '16' : '12'
                    }, ()=>[
                        h(Text, {
                            color: 'modalTextSecondary',
                            textAlign: 'center',
                            size: isMobile ? '16' : '14'
                        }, () => t('sign_in.description')),

                        ...signInRefs.value.status === 'idle' && signInRefs.value.errorMessage !== undefined ? [
                            h(Text, {
                                color: 'error',
                                textAlign: 'center',
                                size: isMobile ? '16' : '14'
                            }, () => signInRefs.value.errorMessage)
                        ] : []
                    ])
                ])),

                h(Container, {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8',
                    width: 'full',
                    alignItems: isMobile ? 'center' : undefined
                },()=> [
                    h(ActionButton, {
                        disabled: !signInRefs.value.nonce || signInRefs.value.status === 'verifying' || signInRefs.value.status === 'signing',
                        label: !signInRefs.value.nonce ? t('sign_in.message.preparing') :
                            signInRefs.value.status === 'signing' ? t('sign_in.signature.waiting') :
                                signInRefs.value.status === 'verifying' ? t('sign_in.signature.verifying') : t('sign_in.message.send'),
                        size: isMobile ? 'large' : 'medium',
                        onClick: signIn
                    }),

                    ...isMobile ? [
                        h(ActionButton, {
                            label: 'cancel',
                            size: 'large',
                            type: 'secondary',
                            onAction: props.onClosed
                        })
                    ] : [],

                    h(Container, {
                        as: 'button',
                        borderRadius: 'full',
                        display: 'block',
                        paddingX: '10',
                        paddingY: '5',
                        transition: 'default',
                        style: { willChange: 'transform' },
                        class: touchable({ active: 'shrink', hover: 'grow' }),
                        onClick: props.onClosed,
                    }, ()=>h(Text, {
                        color: 'closeButton',
                        size: isMobile ? '16' : '14',
                        weight: 'bold'
                    }, () => t('sign_in.message.cancel')))
                ])
            ]);
        };

    }
});