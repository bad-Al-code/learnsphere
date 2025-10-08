import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-muted hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const rippleVariants = {
  default: 'bg-primary-foreground/30',
  destructive: 'bg-destructive/30',
  outline: 'bg-foreground/10',
  secondary: 'bg-secondary-foreground/30',
  ghost: 'bg-accent-foreground/20',
  link: 'bg-primary/20',
};

function Button({
  className,
  variant = 'default',
  size,
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.className =
      rippleVariants[variant as keyof typeof rippleVariants] ||
      rippleVariants.default;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 900ms ease-out';
    ripple.style.pointerEvents = 'none';

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 900);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (onClick) {
      onClick(event);
    }
  };

  const Comp = asChild ? Slot : 'button';

  return (
    <>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      <Comp
        ref={asChild ? undefined : buttonRef}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={asChild ? onClick : handleClick}
        {...props}
      />
    </>
  );
}

export { Button, buttonVariants };
