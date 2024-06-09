import type { ContainerProps } from '@/types'

export type AsyncImageSrc = () => Promise<string>;
export type CustomBorderColor = {
  custom: string
}
export type AsyncImageProps = {
  alt?: string
  background?: string
  useAsImage?: boolean
  src: string | AsyncImageSrc | undefined
  width: ContainerProps<'div'>['width'] | number
  height: ContainerProps<'div'>['height'] | number
  borderRadius?: ContainerProps<'div'>['borderRadius']
  borderColor?: ContainerProps<'div'>['borderColor'] | CustomBorderColor
  boxShadow?: ContainerProps<'div'>['boxShadow']
}
