import { getRandomQuote } from '@/lib/utils';
import { WeatherApiResponse } from '../schema/misc.schema';

export const getTodaysQuoteAction = async () => {
  return { data: getRandomQuote() };
};

export const getWeatherDataAction = async () => {
  const location = 'Indore';
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('Weather API key not set. Skipping fetch.');
    return { data: null };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch weather data.');

    const data: WeatherApiResponse = await response.json();
    return { data };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return { error: 'Could not load weather data.' };
  }
};
