import { AsyncImage } from "@/components/Common/AsyncImage";
import { defineComponent, h } from "vue";
import LoginSvg from '@/assets/login.svg?url'

export const LoginIcon = defineComponent({
    setup() {
        return ()=>{
            return h(AsyncImage,{
                background: "#d0d5de",
                borderRadius: '10',
                height: 48,
                width: 48,
                src: LoginSvg
            })
        }
    },
});