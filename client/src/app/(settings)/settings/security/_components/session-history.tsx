"use client";

import { format } from "date-fns";
import {
  Chrome,
  Firefox,
  Globe,
  Laptop,
  LogOut,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

import { getSessions, terminateSession } from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Session = {
  jti: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

const getDeviceIcon = (device: UAParser.IDevice) => {
  switch (device.type) {
    case "mobile":
      return <Smartphone className="h-5 w-5 text-muted-foreground" />;
    case "tablet":
      return <Tablet className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Laptop className="h-5 w-5 text-muted-foreground" />;
  }
};

const getBrowserIcon = (browser: UAParser.IBrowser) => {
  switch (browser.name) {
    case "Chrome":
      return <Chrome className="h-5 w-5 text-muted-foreground" />;
    case "Firefox":
      return <Firefox className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Globe className="h-5 w-5 text-muted-foreground" />;
  }
};

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, startLoading] = useTransition();
  const [isTerminating, startTerminating] = useTransition();

  useEffect(() => {
    startLoading(async () => {
      const result = await getSessions();
      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        toast.error(result.error || "Could not load session history");
      }
    });
  }, []);

  const handleTerminate = (sessionId: string) => {
    startTerminating(async () => {
      const result = await terminateSession(sessionId);
      if (result.success) {
        toast.success("Session terminated.");
        const updatedSessions = await getSessions();
        if (updatedSessions.success && updatedSessions.data) {
          setSessions(updatedSessions.data);
        }
      } else {
        toast.error(result.error || "Failed to terminate session");
      }
    });
  };

  if (isLoading) {
    return <p>Loading session history...</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {sessions.map((session, index) => {
          const ua = new UAParser(session.userAgent || "");
          const device = ua.getDevice();
          const browser = ua.getBrowser();
          const os = ua.getOS();
          const isCurrent = index === 0;

          return (
            <li
              key={session.jti}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                {getBrowserIcon(browser)}
                <div>
                  <p className="font-medium">
                    {browser.name || "Unknown Browser"} on{" "}
                    {os.name || "Unknown OS"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.ipAddress || "IP Not Available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground hidden md:block">
                  {format(new Date(session.createdAt), "P p")}
                </p>
                {isCurrent ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Current
                  </Badge>
                ) : (
                  <Badge variant="outline">Logged in</Badge>
                )}
                {!isCurrent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTerminate(session.jti)}
                    disabled={isTerminating}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
