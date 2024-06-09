import type { ContainerProps } from "@/types"
import type { TextProps } from "@/components"

export type Size = 'small' | 'medium' | 'large';
export type SizeCssProps = {
    paddingX: ContainerProps<'div'>['paddingX'];
    paddingY: ContainerProps<'div'>['paddingY'];
    fontSize: TextProps['size'];
    height?: ContainerProps<'div'>['height'];
}; 

export const css: Record<Size,SizeCssProps> = {
    large: {
        fontSize: '16',
        paddingX: '24',
        paddingY: '10',
    },
    medium: {
        fontSize: '14',
        height: '28',
        paddingX: '12',
        paddingY: '4',
    },
    small: {
        fontSize: '14',
        paddingX: '10',
        paddingY: '5',
    }
}