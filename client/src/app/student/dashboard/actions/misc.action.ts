'use server';

import { getRandomQuote } from '@/lib/utils';
import { headers } from 'next/headers';
import { WeatherApiResponse } from '../schema/misc.schema';

export const getTodaysQuoteAction = async () => {
  return { data: getRandomQuote() };
};

async function getGeoInfoFromIp(ip: string | undefined) {
  if (!ip || ip === '::1' || ip.startsWith('127.')) {
    return { city: 'Delhi', country: 'India' };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=city,country`
    );
    if (!response.ok) return { city: 'Delhi', country: 'India' };

    const data = await response.json();
    console.log(data);

    return { city: data.city, country: data.country };
  } catch (error) {
    console.error('IP lookup failed:', error);
    return { city: 'Delhi', country: 'India' };
  }
}
export const getWeatherDataAction = async () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('Weather API key not set. Skipping fetch.');
    return { data: null };
  }

  const forwardedFor = (await headers()).get('x-forwarded-for');
  const userIp = forwardedFor ? forwardedFor.split(',')[0] : undefined;
  const location = await getGeoInfoFromIp(userIp);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch weather data.');

    const data: WeatherApiResponse = await response.json();
    return { data };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return { error: 'Could not load weather data.' };
  }
};
