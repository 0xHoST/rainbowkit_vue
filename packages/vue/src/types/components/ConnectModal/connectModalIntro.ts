import { DefineSetupFnComponent, PublicProps } from "vue"

export type ConnectModalIntroProps = {
    compactModalEnabled?: boolean,
    getWallet: ()=> void
}

export type ConnectModelIntroComponent = DefineSetupFnComponent<ConnectModalIntroProps, {}, {}, ConnectModalIntroProps & {}, PublicProps>;