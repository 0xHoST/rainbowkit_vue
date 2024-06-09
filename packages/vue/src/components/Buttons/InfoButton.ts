import { Container } from "@/components/Common/Container";
import { InfoIcon } from "@/components/Icons/InfoIcon";
import { isMobile } from "@/utils";
import { touchable } from "@/css";
import { defineComponent, h } from "vue"

export const createInfoButtonProps = {
    ariaLabel: {
        type: String,
        default: 'Info'
    },
} as const;

export const InfoButton = defineComponent({
    props: createInfoButtonProps,
    emits: [ 'action' ],
    setup(props, { emit }) {
        return () => {
            return h(Container, {
                as: 'button',
                alignItems: 'center',
                background: 'closeButtonBackground',
                borderColor: 'actionButtonBorder',
                borderRadius: 'full',
                borderStyle: 'solid',
                color: 'closeButton',
                display: 'flex',
                height: isMobile ? '30' : '28',
                justifyContent: 'center',
                transition: 'default',
                type: 'button',
                width: isMobile ? '30' : '28',
                onClick: ()=> emit('action'),
                "aria-label": props.ariaLabel,
                borderWidth: isMobile ? '0' : '1',
                class: touchable({ active: 'shrinkSm', hover: 'growLg' }),
                style: { 'will-change': 'transform' },
            }, ()=>h(InfoIcon))
        }
    },
});