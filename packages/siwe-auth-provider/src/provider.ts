import { CreateSiweMessageReturnType, type SiweMessage, createSiweMessage, generateSiweNonce, parseSiweMessage } from "viem/siwe";
import { AuthenticationAdapter } from "@raveyard/rainbowkit-vue";
import { useAuth, Options, createAuth } from "vue-auth3";
import { Address } from "viem";
import { App } from "vue";
import driverHttpFetch from 'vue-auth3/dist/drivers/http/fetch';
import driverHttpAuthBasic from "vue-auth3/dist/drivers/auth/basic";

export const RainbowKitVueSiweAuthAdapterPlugin = () => {

    type AuthAdapterProviderOption = Partial<Options & Omit<SiweMessage, 'chainId' | 'address' | 'nonce'>>;
    function create(app: App, options: AuthAdapterProviderOption = {}): AuthenticationAdapter<CreateSiweMessageReturnType> {
        const {
            scheme,
            domain,
            statement,
            uri,
            version,
            ...authOptions
        } = options;

        const defaultAuthOptions: Options = {
            drivers: {
                http: driverHttpFetch,
                auth: driverHttpAuthBasic
            },
        };
        const mergeAuthOptions = { ...defaultAuthOptions, ...authOptions };
        app.use(createAuth(mergeAuthOptions));

        return {
            createMessage: ({ address, chainId, nonce }) => {
                return createSiweMessage({
                    scheme: scheme ?? window.location.protocol.slice(0, -1),
                    domain: domain ?? window.location.host,
                    statement: statement ?? 'Sign in with Ethereum to the app.',
                    uri: uri ?? window.location.origin,
                    nonce: nonce === '' || nonce === undefined || nonce === null ? generateSiweNonce() : nonce,
                    version: '1',
                    address: address as Address,
                    chainId
                })
            },
            getMessageBody: ({ message }) => parseSiweMessage(message),
            getNonce: async () => {
                const auth = useAuth();
                const nonce = auth.currentToken;
                if (!nonce) throw new Error();
                return nonce;
            },
            signOut: async () => {
                const auth = useAuth();
                await auth.logout({ redirect: false });
            },
            async verify({ message, signature }) {
                const auth = useAuth();
                const response = await auth.login({
                    method: "POST",
                    redirect: false,
                    data: {
                        message: JSON.stringify(message),
                        signature
                    },
                });
                return response.status > 200;
            },
        };
    }
    return { create };
}

