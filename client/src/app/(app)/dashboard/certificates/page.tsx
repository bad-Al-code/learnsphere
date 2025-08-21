import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import {
  Calendar,
  CheckCheck,
  Clock,
  LucideIcon,
  Plus,
  Stamp,
} from 'lucide-react';
import { Suspense } from 'react';
import {
  DashboardHeader as CertificateHeader,
  DashboardHeaderSkeleton as CertificateHeaderSkeleton,
} from '../../_components/dashboard-header';
import {
  AllCertificatesTab,
  AllCertificatesTabSkeleton,
} from './_components/all-certificates-tab';
import { CertificateTabsHandler } from './_components/certificates-tab';
import { TemplatesTab } from './_components/templates-tab';
import { VerificationTab } from './_components/verification-tab';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}
function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
          <Icon className="text-muted-foreground h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatCards() {
  const stats = [
    { title: 'Total Issued', value: '156', icon: Stamp },
    { title: 'Pending Approval', value: '8', icon: Clock },
    { title: 'This Month', value: '23', icon: Calendar },
    { title: 'Average Score', value: '87.5%', icon: CheckCheck },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

function CertificatesPageSkeleton() {
  return (
    <div className="space-y-6">
      <CertificateHeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-24" />
              <div className="mt-2 flex justify-between">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex border-b">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <AllCertificatesTabSkeleton />
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <Suspense fallback={<CertificatesPageSkeleton />}>
      <div className="space-y-2">
        <CertificateHeader
          title="Certificates"
          description="Manage, issue, and verify student certificates."
        />

        <StatCards />

        <div className="flex items-center justify-end">
          <Button>
            <Plus className="h-4 w-4" /> Issue Certificate
          </Button>
        </div>

        <CertificateTabsHandler>
          <TabsContent value="all-certificates">
            <AllCertificatesTab />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="verification">
            <VerificationTab />
          </TabsContent>
        </CertificateTabsHandler>
      </div>
    </Suspense>
  );
}
