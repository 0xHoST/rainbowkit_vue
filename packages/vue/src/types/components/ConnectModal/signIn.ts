export type SignInRefType = {
    status: 'idle' | 'signing' | 'verifying';
    errorMessage?: string;
    nonce?: string;
}