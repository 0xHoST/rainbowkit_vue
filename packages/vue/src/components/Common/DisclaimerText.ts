import { Text } from "@/components/Common/Text"
import { defineComponent, h } from "vue"

export const DisclaimerText = defineComponent({
    setup(_, { slots }) {
        return () => {
            return h(Text, {
                color: 'modalTextSecondary',
                size: '12',
                weight: 'medium'
            }, slots.default ? slots.default : undefined)
        }
    },
});

export type DisclaimerTextComponent = typeof DisclaimerText;
