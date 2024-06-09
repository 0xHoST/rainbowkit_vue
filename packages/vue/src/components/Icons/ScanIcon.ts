import { AsyncImage } from "@/components/Common/AsyncImage";
import { defineComponent, h } from "vue";
import ScanSvg from '@/assets/scan.svg?url';

export const ScanIcon = defineComponent({
    setup() {
        return ()=>{
            return h(AsyncImage,{
                background: '#515a70',
                borderColor: 'generalBorder',
                borderRadius: '10',
                height: '48',
                width: '48',
                src: ScanSvg
            });
        }
    },
});