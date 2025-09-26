import { Skeleton } from '@/components/ui/skeleton';
import { studentCertificatesTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CertificatesTabSkeleton } from './_components/certificates-tab';
import { CertificatesTabs } from './_components/certificats-tabs';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'Certificates';

  const titles: Record<string, string> = {
    certificates: 'Certificates',
    'in-progress': 'In-Progress',
    achievements: 'Achievements',
    'digital-badges': 'Digital Badges',
    portfolio: 'Portfolio',
  };

  return {
    title: titles[tab] || 'Certificates',
  };
}

export default function CertificatesPage() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="My Certificates & Achievements"
        description="Manage your certificates, track progress towards new ones, and view your achievements."
      />

      <Suspense fallback={<CertificatesPageSkeleton />}>
        <CertificatesTabs />
      </Suspense>
    </div>
  );
}

function CertificatesPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentCertificatesTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <CertificatesTabSkeleton />
      </div>
    </div>
  );
}
