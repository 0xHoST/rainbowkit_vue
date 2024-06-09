import { Buffer } from 'buffer';
window.globalThis.Buffer = Buffer;
window.globalThis.Process = { env: {} }; // Minimal process polyfill

export {};