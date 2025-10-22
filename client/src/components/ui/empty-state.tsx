import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, PlayCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'book' | 'file' | 'video';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No Content Available',
  description = 'There is no content to display at the moment.',
  icon = 'book',
  action,
}: EmptyStateProps) {
  const Icon =
    icon === 'book' ? BookOpen : icon === 'file' ? FileText : PlayCircle;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-muted rounded-full p-6">
          <Icon className="text-muted-foreground h-12 w-12" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            {description}
          </p>
        </div>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
