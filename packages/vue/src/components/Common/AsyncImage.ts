import { AsyncImageSrc, ContainerProps, CustomBorderColor } from '@/types'
import { Container } from '@/components/Common/Container'
import { loadImage } from '@/composables'
import { isIOS } from '@/utils'
import { defineComponent, h, onMounted, PropType, ref } from 'vue'

export const createAsyncImageProps = {
    alt: String,
    background: String,
    src: [String, Function] as PropType<AsyncImageSrc | string | undefined>,
    borderRadius: String as PropType<ContainerProps<'div'>['borderRadius']>,
    borderColor: [String, Object] as PropType<
        ContainerProps<'div'>['borderColor'] | CustomBorderColor
    >,
    boxShadow: String as PropType<ContainerProps<'div'>['boxShadow']>,
    useAsImage: {
        type: Boolean,
        default: false
    },
    width: {
        type: [String, Number] as PropType<ContainerProps<'div'>['width'] | number>,
        required: true
    },
    height: {
        type: [String, Number] as PropType<ContainerProps<'div'>['height'] | number>,
        required: true
    }
} as const

export const AsyncImage = defineComponent({
    props: createAsyncImageProps,
    setup(props) {
        const source = ref<string>('')
        const isRemoteImage = ref<boolean>(source.value !== undefined && /^http/.test(source.value))
        const isRemoteImageLoaded = ref<boolean>(false)

        const onLoadRemoteImage = () => {
            if (props.useAsImage) return
            isRemoteImageLoaded.value = true
        }
        onMounted(() => {
            loadImage(props.src).then((url) => {
                source.value = url ?? ''
                isRemoteImage.value = source.value !== undefined && /^http/.test(source.value)
            })
        })

        return () => h(
            Container,
            {
                overflow: 'hidden',
                position: 'relative',
                role: 'img',
                borderRadius: props.borderRadius,
                boxShadow: props.boxShadow,
                height: typeof props.height === 'string' ? props.height : undefined,
                width: typeof props.width === 'string' ? props.width : undefined,
                style: [
                    { background: props.background },
                    typeof props.width === 'number' ? { width: `${props.width}px` } : undefined,
                    typeof props.height === 'number' ? { height: `${props.height}px` } : undefined
                ]

            },
            ()=>h(Container,
                {
                    src: props.src,
                    'aria-hidden': true,
                    as: 'img',
                    height: 'full',
                    width: 'full',
                    position: 'absolute',
                    rel: 'preload',
                    backgroundSize: props.useAsImage && !isRemoteImage.value ? 'cover' : undefined,
                    WebkitUserSelect: props.useAsImage && !isRemoteImage.value
                        ? isIOS
                            ? 'none'
                            : undefined
                        : isIOS
                            ? 'none'
                            : undefined,
                    style: [
                        { '-webkit-touch-callout': 'none' },
                        { transition: 'opacity .15s linear' },
                        { 'user-select': 'none' },
                        !props.useAsImage ? isRemoteImage.value
                            ? {
                                opacity: isRemoteImageLoaded.value ? '1' : '0'
                            }
                            : {
                                'background-image': source.value ? `url(${source.value})` : undefined,
                                'background-repeat': 'no-repeat',
                                opacity: source.value ? '1' : '0'
                            }
                            : {}
                    ],
                    onLoad: onLoadRemoteImage
                },
                props.borderColor ? ()=>h(Container, {
                    borderRadius: props.borderRadius,
                    borderStyle: 'solid',
                    borderWidth: '1',
                    height: 'full',
                    position: 'relative',
                    width: 'full',
                    borderColor:
                        typeof props.borderColor === 'object' && 'custom' in props.borderColor ? undefined : props.borderColor,
                    style: [
                        typeof props.borderColor === 'object' && 'custom' in props.borderColor
                            ? { 'border-color': props.borderColor.custom }
                            : undefined
                    ]
                }) : undefined
            )
        );
    }
})
