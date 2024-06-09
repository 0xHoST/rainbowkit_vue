import { WalletConnector } from "@/types";
import { DeepReadonly, defineComponent, h, PropType } from "vue";
import { spinner,rotatingBorder } from '@/css';

export const createLoadingSpinnerIconProps = {
    wallet: {
        type: Object as PropType<WalletConnector>,
        required: true,
    }
} as const;

export const LoadingSpinnerIcon = defineComponent({
    props: createLoadingSpinnerIconProps,
    setup(props) {
        const width = 80;
        const height = 80;
        const radiusFactor = 20;
        const perimeter = 2 * (width + height - 4 * radiusFactor);
        return ()=>{
            return h('svg',{
                class: spinner,
                viewBox: '0 0 86 86',
                weight: '86',
                height: '86',
                innerHTML: `
                    <title>loading</title>
                    <rect x="3" 
                        y="3" 
                        rx="${radiusFactor}" 
                        ry="${radiusFactor}" 
                        class="${rotatingBorder}"
                        strokeDasharray="${perimeter / 3} ${(2 * perimeter) / 3}" 
                        strokeDashoffset="${perimeter}" 
                        style="stroke:${props.wallet?.iconAccent || '#0D3887'}" 
                        width="${width}" 
                        height="${height}" />
                `,
            })
        }
    },
});