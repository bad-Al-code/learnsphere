'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionStore } from '@/stores/session-store';
import { CloudSun, Droplets, MapPin, Quote, Wind } from 'lucide-react';
import { useTodaysQuote, useWeatherData } from '../hooks/use-dashboard-misc';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

interface QuoteData {
  text: string;
  author: string;
}

export function WeatherCard({ data }: { data: WeatherData }) {
  return (
    <Card className="h-32">
      <CardContent className="flex h-full items-center justify-between px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <CloudSun className="text-muted-foreground h-6 w-6" />{' '}
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-4xl leading-none font-bold">
              {data.temperature}°C
            </p>
            <p className="text-muted-foreground text-sm">{data.condition}</p>
          </div>
        </div>

        <div className="text-muted-foreground space-y-1 text-right text-xs">
          <p className="flex items-center justify-end gap-1.5">
            <MapPin className="h-3 w-3" /> {data.location}
          </p>

          <div className="flex space-x-2">
            <p className="flex items-center justify-end gap-1">
              <Droplets className="h-3 w-3" /> {data.humidity}%
            </p>

            <p className="flex items-center justify-end gap-1">
              <Wind className="h-3 w-3" /> {data.windSpeed} km/h
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuoteCard({ data }: { data: QuoteData }) {
  return (
    <Card className="h-32 rounded-2xl shadow-sm">
      <CardContent className="relative flex h-full flex-col justify-center px-6 py-4">
        <Quote className="text-muted-foreground absolute top-4 right-4 h-5 w-5" />

        <blockquote className="text-sm italic">"{data.text}"</blockquote>
        <p className="text-muted-foreground mt-2 text-right text-xs">
          — {data.author}
        </p>
      </CardContent>
    </Card>
  );
}

export async function WelcomeHeader() {
  const { user } = useSessionStore();
  const { data: quoteData, isLoading: isLoadingQuote } = useTodaysQuote();
  const { data: weatherApiData, isLoading: isLoadingWeather } =
    useWeatherData();

  const data = {
    streak: 12,
    weather: {
      temperature: Math.round(weatherApiData?.main.temp || 0),
      condition: weatherApiData?.weather[0]?.main || 'Loading...',
      location: weatherApiData?.name || 'Loading...',
      humidity: weatherApiData?.main.humidity || 0,
      windSpeed: Math.round(weatherApiData?.wind.speed || 0),
    },
    quote: {
      text: quoteData?.text || 'Loading quote...',
      author: quoteData?.author || '...',
    },
  };

  if (!user) {
    return <WelcomeHeaderSkeleton />;
  }

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {user.firstName || 'Student'}! 👋
          </h1>
          <Badge variant="secondary">
            🔥
            {data.streak}-day streak
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Track your learning progress and upcoming tasks
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {isLoadingWeather ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <WeatherCard data={data.weather} />
        )}

        {isLoadingQuote ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <QuoteCard data={data.quote} />
        )}
      </div>
    </div>
  );
}

export function WelcomeHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <Card className="h-[96px]">
          <CardContent className="p-4">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
        <Card className="h-[96px]">
          <CardContent className="p-4">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
