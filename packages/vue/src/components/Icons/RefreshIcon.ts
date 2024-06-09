import { AsyncImage } from "@/components/Common/AsyncImage"
import { defineComponent, h } from "vue"
import RefreshSvg from '@/assets/refresh.svg?url'

export const RefreshIcon = defineComponent({
    setup() {
        return ()=>{
            return h(AsyncImage,{
                background: '#515a70',
                borderColor: 'generalBorder',
                borderRadius: '10',
                height: '48',
                width: '48',
                src: RefreshSvg
            });
        }
    },
});