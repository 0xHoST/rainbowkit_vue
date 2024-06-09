import { AsyncImage } from "@/components/Common/AsyncImage";
import { defineComponent, h } from "vue";
import CreateSvg from '@/assets/create.svg?url';

export const CreateIcon = defineComponent({
    setup() {
        return ()=>{
            return h(AsyncImage,{
                background: '#e3a5e8',
                borderColor: 'generalBorder',
                borderRadius: '10',
                height: '48',
                width: '48',
                src: CreateSvg
            });
        }
    },
});