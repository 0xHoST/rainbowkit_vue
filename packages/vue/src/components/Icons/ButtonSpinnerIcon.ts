import { SpinnerIconClassName, SpinnerIconPathClassName } from "@/css";
import { randomize } from "@/utils";
import { defineComponent, h, PropType } from "vue";

export const createSpinnerIconProps = {
    width: {
        type: [ Number, String ] as PropType<number|string>,
        default: 21
    },
    height:  {
        type: [ Number, String ] as PropType<number|string>,
        default: 21
    }
} as const;

export const ButtonSpinnerIcon = defineComponent({
    props: createSpinnerIconProps,
    setup(props) {
        const identifier = randomize('spinner');
        return ()=>{
            return h('svg',{
                fill:"none",
                viewBox:"0 0 21 21",
                xmlns:"http://www.w3.org/2000/svg",
                class: SpinnerIconClassName,
                height: props.height,
                width: props.width,
                innerHTML: `
                    <title>loading</title>
                    <clipPath id="${identifier.value}">
                        <path d="M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C11.3284 18 12 18.6716 12 19.5C12 20.3284 11.3284 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 11.3284 20.3284 12 19.5 12C18.6716 12 18 11.3284 18 10.5C18 6.35786 14.6421 3 10.5 3Z"/>
                    </clipPath>
                    <foreignObject clip-path="url(#${identifier.value})" height="21" width="21" x="0" y="0">
                        <div class="${SpinnerIconPathClassName}" />
                    </foreignObject>
                `
            })
        }

    },
});