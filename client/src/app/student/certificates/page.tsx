import { Skeleton } from '@/components/ui/skeleton';
import { studentCertificatesTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CertificatesTabs } from './_components/certificats-tabs';

function CertificatesPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentCertificatesTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading Certificates...</p>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
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
