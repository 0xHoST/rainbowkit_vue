import type { WindowSize } from "@/types"
import { debounce } from "@/utils"
import { ref, watchEffect } from "vue"

export const useWindow = ()=>{
    const windowSize = ref<WindowSize>({
        height: window.innerHeight,
        width: window.innerWidth
    });
    
    const handleResize = ()=>{
        windowSize.value = {
            height: window.innerHeight,
            width: window.innerWidth
        };
    };

    const debouncedResizeHandler = debounce(handleResize, 500);
    watchEffect((onInvalidate) => {
        window.addEventListener('resize', debouncedResizeHandler);
        handleResize();
        // Cleanup
        onInvalidate(() => {
          window.removeEventListener('resize', debouncedResizeHandler);
        });
    });
    
    return windowSize;
}