import { ref } from 'vue';

export function randomize(prefix:string){
    const randomId = ref(`${prefix}_${Math.round(Math.random() * 1_000_000_000)}`);
    return randomId;
};