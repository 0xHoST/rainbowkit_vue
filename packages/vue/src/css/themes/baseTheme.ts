import { type RadiusScale, type Blurs, type BaseThemeOptions, fonts } from '../../types'
import type { ThemeVariables } from '../sprinkles.css'

const radius: Record<
  RadiusScale,
  {
    actionButton: string
    connectButton: string
    modal: string
    modalMobile: string
  }
> = {
  large: {
    actionButton: '9999px',
    connectButton: '12px',
    modal: '24px',
    modalMobile: '28px'
  },
  medium: {
    actionButton: '10px',
    connectButton: '8px',
    modal: '16px',
    modalMobile: '18px'
  },
  none: {
    actionButton: '0px',
    connectButton: '0px',
    modal: '0px',
    modalMobile: '0px'
  },
  small: {
    actionButton: '4px',
    connectButton: '4px',
    modal: '8px',
    modalMobile: '8px'
  }
}

const blurs: Record<
  Blurs,
  {
    modalOverlay: string
  }
> = {
  large: {
    modalOverlay: 'blur(20px)'
  },
  none: {
    modalOverlay: 'blur(0px)'
  },
  small: {
    modalOverlay: 'blur(4px)'
  }
}

export function getBaseTheme({
  borderRadius = 'large',
  fontStack = 'rounded',
  overlayBlur = 'none'
}: BaseThemeOptions): Pick<ThemeVariables, 'radii' | 'fonts' | 'blurs'> {
  return {
    blurs: {
      modalOverlay: blurs[overlayBlur].modalOverlay
    },
    fonts: {
      body: fonts[fontStack]
    },
    radii: {
      actionButton: radius[borderRadius].actionButton,
      connectButton: radius[borderRadius].connectButton,
      menuButton: radius[borderRadius].connectButton,
      modal: radius[borderRadius].modal,
      modalMobile: radius[borderRadius].modalMobile
    }
  }
}
