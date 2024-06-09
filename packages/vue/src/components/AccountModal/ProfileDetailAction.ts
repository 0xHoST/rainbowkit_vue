import { Container } from "@/components/Common/Container";
import { Text } from "@/components/Common/Text";
import { isMobile } from "@/utils";
import { touchable } from "@/css";
import { Component, defineComponent, h, PropType } from "vue";

export const createProfileDetailActionProps = {
    label: {
        type: String,
        required: true,
    },
    url: String,
    icon: {
        type: Object as PropType<Component>,
        required: true,
    }
} as const;

export const ProfileDetailAction = defineComponent({
    props: createProfileDetailActionProps,
    emits: [ 'action' ],
    setup(props,{ emit }) {
        return () => {
            return h(Container, props.url !== undefined ? {
                as: 'a',
                href: props.url,
                rel: 'noreferrer noopener',
                target: '_blank',
                background: {
                    base: 'profileAction',
                    ...(!isMobile ? { hover: 'profileActionHover' } : {}),
                },
                borderRadius: 'menuButton',
                boxShadow: 'profileDetailsAction',
                class: touchable({
                    active: 'shrinkSm',
                    hover: !isMobile ? 'grow' : undefined
                }),
                display: 'flex',
                padding: isMobile ? '6' : '8',
                style: { willChange: 'transform' },
                transition: 'default',
                width: 'full',
                onClick: ()=> emit('action')
            } : {
                as: 'button',
                type: 'button',
                background: {
                    base: 'profileAction',
                    ...(!isMobile ? { hover: 'profileActionHover' } : {}),
                },
                borderRadius: 'menuButton',
                boxShadow: 'profileDetailsAction',
                class: touchable({
                    active: 'shrinkSm',
                    hover: !isMobile ? 'grow' : undefined,
                }),
                display: 'flex',
                padding: isMobile ? '6' : '8',
                style: { willChange: 'transform' },
                transition: 'default',
                width: 'full',
                onClick: ()=> emit('action')
            }, ()=>h(Container, {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
                justifyContent: "center",
                paddingTop: '2',
                width: 'full'
            },()=> [
                h(Container,{
                    color: 'modalText',
                    height: 'max'  
                },props.icon ? ()=>h(props.icon) : undefined),
                h(Text,{
                    color: 'modalText',
                    size: isMobile? '12': '13',
                    weight: 'semibold'
                },()=>props.label),
            ]));
        }
    },
});