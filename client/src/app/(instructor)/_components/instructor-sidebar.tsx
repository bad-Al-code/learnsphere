'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { instructorNavItems } from './nav-items';

export function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden flex-col space-y-2 md:flex">
      {instructorNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2 truncate"
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
