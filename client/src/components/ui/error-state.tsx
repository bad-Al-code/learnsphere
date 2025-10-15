'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsLoading(true);
    try {
      await onRetry();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <p className="text-lg font-semibold">An Error Occurred</p>
        <Alert variant="destructive" className="mx-auto max-w-sm">
          <AlertDescription className="mx-auto">{message}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button variant="outline" onClick={handleRetry} disabled={isLoading}>
            {isLoading ? (
              <Loader className={cn('h-4 w-4 animate-spin')} />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? 'Retrying...' : 'Retry'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
