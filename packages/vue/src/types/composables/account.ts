export type AuthenticationStatus = 'loading' | 'authenticated' | 'unauthenticated'
export type ConnectionStatus = 'disconnected' | 'loading' | 'unauthenticated' | 'connected' | 'connecting' | 'unknown'
export type AuthenticateOption = {
  allowAuthenticate?: boolean,
  authenticateAdapter?: AuthenticationAdapter<any>
};
export interface AuthenticationAdapter<Message> {
  getNonce: () => Promise<string>
  createMessage: (args: { nonce: string; address: string; chainId: number }) => Message
  getMessageBody: (args: { message: Message }) => any
  verify: (args: { message: Message; signature: string }) => Promise<boolean>
  signOut: () => Promise<void>
}
export interface AuthenticationConfig<Message = any> {
  adapter?: AuthenticationAdapter<Message>
  status?: AuthenticationStatus
}