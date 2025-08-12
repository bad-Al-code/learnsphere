import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const bannerVariants = cva(
  'flex items-center w-full rounded-md border p-4 text-sm',
  {
    variants: {
      variant: {
        warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
        success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || 'warning'];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 h-4 w-4 shrink-0" />
      {label}
    </div>
  );
};
