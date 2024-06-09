
export const walletConnectStorageKey = 'WALLETCONNECT_DEEPLINK_CHOICE';

export const setWalletConnectDeepLink = ({ mobileUri, name }:{ mobileUri: string, name: string }) => 
    localStorage.setItem(walletConnectStorageKey, JSON.stringify({ href: mobileUri.split('?')[0], name }));

export const clearWalletConnectDeepLink = () => localStorage.removeItems(walletConnectStorageKey);

