import { defineComponent, EmitsOptions, ExtractPropTypes, PropType, RenderFunction, SetupContext, SlotsType } from "vue";
import type { DisclaimerTextComponent } from "../../../components/Common/DisclaimerText";
import type { DisclaimerLinkComponent } from "../../../components/Common/DisclaimerLink";

export type DisclaimerLinkProps = {
    href: string
};

export const createDisclaimerProps = {
    text: {
        type: Object as PropType<DisclaimerTextComponent>,
        required: true
    },
    link: {
        type: Object as PropType<DisclaimerLinkComponent>,
        required: true,
    }
} as const;

export type DisclaimerProps = ExtractPropTypes<typeof createDisclaimerProps>;

export type DisclaimerComponentSetupFn<E extends EmitsOptions = {}, S extends SlotsType = SlotsType> = (props: DisclaimerProps,ctx: SetupContext<E, S>) => RenderFunction | Promise<RenderFunction>;
export function createDisclaimerComponent(setup:DisclaimerComponentSetupFn){
    return defineComponent({ props: createDisclaimerProps, setup });
}