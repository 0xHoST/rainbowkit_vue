import { AsyncImageSrc } from "@/types";
import { getGradientRGBAs } from "@/utils";
import { Container } from "@/components/Common/Container";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { Text } from "@/components/Common/Text";
import { ActionButton } from "@/components/Buttons/ActionButton";
import { defineComponent, h, PropType } from "vue";

export const createDownloadOptionsProps = {
    iconAccent: String,
    iconBackground: String,
    url: String,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    actionLabel: {
        type: String,
        required: true,
    },
    isCompact: {
        type: Boolean,
        required: true,
    },
    variant: {
        type: String as PropType<'browser' | 'app' | 'desktop'>,
        required: true
    },
    iconUrl: {
        type: [String, Object] as PropType<string | AsyncImageSrc>,
        required: true
    },
    onAction: Function as PropType<(() => void)>
} as const;

export const DownloadOptionsBox = defineComponent({
    props: createDownloadOptionsProps,
    setup(props) {
        const isBrowserCard = props.variant === 'browser';
        const gradientRGBAs = !isBrowserCard && props.iconAccent && getGradientRGBAs(props.iconAccent);

        return () => {
            return h(Container, {
                alignItems: 'center',
                borderRadius: '13',
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingX: props.isCompact ? '18' : '44',
                position: 'relative',
                style: { flex: 1, isolation: 'isolate' },
                width: 'full'
            }, ()=>[
                h(Container, {
                    borderColor: 'actionButtonBorder',
                    borderRadius: '13',
                    borderStyle: 'solid',
                    borderWidth: '1',
                    style: {
                        bottom: '0',
                        left: '0',
                        right: '0',
                        top: '0',
                        position: 'absolute',
                        zIndex: 1
                    }
                }),

                ...isBrowserCard ? [
                    h(Container, {
                        background: 'downloadTopCardBackground',
                        height: 'full',
                        width: 'full',
                        position: 'absolute',
                        style: { zIndex: 0 }
                    }, ()=>h(Container, {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        style: {
                            bottom: '0',
                            filter: 'blur(20px)',
                            left: '0',
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            transform: 'translate3d(0, 0, 0)'
                        }
                    }, ()=>[
                        h(Container, {
                            style: {
                                filter: 'blur(100px)',
                                marginLeft: '-27px',
                                marginTop: '-20px',
                                opacity: 0.6,
                                transform: 'translate3d(0, 0, 0)'
                            }
                        }, ()=>h(AsyncImage, {
                            borderRadius: 'full',
                            src: props.iconUrl,
                            width: '200',
                            height: '200'
                        })),

                        h(Container, {
                            style: {
                                filter: 'blur(100px)',
                                marginLeft: '0px',
                                marginTop: '105px',
                                opacity: 0.6,
                                transform: 'translate3d(0, 0, 0)'
                            }
                        }, ()=>h(AsyncImage, {
                            borderRadius: 'full',
                            src: props.iconUrl,
                            width: '200',
                            height: '200'
                        })),
                    ]))
                ] : [],

                ...!isBrowserCard && gradientRGBAs ? [
                    h(Container, {
                        background: 'downloadBottomCardBackground',
                        style: {
                            bottom: '0',
                            left: '0',
                            position: 'absolute',
                            right: '0',
                            top: '0'
                        },
                    }, ()=>[
                        h(Container, {
                            position: 'absolute',
                            style: {
                                background: `radial-gradient(50% 50% at 50% 50%, ${gradientRGBAs[0]} 0%, ${gradientRGBAs[1]} 25%, rgba(0,0,0,0) 100%)`,
                                height: '564px',
                                left: '-215',
                                top: '-197',
                                transform: 'translate3d(0, 0, 0)',
                                width: '564px'
                            },
                        }),
                        h(Container, {
                            position: 'absolute',
                            style: {
                                background: `radial-gradient(50% 50% at 50% 50%, ${gradientRGBAs[2]} 0%, rgba(0, 0, 0, 0) 100%)`,
                                height: '564px',
                                left: '-1',
                                top: '-76',
                                transform: 'translate3d(0, 0, 0)',
                                width: '564px'
                            },
                        })

                    ])
                ] : [],

                h(Container, {
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '24',
                    height: 'max',
                    justifyContent: 'center',
                    style: { zIndex: 1 }
                }, ()=>[
                    h(Container,()=> [
                        ...props.iconBackground ? [
                            h(AsyncImage, {
                                src: props.iconUrl,
                                width: '60',
                                height: '60',
                                background: props.iconBackground,
                                borderColor: 'generalBorder',
                                borderRadius: '10'
                            })
                        ] : [
                            h(AsyncImage, {
                                src: props.iconUrl,
                                width: '60',
                                height: '60'
                            })
                        ],
                    ]),

                    h(Container, {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4',
                        style: { flex: 1 },
                        width: 'full'
                    }, ()=>[
                        h(Text, {
                            color: 'modalText',
                            size: '14',
                            weight: 'bold'
                        }, () => props.title),

                        h(Text, {
                            color: 'modalTextSecondary',
                            size: '14',
                            weight: 'medium'
                        }, () => props.description),

                        h(Container, {
                            marginTop: '14',
                            width: 'max'
                        }, ()=>h(ActionButton, {
                            href: props.url,
                            label: props.actionLabel,
                            onClick: props.onAction,
                            size: 'medium'
                        }))
                    ])
                ])

            ])
        };
    },
});