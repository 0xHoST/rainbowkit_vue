import { Container } from "@/components/Common/Container"
import { defineComponent, h } from "vue"

const createDisclaimerLinkProps = {
    href: {
        type: String,
        required: true
    }
} as const;

const DisclaimerLink = defineComponent({
    props: createDisclaimerLinkProps,
    setup(props, { slots }) {
        return ()=>{
            return h(Container,{
                as: "a",
                color: "accentColor",
                rel:"noreferrer" ,
                target:"_blank",
                href: props.href
            },()=>slots.default? slots.default(): undefined)
        }
    },
});

export type DisclaimerLinkComponent = typeof DisclaimerLink;

export { DisclaimerLink, createDisclaimerLinkProps };