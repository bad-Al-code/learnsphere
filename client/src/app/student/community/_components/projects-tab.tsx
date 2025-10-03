import { faker } from '@faker-js/faker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Archive,
  BarChart3,
  Bell,
  BellOff,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  Filter,
  FolderKanban,
  GitBranch,
  Grid3x3,
  Image as ImageIcon,
  List,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Webhook,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TeamMemberRole = 'owner' | 'admin' | 'contributor' | 'viewer';

type TeamMember = {
  id: string;
  name: string;
  role: TeamMemberRole;
  initials: string;
  email: string;
  joinedAt: string;
};

type ProjectStatus = 'active' | 'recruiting' | 'completed' | 'archived';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  assigneeId: string;
};

type Milestone = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

type Notification = {
  id: string;
  type: 'due_date' | 'team_change' | 'milestone' | 'overdue' | 'status_change';
  message: string;
  timestamp: string;
  read: boolean;
  projectId: string;
};

type Integration = {
  type: 'slack' | 'discord' | 'email' | 'webhook';
  enabled: boolean;
  config: Record<string, string | undefined>;
};

type CustomField = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: string;
  options?: string[];
};

type Project = {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  createdAt: string;
  lastUpdated: string;
  status: ProjectStatus;
  team: TeamMember[];
  tags: string[];
  teamSize: number;
  isFavorite: boolean;
  isWatching: boolean;
  visibility: 'public' | 'private';
  color: string;
  tasks: Task[];
  milestones: Milestone[];
  githubUrl?: string;
  category: string;
  coverImage?: string;
  customFields: CustomField[];
  labels: string[];
  notifications: Notification[];
  integrations: Integration[];
  aiSuggestion?: string;
  predictedDeadline?: string;
};

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'progress' | 'dueDate' | 'popularity';

type Filters = {
  search: string;
  status: ProjectStatus | 'all';
  dateFrom: string;
  dateTo: string;
  teamSize: string;
  tags: string[];
  sortBy: SortBy;
  myProjects: boolean;
  favorites: boolean;
  watching: boolean;
  categories: string[];
};

const createTeam = (count: number): TeamMember[] =>
  Array.from({ length: count }, () => {
    const name = faker.person.fullName();
    return {
      id: faker.string.uuid(),
      name,
      role: faker.helpers.arrayElement([
        'owner',
        'admin',
        'contributor',
        'viewer',
      ] as TeamMemberRole[]),
      initials: name
        .split(' ')
        .map((n) => n[0])
        .join(''),
      email: faker.internet.email(),
      joinedAt: faker.date.past({ years: 0.5 }).toISOString(),
    };
  });

const createTasks = (count: number, teamIds: string[]): Task[] =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    completed: faker.datatype.boolean(),
    assigneeId: faker.helpers.arrayElement(teamIds),
  }));

const createMilestones = (count: number): Milestone[] =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    dueDate: faker.date.future({ years: 0.5 }).toISOString().split('T')[0],
    completed: faker.datatype.boolean(),
  }));

const generateMockProjects = (): Project[] => {
  const templates = [
    {
      title: 'E-commerce Platform',
      description:
        'Building a full-stack e-commerce application with React and Node.js',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Web Development',
    },
    {
      title: 'Machine Learning Classifier',
      description: 'Developing an image classification model using TensorFlow',
      tags: ['Python', 'TensorFlow', 'Jupyter', 'OpenCV'],
      category: 'AI/ML',
    },
    {
      title: 'Mobile Fitness App',
      description: 'Creating a cross-platform fitness tracking application',
      tags: ['React Native', 'Firebase', 'Redux'],
      category: 'Mobile Development',
    },
    {
      title: 'DevOps Automation Suite',
      description: 'Automated CI/CD pipeline with Docker and Kubernetes',
      tags: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
      category: 'DevOps',
    },
    {
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media marketing',
      tags: ['Vue.js', 'D3.js', 'GraphQL'],
      category: 'Data Visualization',
    },
  ];

  return templates.map((p) => {
    const team = createTeam(faker.number.int({ min: 3, max: 8 }));
    const tasks = createTasks(
      faker.number.int({ min: 5, max: 15 }),
      team.map((t) => t.id)
    );
    const milestones = createMilestones(faker.number.int({ min: 2, max: 5 }));
    const dueDate = faker.date
      .future({ years: 0.3 })
      .toISOString()
      .split('T')[0];
    const dueDateObj = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.floor(
      (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const notifications: Notification[] = [];
    if (daysUntilDue <= 7 && daysUntilDue >= 0) {
      notifications.push({
        id: faker.string.uuid(),
        type: 'due_date',
        message: `Project due in ${daysUntilDue} days`,
        timestamp: new Date().toISOString(),
        read: false,
        projectId: '',
      });
    }
    if (daysUntilDue < 0) {
      notifications.push({
        id: faker.string.uuid(),
        type: 'overdue',
        message: `Project is ${Math.abs(daysUntilDue)} days overdue`,
        timestamp: new Date().toISOString(),
        read: false,
        projectId: '',
      });
    }

    return {
      ...p,
      id: faker.string.uuid(),
      progress: faker.number.int({ min: 20, max: 95 }),
      dueDate,
      createdAt: faker.date.past({ years: 0.5 }).toISOString(),
      lastUpdated: faker.date.recent({ days: 7 }).toISOString(),
      status: faker.helpers.arrayElement([
        'active',
        'recruiting',
        'completed',
        'archived',
      ] as ProjectStatus[]),
      team,
      teamSize: team.length,
      isFavorite: faker.datatype.boolean({ probability: 0.3 }),
      isWatching: faker.datatype.boolean({ probability: 0.5 }),
      visibility: faker.helpers.arrayElement(['public', 'private'] as const),
      color: faker.helpers.arrayElement([
        'blue',
        'green',
        'purple',
        'orange',
        'pink',
      ]),
      tasks,
      milestones,
      githubUrl: faker.datatype.boolean({ probability: 0.7 })
        ? faker.internet.url()
        : undefined,
      coverImage: faker.datatype.boolean({ probability: 0.6 })
        ? faker.image.urlPicsumPhotos({ width: 800, height: 400 })
        : undefined,
      customFields: [
        {
          id: '1',
          name: 'Priority',
          type: 'select',
          value: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
          options: ['High', 'Medium', 'Low'],
        },
        {
          id: '2',
          name: 'Budget',
          type: 'number',
          value: faker.finance.amount({ min: 10000, max: 100000, dec: 0 }),
        },
      ],
      labels: faker.helpers.arrayElements(
        ['Frontend', 'Backend', 'Design', 'Testing', 'Documentation'],
        { min: 1, max: 3 }
      ),
      notifications,
      integrations: [
        {
          type: 'slack',
          enabled: faker.datatype.boolean(),
          config: { webhook: 'https://hooks.slack.com/...' },
        },
        {
          type: 'discord',
          enabled: faker.datatype.boolean(),
          config: { webhook: 'https://discord.com/api/webhooks/...' },
        },
        { type: 'email', enabled: true, config: { frequency: 'weekly' } },
        {
          type: 'webhook',
          enabled: faker.datatype.boolean(),
          config: { url: 'https://api.example.com/webhooks' },
        },
      ],

      aiSuggestion: faker.datatype.boolean({ probability: 0.7 })
        ? faker.helpers.arrayElement([
            'Consider adding more frontend developers',
            'Milestone dates might be too aggressive',
            'Similar projects completed in 3 months',
            'Team velocity suggests early completion',
          ])
        : undefined,
      predictedDeadline: faker.datatype.boolean({ probability: 0.6 })
        ? faker.date.future({ years: 0.2 }).toISOString().split('T')[0]
        : undefined,
    };
  });
};

const fetchProjects = async (): Promise<Project[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateMockProjects();
};

const useProjectsQuery = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 30000,
  });
};

const getRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

const filterProjects = (projects: Project[], filters: Filters): Project[] => {
  return projects.filter((project) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (filters.status !== 'all' && project.status !== filters.status)
      return false;

    if (filters.dateFrom && project.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && project.createdAt > filters.dateTo) return false;

    if (filters.teamSize) {
      const [min, max] = filters.teamSize.split('-').map(Number);
      if (max) {
        if (project.teamSize < min || project.teamSize > max) return false;
      } else {
        if (project.teamSize < min) return false;
      }
    }

    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => project.tags.includes(tag));
      if (!hasTag) return false;
    }

    if (filters.myProjects && !project.team.some((m) => m.role === 'owner'))
      return false;
    if (filters.favorites && !project.isFavorite) return false;
    if (filters.watching && !project.isWatching) return false;

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(project.category)
    )
      return false;

    return true;
  });
};

const sortProjects = (projects: Project[], sortBy: SortBy): Project[] => {
  const sorted = [...projects];
  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'progress':
      return sorted.sort((a, b) => b.progress - a.progress);
    case 'dueDate':
      return sorted.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    case 'popularity':
      return sorted.sort((a, b) => b.teamSize - a.teamSize);
    default:
      return sorted;
  }
};

const NotificationsPanel = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);
  const unreadCount = project.notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'due_date':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="text-destructive h-4 w-4" />;
      case 'team_change':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'milestone':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'status_change':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Stay updated on project activity
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {project.notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BellOff className="text-muted-foreground mb-2 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  No notifications
                </p>
              </div>
            ) : (
              project.notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={notification.read ? 'opacity-60' : ''}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-muted-foreground text-xs">
                          {getRelativeTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const ProjectSettingsDialog = ({
  project,
  open,
  onOpenChange,
  onSuccess,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const [settings, setSettings] = useState({
    visibility: project.visibility,
    color: project.color,
    coverImage: project.coverImage || '',
    notifications: project.isWatching,
    customFields: project.customFields,
    labels: project.labels,
    integrations: project.integrations,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    'blue',
    'green',
    'purple',
    'orange',
    'pink',
    'red',
    'yellow',
    'cyan',
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onOpenChange(false);
    }, 800);
  };

  const toggleIntegration = (type: Integration['type']) => {
    setSettings({
      ...settings,
      integrations: settings.integrations.map((int) =>
        int.type === type ? { ...int, enabled: !int.enabled } : int
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Customize your project settings and integrations
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-1">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={settings.visibility}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    visibility: value as 'public' | 'private',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Public - Anyone can view
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Private - Only team members
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSettings({ ...settings, color })}
                    className={`h-8 w-8 rounded-full border-2 ${
                      settings.color === color
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: {
                        blue: '#3b82f6',
                        green: '#10b981',
                        purple: '#8b5cf6',
                        orange: '#f97316',
                        pink: '#ec4899',
                        red: '#ef4444',
                        yellow: '#eab308',
                        cyan: '#06b6d4',
                      }[color],
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="coverImage"
                  value={settings.coverImage}
                  onChange={(e) =>
                    setSettings({ ...settings, coverImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              {settings.coverImage && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                  <img
                    src={settings.coverImage}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base">Integrations & Notifications</Label>

              <div className="space-y-2">
                {settings.integrations.map((integration) => (
                  <Card key={integration.type}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {integration.type === 'slack' && (
                            <MessageCircle className="h-5 w-5 text-purple-500" />
                          )}
                          {integration.type === 'discord' && (
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                          )}
                          {integration.type === 'email' && (
                            <Mail className="h-5 w-5 text-red-500" />
                          )}
                          {integration.type === 'webhook' && (
                            <Webhook className="h-5 w-5 text-orange-500" />
                          )}
                          <div>
                            <p className="font-medium capitalize">
                              {integration.type}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {integration.type === 'email' &&
                                'Weekly digest emails'}
                              {integration.type === 'slack' &&
                                'Real-time Slack notifications'}
                              {integration.type === 'discord' &&
                                'Discord channel updates'}
                              {integration.type === 'webhook' &&
                                'Custom webhook integration'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={integration.enabled}
                            onCheckedChange={() =>
                              toggleIntegration(integration.type)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Custom Fields</Label>
              <div className="space-y-2">
                {settings.customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-2 gap-2">
                    <Input value={field.name} disabled className="bg-muted" />
                    {field.type === 'select' ? (
                      <Select value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={field.value} type={field.type} />
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Custom Field
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Labels</Label>
              <div className="flex flex-wrap gap-2">
                {settings.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          labels: settings.labels.filter((l) => l !== label),
                        })
                      }
                    />
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3" />
                  Add Label
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AIInsightsCard = ({ project }: { project: Project }) => {
  if (!project.aiSuggestion && !project.predictedDeadline) return null;

  return (
    <Card className="border-dashed border-purple-500/50 bg-purple-500/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-purple-500" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">AI Insights</p>
            {project.aiSuggestion && (
              <p className="text-muted-foreground text-sm">
                {project.aiSuggestion}
              </p>
            )}
            {project.predictedDeadline && (
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Zap className="h-3 w-3" />
                <span>Predicted completion: {project.predictedDeadline}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectComparisonDialog = ({
  open,
  onOpenChange,
  projects,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const compareProjects = projects.filter((p) =>
    selectedProjects.includes(p.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Compare Projects</DialogTitle>
          <DialogDescription>
            Select up to 3 projects to compare
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {projects.slice(0, 6).map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all ${
                  selectedProjects.includes(project.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground'
                }`}
                onClick={() => {
                  if (selectedProjects.includes(project.id)) {
                    setSelectedProjects(
                      selectedProjects.filter((id) => id !== project.id)
                    );
                  } else if (selectedProjects.length < 3) {
                    setSelectedProjects([...selectedProjects, project.id]);
                  }
                }}
              >
                <CardContent className="p-3">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {project.progress}% complete
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {compareProjects.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <div>Metric</div>
                  {compareProjects.map((p) => (
                    <div key={p.id} className="truncate">
                      {p.title}
                    </div>
                  ))}
                </div>
                <Separator />
                {[
                  {
                    label: 'Progress',
                    getValue: (p: Project) => `${p.progress}%`,
                  },
                  { label: 'Status', getValue: (p: Project) => p.status },
                  {
                    label: 'Team Size',
                    getValue: (p: Project) => `${p.teamSize} members`,
                  },
                  {
                    label: 'Tasks',
                    getValue: (p: Project) =>
                      `${p.tasks.filter((t) => t.completed).length}/${p.tasks.length}`,
                  },
                  {
                    label: 'Milestones',
                    getValue: (p: Project) =>
                      `${p.milestones.filter((m) => m.completed).length}/${p.milestones.length}`,
                  },
                  { label: 'Due Date', getValue: (p: Project) => p.dueDate },
                  {
                    label: 'Visibility',
                    getValue: (p: Project) => p.visibility,
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="grid grid-cols-4 gap-4 text-sm"
                  >
                    <div className="text-muted-foreground">{metric.label}</div>
                    {compareProjects.map((p) => (
                      <div key={p.id}>{metric.getValue(p)}</div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const config = {
    active: {
      className: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
      icon: CheckCircle2,
    },
    recruiting: {
      className: 'border-blue-500 text-blue-500 bg-blue-500/10',
      icon: Users,
    },
    completed: {
      className: 'border-purple-500 text-purple-500 bg-purple-500/10',
      icon: Check,
    },
    archived: {
      className: 'border-muted-foreground text-muted-foreground bg-muted',
      icon: Archive,
    },
  };

  const { className, icon: Icon } = config[status];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
};

const ProjectStats = ({ project }: { project: Project }) => {
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const completedMilestones = project.milestones.filter(
    (m) => m.completed
  ).length;

  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="text-muted-foreground flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        <span>
          {completedTasks}/{project.tasks.length} tasks
        </span>
      </div>
      <div className="text-muted-foreground flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        <span>
          {completedMilestones}/{project.milestones.length} milestones
        </span>
      </div>
      <div className="text-muted-foreground flex items-center gap-1">
        <Users className="h-3 w-3" />
        <span>{project.teamSize} members</span>
      </div>
    </div>
  );
};

const TeamAvatars = ({
  team,
  maxShow = 4,
}: {
  team: TeamMember[];
  maxShow?: number;
}) => {
  const displayTeam = team.slice(0, maxShow);
  const remaining = team.length - maxShow;

  return (
    <div className="flex items-center -space-x-2">
      {displayTeam.map((member) => (
        <Tooltip key={member.id}>
          <TooltipTrigger>
            <Avatar className="border-background h-8 w-8 border-2">
              <AvatarFallback className="text-xs">
                {member.initials}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{member.name}</p>
            <p className="text-muted-foreground text-xs">{member.role}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {remaining > 0 && (
        <Avatar className="border-background h-8 w-8 border-2">
          <AvatarFallback className="text-xs">+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const AdvancedFiltersDialog = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  allTags,
  allCategories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  allTags: string[];
  allCategories: string[];
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      teamSize: '',
      tags: [],
      sortBy: 'newest',
      myProjects: false,
      favorites: false,
      watching: false,
      categories: [],
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Filter and sort projects by multiple criteria
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-6 p-1">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="dateFrom"
                    className="text-muted-foreground text-xs"
                  >
                    From
                  </Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={localFilters.dateFrom}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        dateFrom: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="dateTo"
                    className="text-muted-foreground text-xs"
                  >
                    To
                  </Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={localFilters.dateTo}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        dateTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Select
                value={localFilters.teamSize}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, teamSize: value })
                }
              >
                <SelectTrigger id="teamSize">
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any size</SelectItem>
                  <SelectItem value="1-3">1-3 members</SelectItem>
                  <SelectItem value="4-6">4-6 members</SelectItem>
                  <SelectItem value="7-10">7-10 members</SelectItem>
                  <SelectItem value="11">11+ members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {allCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={localFilters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          categories: checked
                            ? [...localFilters.categories, category]
                            : localFilters.categories.filter(
                                (c) => c !== category
                              ),
                        });
                      }}
                    />
                    <Label
                      htmlFor={`cat-${category}`}
                      className="text-sm font-normal"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="grid grid-cols-3 gap-2">
                {allTags.slice(0, 12).map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={localFilters.tags.includes(tag)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          tags: checked
                            ? [...localFilters.tags, tag]
                            : localFilters.tags.filter((t) => t !== tag),
                        });
                      }}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-normal"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="myProjects"
                    checked={localFilters.myProjects}
                    onCheckedChange={(checked) =>
                      setLocalFilters({
                        ...localFilters,
                        myProjects: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="myProjects" className="text-sm font-normal">
                    My Projects Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorites"
                    checked={localFilters.favorites}
                    onCheckedChange={(checked) =>
                      setLocalFilters({
                        ...localFilters,
                        favorites: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="favorites" className="text-sm font-normal">
                    Favorites Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="watching"
                    checked={localFilters.watching}
                    onCheckedChange={(checked) =>
                      setLocalFilters({
                        ...localFilters,
                        watching: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="watching" className="text-sm font-normal">
                    Watching Only
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BulkActionsDialog = ({
  open,
  onOpenChange,
  selectedCount,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onAction: (action: string) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
          <DialogDescription>
            Perform actions on {selectedCount} selected project
            {selectedCount !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Button
            variant="outline"
            onClick={() => onAction('archive')}
            className="justify-start"
          >
            <Archive className="h-4 w-4" />
            Archive Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => onAction('export')}
            className="justify-start"
          >
            <Download className="h-4 w-4" />
            Export Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => onAction('changeStatus')}
            className="justify-start"
          >
            <CheckCircle2 className="h-4 w-4" />
            Change Status
          </Button>
          <Separator />
          <Button
            variant="outline"
            onClick={() => onAction('delete')}
            className="text-destructive hover:text-destructive justify-start"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjectCard = ({
  project,
  onUpdate,
  isSelected,
  onSelect,
}: {
  project: Project;
  onUpdate: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(project.id)}
              className="mt-1"
            />

            <div className="flex-1">
              <CardTitle className="text-base leading-tight">
                {project.title}
              </CardTitle>

              {project.isFavorite && (
                <Star className="mt-1 inline h-3 w-3 fill-yellow-500 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Copy className="h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShareOpen(true)}>
                  <Share2 className="h-4 w-4" />
                  Share
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Download className="h-4 w-4" />
                  Export
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Archive className="h-4 w-4" />
                  Archive
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="hover:text-destructive text-destructive"
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-muted-foreground text-sm">{project.progress}%</p>
          </div>

          <Progress value={project.progress} className="h-2" />
        </div>

        <ProjectStats project={project} />

        <div className="flex items-center justify-between text-xs">
          <div className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Due {project.dueDate}</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(project.lastUpdated)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TeamAvatars team={project.team} />

          {project.githubUrl && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <GitBranch className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View on GitHub</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}

          {project.tags.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="default" className="flex-1">
          <FolderKanban className="h-4 w-4" />
          View
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chat</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Analytics</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

const ProjectListItem = ({
  project,
  onUpdate,
  isSelected,
  onSelect,
}: {
  project: Project;
  onUpdate: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(project.id)}
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{project.title}</h3>
                {project.isFavorite && (
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                )}
                <StatusBadge status={project.status} />
              </div>

              <div className="flex items-center gap-2">
                <Progress value={project.progress} className="h-2 w-24" />

                <span className="text-muted-foreground text-sm">
                  {project.progress}%
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <span className="line-clamp-1">{project.description}</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <TeamAvatars team={project.team} maxShow={3} />

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{project.dueDate}</span>
              </div>

              <div className="flex gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsHeader = ({
  onCreateClick,
  onRefetch,
  isRefetching,
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  onBulkActions,
}: {
  onCreateClick: () => void;
  onRefetch: () => void;
  isRefetching: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  onBulkActions: () => void;
}) => {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const allTags = [
    'React',
    'Node.js',
    'Python',
    'TypeScript',
    'MongoDB',
    'Docker',
    'AWS',
    'Vue.js',
    'TensorFlow',
    'Firebase',
    'GraphQL',
    'Kubernetes',
  ];
  const allCategories = [
    'Web Development',
    'Mobile Development',
    'AI/ML',
    'DevOps',
    'Data Visualization',
  ];

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col items-start gap-2 md:flex-row">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="flex w-full justify-between">
            <div className="flex space-x-2">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status: value as ProjectStatus | 'all',
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="recruiting">Recruiting</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, sortBy: value as SortBy })
                }
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdvancedFiltersOpen(true)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Advanced Filters</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex space-x-2">
              <Tabs
                value={viewMode}
                onValueChange={(v) => onViewModeChange(v as ViewMode)}
              >
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid3x3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onCreateClick} className="">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Project</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden">
                  Create Project
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {selectedCount > 0 && (
          <Button variant="outline" onClick={onBulkActions}>
            <CheckCircle2 className="h-4 w-4" />
            {selectedCount} Selected
          </Button>
        )}

        {(filters.tags.length > 0 ||
          filters.categories.length > 0 ||
          filters.myProjects ||
          filters.favorites ||
          filters.watching) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Active filters:
            </span>
            {filters.myProjects && (
              <Badge variant="secondary">
                My Projects
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({ ...filters, myProjects: false })
                  }
                />
              </Badge>
            )}

            {filters.favorites && (
              <Badge variant="secondary">
                Favorites
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({ ...filters, favorites: false })
                  }
                />
              </Badge>
            )}

            {filters.watching && (
              <Badge variant="secondary">
                Watching
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({ ...filters, watching: false })
                  }
                />
              </Badge>
            )}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      tags: filters.tags.filter((t) => t !== tag),
                    })
                  }
                />
              </Badge>
            ))}

            {filters.categories.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      categories: filters.categories.filter((c) => c !== cat),
                    })
                  }
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <AdvancedFiltersDialog
        open={advancedFiltersOpen}
        onOpenChange={setAdvancedFiltersOpen}
        filters={filters}
        onFiltersChange={onFiltersChange}
        allTags={allTags}
        allCategories={allCategories}
      />
    </>
  );
};

const CreateProjectDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    tags: '',
    category: '',
    visibility: 'public',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.dueDate) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        tags: '',
        category: '',
        visibility: 'public',
      });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new collaborative project with your team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter project title"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="ai">AI/ML</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="data">Data Visualization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) =>
                  setFormData({ ...formData, visibility: value })
                }
              >
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.title ||
              !formData.description ||
              !formData.dueDate
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = ({
  onCreateClick,
  hasFilters,
}: {
  onCreateClick: () => void;
  hasFilters: boolean;
}) => {
  if (hasFilters) {
    return (
      <Card className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
        <AlertCircle className="text-muted-foreground h-16 w-16" />
        <h3 className="text-xl font-semibold">No projects found</h3>
        <p className="text-muted-foreground max-w-sm">
          No projects match your current filters. Try adjusting your search
          criteria.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
      <FolderKanban className="text-muted-foreground h-16 w-16" />

      <h3 className="text-xl font-semibold">No projects yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Get started by creating your first project and collaborating with your
        team.
      </p>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        Create Your First Project
      </Button>
    </Card>
  );
};

const ErrorState = ({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) => {
  return (
    <Card className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
      <X className="text-destructive h-16 w-16" />

      <h3 className="text-xl font-semibold">Something went wrong</h3>
      <p className="text-muted-foreground max-w-sm">
        {error?.message || 'Failed to load projects. Please try again.'}
      </p>

      <Button onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </Card>
  );
};

export function ProjectsTab() {
  const queryClient = useQueryClient();
  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useProjectsQuery();

  const [createOpen, setCreateOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    teamSize: '',
    tags: [],
    sortBy: 'newest',
    myProjects: false,
    favorites: false,
    watching: false,
    categories: [],
  });

  const handleRefetch = () => {
    setIsRefetching(true);
    refetch();
    setTimeout(() => setIsRefetching(false), 1000);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedProjects.length} projects`);
    setSelectedProjects([]);
    setBulkActionsOpen(false);
    handleSuccess();
  };

  if (isLoading) {
    return <ProjectsTabSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <ProjectsHeader
          onCreateClick={() => setCreateOpen(true)}
          onRefetch={handleRefetch}
          isRefetching={isRefetching}
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedProjects.length}
          onBulkActions={() => setBulkActionsOpen(true)}
        />

        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const filteredProjects = sortProjects(
    filterProjects(projects || [], filters),
    filters.sortBy
  );
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.tags.length > 0 ||
    filters.categories.length > 0 ||
    filters.myProjects ||
    filters.favorites ||
    filters.watching;

  return (
    <div className="space-y-2">
      <ProjectsHeader
        onCreateClick={() => setCreateOpen(true)}
        onRefetch={handleRefetch}
        isRefetching={isRefetching}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedProjects.length}
        onBulkActions={() => setBulkActionsOpen(true)}
      />

      {filteredProjects.length === 0 ? (
        <EmptyState
          onCreateClick={() => setCreateOpen(true)}
          hasFilters={hasActiveFilters}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={handleSuccess}
              isSelected={selectedProjects.includes(project.id)}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onUpdate={handleSuccess}
              isSelected={selectedProjects.includes(project.id)}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleSuccess}
      />

      <BulkActionsDialog
        open={bulkActionsOpen}
        onOpenChange={setBulkActionsOpen}
        selectedCount={selectedProjects.length}
        onAction={handleBulkAction}
      />
    </div>
  );
}

export function ProjectsTabSkeleton() {
  return (
    <div className="space-y-2">
      <ProjectsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

const ProjectCardSkeleton = () => {
  return (
    <Card className="">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 items-start gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
};

const ProjectsHeaderSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};
