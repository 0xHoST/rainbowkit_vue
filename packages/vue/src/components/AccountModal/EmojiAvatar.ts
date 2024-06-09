import { AvatarComponentProps } from "@/types"
import { emojiAvatarForAddress } from "@/utils"
import { Container } from "@/components/Common/Container";
import { SpinnerIcon } from "@/components/Icons/SpinnerIcon";
import { computed, defineComponent, h, onMounted, ref } from "vue"

export const EmojiAvatar = defineComponent<AvatarComponentProps>(
    (props: AvatarComponentProps,_)=> {
      const loaded = ref<boolean>(false)
      const { ensImage, address } = props
      const handleImage = () => {
        if (!ensImage) return
        const img = new Image()
        img.src = ensImage
        img.onload = () => (loaded.value = true)
      }
      const emoji = computed(() => emojiAvatarForAddress(address))
      onMounted(() => handleImage())
  
      return ()=>{
        if(loaded.value && ensImage){
            return h(Container,{ 
                backgroundSize: 'cover', 
                borderRadius: 'full', 
                position: 'absolute', 
                style: {  
                    backgroundImage: `url(${ensImage})`,
                    backgroundPosition: 'center',
                    height: `${props.size}px`,
                    width: `${props.size}px` 
                } 
            });
        }
        else if(!loaded.value && ensImage){
            return h(Container,{
                alignItems: 'center',
                backgroundSize: 'cover',
                borderRadius: 'full',
                color: 'modalText',
                display: 'flex',
                justifyContent: 'center',
                position:'absolute',
                style: {
                    height: `${props.size}px`,
                    width: `${props.size}px`
                }
            },()=>SpinnerIcon);
        }else{
            return h(Container,{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
                style: {
                    background: emoji.value.color,
                    height: `${props.size}px`,
                    width: `${props.size}px`
                }
            },()=>emoji.value.emoji); ///Non-function value encountered for default slot. Prefer function slots for better performance.  : This used only for those string 
        }

      }
    },
    { props: ['size', 'ensImage', 'address'] }
  )