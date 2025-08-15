'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDevice(): DeviceType {
  const [device, setDevice] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < MOBILE_BREAKPOINT) return 'mobile';
    if (width < TABLET_BREAKPOINT) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) setDevice('mobile');
      else if (width < TABLET_BREAKPOINT) setDevice('tablet');
      else setDevice('desktop');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
}
