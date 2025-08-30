'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Share2, Star, User } from 'lucide-react';

type TPortfolioItem = {
  id: string;
  title: string;
  course: string;
  imageUrl: string;
  description: string;
  grade: string;
  tags: string[];
  views: number;
  likes: number;
};

const portfolioData: TPortfolioItem[] = [
  {
    id: '1',
    title: 'E-commerce Database Design',
    course: 'Database Design',
    imageUrl: 'https://picsum.photos/seed/dbdesign/400/300',
    description: 'Comprehensive database schema for online retail platform',
    grade: 'A+',
    tags: ['SQL', 'Database Design', 'Normalization'],
    views: 156,
    likes: 23,
  },
  {
    id: '2',
    title: 'React Component Library',
    course: 'React Fundamentals',
    imageUrl: 'https://picsum.photos/seed/reactlib/400/300',
    description: 'Reusable UI component library with TypeScript',
    grade: 'A',
    tags: ['React', 'TypeScript', 'Component Design'],
    views: 89,
    likes: 15,
  },
  {
    id: '3',
    title: 'User Research Analysis',
    course: 'UI/UX Principles',
    imageUrl: 'https://picsum.photos/seed/userresearch/400/300',
    description: 'Comprehensive user interview analysis and insights',
    grade: 'A-',
    tags: ['User Research', 'Data Analysis', 'UX Design'],
    views: 67,
    likes: 12,
  },
];

function PortfolioItemCard({ item }: { item: TPortfolioItem }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <CardHeader className="p-0">
        <div className="bg-muted flex aspect-video w-full items-center justify-center transition-all hover:scale-105">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.course}</CardDescription>
        </div>
        <p className="text-muted-foreground text-sm">{item.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Grade: {item.grade}</Badge>
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {item.likes}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center gap-2">
        <Button variant="outline" className="flex-grow">
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button variant="outline" className="flex-grow">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

function PortfolioItemCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full rounded-b-none" />
      <CardContent className="flex-grow space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 flex-grow" />
      </CardFooter>
    </Card>
  );
}

export function PortfolioTab() {
  return (
    <div className="space-y-2">
      <header>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Assignment Portfolio</h2>
        </div>
        <p className="text-muted-foreground">
          Showcase your best work and achievements
        </p>
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {portfolioData.map((item) => (
          <PortfolioItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function PortfolioTabSkeleton() {
  return (
    <div className="space-y-2">
      <header>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PortfolioItemCardSkeleton />
        <PortfolioItemCardSkeleton />
        <PortfolioItemCardSkeleton />
      </div>
    </div>
  );
}
