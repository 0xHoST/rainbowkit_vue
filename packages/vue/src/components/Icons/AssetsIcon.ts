import { AsyncImage } from "@/components/Common/AsyncImage";
import AssetSvg from '@/assets/assets.svg?url';
import { defineComponent, h } from "vue";

export const AssetsIcon = defineComponent({
    setup() {
        return ()=>{
            return h(AsyncImage,{
                background: "#d0d5de",
                borderRadius: '10',
                height: 48,
                width: 48,
                src: AssetSvg
            })
        }
    },
});