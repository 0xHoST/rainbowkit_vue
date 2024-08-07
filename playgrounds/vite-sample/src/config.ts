import {
    argentWallet,
    bifrostWallet,
    bitgetWallet,
    bitskiWallet,
    binanceWallet,
    bloomWallet,
    braveWallet,
    clvWallet,
    coin98Wallet,
    coreWallet,
    dawnWallet,
    desigWallet,
    enkryptWallet,
    foxWallet,
    frameWallet,
    frontierWallet,
    imTokenWallet,
    injectedWallet,
    kresusWallet,
    kaikasWallet,
    krakenWallet,
    ledgerWallet,
    metaMaskWallet,
    mewWallet,
    oktoWallet,
    okxWallet,
    omniWallet,
    oneKeyWallet,
    phantomWallet,
    rabbyWallet,
    rainbowWallet,
    ramperWallet,
    roninWallet,
    safeWallet,
    safeheronWallet,
    safepalWallet,
    subWallet,
    tahoWallet,
    talismanWallet,
    tokenaryWallet,
    tokenPocketWallet,
    trustWallet,
    uniswapWallet,
    walletConnectWallet,
    xdefiWallet,
    zealWallet,
    zerionWallet,
    RainbowKitVuePlugin,  
    RainbowKitPluginOptions,
    mainnet,
    zkSync,
    scroll,
    polygonZkEvm,
    immutableZkEvm,
    RainbowKitChain,
    coinbaseWallet,
    arbitrum,
    compassWallet,
    //createRainbowKitDefaultLocaleAdapter
} from 'use-rainbowkit-vue';
import { RainbowKitVueI18nLocaleAdapterPlugin } from 'use-rainbowkit-vue-i18n-locale-provider';
import { RainbowKitVueSiweAuthAdapterPlugin } from 'use-rainbowkit-vue-siwe-auth-provider';
import { App, h } from 'vue';
import { createI18n } from 'vue-i18n';

export function createRainbowKitConfig(app: App) : App{
    const RAINBOW_TERMS = 'https://rainbow.me/terms-of-use';
    const avalanche = {
        id: 43_114,
        name: 'Avalanche',
        iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        iconBackground: '#fff',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrls: {
            default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
        },
        blockExplorers: {
            default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
        },
        contracts: {
            multicall3: {
                address: '0xca11bde05977b3631167028862be2a173976ca11',
                blockCreated: 11_907_934,
            },
        },
    } as const satisfies RainbowKitChain;

    ///if having existing i18n 
    const newI18n = createI18n({
        locale: 'en',
        fallbackLocale: [ 'en', 'zh' ],
        legacy: false,
        globalInjection: true,
        messages:{ "en": { "wallet.module": "You can override the existing wording with same key. For example, rainbowkit existing wording" }},
    });

    function configure():RainbowKitPluginOptions{
       
        const { create: createI18nAdapter } = RainbowKitVueI18nLocaleAdapterPlugin();
        const { create: createAuthAdapter } = RainbowKitVueSiweAuthAdapterPlugin();
        
        const i18nAdapter = createI18nAdapter(app,{ 
            messages:{ "en": { "wallet.module": "You can override the existing wording with same key. For example, rainbowkit existing wording" }},
            i18n: newI18n
        });

        ///Using ngrok for https 
        const authAdapter = createAuthAdapter(app,{
            baseURL: "https://ade5-2001-d08-d9-ca7f-7de8-f114-47fb-8bf.ngrok-free.app",
            nonceData:{
                url: "/auth/get-nonce"
            },
            loginData: {
                url: "/auth/login"
            },
            logoutData: {
                url: "/auth/logout"
            },
            fetchData: {
                url: "/auth/fetch-user"
            },
            refreshToken: {
                enabled: false,
            }
        });

        //If want to change locale and don't want to use vue-i18n, use default locale adapter
        /*
          const { install: createDefaultLocaleAdapter } = createRainbowKitDefaultLocaleAdapter();
          const defaultLocaleAdapter = createDefaultLocaleAdapter({ 
            locale: 'en', 
            fallbackLocale:  'en' , 
            message: { "en": { "wallet.module": "You can override the existing language with same key or add your new language wording" }}
          })
        */
        
        ///All options are optional, except 'appName', 'projectId' and 'chains' options.
        const coinbase = coinbaseWallet.all;
        const smartWalletCoinbase = coinbaseWallet.smartWallet;
        const eoaCoinbase = coinbaseWallet.eoa;

        return {
            ///Default options 
            appName: 'RainbowKit Vue Demo',
            projectId: 'YOUR_PROJECT_ID',
            initialChainId: mainnet.id,
            chains: [
                mainnet,
                arbitrum,
                zkSync,
                scroll,
                polygonZkEvm,
                immutableZkEvm,
                avalanche
            ],
            ssr: false,
            enableChainModalOnConnect: true, // by default is true
            locale: i18nAdapter,
            wallets: [
                {
                    groupName: "Populars",
                    wallets: [
                        //metaMaskWallet,
                        coinbase,
                        smartWalletCoinbase,
                        eoaCoinbase,
                        rainbowWallet,
                        walletConnectWallet,
                    ],
                },
                {
                    groupName: "Others",
                    wallets: [
                        argentWallet,
                        bifrostWallet,
                        binanceWallet,
                        bitgetWallet,
                        bitskiWallet,
                        bloomWallet,
                        braveWallet,
                        clvWallet,
                        coin98Wallet,
                        compassWallet,
                        coreWallet,
                        dawnWallet,
                        desigWallet,
                        enkryptWallet,
                        foxWallet,
                        frameWallet,
                        frontierWallet,
                        imTokenWallet,
                        injectedWallet,
                        kaikasWallet,
                        krakenWallet,
                        kresusWallet,
                        ledgerWallet,
                        metaMaskWallet,
                        mewWallet,
                        oktoWallet,
                        okxWallet,
                        omniWallet,
                        oneKeyWallet,
                        phantomWallet,
                        rabbyWallet,
                        rainbowWallet,
                        ramperWallet,
                        roninWallet,
                        safeWallet,
                        safeheronWallet,
                        safepalWallet,
                        subWallet,
                        tahoWallet,
                        talismanWallet,
                        tokenaryWallet,
                        tokenPocketWallet,
                        trustWallet,
                        uniswapWallet,
                        walletConnectWallet,
                        xdefiWallet,
                        zealWallet,
                        zerionWallet,
                    ]
                },
            ],
            auth: {
                allowAuthenticate: false,
                authenticateAdapter: authAdapter,
            },
            coolMode: true,
            avatar: ({ size },_)=>{
                return ()=> h('div',{
                    style: {
                        alignItems: 'center',
                        backgroundColor: 'lightpink',
                        color: 'black',
                        display: 'flex',
                        height: `${size}px`,
                        justifyContent: 'center',
                        width: `${size}px`,
                    },
                });
            },
            
            disclaimer: ({ text: DisclaimerText, link: DisclaimerLink })=>{
                return () => h(DisclaimerText, ()=>[
                    'By connecting, you agree to this demo\'s ',
                    h(DisclaimerLink, { href: RAINBOW_TERMS }, () => 'Terms of Service'),
                    ' and acknowledge you have read and understand our ',
                    h(DisclaimerLink, { href: RAINBOW_TERMS }, () => 'Disclaimer')
                ])
            },

            ///Extra options
            connectModalTeleportTarget: '#rainbowkit-modal',
            chainModalTeleportTarget: '#rainbowkit-modal',
            accountModalTeleportTarget: "#rainbowkit-modal",
            currencyAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',           
            /*connectModalIntro: (/*{ compactModalEnabled, getWallet })=>{
                return ()=>{
                    return h('div','You can start your journey here by using web3 wallet.');
                }
            },*/
        };
    }

    app.use(newI18n).use(RainbowKitVuePlugin,configure());
    return app;
}