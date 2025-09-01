'use client';

import { faker } from '@faker-js/faker';
import {
  Bell,
  Hash,
  Headphones,
  Mic,
  Pin,
  Search,
  Settings,
  Users,
  Volume2,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TChannel = { id: string; name: string; unreadCount?: number };
type TUserRole = 'Professor' | 'Student' | 'AI Assistant';
type TUser = {
  name: string;
  role: TUserRole;
  avatar: string;
  initials: string;
  status?: 'online' | 'away';
};
type TMessage = {
  id: string;
  user: TUser;
  timestamp: string;
  content: string;
  code?: string;
  reactions?: { emoji: string; count: number }[];
  replies?: number;
  suggestions?: string[];
};

const textChannels: TChannel[] = [
  { id: 'c1', name: 'general', unreadCount: 3 },
  { id: 'c2', name: 'announcements' },
  { id: 'c3', name: 'study-groups', unreadCount: 7 },
  { id: 'c4', name: 'project-help', unreadCount: 2 },
];
const voiceChannels: TChannel[] = [
  { id: 'v1', name: 'Study Room 1', unreadCount: 4 },
  { id: 'v2', name: 'Group Project' },
];

const users: TUser[] = [
  { name: 'Dr. Sarah Chen', role: 'Professor', status: 'online' },
  { name: 'Mike Johnson', role: 'Student', status: 'online' },
  { name: 'Emma Wilson', role: 'Student', status: 'away' },
  { name: 'Alex Rivera', role: 'Student', status: 'online' },
  { name: 'AI Study Bot', role: 'AI Assistant', status: 'online' },
].map(
  (u) =>
    ({
      ...u,
      avatar: faker.image.avatarGitHub(),
      initials: u.name
        .split(' ')
        .map((n) => n[0])
        .join(''),
    }) as TUser
);

const messages: TMessage[] = [
  {
    id: 'm1',
    user: users[0],
    timestamp: 'Today at 9:00 AM',
    content:
      "Good morning everyone! Today we'll be covering advanced React patterns. Make sure you've completed the pre-reading.",
    reactions: [
      { emoji: '👍', count: 12 },
      { emoji: '📚', count: 8 },
    ],
    replies: 3,
  },
  {
    id: 'm2',
    user: users[1],
    timestamp: 'Today at 10:15 AM',
    content:
      "Has anyone figured out the useCallback optimization in assignment 3? I'm getting some weird re-renders.",
    code: 'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);',
    reactions: [
      { emoji: '🤔', count: 5 },
      { emoji: '👀', count: 3 },
    ],
    replies: 7,
  },
  {
    id: 'm3',
    user: users[4],
    timestamp: 'Today at 11:30 AM',
    content:
      "💡 **Study Tip**: Based on recent discussions, here are some key React optimization patterns to review before tomorrow's quiz:",
    suggestions: [
      'React.memo() usage patterns',
      'useCallback vs useMemo',
      'Component composition strategies',
    ],
    reactions: [
      { emoji: '🧠', count: 18 },
      { emoji: '💡', count: 15 },
      { emoji: '🙌', count: 9 },
    ],
  },
];

function ServerPanel() {
  return (
    <div className="bg-muted/50 flex h-full flex-col">
      <div className="p-4">
        <p className="font-bold">CS Department</p>
        <p className="text-muted-foreground text-xs">Study Community</p>
      </div>
      <Separator />
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <div>
          <p className="text-muted-foreground px-2 text-xs font-bold uppercase">
            Text Channels
          </p>
          <div className="mt-1 space-y-1">
            {textChannels.map((ch) => (
              <Link
                href="#"
                key={ch.id}
                className={cn(
                  'text-primary/90 flex items-center justify-between rounded-md px-2 py-1',
                  ch.name === 'general' && 'bg-primary/10 text-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {ch.name}
                </div>
                {ch.unreadCount && (
                  <Badge className="h-5">{ch.unreadCount}</Badge>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted-foreground px-2 text-xs font-bold uppercase">
            Voice Channels
          </p>
          <div className="mt-1 space-y-1">
            {voiceChannels.map((ch) => (
              <a
                href="#"
                key={ch.id}
                className="flex items-center justify-between rounded px-2 py-1"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  {ch.name}
                </div>
                {ch.unreadCount && (
                  <Badge variant="secondary">{ch.unreadCount}</Badge>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="mb-2 flex items-center gap-2 p-2">
        <Avatar>
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">You</p>
          <p className="text-muted-foreground text-xs">studying</p>
        </div>
        <Button variant="ghost" size="icon">
          <Mic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Headphones className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ChatPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b p-2">
        <div className="flex items-center gap-2">
          <Hash className="text-muted-foreground h-5 w-5" />
          <p className="font-semibold">general</p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Pin className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <div className="relative ml-2">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search" className="h-8 w-36 pl-9" />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{msg.user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{msg.user.name}</p>
                <Badge variant="secondary">{msg.user.role}</Badge>
                <p className="text-muted-foreground text-xs">{msg.timestamp}</p>
              </div>

              <p className="">{msg.content}</p>
              {msg.code && (
                <pre className="bg-muted mt-2 rounded p-2 font-mono text-xs">
                  <code>{msg.code}</code>
                </pre>
              )}

              {msg.suggestions && (
                <div className="flex flex-wrap gap-1">
                  {msg.suggestions.map((s) => (
                    <Button key={s} variant="outline" size="sm">
                      {s}
                    </Button>
                  ))}
                </div>
              )}

              {msg.reactions && (
                <div className="flex items-center gap-1">
                  {msg.reactions.map((r) => (
                    <Button
                      key={r.emoji}
                      variant="secondary"
                      size="sm"
                      className="space-x-1"
                    >
                      <p>{r.emoji}</p>
                      <p>{r.count}</p>
                    </Button>
                  ))}
                </div>
              )}

              {msg.replies && (
                <p className="text-primary text-xs font-semibold">
                  {msg.replies} replies
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="relative">
          <Input placeholder="Message #general" className="h-12 pr-20" />
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
            <Button variant="ghost" size="icon">
              +
            </Button>
            <Button variant="ghost" size="icon">
              🎁
            </Button>
            <Button variant="ghost" size="icon">
              😊
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserPanel() {
  return (
    <div className="bg-muted/50 flex h-full flex-col p-4">
      <p className="text-sm font-semibold uppercase">
        Online — {users.filter((u) => u.status === 'online').length}
      </p>

      <div className="mt-2 space-y-3">
        {users.map((user) => (
          <div key={user.name} className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  'border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2',
                  user.status === 'online' ? 'bg-emerald-500' : 'bg-yellow-500'
                )}
              />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground text-xs">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServerPanelSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="absolute bottom-0 w-full p-2">
        <Separator />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
function ChatPanelSkeleton() {
  return (
    <div className="h-full">
      <div className="flex items-center border-b p-2">
        <Skeleton className="h-6 w-24" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
      <div className="space-y-6 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 w-full border-t p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
function UserPanelSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-5 w-1/2" />
      <div className="mt-2 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatTab() {
  return (
    <Card className="h-[calc(100vh-11.5rem)] w-full overflow-hidden bg-none py-0">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={0} maxSize={100}>
          <ServerPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={40}>
          <ChatPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={0} maxSize={25}>
          <UserPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}

export function ChatTabSkeleton() {
  return (
    <Card className="h-[calc(100vh-11rem)] w-full overflow-hidden pt-2 pb-0">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={0} maxSize={100}>
          <ServerPanelSkeleton />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={40}>
          <ChatPanelSkeleton />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={0} maxSize={25}>
          <UserPanelSkeleton />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
