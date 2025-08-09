'use client';
import { refreshToken } from '@/lib/auth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}

const REFRESH_THRESHOLD_MINUTES = 5;

export function SessionRefresher() {
  useEffect(() => {
    const onFocus = () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          return;
        }

        const payload = jwtDecode<JwtPayload>(token);
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        const threshold = REFRESH_THRESHOLD_MINUTES * 60 * 60 * 1000;

        if (expiresAt - now < threshold) {
          console.log('Token is nearing expiration. Attempting refresh...');

          refreshToken();
        }
      } catch (error) {
        console.error(`Could not decode token:`, error);
      }
    };

    window.addEventListener('focus', onFocus);

    onFocus();

    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return null;
}
