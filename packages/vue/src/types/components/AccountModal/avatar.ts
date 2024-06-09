import { defineComponent, type ComponentPublicInstance, type EmitsOptions, type ExtractPropTypes, type PropType, type RenderFunction, type SetupContext, type SlotsType } from "vue";

export const createAvatarComponentProps = {
    address: {
        type: String,
        required: true
    },
    ensImage: {
        type: [String, null] as PropType<string|null>,
    },
    size: {
        type: Number,
        required: true
    },
} as const;

export type AvatarComponentProps = ExtractPropTypes<typeof createAvatarComponentProps>;

export type AvatarProps = {
    address: `0x${string}`;
    loading?: boolean;
    imageUrl?: string | null;
    size: number;
}
export type AvatarReturnType = Object & ComponentPublicInstance;
export type AvatarComponentSetupFn<E extends EmitsOptions = {}, S extends SlotsType = SlotsType> = (props: AvatarComponentProps, ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>;
export function createAvatarComponent(setup:AvatarComponentSetupFn){
    return defineComponent({props: createAvatarComponentProps,setup});
}
export type Emoji = { color: string, emoji: string }

