'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './navItem';

export function AdminSidebar() {
  const pathname = usePathname();

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.href))?.value ||
    'dashboard';

  return (
    <>
      {/* Mobile: Tabs */}
      <div className="mb-4 md:hidden">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="no-scrollbar flex overflow-x-auto">
            {navItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link href={item.href} className="flex items-center gap-1 px-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop: Sidebar Buttons */}
      <nav className="hidden flex-col space-y-2 md:flex">
        {navItems.map((item) => {
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
    </>
  );
}
