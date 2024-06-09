import { sprinkles, type Atoms, type Sprinkles } from '@/css'
import { reset, base } from "@/css/reset.css";
import type { ResetCssStyleType, IntrinsicElementAttributesKey } from '@/types'
import { computed, defineComponent, h, normalizeClass, ref, watch } from 'vue'

type CombineProps = Sprinkles & { as?: IntrinsicElementAttributesKey, testId?: string };
export const Container = defineComponent((props: CombineProps,{ slots, expose })=>{
  
    const atom = ref<Record<string, unknown>>({});
    const attributes = ref<Record<string, unknown>>({});
    const component = ref<string>(props.as ?? "div");
    const element = ref<HTMLElement>();
        
    const generateClasses = ({ resetKey, ...classes }: Atoms) =>{
      if (!resetKey) return sprinkles(classes)
      const resetClass = reset[resetKey]
      const sprinklesClasses = sprinkles(classes)
      return normalizeClass([resetClass, base, sprinklesClasses,  ])
    }

    const generateAttributesAndAtoms = (props:CombineProps) =>{
      const newAtom: Record<string,unknown> = {};
      const newAtribute: Record<string,unknown> = {};
      for (const key in props) {
        if (key === 'as') continue;
        const values = props[key as keyof Sprinkles];
        if (!values) continue;
        if (!sprinkles.properties.has(key as keyof Omit<Atoms, 'resetKey'>) && key !== 'as') {
          newAtribute[key] = props[key as keyof Sprinkles];
          continue;
        }
        newAtom[key] = values
      }

      attributes.value = newAtribute;
      atom.value = newAtom;
    }

    generateAttributesAndAtoms(props);
    watch(props,(newProps,_)=>{
      generateAttributesAndAtoms(newProps)
    });

    expose({ element });
    const atomic = computed(()=>generateClasses({ resetKey: component.value as keyof ResetCssStyleType, ...atom.value }));
    return ()=> h(component.value,{ ref: element, class: atomic.value, ...attributes.value }, slots.default ? slots.default() : undefined)
},{ props: [ ...sprinkles.properties, "as", "testId" ] })