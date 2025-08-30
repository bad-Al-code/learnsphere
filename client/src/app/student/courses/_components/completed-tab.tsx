'use client';

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
import {
  Clock,
  Download,
  Share2,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

type TStat = {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
};

type TEarnedBadge = {
  name: string;
  Icon: LucideIcon;
};

type TCertificate = {
  id: string;
  title: string;
  imageUrl: string;
  completionDate: string;
  grade: string;
};

const statsData: TStat[] = [
  {
    title: 'Courses Completed',
    value: '3',
    description: 'This year',
    Icon: Trophy,
  },
  {
    title: 'Total Hours',
    value: '100',
    description: 'Study time',
    Icon: Clock,
  },
  {
    title: 'Average Grade',
    value: 'A',
    description: 'Excellent performance',
    Icon: Star,
  },
];

const badgesData: TEarnedBadge[] = [
  { name: 'JavaScript Master', Icon: Trophy },
  { name: 'Web Developer', Icon: Trophy },
  { name: 'Data Analyst', Icon: Trophy },
];

const certificatesData: TCertificate[] = [
  {
    id: '1',
    title: 'JavaScript Essentials',
    imageUrl: 'https://picsum.photos/id/1011/400/300',
    completionDate: '2023-12-15',
    grade: 'A+',
  },
  {
    id: '2',
    title: 'HTML & CSS Fundamentals',
    imageUrl: 'https://picsum.photos/id/1025/400/300',
    completionDate: '2023-11-20',
    grade: 'A',
  },
  {
    id: '3',
    title: 'SQL Basics',
    imageUrl: 'https://picsum.photos/id/1035/400/300',
    completionDate: '2023-10-10',
    grade: 'A-',
  },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.Icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BadgesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earned Badges</CardTitle>
        <CardDescription>Your achievements and certifications</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {badgesData.map((badge) => (
          <Button key={badge.name} variant="outline" className="">
            <div className="bg-card rounded-full p-1.5">
              <badge.Icon className="text-foreground h-4 w-4" />
            </div>
            {badge.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function CertificateCard({
  certificate,
}: {
  certificate: TCertificate;
}) {
  return (
    <Card className="hover:border-foreground/30 overflow-hidden pt-0 transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={certificate.imageUrl}
            alt={certificate.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold">{certificate.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Completed {certificate.completionDate}
        </p>
        <p className="text-muted-foreground text-sm">
          Grade: {certificate.grade}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex gap-2 p-4">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CertificatesSection() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Certificates</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {certificatesData.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function BadgesSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-28" />
      </CardContent>
    </Card>
  );
}

export function CertificateCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-1 h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CertificatesSectionSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-7 w-48" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <CertificateCardSkeleton />
        <CertificateCardSkeleton />
        <CertificateCardSkeleton />
      </div>
    </div>
  );
}

export function CompletedTab() {
  return (
    <div className="space-y-2">
      <StatsCards />
      <BadgesSection />
      <div className="mt-4">
        <CertificatesSection />
      </div>
    </div>
  );
}

export function CompletedTabSkeleton() {
  return (
    <div className="space-y-2">
      <StatsCardsSkeleton />
      <BadgesSectionSkeleton />

      <div className="mt-4">
        <CertificatesSectionSkeleton />
      </div>
    </div>
  );
}
