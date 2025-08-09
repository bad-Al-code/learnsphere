import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { navItems } from './navItem';

export function AdminTabs() {
  return (
    <Tabs className="w-full">
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
  );
}
