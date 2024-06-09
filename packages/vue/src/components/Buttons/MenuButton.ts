import { Container } from "@/components/Common/Container";
import { isMobile } from "@/utils";
import { touchable, unsetBackgroundOnHover } from "@/css";
import { computed, defineComponent, h } from "vue"

export const createMenuButtonProps = {
    currentlySelected: {
        type: Boolean,
        default: false
    },
} as const;

export const MenuButton = defineComponent({
    props: createMenuButtonProps,
    emits: [ 'action' ],
    setup(props, { slots, emit }) {
        const classes = computed(() => {
            const result: Array<string> = [];
            if (isMobile) {
                result.push(unsetBackgroundOnHover)
            }

            if (!props.currentlySelected) {
                result.push(touchable({ active: 'shrink' }))
            }
            return result;
        })
        return () => {
            return h(Container, {
                as: 'button',
                borderRadius: 'menuButton',
                display: 'flex',
                type: 'button',
                disabled: props.currentlySelected,
                onClick: ()=> emit('action')
            }, ()=>h(Container, {
                borderRadius: "menuButton",
                width: "full",
                class: classes.value,
                padding: isMobile ? '8' : '6',
                background: props.currentlySelected ? 'accentColor' : { hover: 'menuItemBackground' },
                color: props.currentlySelected ? 'accentColorForeground' : 'modalText',
                borderColor: props.currentlySelected ? 'selectedOptionBorder' : undefined,
                borderStyle: props.currentlySelected ? 'solid' : undefined,
                borderWidth: props.currentlySelected ? '1' : undefined,
                boxShadow: props.currentlySelected ? 'selectedOption' : undefined,
                transition: props.currentlySelected ? 'default' : undefined
            }, ()=>slots.default ? slots.default() : undefined))
        }
    },
});