import {
  CustomReportBuilder,
  CustomReportBuilderSkeleton,
} from './custom-report-builder';
import {
  PredefinedReports,
  PredefinedReportsSkeleton,
} from './pre-defined-reports';

export async function ReportsTab() {
  return (
    <div className="space-y-2">
      <PredefinedReports />
      <CustomReportBuilder />
    </div>
  );
}

export function ReportsTabSkeleton() {
  return (
    <div className="space-y-2">
      <PredefinedReportsSkeleton />
      <CustomReportBuilderSkeleton />
    </div>
  );
}
