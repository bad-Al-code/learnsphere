'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Bot,
  Calendar,
  CheckCircle2,
  Circle,
  CircleDot,
  Edit,
  FileText,
  ListTodo,
  MessageSquare,
  Plus,
  Send,
  Share2,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { useState } from 'react';

// Types
type TTeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
};

type TTaskStatus = 'completed' | 'in-progress' | 'todo' | 'overdue';
type TTaskPriority = 'low' | 'medium' | 'high' | 'critical';

type TTask = {
  id: string;
  name: string;
  description?: string;
  status: TTaskStatus;
  priority: TTaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
  comments: number;
};

type TChatMessage = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
};

type TAIInsight = {
  id: string;
  type: 'suggestion' | 'warning' | 'tip';
  title: string;
  description: string;
};

type TCollaborativeAssignment = {
  id: string;
  title: string;
  course: string;
  lastActivity: string;
  progress: number;
  dueDate: string;
  members: TTeamMember[];
  tasks: TTask[];
  chatMessages: TChatMessage[];
  aiInsights: TAIInsight[];
  resources: { id: string; name: string; type: string; url: string }[];
};

// Static Data
const assignmentData: TCollaborativeAssignment = {
  id: '1',
  title: 'React Component Library',
  course: 'React Fundamentals',
  lastActivity: '2h ago',
  progress: 65,
  dueDate: '2025-10-15',
  members: [
    {
      id: '1',
      name: 'Alex Smith',
      initials: 'AS',
      role: 'Lead Developer',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Emma Wilson',
      initials: 'EW',
      role: 'UI Designer',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      initials: 'MJ',
      role: 'Tester',
      isOnline: false,
      lastSeen: '1h ago',
    },
    {
      id: '4',
      name: 'Sarah Davis',
      initials: 'SD',
      role: 'DevOps',
      isOnline: false,
      lastSeen: '3h ago',
    },
  ],
  tasks: [
    {
      id: '1',
      name: 'Button Component',
      description: 'Create reusable button component with variants',
      status: 'completed',
      priority: 'high',
      assignee: 'Alex Smith',
      dueDate: '2025-09-20',
      createdAt: '2025-09-15',
      comments: 3,
    },
    {
      id: '2',
      name: 'Form Components',
      description: 'Input, Select, Checkbox components with validation',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Emma Wilson',
      dueDate: '2025-09-28',
      createdAt: '2025-09-18',
      comments: 8,
    },
    {
      id: '3',
      name: 'Unit Tests',
      description: 'Write comprehensive tests for all components',
      status: 'todo',
      priority: 'medium',
      assignee: 'Mike Johnson',
      dueDate: '2025-10-01',
      createdAt: '2025-09-20',
      comments: 1,
    },
    {
      id: '4',
      name: 'Documentation',
      description: 'Create Storybook documentation',
      status: 'overdue',
      priority: 'critical',
      assignee: 'Sarah Davis',
      dueDate: '2025-09-22',
      createdAt: '2025-09-16',
      comments: 5,
    },
  ],
  chatMessages: [
    {
      id: '1',
      sender: 'Alex Smith',
      message: 'Just pushed the button component updates!',
      timestamp: '2h ago',
    },
    {
      id: '2',
      sender: 'Emma Wilson',
      message: "Great work! I'll start integrating it into the forms.",
      timestamp: '1.5h ago',
    },
    {
      id: '3',
      sender: 'AI Assistant',
      message:
        'I noticed the documentation is overdue. Would you like me to help generate some basic docs?',
      timestamp: '1h ago',
      isAI: true,
    },
  ],
  aiInsights: [
    {
      id: '1',
      type: 'warning',
      title: 'Documentation Overdue',
      description:
        'The documentation task is 2 days overdue. This might block the final review.',
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Optimize Workflow',
      description:
        'Consider breaking down the Form Components task into smaller subtasks for better tracking.',
    },
    {
      id: '3',
      type: 'tip',
      title: 'Team Sync Recommended',
      description:
        "Mike and Sarah haven't been active recently. A quick sync might help.",
    },
  ],
  resources: [
    { id: '1', name: 'Design System Guide', type: 'document', url: '#' },
    { id: '2', name: 'Component Workshop Recording', type: 'video', url: '#' },
    { id: '3', name: 'Testing Best Practices', type: 'document', url: '#' },
  ],
};

// Component: Team Member Card
function TeamMember({
  member,
  onMemberClick,
}: {
  member: TTeamMember;
  onMemberClick: (member: TTeamMember) => void;
}) {
  return (
    <div
      className="bg-muted/40 hover:bg-muted/60 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 transition-colors"
      onClick={() => onMemberClick(member)}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback>{member.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {member.name}
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              member.isOnline ? 'bg-green-500' : 'bg-muted-foreground'
            )}
          />
        </p>
        <p className="text-muted-foreground text-xs">
          {member.role}{' '}
          {!member.isOnline && member.lastSeen && `• ${member.lastSeen}`}
        </p>
      </div>
    </div>
  );
}

// Component: Task Item
function TaskItem({
  task,
  onTaskClick,
}: {
  task: TTask;
  onTaskClick: (task: TTask) => void;
}) {
  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    'in-progress': (
      <CircleDot className="h-4 w-4 animate-pulse text-blue-500" />
    ),
    todo: <Circle className="text-muted-foreground h-4 w-4" />,
    overdue: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div
      className="hover:bg-muted/40 flex cursor-pointer flex-col items-start justify-between rounded-md p-3 transition-colors sm:flex-row sm:items-center"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-center gap-2">
        {statusIcons[task.status]}
        <div>
          <p className="font-medium">{task.name}</p>
          {task.description && (
            <p className="text-muted-foreground text-xs">{task.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 pl-6 sm:pl-0">
        <Badge
          variant="outline"
          className={cn('text-xs', priorityColors[task.priority])}
        >
          {task.priority}
        </Badge>
        <p className="text-muted-foreground text-xs">{task.assignee}</p>
        {task.comments > 0 && (
          <Badge variant="secondary" className="text-xs">
            {task.comments} comments
          </Badge>
        )}
      </div>
    </div>
  );
}

// Component: AI Insights Panel
function AIInsightsPanel({ insights }: { insights: TAIInsight[] }) {
  const iconMap = {
    suggestion: <Bot className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    tip: <Star className="h-4 w-4" />,
  };

  const variantMap = {
    suggestion: 'default',
    warning: 'destructive',
    tip: 'default',
  } as const;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">AI Insights</h3>
      </div>
      {insights.map((insight) => (
        <Alert key={insight.id} variant={variantMap[insight.type]}>
          {iconMap[insight.type]}
          <AlertTitle>{insight.title}</AlertTitle>
          <AlertDescription>{insight.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

// Component: Chat Messages
function ChatMessages({
  messages,
  onSendMessage,
}: {
  messages: TChatMessage[];
  onSendMessage: (message: string) => void;
}) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'rounded-lg p-3',
              msg.isAI ? 'border border-blue-200 bg-blue-50' : 'bg-muted/40'
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{msg.sender}</p>
              <p className="text-muted-foreground text-xs">{msg.timestamp}</p>
            </div>
            <p className="text-sm">{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Component: Resources Panel
function ResourcesPanel({
  resources,
}: {
  resources: typeof assignmentData.resources;
}) {
  const iconMap = {
    document: <FileText className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Resources</h3>
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors"
        >
          {iconMap[resource.type as keyof typeof iconMap]}
          <span className="text-sm">{resource.name}</span>
        </div>
      ))}
    </div>
  );
}

// Component: Task Dialog
function TaskDialog({
  task,
  open,
  onOpenChange,
}: {
  task: TTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.name}
            <Badge variant="outline">{task.priority}</Badge>
          </DialogTitle>
          <DialogDescription>
            Assigned to {task.assignee} • Due {task.dueDate}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-muted-foreground text-sm">
              {task.description || 'No description provided'}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Status</h4>
            <Badge variant="secondary">{task.status}</Badge>
          </div>
          <div>
            <h4 className="font-medium">Comments ({task.comments})</h4>
            <Textarea placeholder="Add a comment..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">
            <Edit className="mr-1 h-4 w-4" />
            Edit Task
          </Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component: Member Dialog
function MemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member: TTeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg">{member.name}</p>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-3 w-3 rounded-full',
                member.isOnline ? 'bg-green-500' : 'bg-muted-foreground'
              )}
            />
            <span className="text-sm">
              {member.isOnline ? 'Online' : `Last seen ${member.lastSeen}`}
            </span>
          </div>
          <div>
            <h4 className="font-medium">Assigned Tasks</h4>
            <p className="text-muted-foreground text-sm">
              {
                assignmentData.tasks.filter((t) => t.assignee === member.name)
                  .length
              }{' '}
              tasks assigned
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">
            <MessageSquare className="mr-1 h-4 w-4" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Component: Collaborative Assignment Card
function CollaborativeAssignmentCard({
  assignment,
}: {
  assignment: TCollaborativeAssignment;
}) {
  const [selectedTask, setSelectedTask] = useState<TTask | null>(null);
  const [selectedMember, setSelectedMember] = useState<TTeamMember | null>(
    null
  );
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);
  const [messages, setMessages] = useState(assignment.chatMessages);

  const handleTaskClick = (task: TTask) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleMemberClick = (member: TTeamMember) => {
    setSelectedMember(member);
    setMemberDialogOpen(true);
  };

  const handleSendMessage = (message: string) => {
    const newMessage: TChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message,
      timestamp: 'now',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{assignment.title}</span>
            <Badge variant="outline">
              <Calendar className="mr-1 h-3 w-3" />
              Due {assignment.dueDate}
            </Badge>
          </CardTitle>
          <CardDescription>
            {assignment.course} • Last activity: {assignment.lastActivity}
          </CardDescription>
          <CardAction>
            <div className="flex-shrink-0 text-right">
              <p className="text-xl font-bold">{assignment.progress}%</p>
              <p className="text-muted-foreground text-xs">Complete</p>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                Team Members ({assignment.members.length})
              </h3>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Member
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {assignment.members.map((member) => (
                <TeamMember
                  key={member.id}
                  member={member}
                  onMemberClick={handleMemberClick}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                Tasks ({assignment.tasks.length})
              </h3>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </div>
            <div className="space-y-1">
              {assignment.tasks.slice(0, 3).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTaskClick={handleTaskClick}
                />
              ))}
              {assignment.tasks.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setTasksDialogOpen(true)}
                >
                  View {assignment.tasks.length - 3} more tasks
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-4">
          <Progress value={assignment.progress} className="h-2" />
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setChatDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Team Chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open team chat</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setTasksDialogOpen(true)}
                  >
                    <ListTodo className="h-4 w-4" />
                    <span>View Tasks</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View all tasks</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setAiInsightsOpen(true)}
                  >
                    <Bot className="h-4 w-4" />
                    <span>AI Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get AI insights</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      <TaskDialog
        task={selectedTask}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
      />

      <MemberDialog
        member={selectedMember}
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
      />

      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Team Chat</DialogTitle>
            <DialogDescription>
              Communicate with your team members
            </DialogDescription>
          </DialogHeader>
          <ChatMessages messages={messages} onSendMessage={handleSendMessage} />
        </DialogContent>
      </Dialog>

      <Dialog open={tasksDialogOpen} onOpenChange={setTasksDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>All Tasks</DialogTitle>
            <DialogDescription>Manage all project tasks</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {assignment.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add New Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={aiInsightsOpen} onOpenChange={setAiInsightsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Insights & Recommendations</DialogTitle>
            <DialogDescription>
              Get AI-powered suggestions for your project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <AIInsightsPanel insights={assignment.aiInsights} />
            <ResourcesPanel resources={assignment.resources} />
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Bot className="mr-1 h-4 w-4" />
              Get More Insights
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Skeleton Components
function TeamMemberSkeleton() {
  return (
    <div className="bg-muted/40 flex items-center gap-2 rounded-lg px-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function TaskItemSkeleton() {
  return (
    <div className="flex flex-col items-start justify-between rounded-md p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-2 pl-6 sm:pl-0">
        <Skeleton className="h-5 w-12 rounded" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </div>
  );
}

function CollaborativeAssignmentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Skeleton className="h-7 w-56" />
          </CardTitle>
          <Skeleton className="h-6 w-20 rounded" />
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
        <CardAction>
          <div className="space-y-1 text-right">
            <Skeleton className="ml-auto h-7 w-16" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <TeamMemberSkeleton key={i} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <TaskItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4">
        <Skeleton className="h-2 w-full" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-10 w-28 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function CollaborativeTab() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <CollaborativeTabSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Collaborative Assignments</h2>
        </div>
        <p className="text-muted-foreground">
          Work together with classmates on group projects and track progress in
          real-time
        </p>
      </header>
      <CollaborativeAssignmentCard assignment={assignmentData} />
    </div>
  );
}

export function CollaborativeTabSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-8 w-72" />
        </div>
        <Skeleton className="mt-2 h-4 w-96" />
      </header>
      <CollaborativeAssignmentCardSkeleton />
    </div>
  );
}
