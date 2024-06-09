import { AsyncImageSrc, ContainerProps, QrDot } from '@/types';
import { qrCodeBackgroundClassName } from '@/css';
import { Container } from '@/components/Common/Container';
import { AsyncImage } from '@/components/Common/AsyncImage';
import { computed, defineComponent, h, PropType } from 'vue';
import { QRCodeErrorCorrectionLevel, create, QRCode } from 'qrcode';

export const createQrCodeProps = {
    ecl: {
        type: String as PropType<QRCodeErrorCorrectionLevel>,
        default: 'M'
    },
    logoMargin: {
        type: Number,
        default: 10
    },
    logoSize: {
        type: Number,
        default: 50
    },
    size: {
        type: Number,
        default: 200,
    },
    uri: String,
    logoBackground: String,
    logo: [String, Function] as PropType<string | AsyncImageSrc>,
} as const;

export const QrCode = defineComponent({
    props: createQrCodeProps,
    setup(props) {

        const padding: NonNullable<ContainerProps<'div'>['padding']> = '20'
        const size = computed(() => props.size - parseInt(padding, 10) * 2)
        const logoPosition = computed(() => size.value / 2 - props.logoSize / 2)
        const logoWrapperSize = computed(() => props.logoSize + props.logoMargin * 2)

        const generateMatrix = (
            value: string,
            errorCorrectionLevel: QRCodeErrorCorrectionLevel
        ) => {
            const arr = Array.prototype.slice.call(
                create(value, { errorCorrectionLevel }).modules.data,
                0
            )
            const sqrt = Math.sqrt(arr.length)
            return arr.reduce(
                (rows, key, index) =>
                    (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
                []
            )
        };

        const dots = computed(() => {
            const dots: Array<QrDot> = []
            const matrix = generateMatrix(props.uri ?? "", props.ecl)
            const cellSize = size.value / matrix.length
            const qrList = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 }
            ]

            qrList.forEach(({ x, y }) => {
                const x1 = (matrix.length - 7) * cellSize * x
                const y1 = (matrix.length - 7) * cellSize * y
                for (let i = 0; i < 3; i++) {
                    dots.push({
                        elementType: 'rect',
                        key: `${i}-${x}-${y}`,
                        fill: i % 2 !== 0 ? 'white' : 'black',
                        height: cellSize * (7 - i * 2),
                        width: cellSize * (7 - i * 2),
                        rx: (i - 2) * -5 + (i === 0 ? 2 : 0),
                        ry: (i - 2) * -5 + (i === 0 ? 2 : 0),
                        x: x1 + cellSize * i,
                        y: y1 + cellSize * i
                    })
                }
            })

            const clearArenaSize = Math.floor((props.logoSize + 25) / cellSize)
            const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2
            const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1

            matrix.forEach((row: QRCode[], i: number) => {
                row.forEach((_: any, j: number) => {
                    if (matrix[i][j]) {
                        if (
                            !(
                                (i < 7 && j < 7) ||
                                (i > matrix.length - 8 && j < 7) ||
                                (i < 7 && j > matrix.length - 8)
                            )
                        ) {
                            if (
                                !(
                                    i > matrixMiddleStart &&
                                    i < matrixMiddleEnd &&
                                    j > matrixMiddleStart &&
                                    j < matrixMiddleEnd
                                )
                            ) {
                                dots.push({
                                    elementType: 'circle',
                                    key: `circle-${i}-${j}`,
                                    fill: 'black',
                                    cx: i * cellSize + cellSize / 2,
                                    cy: j * cellSize + cellSize / 2,
                                    r: cellSize / 3
                                })
                            }
                        }
                    }
                })
            })

            return dots
        });

        return ()=>{
            return h(Container,{
                borderColor: 'generalBorder',
                borderRadius: 'menuButton',
                borderStyle: 'solid',
                borderWidth: '1',
                class: qrCodeBackgroundClassName,
                padding: padding,
                width: 'max'
            },()=>h(Container,{
                userSelect: 'none',
                style: { height: `${size.value}px`, userSelect: 'none', width: `${size.value}px` } 
            },()=>[
                h(Container,{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    width: 'full',
                    style: { height: `${0}px`, top: `${logoPosition.value}px`, width: `${size.value}px` }
                },()=>h(AsyncImage,{
                    src: props.logo,
                    width: props.logoSize,
                    height: props.logoSize,
                    background: props.logoBackground,
                    borderRadius: '13',
                    borderColor: { custom: 'rgba(0, 0, 0, 0.06)' }
                })),
                h('svg',{
                    height: size.value,
                    width: size.value,
                    style: { all: 'revert' },
                    innerHTML: `
                        <title>QR Code</title>
                        <defs>
                            <clipPath id="clip-wrapper">
                                <rect height="${logoWrapperSize.value}" width="${logoWrapperSize.value}" />
                            </clipPath>
                            <clipPath id="clip-logo">
                                <rect height="${props.logoSize}" width="${props.logoSize}" />
                            </clipPath>
                        </defs>
                        <rect fill="transparent" height="${size.value}" width="${size.value}" />
                        ${dots.value.map((dot)=>{
                            return dot.elementType === 'rect'? 
                                `<rect fill="${dot.fill}" x="${dot.x}" y="${dot.y}" rx="${dot.rx}" ry="${dot.ry}" height="${dot.height}" width="${dot.width}"  />` : 
                                `<circle fill="${dot.fill}" cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" />`
                        })}
                    `
                })
            ]))
        };
    },
});