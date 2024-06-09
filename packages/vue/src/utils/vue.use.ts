import type {
  MaybeElement,
  MaybeComputedElementRef,
  UnRefElementReturn,
  VueInstance,
  MaybeRefOrGetter,
  AnyFn
} from '@/types'
import { unref } from 'vue'

export function toValue<T>(r: MaybeRefOrGetter<T>): T {
  return typeof r === 'function' ? (r as AnyFn)() : unref(r)
}

export function unrefElement<T extends MaybeElement>(
  elRef: MaybeComputedElementRef<T>
): UnRefElementReturn<T> {
  const plain = toValue(elRef)
  return (plain as VueInstance)?.$el ?? plain
}

