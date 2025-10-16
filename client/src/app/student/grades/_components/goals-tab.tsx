'use client';

import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader, Target } from 'lucide-react';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import {
  useCreateGoal,
  useDeleteGoal,
  useStudyGoals,
  useUpdateGoal,
} from '../hooks/use-goals';
import {
  CreateGoalInput,
  createGoalSchema,
  Goal,
  goalTypeSchema,
  UpdateGoalInput,
  updateGoalSchema,
} from '../schema';

function AddNewGoal() {
  const { mutate: createGoal, isPending } = useCreateGoal();

  const form = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema) as Resolver<CreateGoalInput>,
    defaultValues: {
      title: '',
      type: 'course_completion',
      priority: 'medium',
      targetValue: 100,
    },
  });

  const onSubmit = (data: CreateGoalInput) => {
    createGoal(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <h3 className="mb-4 text-lg font-semibold">Add New Goal</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Complete JavaScript Course"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalTypeSchema.options.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader className="h-4 w-4 animate-spin" />}
              Add Goal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function GoalItem({ goal }: { goal: Goal }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { mutate: updateGoal } = useUpdateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();

  const percentage = Math.round((goal.currentValue / goal.targetValue) * 100);

  const handleComplete = () => {
    updateGoal({ goalId: goal.id, data: { isCompleted: true } });
  };

  return (
    <>
      <Card className={cn(goal.isCompleted && 'bg-muted/30 opacity-50')}>
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold">{goal.title}</h4>
            <Badge
              variant={
                goal.priority === 'high'
                  ? 'destructive'
                  : goal.priority === 'medium'
                    ? 'secondary'
                    : 'outline'
              }
              className="capitalize"
            >
              {goal.priority} priority
            </Badge>
          </div>

          <div className="mb-1 flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              Progress: {goal.currentValue}/{goal.targetValue}
            </p>
            <p className="text-sm font-semibold">{percentage}%</p>
          </div>

          <Progress value={percentage} className="h-2" />

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              Deadline: {format(new Date(goal.targetDate), 'EEE, MMM d, yyyy')}
            </p>

            <div className="flex items-center gap-2">
              {!goal.isCompleted && (
                <Button variant="outline" size="sm" onClick={handleComplete}>
                  Complete
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="text-destructive hover:text-destructive h-4 w-4" />{' '}
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this goal? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteGoal(goal.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditGoalDialog
        goal={goal}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}

function EditGoalDialog({
  goal,
  open,
  onOpenChange,
}: {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: updateGoal, isPending } = useUpdateGoal();

  const form = useForm<UpdateGoalInput>({
    resolver: zodResolver(updateGoalSchema) as Resolver<UpdateGoalInput>,
    defaultValues: {
      title: goal.title,
      type: goal.type,
      priority: goal.priority,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      targetDate: new Date(goal.targetDate),
    },
  });

  const handleUpdate = (data: UpdateGoalInput) => {
    updateGoal(
      { goalId: goal.id, data },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Make changes to your goal. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Complete JavaScript Course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goalTypeSchema.options.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Progress</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {field.value ? (
                            new Date(field.value).toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function GoalList() {
  const { data, isLoading, isError, error, refetch } = useStudyGoals();

  if (isLoading) {
    return <GoalListSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-2">
      {data && data.length > 0 ? (
        data.map((goal) => <GoalItem key={goal.id} goal={goal} />)
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          <Target className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="font-semibold">No goals set yet.</p>
          <p className="text-sm">Use the form above to add your first goal.</p>
        </div>
      )}
    </div>
  );
}

export function GoalsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Goal Tracking & Achievement</CardTitle>
        </div>
        <CardDescription>
          Set, track, and achieve your academic goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <AddNewGoal />
        <ScrollArea className="">
          <div className="mr-3 max-h-[75vh]">
            <GoalList />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function GoalsTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <AddNewGoalSkeleton />
        <GoalListSkeleton />
      </CardContent>
    </Card>
  );
}

function AddNewGoalSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <Skeleton className="mb-4 h-6 w-1/4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-24" />
      </CardContent>
    </Card>
  );
}

function GoalItemSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="mb-2 flex items-start justify-between">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="mb-2 h-2 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <GoalItemSkeleton key={i} />
      ))}
    </div>
  );
}
