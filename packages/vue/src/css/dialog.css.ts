import { keyframes, style } from '@vanilla-extract/css';
import { largeScreenMinWidth, sprinkles } from './sprinkles.css';

const slideUp = keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const nestedModalZIndexes: Record<string, number> = {
  coinbase: 2147483647,
  walletConnect: 99999999999999,
  metaMask:999999999999999
};

const bleed = 200;
export const overlay = style([
  sprinkles({
    backdropFilter: 'modalOverlay',
    background: 'modalBackdrop',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
  }),
  {
    animation: `${fadeIn} 150ms ease`,
    bottom: -bleed,
    left: -bleed,
    padding: bleed,
    right: -bleed,
    top: -bleed,
    transform: 'translateZ(0)', // This is required for content to render under the URL bar on iOS
    zIndex: Math.min(...Object.values(nestedModalZIndexes)) - 1,
  },
]);

export const content = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  }),
  {
    animation: `${slideUp} 350ms cubic-bezier(.15,1.15,0.6,1.00), ${fadeIn} 150ms ease`,
    maxWidth: '100vw',
  },
]);

export const dialogContent = style([
  sprinkles({
    background: 'modalBackground',
    borderColor: 'modalBorder',
    borderRadius: 'modal',
    borderStyle: 'solid',
    borderWidth: '1',
    boxShadow: 'dialog',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  }),
  {
    '@media': {
      [`screen and (min-width: ${largeScreenMinWidth}px)`]: {
        width: '360px',
      },
    },
    'boxSizing': 'content-box',
    'maxWidth': '100vw',
    'width': '360px',
  },
]);

export const dialogContentWideMobile = style([
  dialogContent,
  { width: '100vw' },
  {
    '@media': {
      [`screen and (min-width: ${largeScreenMinWidth}px)`]: {
        width: '480px',
      },
    },
  },
]);

export const dialogContentWideDesktop = style([
  dialogContent,
  {
    minWidth: '720px',
    width: '720px',
  },
]);

export const dialogContentCompactMode = style([
  dialogContent,
  {
    minWidth: '368px',
    width: '368px',
  },
  {
    '@media': {
      [`screen and (min-width: ${largeScreenMinWidth}px)`]: {
        minWidth: '368px',
        width: '368px',
      },
    },
  },
]);

export const dialogContentMobile = style([
  sprinkles({
    borderRadius: 'modalMobile',
  }),
  {
    borderWidth: '0px',
    boxSizing: 'border-box',
    width: '100vw',
  },
]);

export const bottomSheetOverrides = style({
  '@media': {
    [`screen and (max-width: ${largeScreenMinWidth - 1}px)`]: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginTop: -bleed,
      paddingBottom: bleed,
      top: bleed,
    },
  },
});