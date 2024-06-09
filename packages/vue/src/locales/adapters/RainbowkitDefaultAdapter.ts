import { fetchTranslations } from "@/utils";
import type { 
    Locale,
    LocaleAdapter, 
    LocaleAdapterInstance, 
    LocaleAdapterNumberTranslationFunc, 
    LocaleAdapterTextTranslationFunc, 
    LocaleMessages, 
    LocaleMixedType, 
    LocaleOptions 
} from "@/types";
import { Ref } from "vue";

export function createRainbowKitDefaultAdapter():LocaleAdapter{
    function isObject(obj:LocaleMixedType){
        return obj !== null && typeof obj === 'object' && obj !== undefined;
    }

    function isNumber(obj:LocaleMixedType){
        return obj !== null && typeof obj === 'number' && obj !== undefined;
    }

    function isString(obj:LocaleMixedType){
        return obj !== null && typeof obj === 'string' && obj !== undefined;
    }

    function isBoolean(obj:LocaleMixedType){
        return obj !== null && typeof obj === 'boolean' && obj !== undefined;
    }

    function isArray(obj:LocaleMixedType){
        return Array.isArray(obj);
    }

    function isLocaleMessages(messages: LocaleMessages | string) : messages is LocaleMessages{
        return isObject(messages) && !isArray(messages);
    }

    function isNumberFormatOptions(options: Intl.NumberFormatOptions) : options is Intl.NumberFormatOptions{
        try{
            Intl.NumberFormat(undefined,options);
            return true;
        }catch(error){
            return false;
        }
    } 

    function flattenTranslation(
        translationObject: LocaleMessages,
        locale: string,
      ): LocaleMessages {
        const result: LocaleMessages = {};
    
        const flatten = (
          currentTranslationObj: LocaleMessages,
          parentKey: string,
        ) => {
          for (const key of Object.keys(currentTranslationObj)) {
            // Generate a new key for each iteration e.g 'en-US.connect.title'
            const newKey = `${parentKey}.${key}`;
            const currentValue = currentTranslationObj[key];
    
            // If more nested values are encountered in the object, then
            // the same function will be called again
            if (typeof currentValue === 'object' && currentValue !== null) {
              flatten(currentValue, newKey);
            } else {
              // Otherwise, assign the result to the final
              // object value with the new key
              result[newKey] = currentValue;
            }
          }
        };
    
        flatten(translationObject, locale);
        return result;
      }
    

    function getResourceFromMessages(messages: LocaleMessages | string, targetKey: string, placeHolders: Record<string,any>[]): string{
        if(!isLocaleMessages(messages)) return targetKey;
        ///sign_in.message.preparing
        for(const key of Object.keys(messages)){
            const values = messages[key];
            if(isString(values) && targetKey === key){
                return translateWithPlaceholder(values as string,placeHolders);
            }
            ///
            if(isLocaleMessages(values) && targetKey !== key){
                return getResourceFromMessages(values,targetKey,placeHolders);
            }  
        }

        return targetKey;
    }

    function translateWithPlaceholder(message:string,placeHolders: Array<Record<string,any>>){
        let translatedMessage = message; 
        for(const placeHolder of placeHolders){

            const newPlaceHolder = placeHolder[0];
            if(!newPlaceHolder) continue;

            const keys = Object.keys(newPlaceHolder);
            if(!keys) continue;
            
            keys.map((key)=>{
                
                const value = newPlaceHolder[key];
                const formattedKey = `%{${key}}`;
                
                if(isObject(value) || isArray(value)) return; /// currently no support for object and array
                if(isBoolean(value)){
                    translatedMessage = translatedMessage.trim().replace(formattedKey,String(value as boolean));
                    return;
                }
                if(isNumber(value)){
                    translatedMessage = translatedMessage.trim().replace(formattedKey,(value as number).toString());
                    return;
                }

                translatedMessage = translatedMessage.trim().replace(formattedKey.trim(),value);
            })
        }
        
        return translatedMessage;
    }

    function createTranslateNumberFunc():LocaleAdapterNumberTranslationFunc{
        return (currentLocale:string,fallbackLocale:string, value:number,...args:any)=>{
            if(!isNumberFormatOptions(args)) return value.toString();
            if(!currentLocale && !fallbackLocale) return value.toString();
            const formatter = new Intl.NumberFormat([ currentLocale, fallbackLocale ],args);
            return formatter.format(value);
        }
    }

    function createTranslateTextFunc(): LocaleAdapterTextTranslationFunc{
        return (fallbackLocale: string, currentLocale: string,messages:LocaleMessages,key:string,...params:Record<string,any>[])=>{
            if(!key.startsWith(`${currentLocale}.`)){
               return translateWithPlaceholder(key,params);
            }
            
            if(!fallbackLocale && !currentLocale) return key;

            let message = key;
            const formattedKey = key;
            if(currentLocale){
                message = getResourceFromMessages(messages,formattedKey,params);
                return message;
            }

            message = getResourceFromMessages(messages,formattedKey,params);
            return message;
        }
    }

    function changeLocale(adapter:Ref<LocaleAdapterInstance>,newLocale:Locale){
        adapter.value = {
            ...adapter.value,
            messages: flattenTranslation(fetchTranslations(newLocale),newLocale),
            currentLocale: newLocale,
        }
    }

    function install(option?:LocaleOptions): LocaleAdapterInstance{
        
        const currentLocale = option?.locale ?? "en";
        const fallbackLocale = option?.fallbackLocale ?? "en";

        const currentMessages = flattenTranslation(fetchTranslations(currentLocale),currentLocale); 
        const optionMessages = option?.message;
        if(optionMessages){
            const messages = { ...currentMessages,...flattenTranslation(optionMessages,currentLocale) };

            return {
                name: "RainbowKit Vue",
                currentLocale,
                fallbackLocale,
                messages,
                changeLocale,
                t: createTranslateTextFunc(),
                n: createTranslateNumberFunc(),
            };
        }
        
        const messages = { ...currentMessages };

        return {
            name: "RainbowKit Vue",
            currentLocale,
            fallbackLocale,
            messages,
            changeLocale,
            t: createTranslateTextFunc(),
            n: createTranslateNumberFunc(),
        }
    }

    return { install }
} 