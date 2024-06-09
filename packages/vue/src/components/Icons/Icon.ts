import { defineComponent, h, PropType } from "vue";

export const createIconProps = {
    viewBox: {
        type: String,
        required: true
    },
    width: {
        type: [ Number, String ] as PropType<number|string>,
        required: true
    },
    height:{
        type: [ Number, String ] as PropType<number|string>,
        required: true
    },
    fillColor:{
        type: String,
        default: 'currentColor',
    },
    fillSvg: {
        type: String,
        default: 'none'
    },
    title: {
        type: String,
        required: true
    },
    d:{
        type: String,
        required: true,
    }
};

export const Icon = defineComponent({
    props: createIconProps,
    setup(props) {
        return ()=>{
            return h('svg',{
                'aria-hidden': true,
                height: props.height,
                width: props.width,
                fill: props.fillSvg,
                viewBox: props.viewBox,
                xmlns: "http://www.w3.org/2000/svg",
                innerHTML: `
                    <title>${props.title}</title>
                    <path d="${props.d}" fill="${props.fillColor}" />
                `
            });
        }
    },
})