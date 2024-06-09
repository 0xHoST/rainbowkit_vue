import { Ref } from "vue";

export type LocaleMixedType = object | string | boolean | number;
export type LocaleAdapterTextTranslationFunc = (fallbackLocale: string, currentLocale: string,messages:LocaleMessages,key: string, ...replacements: Record<string,any>[])=> string;
export type LocaleAdapterNumberTranslationFunc = (currentLocale:string,fallbackLocale:string,value: number, ...args: any) => string;
export type LocaleChangeFunc = (adapter: Ref<LocaleAdapterInstance>, locale:Locale) => void;
export type LocaleMessages ={
    [key: string]: LocaleMessages | string
}
export type LocaleOptions = {
    message?: LocaleMessages
    locale?: Locale
    fallbackLocale?: Locale
    adapter?: LocaleAdapterInstance
}
export type LocaleAdapterInstance = {
    name: string
    messages: LocaleMessages,
    currentLocale: Locale,
    fallbackLocale: Locale,
    t: LocaleAdapterTextTranslationFunc
    n: LocaleAdapterNumberTranslationFunc
    changeLocale: LocaleChangeFunc
}
export interface LocaleAdapter{
    install(option?:LocaleOptions | Object): LocaleAdapterInstance
}

export type Locale =
  | 'ar'
  | 'ar-AR'
  | 'en'
  | 'en-US'
  | 'es'
  | 'es-419'
  | 'fr'
  | 'fr-FR'
  | 'hi'
  | 'hi-IN'
  | 'id'
  | 'id-ID'
  | 'ja'
  | 'ja-JP'
  | 'ko'
  | 'ko-KR'
  | 'pt'
  | 'pt-BR'
  | 'ru'
  | 'ru-RU'
  | 'th'
  | 'th-TH'
  | 'tr'
  | 'tr-TR'
  | 'ua'
  | 'uk-UA'
  | 'zh'
  | 'zh-CN';

/*
A sample code for using vue-i18n plugins
i18n must be install by app before using rainbowkit vue plugin 
///app.use(i18n)
///app.use(RainbowKitVuePlugin,{ locale: createI18nAdapter() })
export const createI18nAdapter = function():LocaleAdapter{
    return {
        install(option:LocaleOptions):LocaleAdapterInstance{      
            return {} as LocaleAdapterInstance;
        },
        createProvideFunc(data: Omit<LocaleAdapterInstance,'t'|'n'|'provide'>):LocaleAdapterProvideFunc{
            return (props:LocaleOptions)=>{
                return {} as LocaleAdapterInstance;
            }
        }
    }
}*/