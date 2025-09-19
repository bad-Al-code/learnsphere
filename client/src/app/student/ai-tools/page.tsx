import AiTools, { AiToolsSkeleton } from '@/features/ai-tools/page';
import { Suspense } from 'react';

export default function AiToolsPage() {
  return (
    <Suspense fallback={<AiToolsSkeleton />}>
      <AiTools />
    </Suspense>
  );
}
