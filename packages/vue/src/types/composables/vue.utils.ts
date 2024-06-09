import { Config, Connector } from '@wagmi/vue'
import type { ComponentPublicInstance, Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)
export type DeepMaybeRef<T> =
  T extends Ref<infer V>
    ? MaybeRef<V>
    : T extends Array<any> | object
      ? { [K in keyof T]: DeepMaybeRef<T[K]> }
      : MaybeRef<T>
export type VueInstance = ComponentPublicInstance
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance
  ? Exclude<MaybeElement, VueInstance>
  : T | undefined
export type AnyFn = (...args: any[]) => any

export type MaybeRefShallow<T> = T extends object
  ? {
      [Property in keyof T]: MaybeRef<T[Property]>
    }
  : T

export type MaybeRefDeep<T> = MaybeRef<
  T extends Function | Config | Connector
    ? T
    : T extends object | any[]
    ? {
        [Property in keyof T]: MaybeRefDeep<T[Property]>
      }
    : T
>