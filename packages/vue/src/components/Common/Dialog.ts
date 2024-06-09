import { useModalSizeContext, useThemeContext } from "@/composables";
import { Sprinkles,  dialogContentMobile, bottomSheetOverrides, dialogContentWideMobile, dialogContentCompactMode, dialogContentWideDesktop, dialogContent, overlay, content } from "@/css";
import { Container } from "@/components/Common/Container";
import { FocusTrap } from "@/components/Common/FocusTrap";
import { isMobile } from "@/utils";
import { computed, defineComponent, Directive, h, PropType, resolveDirective, Teleport, withDirectives } from "vue";

export const createDialogProps = {
    paddingBottom: String as PropType<Sprinkles['paddingBottom']>,
    marginTop: String as PropType<Sprinkles['marginTop']>,
    padding: {
        type: String as PropType<Sprinkles['padding']>,
        default: '16',
    },
    bottomSheetOnMobile: {
        type: Boolean,
        default: false,
    },
    identifier: {
        type: String,
        default: 'rk-dialog',
    },
    target: {
        type: String,
        default: 'body',
    },
    wide: {
        type: Boolean,
        default: false,
    },
    open: {
        type: Boolean,
        default: false,
    },
} as const;

export const Dialog = defineComponent({
    props: createDialogProps,
    emits: [ 'closed' ],
    setup(props, { slots, emit }) {
        const { compactModeEnabled } = useModalSizeContext()
        const classes = computed<string>(() => {
            const classesInArray: Array<string> = []

            if (isMobile) {
                classesInArray.push(dialogContentMobile)
            }

            if (isMobile && props.bottomSheetOnMobile) {
                classesInArray.push(bottomSheetOverrides)
            }

            if (isMobile && props.wide) {
                classesInArray.push(dialogContentWideMobile)
            }

            if (!isMobile && props.wide) {
                classesInArray.push(
                    compactModeEnabled.value ? dialogContentCompactMode : dialogContentWideDesktop
                )
            }

            if (!props.wide) {
                classesInArray.push(dialogContent)
            }

            return classesInArray.join(' ')
        });

        function handleBackdrop() {
            emit('closed');
            document.body.blur();
            return true;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key !== 'Escape') return false;
            emit('closed');
            document.body.blur();
            return true;
        }

        return () => {
            const vScrollLock = resolveDirective('scroll-lock');
            return props.open ? h(Teleport, { to: props.target }, withDirectives(h(Container, {
                'data-rk-vue': true,
            },()=>h(Container, {
                alignItems: isMobile ? "flex-end" : "center",
                position: "fixed",
                role: "dialog",
                class: overlay,
                'data-rk-vue': true,
                "aria-modal": true,
                "aria-label-by": props.identifier,
            },()=> h(FocusTrap, {
                class: content,
                active: props.open,
                clickOutsideDeactivates: handleBackdrop,
                escapeDeactivates: handleEscape,
                role: 'document'
            },()=> h(Container, {
                marginTop: props.marginTop,
            },()=> h(Container, {
                class: classes.value,
            },()=> h(Container, {
                padding: props.padding,
                paddingBottom: props.paddingBottom ?? props.padding
            }, ()=> slots.default? slots.default() : undefined)))))), 
            [
                [vScrollLock, props.open] as [Directive | undefined, any]
            ])) : undefined;
        }
    },
});