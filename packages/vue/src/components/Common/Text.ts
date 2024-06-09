import { ContainerProps } from "@/types";
import { Container } from "@/components/Common/Container";
import { defineComponent, h, PropType, ExtractPropTypes } from "vue";

export const createTextProps = {
    id: String,
    tag: {
        type: String as PropType<'code' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'p' | 'span'>,
        default: 'div',
    },
    color: {
        type: String as PropType<ContainerProps<'div'>['color']>,
        default: 'modalText',
    },
    font:{ 
        type: String as PropType<ContainerProps<'div'>['fontFamily']>,
        default: 'body',
    },
    size: {
        type: String as PropType<ContainerProps<'div'>['fontSize']>,
        default: '16',
    },
    weight: {
        type: String as PropType<ContainerProps<'div'>['fontWeight']>,
        default: 'regular',
    },
    className: {
        type: String,
        default: '',
    },
    tabIndex: {
        type: Number,
        default: 0,
    },
    textAlign: {
        type: String as PropType<ContainerProps<'div'>['textAlign']>,
        default: 'inherit',
    },
    display: {
        type: String as PropType<ContainerProps<'div'>['display']>,
        default: 'block',
    },
} as const;

export type TextProps = ExtractPropTypes<typeof createTextProps>;
export const Text = defineComponent({
    props: createTextProps,
    setup(props,{ slots }) {
        return ()=>{
            return h(Container,{ 
                as: props.tag,
                class: props.className,
                color: props.color,
                display: props.display,
                fontFamily: props.font,
                fontSize: props.size,
                fontWeight: props.weight,
                id: props.id,
                tabIndex: props.tabIndex,
                textAlign: props.textAlign, 
            },()=>slots.default ? slots.default() : undefined)
        }
    },
})