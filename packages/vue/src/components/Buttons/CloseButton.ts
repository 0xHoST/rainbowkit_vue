import { Container } from "@/components/Common/Container";
import { CloseIcon } from "@/components/Icons/CloseIcon";
import { isMobile } from "@/utils";
import { touchable } from "@/css";
import { defineComponent, h } from "vue";

export const createCloseButton = {
    ariaLabel: {
        type: String,
        default: 'Close',
    },
} as const;

export const CloseButton = defineComponent({
    props: createCloseButton,
    emits: [ 'closed' ],
    setup(props,{ emit }) {
        return ()=> h(Container,{
            as: "button",
            alignItems: "center",
            background: "closeButtonBackground",
            borderColor: "actionButtonBorder",
            borderStyle: "solid",
            borderRadius: "full",
            color: "closeButton",
            display: "flex",
            justifyContent: "center",
            transition: "default",
            type: "button",
            'aria-label': props.ariaLabel,
            width: isMobile ? '30' : '28',
            height: isMobile ? '30' : '28',
            borderWidth: isMobile ? '0' : '1',
            style: { 'will-change': 'transform' },
            class: touchable({ active: 'shrinkSm', hover: 'growLg' }),
            onClick: ()=> emit('closed')
        },()=>h(CloseIcon))
    },
});