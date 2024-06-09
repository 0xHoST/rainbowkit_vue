import { RainbowKitInstructionStepName, WalletConnector } from "@/types";
import { ScanIcon } from "@/components/Icons/ScanIcon";
import { RefreshIcon } from "@/components/Icons/RefreshIcon";
import { CreateIcon } from "@/components/Icons/CreateIcon";
import { AsyncImage } from "@/components/Common/AsyncImage";
import { defineComponent, h, PropType } from "vue";

export const createStepProps = {
    step: {
        type: String as PropType<RainbowKitInstructionStepName>,
        required: true,
    },
    wallet: Object as PropType<WalletConnector>
} as const;

export const StepIcon = defineComponent({
    props: createStepProps,
    setup(props) {
        return ()=>{
            if(props.step === 'scan'){
                return h(ScanIcon);
            }
            else if(props.step === 'refresh'){
                return h(RefreshIcon);
            }
            else if(props.step === 'create'){
                return h(CreateIcon);
            }
            
            return h(AsyncImage,{
                background: props.wallet?.iconBackground,
                borderColor: 'generalBorder',
                borderRadius: '10',
                height: '48',
                width: '48',
                src: props.wallet?.iconUrl
            })
        }
    },
});


