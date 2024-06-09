import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { isMobile } from "@/utils";
import { touchable } from "@/css";
import { css, Size } from "@/types";
import { computed, defineComponent, h, PropType } from "vue";

export const createActionButtonProps = {
    href: String,
    label: {
        type: String,
        required: true,
    },
    rel: {
        type: String,
        default: 'noreferrer noopener'
    },
    size: {
        type: String as PropType<Size>,
        default: 'medium'
    },
    target: {
        type: String,
        default: '_blank'
    },
    type: {
        type: String as PropType<'primary' | 'secondary'>,
        default: 'primary'
    },
    disabled: {
        type: Boolean,
        default: false
    }
} as const;

export const ActionButton = defineComponent({
    props: createActionButtonProps,
    emits: [ 'action' ],
    setup(props, { emit }) {

        const { fontSize, height, paddingX, paddingY } = css[props.size]
        const isPrimary = computed(() => props.type === 'primary')
        const isNotLarge = computed(() => props.size !== 'large')
        const background = computed(() => !props.disabled ? isPrimary.value ? 'accentColor' : isNotLarge.value ? 'actionButtonSecondaryBackground' : undefined : 'actionButtonSecondaryBackground')
        const hasBorder = computed(() => !isMobile || !isNotLarge.value)

        return () => {

            const label = h(Text, {
                size: fontSize,
                weight: 'bold',
                color: !props.disabled && isPrimary.value ? 'accentColorForeground' :
                    !props.disabled && !isPrimary.value ? 'accentColor' : 'modalTextSecondary',
            }, () => props.label);

            if (props.href) {
                return h(Container, {
                    as: 'a',
                    borderRadius: 'actionButton',
                    display: 'block',
                    textAlign: 'center',
                    transition: 'transform',
                    paddingX,
                    paddingY,
                    height,
                    background: background.value,
                    href: props.href,
                    rel: props.rel,
                    target: props.target,
                    class: !props.disabled ? touchable({ active: 'shrinkSm', hover: 'grow' }) : undefined,
                    onClick: !props.disabled ? ()=> emit('action') : undefined,
                    borderStyle: hasBorder.value ? 'solid' : undefined,
                    borderWidth: hasBorder.value ? '1' : undefined,
                    borderColor: isMobile && !isNotLarge.value && !isPrimary.value ? 'actionButtonBorderMobile' : 'actionButtonBorder'
                }, ()=>label);
            }

            return h(Container, {
                as: 'button',
                borderRadius: 'actionButton',
                type: 'button',
                display: 'block',
                textAlign: 'center',
                transition: 'transform',
                paddingX,
                paddingY,
                height,
                background: background.value,
                class: !props.disabled ? touchable({ active: 'shrinkSm', hover: 'grow' }) : undefined,
                onClick: !props.disabled ? ()=> emit('action') : undefined,
                borderStyle: hasBorder.value ? 'solid' : undefined,
                borderWidth: hasBorder.value ? '1' : undefined,
                borderColor: isMobile && !isNotLarge.value && !isPrimary.value ? 'actionButtonBorderMobile' : 'actionButtonBorder'
            }, ()=>label)
        }
    },
});