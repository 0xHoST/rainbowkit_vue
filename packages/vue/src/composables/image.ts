import type { AsyncImageSrc } from "@/types";
import  { type Ref, watch } from "vue";

const cachedUrls = new Map<AsyncImageSrc, string>();
const cachedRequestPromises = new Map<AsyncImageSrc, Promise<string | undefined>>();

export function useResolveAsyncImage(url?: Ref<string | AsyncImageSrc>) : string| undefined{
    if(!url) return;
    const cachedUrl = typeof url.value === 'function' ? cachedUrls.get(url.value) : undefined;
    watch(url,(newUrl,_)=>{
        if(typeof newUrl === 'function' && !cachedUrl){
            loadImage(newUrl).then(()=>{
                url.value = newUrl; /// force update 
            });
        }
    })
    return typeof url.value === 'function' ? cachedUrl: url.value;
}

const progress = (image: AsyncImageSrc):Promise<string|undefined> =>{
    const promise = cachedRequestPromises.get(image);
    if (promise) return promise;
    
    const load = async () => image().then(async (url: string) => {
        cachedUrls.set(image, url);
        return url;
    });

    const requestPromise = load().catch((_err) => {
        return load().catch((_err) => {
            return undefined;
        });
    });

    cachedRequestPromises.set(image, requestPromise);
    return requestPromise;
};

export function loadImage(url?:string | AsyncImageSrc): Promise<string | undefined>{
    const cachedUrl = typeof url === 'function' ? cachedUrls.get(url) : undefined;
    if(typeof url === 'function' && !cachedUrl){
        return progress(url);
    }
    return Promise.resolve(typeof url === 'function' ? cachedUrl : url);
}

export async function loadImages(...urls: Array<string|AsyncImageSrc>) : Promise<(string | undefined)[]>{
    return await Promise.all(
        urls.map((url) => (typeof url === 'function' ? progress(url) : url)),
    );
}
