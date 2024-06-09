import { createElementCool, useCoolModeContext, useLocale } from '@/composables'
import { Container } from "@/components/Common/Container";
import { Text, TextProps } from "@/components/Common/Text";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { touchable, transparentBorder } from "@/css";
import type { ContainerProps, IntrinsicElementAttributesKey } from '@/types'
import { ComponentPublicInstance, defineComponent, h, onMounted, onUnmounted, PropType, ref, toRef, watch, withModifiers } from 'vue'

export const createModalSelectionProps = {
  as: {
    type: String as PropType<IntrinsicElementAttributesKey>,
    required: true,
    default: 'button'
  },
  name: {
    type: String,
    required: true
  },
  iconUrl: {
    type: [String, Function] as PropType<string | (() => Promise<string>)>,
    required: true
  },
  currentlySelected: {
    type: Boolean,
    default: false
  },
  isRainbowKitConnector: Boolean,
  iconBackground: String,
  ready: Boolean,
  recent: Boolean
} as const

export const ModalSelection = defineComponent({
  props: createModalSelectionProps,
  emits: [
    'selectWallet'
  ],
  setup(props,{ emit }) {
    let removalElementCodeFn: () => void = () => {}
    const { t } = useLocale();
    const currentlySelected = toRef(props, 'currentlySelected')
    const imageUrl = ref<string>(props.iconUrl as string)
    const background = ref<ContainerProps<'div'>['background']>({ hover: 'menuItemBackground' })
    const borderColor = ref<ContainerProps<'div'>['borderColor']>()
    const boxShadow = ref<ContainerProps<'div'>['boxShadow']>()
    const color = ref<ContainerProps<'div'>['color']>('modalText')
    const textColor = ref<TextProps['color']>('accentColor')

    const enableCoolMode = useCoolModeContext()
    const CoolModeContainer =
      ref<ComponentPublicInstance<typeof Container & { element: HTMLElement }>>()
    const isMouseOver = ref<boolean>(false)
    watch(currentlySelected, (newCurrentlySelected, _) => {
      background.value = newCurrentlySelected ? 'accentColor' : { hover: 'menuItemBackground' }
      borderColor.value = newCurrentlySelected ? 'selectedOptionBorder' : undefined
      boxShadow.value = newCurrentlySelected ? 'selectedWallet' : undefined
      color.value = newCurrentlySelected ? 'accentColorForeground' : 'modalText'
      textColor.value = newCurrentlySelected ? 'accentColorForeground' : 'accentColor'
    })

    onMounted(() => {
      if (enableCoolMode.value && CoolModeContainer.value?.element) {
        removalElementCodeFn = createElementCool(CoolModeContainer.value.element, imageUrl.value)
      }
    })

    onUnmounted(() => {
      removalElementCodeFn()
    })

    const onMouseEnter = () => {
      isMouseOver.value = true
    }
    const onMouseLeave = () => {
      isMouseOver.value = false
    }

    return () => {
        return h(Container,{
            display: 'flex',
            flexDirection: 'column',
            ref: CoolModeContainer,
            onMouseEnter: onMouseEnter,
            onMouedLeave: onMouseLeave,
        },()=>h(Container,{
            as: props.as,
            testId: "modal-selection",
            borderRadius: 'menuButton',
            borderStyle: 'solid',
            borderWidth: '1',
            class: [
                currentlySelected.value == false ? transparentBorder : '',
                currentlySelected.value == false ? touchable({ active: 'shrink' }) : ''
            ],
            disabled: currentlySelected.value,
            padding: '5',
            transition: 'default',
            width: 'full',
            background: background.value,
            borderColor: borderColor.value,
            boxShadow: boxShadow.value,
            style: { willChange: 'transform' },
            onClick: ()=>emit('selectWallet')
        },()=>h(Container,{
            color: color.value,
            fontFamily: 'body',
            fontSize: '16',
            fontWeight: 'bold',
            tabIndex: '0',
            transition: 'default'
        },()=>h(Container,{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: '12'
        },()=>[
            h(AsyncImage,{
                src: imageUrl.value,
                width: '28',
                height: '28',
                borderRadius: '6',
                useAsImage: !props.isRainbowKitConnector,
                background: props.iconBackground,
                borderColor: !isMouseOver.value && props.isRainbowKitConnector ? 'actionButtonBorder' : undefined
            }),
            h(Container,()=>[
                h(Container,{
                    maxWidth: '200',
                    style: { marginTop: props.recent ? '-2px' : undefined }
                },()=> props.name),

                ...props.recent ? [
                    h(Text,{
                        color: textColor.value,
                        size: '12',
                        weight: 'medium',
                        style: { lineHeight: 1, marginTop: '-1px' }
                    },()=> t('connect.recent'))
                ] : [],
            ])
        ]))))
    }
  }
})
