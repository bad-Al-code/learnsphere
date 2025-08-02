"use client";

import { format } from "date-fns";
import { Chrome, Globe, LogOut } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Flag from "react-world-flags";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

import {
  getSessions,
  terminateAllOtherSessions,
  terminateCurrentSession,
  terminateSession,
} from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "@/types/user";

const getBrowserIcon = (browserName: string = "") => {
  if (browserName.includes("Chrome"))
    return <Chrome className="h-5 w-5 text-muted-foreground" />;

  return <Globe className="h-5 w-5 text-muted-foreground" />;
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
        toast.error("Could not load session history", {
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
          toast.success("Session terminated.");

          fetchSessions(limit);
        } else {
          toast.error(result.error || "Failed to terminate session");
        }
      }
    });
  };

  const handleTerminateAllOthers = () => {
    startTerminatingAll(async () => {
      const result = await terminateAllOtherSessions();
      if (result.success) {
        toast.success("All other sessions have been terminated.");
        const updatedSessions = await getSessions();
        if (updatedSessions.success && updatedSessions.data) {
          setSessions(updatedSessions.data);
        }
      } else {
        toast.error(result.error || "Failed to terminate other sessions");
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

      <div className="border rounded-lg">
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4 p-4 font-semibold text-sm text-muted-foreground border-b">
          <div className="col-span-2 md:col-span-2">Clients</div>
          <div className="col-start-3 hidden md:block">IP address</div>
          <div className="col-start-4 hidden md:block">Country</div>
          <div className="col-start-5 hidden md:block">
            Most recent activity
          </div>
          <div className="col-start-3 md:col-start-6 text-center">Status</div>
        </div>
        {isLoading ? (
          <p className="p-4 text-center">Loading sessions...</p>
        ) : (
          <ul className="divide-y">
            {sessions.map((session, index) => {
              const ua = new UAParser(session.userAgent || "");
              const browser = ua.getBrowser();
              const os = ua.getOS();
              const isCurrent = index === 0;

              return (
                <li
                  key={session.jti}
                  className="grid grid-cols-4 md:grid-cols-7 gap-4 p-4 items-center"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    {getBrowserIcon(browser.name)}
                    <div>
                      <p className="font-medium text-sm">
                        {browser.name || "Unknown Browser"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {os.name || "Unknown OS"}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block col-start-3 text-sm text-muted-foreground  break-all">
                    {session.ipAddress}
                  </div>

                  <div className="hidden col-start-4 md:block text-sm  items-center gap-2 ">
                    {session.countryCode ? (
                      <Flag code={session.countryCode} height="14" />
                    ) : (
                      <span>-</span>
                    )}
                    <span>{session.country || "Unknown"}</span>
                  </div>

                  <div className="hidden md:block col-start-5 text-sm text-muted-foreground  break-all">
                    {format(new Date(session.createdAt), "P p")}
                  </div>

                  <div className="col-start-4 md:col-start-6 flex justify-center items-center gap-2">
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
                      <LogOut className="mr-1 " />
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
        <div className="pt-4 flex justify-end">
          <Button
            variant="destructive"
            onClick={handleTerminateAllOthers}
            disabled={isTerminatingAll}
          >
            {isTerminatingAll ? "Closing..." : "Close other sessions"}
          </Button>
        </div>
      )}
    </div>
  );
}
