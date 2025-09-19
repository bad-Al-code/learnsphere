'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSessionStore } from '@/stores/session-store';
import { useMutation } from '@tanstack/react-query';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateThemeAction } from './actions/theme';

const useUpdateTheme = () => {
  const { user, setUser } = useSessionStore();

  return useMutation({
    mutationFn: updateThemeAction,
    onMutate: async (newTheme) => {
      if (!user) return;

      const newSettings = { ...user.settings, theme: newTheme.theme };
      const optimisticUser = { ...user, settings: newSettings };

      setUser(optimisticUser);
    },
    onError: (error) => {
      toast.error(error.message || 'Could not save your theme preference.');
    },
  });
};

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useSessionStore();
  const { mutate: updateTheme } = useUpdateTheme();

  useEffect(() => {
    setMounted(true);

    const dbTheme = user?.settings?.theme;
    if (dbTheme && dbTheme !== theme) {
      setTheme(dbTheme);
    }
  }, [user, setTheme, theme]);

  if (!mounted) {
    return <div style={{ width: '40px', height: '40px' }} />;
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    updateTheme({ theme: newTheme });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
