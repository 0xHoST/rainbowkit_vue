export const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
export const isIOS = (typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent)) || 
    (typeof navigator !== 'undefined' && (/iPad/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1)));
export const isMobile = isAndroid || isIOS;