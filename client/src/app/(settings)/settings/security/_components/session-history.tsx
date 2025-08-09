'use client';

import { format } from 'date-fns';
import { Chrome, Globe, LogOut } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import Flag from 'react-world-flags';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';

import {
  getSessions,
  terminateAllOtherSessions,
  terminateCurrentSession,
  terminateSession,
} from '@/app/(auth)/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Session } from '@/types/user';

const getBrowserIcon = (browserName: string = '') => {
  if (browserName.includes('Chrome'))
    return <Chrome className="text-muted-foreground h-5 w-5" />;

  return <Globe className="text-muted-foreground h-5 w-5" />;
};

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, startLoading] = useTransition();
  const [isTerminating, startTerminating] = useTransition();
  const [isTerminatingAll, startTerminatingAll] = useTransition();
  const [limit, setLimit] = useState<number>(10);

  const fetchSessions = (currentLimit: number) => {
    startLoading(async () => {
      const result = await getSessions(currentLimit);
      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        toast.error('Could not load session history', {
          description: result.error,
        });
      }
    });
  };

  useEffect(() => {
    fetchSessions(limit);
  }, [limit]);

  const handleTerminate = (sessionId: string, isCurrent?: boolean) => {
    startTerminating(async () => {
      if (isCurrent) {
        await terminateCurrentSession(sessionId);
      } else {
        const result = await terminateSession(sessionId);
        if (result.success) {
          toast.success('Session terminated.');

          fetchSessions(limit);
        } else {
          toast.error(result.error || 'Failed to terminate session');
        }
      }
    });
  };

  const handleTerminateAllOthers = () => {
    startTerminatingAll(async () => {
      const result = await terminateAllOtherSessions();
      if (result.success) {
        toast.success('All other sessions have been terminated.');
        const updatedSessions = await getSessions();
        if (updatedSessions.success && updatedSessions.data) {
          setSessions(updatedSessions.data);
        }
      } else {
        toast.error(result.error || 'Failed to terminate other sessions');
      }
    });
  };

  if (isLoading) {
    return <p>Loading session history...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={String(limit)}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select number of sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Last 10 sessions</SelectItem>
            <SelectItem value="25">Last 25 sessions</SelectItem>
            <SelectItem value="50">Last 50 sessions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <div className="text-muted-foreground grid grid-cols-4 gap-4 border-b p-4 text-sm font-semibold md:grid-cols-7">
          <div className="col-span-2 md:col-span-2">Clients</div>
          <div className="col-start-3 hidden md:block">IP address</div>
          <div className="col-start-4 hidden md:block">Country</div>
          <div className="col-start-5 hidden md:block">
            Most recent activity
          </div>
          <div className="col-start-3 text-center md:col-start-6">Status</div>
        </div>
        {isLoading ? (
          <p className="p-4 text-center">Loading sessions...</p>
        ) : (
          <ul className="divide-y">
            {sessions.map((session, index) => {
              const ua = new UAParser(session.userAgent || '');
              const browser = ua.getBrowser();
              const os = ua.getOS();
              const isCurrent = index === 0;

              return (
                <li
                  key={session.jti}
                  className="grid grid-cols-4 items-center gap-4 p-4 md:grid-cols-7"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    {getBrowserIcon(browser.name)}
                    <div>
                      <p className="text-sm font-medium">
                        {browser.name || 'Unknown Browser'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {os.name || 'Unknown OS'}
                      </p>
                    </div>
                  </div>

                  <div className="text-muted-foreground col-start-3 hidden text-sm break-all md:block">
                    {session.ipAddress}
                  </div>

                  <div className="col-start-4 hidden items-center gap-2 text-sm md:block">
                    {session.countryCode ? (
                      <Flag code={session.countryCode} height="14" />
                    ) : (
                      <span>-</span>
                    )}
                    <span>{session.country || 'Unknown'}</span>
                  </div>

                  <div className="text-muted-foreground col-start-5 hidden text-sm break-all md:block">
                    {format(new Date(session.createdAt), 'P p')}
                  </div>

                  <div className="col-start-4 flex items-center justify-center gap-2 md:col-start-6">
                    {isCurrent ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Current
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Logged in</Badge>
                    )}
                  </div>

                  <div className="col-start-7">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTerminate(session.jti, isCurrent)}
                      disabled={isTerminating}
                    >
                      <LogOut className="mr-1" />
                      Log out
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {sessions.length > 1 && (
        <div className="flex justify-end pt-4">
          <Button
            variant="destructive"
            onClick={handleTerminateAllOthers}
            disabled={isTerminatingAll}
          >
            {isTerminatingAll ? 'Closing...' : 'Close other sessions'}
          </Button>
        </div>
      )}
    </div>
  );
}
