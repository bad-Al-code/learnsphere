import { z } from 'zod';

export const weatherDataSchema = z.object({
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
  }),

  weather: z.array(
    z.object({
      main: z.string(),
    })
  ),

  wind: z.object({
    speed: z.number(),
  }),

  name: z.string(),
});
export type WeatherApiResponse = z.infer<typeof weatherDataSchema>;

export const quoteSchema = z.object({
  text: z.string(),
  author: z.string(),
});
export type Quote = z.infer<typeof quoteSchema>;
