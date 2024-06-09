import { useAvatarContext } from "@/composables";
import { Container } from "@/components/Common/Container";
import { SpinnerIcon } from "@/components/Icons/SpinnerIcon";
import { Address, createAvatarComponent } from "@/types";
import { defineComponent, h, PropType } from "vue";
import { EmojiAvatar } from '@/components/AccountModal/EmojiAvatar'

export const createAvatarProps = {
    address: {
        type: String as PropType<Address>,
        required: true,
    },
    loading: Boolean,
    imageUrl: [ String, null ] as PropType<string|null>,
    size: {
        type: Number,
        required: true,
    }
} as const

export const Avatar = defineComponent({
    props: createAvatarProps,
    setup(props) {
        const AvatarComponentFn = useAvatarContext();
        const AvatarComponent = AvatarComponentFn.value ? createAvatarComponent(AvatarComponentFn.value) : undefined;
        return ()=>{
            return h(Container,{
                'aria-hidden': true,
                borderRadius: 'full',
                overflow: 'hidden',
                position: 'relative',
                userSelect: 'none',
                style: { height: `${props.size}px`, width: `${props.size}px` } 
            },()=>[
                h(Container,{
                    alignItems: 'center',
                    borderRadius: 'full',
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'absolute',
                    userSelect: 'none',
                    style: {
                        fontSize: `${Math.round(props.size ?? 0 * 0.55)}px`,
                        height: `${props.size}px`,
                        transform: props.loading ? 'scale(0.72)' : undefined,
                        transition: '.25s ease',
                        transitionDelay: props.loading ? undefined : '.1s',
                        width: `${props.size}px`,
                        willChange: 'transform'
                    }
                },()=> AvatarComponent !== undefined ? h(AvatarComponent,{
                    size: props.size,
                    address: props.address,
                    ensImage: props.imageUrl
                }): h(EmojiAvatar,{
                    size: props.size,
                    address: props.address,
                    ensImage: props.imageUrl
                })),

                ...props.loading ? [
                    h(Container,{
                        color: 'accentColor',
                        display: 'flex',
                        height: 'full',
                        width: 'full',
                        position: 'absolute'
                    },()=>h(SpinnerIcon))
                ] : [],
            ])
        }
    },
});