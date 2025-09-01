'use client';

import { faker } from '@faker-js/faker';
import { Download, ExternalLink, Share2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type TCertificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  tags: string[];
  credentialId: string;
  imageUrl: string;
};

const createCertificate = (index: number): TCertificate => ({
  id: faker.string.uuid(),
  title: faker.lorem
    .words({ min: 2, max: 3 })
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  issuer: `Issued by ${faker.company.name()}`,
  issueDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
  tags: faker.helpers.arrayElements(
    [
      'JavaScript',
      'ES6',
      'DOM Manipulation',
      'HTML5',
      'CSS3',
      'Responsive Design',
      'SQL',
      'Database Design',
      'Query Optimization',
    ],
    { min: 2, max: 3 }
  ),
  credentialId: `Credential ID: ${faker.string.alphanumeric(4).toUpperCase()}-2024-${faker.string.numeric(3)}`,
  imageUrl: `https://picsum.photos/400/225?random=${index}`,
});

const certificatesData: TCertificate[] = Array.from({ length: 3 }, (_, i) =>
  createCertificate(i)
);

function CertificateCard({ certificate }: { certificate: TCertificate }) {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={certificate.imageUrl}
          alt={certificate.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="flex-1 space-y-2">
        <div>
          <h3 className="font-semibold">{certificate.title}</h3>
          <p className="text-muted-foreground text-xs">
            {certificate.issuer} • {certificate.issueDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {certificate.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          {certificate.credentialId}
        </p>
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Button variant="secondary" className="flex-1">
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CertificateCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="flex-1 space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}

export function CertificatesTab() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {certificatesData.map((cert) => (
        <CertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  );
}

export function CertificatesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      <CertificateCardSkeleton />
      <CertificateCardSkeleton />
      <CertificateCardSkeleton />
    </div>
  );
}
