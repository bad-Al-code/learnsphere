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
      <CardContent className="relative flex h-full items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-200/40 blur-lg transition-all duration-300 group-hover:bg-blue-300/60" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
              <CloudSun className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-4xl font-bold transition-colors">
              {data.temperature}°C
            </p>

            <p className="text-muted-foreground text-sm font-medium">
              {data.condition}
            </p>
          </div>
        </div>

        <div className="text-muted-foreground space-y-3 text-right text-sm">
          <div className="flex items-center justify-end gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            <span>{data.location}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-end gap-1.5">
              <Droplets className="text-muted-foreground h-3.5 w-3.5" />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Wind className="text-muted-foreground h-3.5 w-3.5" />
              <span>{data.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuoteCard({ data }: { data: QuoteData }) {
  return (
    <Card className="">
      <CardContent className="relative flex h-full flex-col justify-center">
        <div className="absolute top-4 right-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm">
            <Quote className="text-primary h-4 w-4" />
          </div>
        </div>

        <div className="space-y-4">
          <blockquote className="line-clamp-3 text-sm leading-relaxed font-medium italic">
            "{data.text}"
          </blockquote>
          <p className="text-muted-foreground text-right text-xs font-medium">
            — {data.author}
          </p>
        </div>
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
