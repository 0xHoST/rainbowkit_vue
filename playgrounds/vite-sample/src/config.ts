import {
    argentWallet,
    bifrostWallet,
    bitgetWallet,
    bitskiWallet,
    bloomWallet,
    braveWallet,
    clvWallet,
    coin98Wallet,
    coinbaseWallet,
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
    sepolia
} from 'use-rainbowkit-vue';
import { RainbowKitVueI18nLocaleAdapterPlugin } from 'use-rainbowkit-vue-i18n-locale-provider';
import { RainbowKitVueSiweAuthAdapterPlugin } from 'use-rainbowkit-vue-siwe-auth-provider';
import { Chain } from 'viem';
import { App, h } from 'vue';

export function createRainbowKitConfig(app: App) : App{
    const RAINBOW_TERMS = 'https://rainbow.me/terms-of-use';
    const avalanche = {
        id: 43_114,
        name: 'Avalanche',
        //iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
        //iconBackground: '#fff',
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
    } as const satisfies Chain;

    function configure():RainbowKitPluginOptions{

        const { create: createI18nAdapter } = RainbowKitVueI18nLocaleAdapterPlugin();
        const { create: createAuthAdapter } = RainbowKitVueSiweAuthAdapterPlugin();
        const i18nAdapter = createI18nAdapter(app,{ currentLocale: 'zh', fallbackLocale: 'zh' });
        const authAdapter = createAuthAdapter(app);

        return {
            chains: [
                mainnet,
                sepolia, 
                avalanche
            ],
            locale: {
                locale: 'zh',
                fallbackLocale: 'en',
                adapter: i18nAdapter
            },
            wallets: [
                {
                    groupName: "Populars",
                    wallets: [
                        metaMaskWallet,
                        coinbaseWallet,
                        rainbowWallet,
                        walletConnectWallet,
                    ],
                },
                {
                    groupName: "Others",
                    wallets: [
                        metaMaskWallet,
                        argentWallet,
                        bifrostWallet,
                        bitgetWallet,
                        bitskiWallet,
                        bloomWallet,
                        braveWallet,
                        clvWallet,
                        coin98Wallet,
                        coinbaseWallet,
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
                }
            ],
            allowAuthenticate: true,
            authenticateAdapter: authAdapter,
            coolMode: true,
            currencyAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
            appName: 'RainbowKit Vue Demo',
            projectId: 'YOUR_PROJECT_ID',
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
            connectModalIntro: ()=>{
                return ()=>{
                    return h('div','You can start your journey here by using web3 wallet.');
                }
            },
        };
    }

    app.use(RainbowKitVuePlugin,configure());
    return app;
}