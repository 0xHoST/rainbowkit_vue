
export const isArc = typeof navigator !== 'undefined' && /Version\/([0-9._]+).*Safari/.test(navigator.userAgent);
export const isSafari = typeof document !== 'undefined' && getComputedStyle(document.body).getPropertyValue('--arc-palette-focus') !== '';
export enum BrowserType {
    Arc = 'Arc',
    Brave = 'Brave',
    Browser = 'Browser',
    Chrome = 'Chrome',
    Edge = 'Edge',
    Firefox = 'Firefox',
    Opera = 'Opera',
    Safari = 'Safari',
}
export function getBrowser():BrowserType{
    if (typeof navigator === 'undefined') return BrowserType.Browser;
    const ua = navigator.userAgent.toLowerCase();
    
    // @ts-ignore - brave is not in the navigator type
    if (navigator.brave?.isBrave) return BrowserType.Brave;
    if (ua.indexOf('edg/') > -1) return BrowserType.Edge;
    if (ua.indexOf('op') > -1) return BrowserType.Opera;
    if (isArc) return BrowserType.Arc;
    if (ua.indexOf('chrome') > -1) return BrowserType.Chrome;
    if (ua.indexOf('firefox') > -1) return BrowserType.Firefox;
    if (isSafari) return BrowserType.Safari;
    return BrowserType.Browser;
}

export function getBrowserSrc(selectedBrowserType: BrowserType): string{
    return {
        [BrowserType.Arc]:  (import.meta.glob<{ default: string }>('../assets/Arc.svg',{ query: '?url',eager: true }))['../assets/Arc.svg'].default,
        [BrowserType.Brave]: (import.meta.glob<{ default: string }>('../assets/Brave.svg',{ query: '?url',eager: true }))['../assets/Brave.svg'].default,
        [BrowserType.Chrome]: (import.meta.glob<{ default: string }>('../assets/Chrome.svg',{ query: '?url',eager: true }))['../assets/Chrome.svg'].default,
        [BrowserType.Browser]: (import.meta.glob<{ default: string }>('../assets/Browser.svg',{ query: '?url',eager: true }))['../assets/Browser.svg'].default,
        [BrowserType.Edge]: (import.meta.glob<{ default: string }>('../assets/Edge.svg',{ query: '?url',eager: true }))['../assets/Edge.svg'].default,
        [BrowserType.Firefox]: (import.meta.glob<{ default: string }>('../assets/Firefox.svg',{ query: '?url',eager: true }))['../assets/Firefox.svg'].default,
        [BrowserType.Opera]: (import.meta.glob<{ default: string }>('../assets/Opera.svg',{ query: '?url',eager: true }))['../assets/Opera.svg'].default,
        [BrowserType.Safari]: (import.meta.glob<{ default: string }>('../assets/Safari.svg',{ query: '?url',eager: true }))['../assets/Safari.svg'].default
    }[selectedBrowserType];
}