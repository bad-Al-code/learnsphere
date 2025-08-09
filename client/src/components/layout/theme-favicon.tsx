'use client';

import { useEffect } from 'react';

export const ThemeFavicon = () => {
  useEffect(() => {
    const updateFavicon = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const favicon = document.getElementById(
        'favicon'
      ) as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = isDark
          ? '/icons/theme-dark.svg'
          : '/icons/theme-light.svg';
      }
    };

    updateFavicon();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateFavicon);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', updateFavicon);
    };
  }, []);

  return null;
};
