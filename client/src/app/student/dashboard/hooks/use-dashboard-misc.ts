'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getTodaysQuoteAction,
  getWeatherDataAction,
} from '../actions/misc.action';

export const useTodaysQuote = () => {
  return useQuery({
    queryKey: ['todays-quote'],

    queryFn: async () => {
      const result = await getTodaysQuoteAction();

      return result.data;
    },

    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weather-data'],

    queryFn: async () => {
      const result = await getWeatherDataAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    staleTime: 1000 * 60 * 15,
  });
};
