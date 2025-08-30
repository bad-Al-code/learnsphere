'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { iconMap } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  instructorNavItems,
  studentCustomizeNavItems,
  studentNavItems,
} from '@/config/nav-items';

interface SidebarNavProps {
  type: 'instructor' | 'student' | 'student-customize';
}

export function SidebarNav({ type }: SidebarNavProps) {
  const pathname = usePathname();
  const navItems =
    type === 'instructor'
      ? instructorNavItems
      : type === 'student'
        ? studentNavItems
        : type === 'student-customize'
          ? studentCustomizeNavItems
          : [];

  return (
    <nav className="grid items-start gap-1 text-sm font-medium">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        if (!Icon) return null;

        const isActive = () => {
          if (item.href === '/student' || item.href === '/dashboard') {
            return pathname === item.href;
          }

          return pathname.startsWith(item.href);
        };

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive() ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Link href={item.href} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
