import type axe from 'axe-core';

/** Disables axe `color-contrast` while other rules still run site-wide */
export const axeRunOptionsDisableColorContrast: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};
