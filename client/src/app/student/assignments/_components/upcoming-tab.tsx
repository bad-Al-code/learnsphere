'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
} from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDevice } from '@/hooks/use-mobile';
import {
  BarChart2,
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Eye,
  Filter,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import {
  useAIRecommendations,
  usePendingAssignments,
  useStartAssignment,
} from '../hooks/use-assignment';
import {
  AIRecommendation,
  EnrichedPendingAssignment,
} from '../schemas/assignment.schema';
import {
  AssignmentStatusFilter,
  useAssignmentStore,
} from '../stores/assignment.store';

interface UpcomingHeaderProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (status: AssignmentStatusFilter) => void;
  currentFilter: AssignmentStatusFilter;
}

export function UpcomingHeader({
  onSearchChange,
  onFilterChange,
  currentFilter,
}: UpcomingHeaderProps) {
  return (
    <header>
      {/* Desktop View */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search assignments..."
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select value={currentFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="">
            <SelectValue placeholder="All Assignments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
          <Button variant="outline">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Tooltip>
          <Select defaultValue="all">
            <TooltipTrigger asChild>
              <SelectTrigger>
                <Filter className="h-4 w-4" />
              </SelectTrigger>
            </TooltipTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignments</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
              <SelectItem value="collaborative">Collaborative</SelectItem>
            </SelectContent>
          </Select>
          <TooltipContent>
            <p>Filter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Calendar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <BarChart2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Analytics</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export function AIRecommendationItem({ item }: { item: AIRecommendation }) {
  const priorityClasses = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-gray-500/10 text-gray-500',
  };
  return (
    <div className="hover:bg-card flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <Badge className={`capitalize ${priorityClasses[item.priority]}`}>
            {item.priority} Priority
          </Badge>
          <h4 className="font-semibold">{item.title}</h4>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>

        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-default items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.hours} hours
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total estimated time</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-default items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due {item.dueDate}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Task deadline</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mt-2 w-full sm:mt-0 sm:w-auto"
      >
        <Calendar className="mr-1 h-4 w-4" />
        Schedule
      </Button>
    </div>
  );
}

function AIStudyPlanner({ data }: { data: AIRecommendation[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <CardTitle>AI Study Planner</CardTitle>
        </div>
        <CardDescription>
          Personalized study recommendations for your assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((item) => (
          <AIRecommendationItem key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}

function BulkActionHeader() {
  const { selectedIds, actions } = useAssignmentStore();
  if (selectedIds.size === 0) return null;

  return (
    <div className="bg-muted/50 animate-in fade-in-0 slide-in-from-top-4 sticky top-0 z-10 mb-2 rounded-lg border p-1 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-5 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={actions.clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear selection</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="" />

          <p className="text-sm font-semibold">{selectedIds.size} selected</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4" /> Mark as In Progress
          </Button>
          <Button variant="outline" size="sm">
            <CalendarPlus className="h-4 w-4" /> Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}

function PendingAssignments({ data }: { data: EnrichedPendingAssignment[] }) {
  const { selectedIds, actions } = useAssignmentStore();
  const { mutate: startAssignment } = useStartAssignment();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      data.forEach(
        (item) => !selectedIds.has(item.id) && actions.toggleSelection(item.id)
      );
    } else {
      actions.clearSelection();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Assignments</CardTitle>
        <CardDescription>
          Complete these assignments before their due dates
        </CardDescription>
      </CardHeader>

      <CardContent>
        <BulkActionHeader />

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">
                  <Checkbox
                    checked={
                      selectedIds.size > 0 && selectedIds.size === data.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>

                <TableHead className="">Assignment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => actions.toggleSelection(item.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.description}
                    </div>
                  </TableCell>

                  <TableCell>{item.course}</TableCell>

                  <TableCell>
                    <div>
                      {item.isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <div className="text-xs"> {item.dueDate ?? 'N/A'}</div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>

                  <TableCell>{item.points} pts</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => actions.viewAssignment(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                      </Tooltip>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={() => startAssignment(item.id)}
                      >
                        <Link href={`/student/assignments/${item.id}`}>
                          <Play className="h-4 w-4" />
                          Start
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScheduleModal() {
  const { isScheduleModalOpen, schedulingRecommendation, actions } =
    useAssignmentStore();

  if (!schedulingRecommendation) return null;

  return (
    <Dialog
      open={isScheduleModalOpen}
      onOpenChange={actions.closeScheduleModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Study Time</DialogTitle>
          <DialogDescription>
            Add "{schedulingRecommendation.title}" to your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Placeholder */}
          <p>Scheduling form will be here.</p>
          <p>Duration: {schedulingRecommendation.hours} hours</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={actions.closeScheduleModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              /* TODO: Call action to save to calendar */ actions.closeScheduleModal();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AssignmentDetails() {
  const { isDrawerOpen, selectedAssignment, actions } = useAssignmentStore();
  const device = useDevice();

  const onOpenChange = (open: boolean) => {
    if (!open) actions.closeDrawer();
  };

  if (!selectedAssignment) return null;

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{selectedAssignment.title}</DialogTitle>
        <DialogDescription>{selectedAssignment.course}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          {selectedAssignment.description}
        </p>
        <div>
          <strong>Due:</strong>{' '}
          {new Date(selectedAssignment.dueDate!).toLocaleString()}
        </div>
        <div>
          <strong>Points:</strong> {selectedAssignment.points}
        </div>
        <Button asChild className="w-full">
          <Link href={`/student/assignments/${selectedAssignment.id}`}>
            Start Assignment
          </Link>
        </Button>
      </div>
    </>
  );

  if (device === 'desktop') {
    return (
      <Dialog open={isDrawerOpen} onOpenChange={onOpenChange}>
        <DialogContent className="">{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onOpenChange}>
      <DrawerContent>{content} </DrawerContent>
    </Drawer>
  );
}

export function UpcomingTab() {
  const { searchTerm, statusFilter, actions } = useAssignmentStore();
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { data: recommendations, isLoading: isLoadingRecs } =
    useAIRecommendations();
  const { data: assignments, isLoading: isLoadingAssignments } =
    usePendingAssignments(debouncedSearchTerm, statusFilter);

  return (
    <div className="space-y-2">
      <UpcomingHeader
        onSearchChange={actions.setSearchTerm}
        onFilterChange={actions.setStatusFilter}
        currentFilter={statusFilter}
      />

      {isLoadingRecs ? (
        <AIStudyPlannerSkeleton />
      ) : (
        <AIStudyPlanner data={recommendations || []} />
      )}
      {isLoadingAssignments ? (
        <PendingAssignmentsSkeleton />
      ) : (
        <PendingAssignments data={assignments || []} />
      )}
      <AssignmentDetails />
      <ScheduleModal />
    </div>
  );
}

export function UpcomingTabSkeleton() {
  return (
    <div className="space-y-2">
      <UpcomingHeaderSkeleton />
      <AIStudyPlannerSkeleton />
      <PendingAssignmentsSkeleton />
    </div>
  );
}

function UpcomingHeaderSkeleton() {
  return (
    <header>
      <div className="hidden items-center gap-2 md:flex">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-[180px]" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </header>
  );
}

function AIRecommendationItemSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row">
      <Skeleton className="h-6 w-24 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-full sm:w-28" />
    </div>
  );
}

function AIStudyPlannerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-2">
        <AIRecommendationItemSkeleton />
        <AIRecommendationItemSkeleton />
        <AIRecommendationItemSkeleton />
      </CardContent>
    </Card>
  );
}

function PendingAssignmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
