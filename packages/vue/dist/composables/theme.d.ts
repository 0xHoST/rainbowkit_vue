import { type Context, type ThemeOption, type RainbowKitPluginOptions } from '../types';
export declare function createThemeContext(option: RainbowKitPluginOptions): Context<ThemeOption>;
export declare function useThemeContext(): {
    css: import("vue").ComputedRef<string | undefined>;
    changeTheme: (mode: 'light' | 'dark' | 'midnight') => void;
    theme: import("vue").Ref<{
        light: {
            colors: {
                accentColor: string;
                accentColorForeground: string;
                actionButtonBorder: string;
                actionButtonBorderMobile: string;
                actionButtonSecondaryBackground: string;
                closeButton: string;
                closeButtonBackground: string;
                connectButtonBackground: string;
                connectButtonBackgroundError: string;
                connectButtonInnerBackground: string;
                connectButtonText: string;
                connectButtonTextError: string;
                connectionIndicator: string;
                downloadBottomCardBackground: string;
                downloadTopCardBackground: string;
                error: string;
                generalBorder: string;
                generalBorderDim: string;
                menuItemBackground: string;
                modalBackdrop: string;
                modalBackground: string;
                modalBorder: string;
                modalText: string;
                modalTextDim: string;
                modalTextSecondary: string;
                profileAction: string;
                profileActionHover: string;
                profileForeground: string;
                selectedOptionBorder: string;
                standby: string;
            };
            fonts: {
                body: string;
            };
            radii: {
                actionButton: string;
                connectButton: string;
                menuButton: string;
                modal: string;
                modalMobile: string;
            };
            shadows: {
                connectButton: string;
                dialog: string;
                profileDetailsAction: string;
                selectedOption: string;
                selectedWallet: string;
                walletLogo: string;
            };
            blurs: {
                modalOverlay: string;
            };
        };
        dark: {
            colors: {
                accentColor: string;
                accentColorForeground: string;
                actionButtonBorder: string;
                actionButtonBorderMobile: string;
                actionButtonSecondaryBackground: string;
                closeButton: string;
                closeButtonBackground: string;
                connectButtonBackground: string;
                connectButtonBackgroundError: string;
                connectButtonInnerBackground: string;
                connectButtonText: string;
                connectButtonTextError: string;
                connectionIndicator: string;
                downloadBottomCardBackground: string;
                downloadTopCardBackground: string;
                error: string;
                generalBorder: string;
                generalBorderDim: string;
                menuItemBackground: string;
                modalBackdrop: string;
                modalBackground: string;
                modalBorder: string;
                modalText: string;
                modalTextDim: string;
                modalTextSecondary: string;
                profileAction: string;
                profileActionHover: string;
                profileForeground: string;
                selectedOptionBorder: string;
                standby: string;
            };
            fonts: {
                body: string;
            };
            radii: {
                actionButton: string;
                connectButton: string;
                menuButton: string;
                modal: string;
                modalMobile: string;
            };
            shadows: {
                connectButton: string;
                dialog: string;
                profileDetailsAction: string;
                selectedOption: string;
                selectedWallet: string;
                walletLogo: string;
            };
            blurs: {
                modalOverlay: string;
            };
        };
        midnight: {
            colors: {
                accentColor: string;
                accentColorForeground: string;
                actionButtonBorder: string;
                actionButtonBorderMobile: string;
                actionButtonSecondaryBackground: string;
                closeButton: string;
                closeButtonBackground: string;
                connectButtonBackground: string;
                connectButtonBackgroundError: string;
                connectButtonInnerBackground: string;
                connectButtonText: string;
                connectButtonTextError: string;
                connectionIndicator: string;
                downloadBottomCardBackground: string;
                downloadTopCardBackground: string;
                error: string;
                generalBorder: string;
                generalBorderDim: string;
                menuItemBackground: string;
                modalBackdrop: string;
                modalBackground: string;
                modalBorder: string;
                modalText: string;
                modalTextDim: string;
                modalTextSecondary: string;
                profileAction: string;
                profileActionHover: string;
                profileForeground: string;
                selectedOptionBorder: string;
                standby: string;
            };
            fonts: {
                body: string;
            };
            radii: {
                actionButton: string;
                connectButton: string;
                menuButton: string;
                modal: string;
                modalMobile: string;
            };
            shadows: {
                connectButton: string;
                dialog: string;
                profileDetailsAction: string;
                selectedOption: string;
                selectedWallet: string;
                walletLogo: string;
            };
            blurs: {
                modalOverlay: string;
            };
        };
    }>;
    mode: import("vue").Ref<"dark" | "light" | "midnight">;
};
//# sourceMappingURL=theme.d.ts.map