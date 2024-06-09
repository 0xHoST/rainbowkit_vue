import { style } from '@vanilla-extract/css';
import { sprinkles } from './sprinkles.css';

export const qrCodeBackgroundClassName = style([
  {
    background: 'white',
  },
]);

export const scrollClassName = style([
  sprinkles({
    paddingX: '18',
  }),
  {
    maxHeight: 454,
    overflowY: 'auto',
  },
]);

export const sidebar = style({
  minWidth: '287px',
});

export const sidebarCompactMode = style({
  minWidth: '100%',
});