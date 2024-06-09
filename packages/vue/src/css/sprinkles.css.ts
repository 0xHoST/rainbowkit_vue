import type { RequiredConditionalValue } from '@vanilla-extract/sprinkles';
import { createGlobalThemeContract } from '@vanilla-extract/css';
import {
  createMapValueFn,
  createNormalizeValueFn,
  createSprinkles,
  defineProperties
} from '@vanilla-extract/sprinkles';
import type { ResetCssStyleType } from '@/types';

///how to place folder for css.ts; 
import './reset.css';
const flexAlignment = ['flex-start', 'flex-end', 'center'] as const
const textAlignments = ['left', 'center', 'inherit'] as const
const largeScreenWidth = 768
const theme = {
  colors: {
    accentColor: '',
    accentColorForeground: '',
    actionButtonBorder: '',
    actionButtonBorderMobile: '',
    actionButtonSecondaryBackground: '',
    closeButton: '',
    closeButtonBackground: '',
    connectButtonBackground: '',
    connectButtonBackgroundError: '',
    connectButtonInnerBackground: '',
    connectButtonText: '',
    connectButtonTextError: '',
    connectionIndicator: '',
    downloadBottomCardBackground: '',
    downloadTopCardBackground: '',
    error: '',
    generalBorder: '',
    generalBorderDim: '',
    menuItemBackground: '',
    modalBackdrop: '',
    modalBackground: '',
    modalBorder: '',
    modalText: '',
    modalTextDim: '',
    modalTextSecondary: '',
    profileAction: '',
    profileActionHover: '',
    profileForeground: '',
    selectedOptionBorder: '',
    standby: ''
  },
  fonts: {
    body: ''
  },
  radii: {
    actionButton: '',
    connectButton: '',
    menuButton: '',
    modal: '',
    modalMobile: ''
  },
  shadows: {
    connectButton: '',
    dialog: '',
    profileDetailsAction: '',
    selectedOption: '',
    selectedWallet: '',
    walletLogo: ''
  },
  blurs: {
    modalOverlay: ''
  }
}
const spacing: Record<string, string> = {
  '-1': '-1px',
  '0': '0',
  '1': '1px',
  '2': '2px',
  '3': '3px',
  '4': '4px',
  '5': '5px',
  '6': '6px',
  '8': '8px',
  '10': '10px',
  '12': '12px',
  '14': '14px',
  '16': '16px',
  '18': '18px',
  '20': '20px',
  '24': '24px',
  '28': '28px',
  '32': '32px',
  '36': '36px',
  '44': '44px',
  '64': '64px'
}
const dimensions: Record<string, string> = {
  '1': '1px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
  '12': '12px',
  '20': '20px',
  '24': '24px',
  '28': '28px',
  '30': '30px',
  '32': '32px',
  '34': '34px',
  '36': '36px',
  '40': '40px',
  '44': '44px',
  '48': '48px',
  '54': '54px',
  '60': '60px',
  '200': '200px',
  full: '100%',
  max: 'max-content'
}
const variable = createGlobalThemeContract(theme, (_, path) => `rk-vue-${path.join('-')}`)
const responsive = defineProperties({
  conditions: {
    smallScreen: {},
    largeScreen: {
      '@media': `screen and (min-width: ${largeScreenWidth}px)`
    }
  },
  defaultCondition: 'smallScreen',
  properties: {
    alignItems: flexAlignment,
    display: ['none', 'block', 'flex', 'inline']
  }
})
const unresponsive = defineProperties({
  properties: {
    alignSelf: flexAlignment,
    backgroundSize: ['cover'] as const,
    borderRadius: {
      ...variable.radii,
      '1': '1px',
      '6': '6px',
      '10': '10px',
      '13': '13px',
      '25%': '25%',
      full: '9999px'
    },
    borderStyle: {
      solid: 'solid'
    },
    borderWidth: {
      '0': '0px',
      '1': '1px',
      '2': '2px',
      '4': '4px'
    },
    cursor: ['pointer', 'none'],
    pointerEvents: ['none', 'all'],
    minHeight: {
      '8': { minHeight: '8px' },
      '44': { minHeight: '44px' }
    },
    flexDirection: ['row', 'column'],
    fontFamily: variable.fonts,
    fontSize: {
      '12': { fontSize: '12px', lineHeight: '18px' },
      '13': { fontSize: '13px', lineHeight: '18px' },
      '14': { fontSize: '14px', lineHeight: '18px' },
      '16': { fontSize: '16px', lineHeight: '20px' },
      '18': { fontSize: '18px', lineHeight: '24px' },
      '20': { fontSize: '20px', lineHeight: '24px' },
      '23': { fontSize: '23px', lineHeight: '29px' }
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800'
    },
    gap: spacing,
    height: dimensions,
    justifyContent: [...flexAlignment, 'space-between', 'space-around'],
    textAlign: textAlignments,
    marginBottom: spacing,
    marginLeft: spacing,
    marginRight: spacing,
    marginTop: spacing,
    maxWidth: dimensions,
    minWidth: dimensions,
    overflow: ['hidden'],
    paddingBottom: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    position: ['absolute', 'fixed', 'relative'],
    WebkitUserSelect: ['none'],
    right: {
      '0': '0'
    },
    transition: {
      default: '0.125s ease',
      transform: 'transform 0.125s ease'
    },
    userSelect: ['none'],
    width: dimensions,
    backdropFilter: {
      ...variable.blurs
    }
  } as const,
  shorthands: {
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom']
  }
})
const color = defineProperties({
  conditions: {
    base: {},
    hover: { selector: '&:hover' },
    active: { selector: '&:active' }
  },
  defaultCondition: 'base',
  properties: {
    background: variable.colors,
    borderColor: variable.colors,
    boxShadow: variable.shadows,
    color: variable.colors
  }
})

export const largeScreenMinWidth = largeScreenWidth;
export const themeVars = variable;
export const sprinkles = createSprinkles(color, responsive, unresponsive);
export const mapResponsiveValue = createMapValueFn(responsive);
export const normalizeResponsiveValue = createNormalizeValueFn(responsive);

export type Sprinkles = Parameters<typeof sprinkles>[0];
export type ThemeVariables = typeof theme;
export type ResponsiveValue<value extends string | number | boolean> = RequiredConditionalValue<typeof responsive,value>;

type ResetKey = keyof ResetCssStyleType;
export type Atoms =  Sprinkles & {
  resetKey : ResetKey
};

