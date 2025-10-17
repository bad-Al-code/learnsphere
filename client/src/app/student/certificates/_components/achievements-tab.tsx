'use client';

import { ErrorState } from '@/components/ui/error-state';
import { useState } from 'react';
import {
  useAchievement,
  useAchievements,
  useBulkUpdateStarred,
  useExportAchievements,
  useShareAchievement,
  useStatistics,
  useUpdateStarred,
} from '../hooks/use-achievement';
import { useAchievementStore } from '../store/achievement.store';
import {
  DigitalBadgesTab,
  DigitalBadgesTabSkeleton,
} from './digital-badges-tab';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Download,
  Filter,
  Grid3x3,
  LayoutGrid,
  List,
  Lock,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  TAchievement,
  TPagination,
  TStatistics,
} from '../schemas/achievement.schema';

function AchievementFilters() {
  const {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    clearFilters,
    selectedAchievements,
    clearSelection,
  } = useAchievementStore();

  const bulkUpdateStarred = useBulkUpdateStarred();
  const exportMutation = useExportAchievements();

  const hasActiveFilters =
    filters.search ||
    filters.status?.length ||
    filters.category?.length ||
    filters.difficulty?.length ||
    filters.rarity?.length ||
    filters.starred;

  const handleBulkStar = async (isStarred: boolean) => {
    if (selectedAchievements.size === 0) {
      toast.error('No achievements selected');
      return;
    }

    try {
      await bulkUpdateStarred.mutateAsync({
        achievementIds: Array.from(selectedAchievements),
        isStarred,
      });

      toast.success(
        `${isStarred ? 'Starred' : 'Unstarred'} ${selectedAchievements.size} achievement(s)`
      );

      clearSelection();
    } catch (error) {
      toast.error('Failed to update achievements');
    }
  };

  const handleExport = async (format: 'pdf' | 'json' | 'csv') => {
    try {
      await exportMutation.mutateAsync({
        format,
        achievementIds:
          selectedAchievements.size > 0
            ? Array.from(selectedAchievements)
            : undefined,
        includeStatistics: true,
      });

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export achievements');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search achievements..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_earned">Date Earned</SelectItem>
            <SelectItem value="rarity">Rarity</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 rounded-md border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="px-2"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>List view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('compact')}
                className="px-2"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Compact view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('timeline')}
                className="px-2"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Timeline view</TooltipContent>
          </Tooltip>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  •
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('earned')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'earned' as const]
                  : filters.status?.filter((s) => s !== 'earned');
                setFilters({
                  status: newStatus?.length ? (newStatus as any) : undefined,
                });
              }}
            >
              Earned
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('in_progress')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'in_progress' as const]
                  : filters.status?.filter((s) => s !== 'in_progress');
                setFilters({
                  status: newStatus?.length ? (newStatus as any) : undefined,
                });
              }}
            >
              In Progress
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('locked')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'locked' as const]
                  : filters.status?.filter((s) => s !== 'locked');
                setFilters({
                  status: newStatus?.length ? (newStatus as any) : undefined,
                });
              }}
            >
              Locked
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            {['academic', 'social', 'streak', 'milestone'].map((cat) => (
              <DropdownMenuCheckboxItem
                key={cat}
                checked={filters.category?.includes(cat as any)}
                onCheckedChange={(checked) => {
                  const newCategory = checked
                    ? [...(filters.category || []), cat]
                    : filters.category?.filter((c) => c !== cat);
                  setFilters({
                    category: newCategory?.length
                      ? (newCategory as any)
                      : undefined,
                  });
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={filters.starred === true}
              onCheckedChange={(checked) =>
                setFilters({ starred: checked ? true : undefined })
              }
            >
              <Star className="h-4 w-4" />
              Starred Only
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={filters.showHidden}
              onCheckedChange={(checked) => setFilters({ showHidden: checked })}
            >
              Show Hidden
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className=""
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Filters</TooltipContent>
          </Tooltip>
        )}
      </div>

      {(hasActiveFilters || selectedAchievements.size > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {selectedAchievements.size > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {selectedAchievements.size} selected
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkStar(true)}
                >
                  <Star className="h-3 w-3" />
                  Star All
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkStar(false)}
                >
                  Unstar All
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      onClick={() => handleExport('pdf')}
                    >
                      PDF
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleExport('json')}
                    >
                      JSON
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onClick={() => handleExport('csv')}
                    >
                      CSV
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface AchievementHeaderProps {
  statistics?: TStatistics;
}

function AchievementHeader({ statistics }: AchievementHeaderProps) {
  if (!statistics) return null;

  const stats = [
    {
      icon: Trophy,
      label: 'Total Points',
      value: statistics.totalPoints.toLocaleString(),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Target,
      label: 'Achievements',
      value: `${statistics.earnedAchievements}/${statistics.totalAchievements}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Zap,
      label: 'Rarity Score',
      value: statistics.rarityScore.toFixed(1),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: TrendingUp,
      label: 'Rank',
      value: statistics.leaderboardPosition
        ? `#${statistics.leaderboardPosition}`
        : 'N/A',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <Card>
      <CardContent className="">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">
                {statistics.completionPercentage.toFixed(1)}%
              </span>
            </div>

            <Progress value={statistics.completionPercentage} />
          </div>

          {(statistics.rarestOwned || statistics.fastestEarned) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {statistics.rarestOwned && (
                <Badge variant="secondary" className="text-xs">
                  🏆 Rarest: {statistics.rarestOwned.rarity}% have this
                </Badge>
              )}

              {statistics.fastestEarned && (
                <Badge variant="secondary" className="text-xs">
                  ⚡ Fastest: {statistics.fastestEarned.timeToEarn} days
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                📈 {statistics.averageEarningRate.toFixed(1)} per week
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AchievementCardProps {
  achievement: TAchievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { openDetailsModal, selectedAchievements, toggleSelectAchievement } =
    useAchievementStore();

  const updateStarred = useUpdateStarred();
  const shareMutation = useShareAchievement();

  const isSelected = selectedAchievements.has(achievement.id);
  const isEarned = achievement.status === 'earned';
  const isLocked = achievement.status === 'locked';
  const isInProgress = achievement.status === 'in_progress';

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateStarred.mutateAsync({
        achievementId: achievement.id,
        isStarred: !achievement.isStarred,
      });
    } catch (error) {
      toast.error('Failed to update starred status');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await shareMutation.mutateAsync({
        achievementId: achievement.id,
        platform: 'copy_link',
      });
      navigator.clipboard.writeText(result.url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return 'from-amber-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyBadge = () => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-orange-100 text-orange-700',
      legendary: 'bg-red-100 text-red-700',
    };
    return colors[achievement.difficulty];
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all hover:shadow-lg',
        isLocked && 'opacity-60',
        isSelected && 'ring-muted-foreground ring-1',
        achievement.rarity === 'legendary' && 'animate-pulse-slow'
      )}
      onClick={() => openDetailsModal(achievement.id)}
    >
      {(achievement.rarity === 'epic' ||
        achievement.rarity === 'legendary') && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg bg-gradient-to-r opacity-20',
            getRarityColor()
          )}
        />
      )}

      <CardContent className="relative">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelectAchievement(achievement.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
          onClick={handleStarClick}
        >
          <Star
            className={cn(
              'h-4 w-4',
              achievement.isStarred && 'fill-yellow-400 text-yellow-400'
            )}
          />
        </Button>

        <div className="mt-6 space-y-3">
          <div
            className={cn(
              'mx-auto flex h-16 w-16 items-center justify-center rounded-full text-4xl',
              isLocked && 'grayscale'
            )}
          >
            {isLocked ? <Lock className="h-8 w-8" /> : achievement.icon}
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="line-clamp-1 font-semibold">
                {achievement.title}
              </h3>
              {achievement.isLimitedTime && (
                <Clock className="h-3 w-3 text-orange-500" />
              )}
              {achievement.rarity === 'legendary' && (
                <Sparkles className="h-3 w-3 text-yellow-500" />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1">
              <Badge className={getDifficultyBadge()} variant="secondary">
                {achievement.difficulty}
              </Badge>

              <Badge variant="outline" className="text-xs">
                {achievement.rarity}
              </Badge>

              {achievement.points > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {achievement.points} pts
                </Badge>
              )}
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-center text-sm">
            {achievement.description}
          </p>

          {isInProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{achievement.progress}%</span>
              </div>
              <Progress value={achievement.progress} />
            </div>
          )}

          <div className="flex items-center justify-between">
            {isEarned && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Earned
                {achievement.earnedAt && (
                  <span className="ml-1">
                    • {format(new Date(achievement.earnedAt), 'MMM d')}
                  </span>
                )}
              </Badge>
            )}

            {isInProgress && (
              <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
            )}

            {isLocked && (
              <Badge className="bg-gray-100 text-gray-700">
                <Lock className="mr-1 h-3 w-3" />
                Locked
              </Badge>
            )}

            {isEarned && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {achievement.unlockedBy !== undefined && (
            <p className="text-muted-foreground text-center text-xs">
              {achievement.unlockedBy}% of students have this
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AchievementGridProps {
  achievements: TAchievement[];
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}

interface AchievementListProps {
  achievements: TAchievement[];
}

export function AchievementList({ achievements }: AchievementListProps) {
  return (
    <div className="space-y-2">
      {achievements.map((achievement) => (
        <AchievementListItem key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}

function AchievementListItem({ achievement }: { achievement: TAchievement }) {
  const { openDetailsModal, selectedAchievements, toggleSelectAchievement } =
    useAchievementStore();

  const updateStarred = useUpdateStarred();
  const shareMutation = useShareAchievement();

  const isSelected = selectedAchievements.has(achievement.id);
  const isEarned = achievement.status === 'earned';
  const isLocked = achievement.status === 'locked';
  const isInProgress = achievement.status === 'in_progress';

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateStarred.mutateAsync({
        achievementId: achievement.id,
        isStarred: !achievement.isStarred,
      });
    } catch (error) {
      toast.error('Failed to update starred status');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await shareMutation.mutateAsync({
        achievementId: achievement.id,
        platform: 'copy_link',
      });
      navigator.clipboard.writeText(result.url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  const getDifficultyColor = () => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-orange-100 text-orange-700',
      legendary: 'bg-red-100 text-red-700',
    };
    return colors[achievement.difficulty];
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isLocked && 'opacity-60',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={() => openDetailsModal(achievement.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelectAchievement(achievement.id)}
            onClick={(e) => e.stopPropagation()}
          />

          <div
            className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center text-3xl',
              isLocked && 'grayscale'
            )}
          >
            {isLocked ? <Lock className="h-6 w-6" /> : achievement.icon}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold">
                    {achievement.title}
                  </h3>
                  {achievement.isLimitedTime && (
                    <Clock className="h-3 w-3 flex-shrink-0 text-orange-500" />
                  )}
                  {achievement.rarity === 'legendary' && (
                    <Sparkles className="h-3 w-3 flex-shrink-0 text-yellow-500" />
                  )}
                </div>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {achievement.description}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleStarClick}
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      achievement.isStarred && 'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </Button>
                {isEarned && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getDifficultyColor()} variant="secondary">
                {achievement.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {achievement.rarity}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {achievement.category}
              </Badge>
              {achievement.points > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {achievement.points} pts
                </Badge>
              )}
              {isEarned && achievement.earnedAt && (
                <Badge className="bg-green-100 text-xs text-green-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {format(new Date(achievement.earnedAt), 'MMM d, yyyy')}
                </Badge>
              )}
              {achievement.unlockedBy !== undefined && (
                <span className="text-muted-foreground text-xs">
                  {achievement.unlockedBy}% have this
                </span>
              )}
            </div>

            {isInProgress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AchievementCompactProps {
  achievements: TAchievement[];
}

export function AchievementCompact({ achievements }: AchievementCompactProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <CompactItem key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}

function CompactItem({ achievement }: { achievement: TAchievement }) {
  const { openDetailsModal, selectedAchievements, toggleSelectAchievement } =
    useAchievementStore();

  const updateStarred = useUpdateStarred();

  const isSelected = selectedAchievements.has(achievement.id);
  const isEarned = achievement.status === 'earned';
  const isLocked = achievement.status === 'locked';

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateStarred.mutateAsync({
        achievementId: achievement.id,
        isStarred: !achievement.isStarred,
      });
    } catch (error) {
      toast.error('Failed to update starred status');
    }
  };

  return (
    <div
      className={cn(
        'bg-card hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
        isLocked && 'opacity-60',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={() => openDetailsModal(achievement.id)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => toggleSelectAchievement(achievement.id)}
        onClick={(e) => e.stopPropagation()}
      />

      <div className={cn('flex-shrink-0 text-2xl', isLocked && 'grayscale')}>
        {isLocked ? <Lock className="h-5 w-5" /> : achievement.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-medium">{achievement.title}</h4>
          {isEarned && (
            <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-green-600" />
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          {achievement.points} pts
        </p>
      </div>

      <button onClick={handleStarClick} className="flex-shrink-0">
        <Star
          className={cn(
            'h-4 w-4',
            achievement.isStarred && 'fill-yellow-400 text-yellow-400'
          )}
        />
      </button>
    </div>
  );
}

interface AchievementTimelineProps {
  achievements: TAchievement[];
}

export function AchievementTimeline({
  achievements,
}: AchievementTimelineProps) {
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (!a.earnedAt) return 1;
    if (!b.earnedAt) return -1;
    return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
  });

  return (
    <div className="space-y-2">
      {sortedAchievements.map((achievement, index) => (
        <TimelineItem
          key={achievement.id}
          achievement={achievement}
          isFirst={index === 0}
          isLast={index === sortedAchievements.length - 1}
        />
      ))}
    </div>
  );
}

function TimelineItem({
  achievement,
  isFirst,
  isLast,
}: {
  achievement: TAchievement;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { openDetailsModal } = useAchievementStore();

  const isEarned = achievement.status === 'earned';
  const isLocked = achievement.status === 'locked';

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-4',
            isEarned
              ? 'border-green-500 bg-green-100'
              : 'border-gray-300 bg-gray-100'
          )}
        >
          {isEarned ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {!isLast && <div className="bg-border h-full min-h-[40px] w-0.5" />}
      </div>

      <Card
        className={cn(
          'mb-4 flex-1 cursor-pointer transition-all hover:shadow-md',
          isLocked && 'opacity-60'
        )}
        onClick={() => openDetailsModal(achievement.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {achievement.earnedAt && (
                <p className="text-muted-foreground mb-1 text-xs">
                  {format(
                    new Date(achievement.earnedAt),
                    'MMMM d, yyyy • h:mm a'
                  )}
                </p>
              )}

              <div className="mb-2 flex items-center gap-3">
                <div className={cn('text-2xl', isLocked && 'grayscale')}>
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {achievement.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {achievement.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {achievement.rarity}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {achievement.points} pts
                </Badge>
                {achievement.isStarred && (
                  <Badge className="bg-yellow-100 text-xs text-yellow-700">
                    <Star className="mr-1 h-3 w-3 fill-yellow-600" />
                    Starred
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementDetailsModal() {
  const { detailsModalOpen, closeDetailsModal, selectedAchievementId } =
    useAchievementStore();

  const { data: achievement, isLoading } = useAchievement(
    selectedAchievementId || '',
    { enabled: !!selectedAchievementId }
  );

  const updateStarred = useUpdateStarred();
  const shareMutation = useShareAchievement();

  if (!selectedAchievementId) return null;

  const handleStarToggle = async () => {
    if (!achievement) return;
    try {
      await updateStarred.mutateAsync({
        achievementId: achievement.id,
        isStarred: !achievement.isStarred,
      });
      toast.success(
        achievement.isStarred ? 'Removed from starred' : 'Added to starred'
      );
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleShare = async (
    platform: 'twitter' | 'linkedin' | 'copy_link'
  ) => {
    if (!achievement) return;
    try {
      const result = await shareMutation.mutateAsync({
        achievementId: achievement.id,
        platform,
      });

      if (platform === 'copy_link') {
        navigator.clipboard.writeText(result.url);
        toast.success('Link copied!');
      } else {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  return (
    <Dialog open={detailsModalOpen} onOpenChange={closeDetailsModal}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {isLoading ? (
          <ModalSkeleton />
        ) : achievement ? (
          <AchievementDetails
            achievement={achievement}
            onStarToggle={handleStarToggle}
            onShare={handleShare}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AchievementDetails({
  achievement,
  onStarToggle,
  onShare,
}: {
  achievement: any;
  onStarToggle: () => void;
  onShare: (platform: 'twitter' | 'linkedin' | 'copy_link') => void;
}) {
  const isEarned = achievement.status === 'earned';
  const isLocked = achievement.status === 'locked';
  const isInProgress = achievement.status === 'in_progress';

  const getDifficultyColor = () => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-orange-100 text-orange-700',
      legendary: 'bg-red-100 text-red-700',
    };

    return colors[achievement.difficulty] || colors.easy;
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'bg-muted flex h-16 w-16 items-center justify-center rounded-full text-5xl',
                isLocked && 'grayscale'
              )}
            >
              {isLocked ? <Lock className="h-8 w-8" /> : achievement.icon}
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {achievement.title}
                {achievement.isLimitedTime && (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}
                {achievement.rarity === 'legendary' && (
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                )}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base">
                {achievement.description}
              </DialogDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onStarToggle}>
              <Star
                className={cn(
                  'h-4 w-4',
                  achievement.isStarred && 'fill-yellow-400 text-yellow-400'
                )}
              />
            </Button>
            {isEarned && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShare('copy_link')}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogHeader>

      <div className="mt-4 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge className={getDifficultyColor()}>
            {achievement.difficulty}
          </Badge>
          <Badge variant="outline">{achievement.rarity}</Badge>
          <Badge variant="secondary">{achievement.category}</Badge>
          <Badge variant="secondary">
            <Trophy className="mr-1 h-3 w-3" />
            {achievement.points} points
          </Badge>
          {isEarned && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Earned
            </Badge>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {achievement.unlockedBy !== undefined && (
            <div className="flex items-center gap-2">
              <TrendingUp className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Rarity</p>
                <p className="text-muted-foreground text-xs">
                  {achievement.unlockedBy}% have this
                </p>
              </div>
            </div>
          )}
          {achievement.earnedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Earned On</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(achievement.earnedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>

        {isInProgress && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Target className="h-4 w-4" />
                  Progress
                </h4>
                <span className="text-sm font-medium">
                  {achievement.progress}%
                </span>
              </div>
              <Progress value={achievement.progress} className="h-3" />
              {achievement.estimatedCompletion && (
                <p className="text-muted-foreground text-xs">
                  Estimated completion:{' '}
                  {format(
                    new Date(achievement.estimatedCompletion),
                    'MMM d, yyyy'
                  )}
                </p>
              )}
            </div>
          </>
        )}

        {achievement.requirements && achievement.requirements.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold">Requirements</h4>
              <div className="space-y-2">
                {achievement.requirements.map((req: any) => (
                  <div
                    key={req.id}
                    className="bg-muted/50 flex items-start gap-3 rounded-lg p-2"
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                        req.completed ? 'bg-green-500' : 'bg-gray-300'
                      )}
                    >
                      {req.completed && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{req.description}</p>
                      {req.current !== undefined &&
                        req.target !== undefined && (
                          <p className="text-muted-foreground text-xs">
                            {req.current} / {req.target}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isEarned && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold">Share Achievement</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare('twitter')}
                >
                  Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare('linkedin')}
                >
                  Share on LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare('copy_link')}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </>
        )}

        {isLocked && (
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground text-center text-sm">
              Complete the requirements above to unlock this achievement
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ModalSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

interface AchievementPaginationProps {
  pagination: TPagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function AchievementPagination({
  pagination,
  currentPage,
  onPageChange,
}: AchievementPaginationProps) {
  const { itemsPerPage, setItemsPerPage } = useAchievementStore();

  const { totalPages } = pagination;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Items per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(v) => {
            setItemsPerPage(Number(v));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          Showing{' '}
          {Math.min((currentPage - 1) * itemsPerPage + 1, pagination.total)} -{' '}
          {Math.min(currentPage * itemsPerPage, pagination.total)} of{' '}
          {pagination.total}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!canGoBack}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground px-2"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoForward}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function EmptyAchievements() {
  const { filters, clearFilters } = useAchievementStore();

  const hasActiveFilters =
    filters.search ||
    filters.status?.length ||
    filters.category?.length ||
    filters.difficulty?.length ||
    filters.rarity?.length ||
    filters.starred;

  if (hasActiveFilters) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No achievements found</h3>
          <p className="text-muted-foreground mb-4 max-w-md text-sm">
            No achievements match your current filters. Try adjusting your
            search criteria or clear all filters.
          </p>
          <Button onClick={clearFilters} variant="outline">
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Trophy className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No achievements yet</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Start your learning journey to unlock achievements! Complete courses,
          participate in discussions, and achieve milestones to earn badges.
        </p>
      </CardContent>
    </Card>
  );
}

export function AchievementGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <AchievementCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AchievementCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <AchievementListItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function AchievementListItemSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementCompactSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <CompactItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function CompactItemSkeleton() {
  return (
    <div className="bg-card flex items-center gap-2 rounded-lg border p-3">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-8 w-8" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  );
}

export function AchievementTimelineSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <TimelineItemSkeleton key={i} isLast={i === 4} />
      ))}
    </div>
  );
}

export function TimelineItemSkeleton({ isLast }: { isLast?: boolean }) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        {!isLast && <div className="bg-border h-full min-h-[40px] w-0.5" />}
      </div>
      <Card className="mb-4 flex-1">
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-3 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AchievementsTab() {
  const { viewMode, filters, sortBy, itemsPerPage } = useAchievementStore();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: achievementsData,
    isLoading: isLoadingAchievements,
    isError: isErrorAchievements,
    error: errorAchievements,
    refetch: refetchAchievements,
  } = useAchievements({
    filters,
    sort: sortBy,
    page: currentPage,
    limit: itemsPerPage,
  });

  const {
    data: statistics,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
  } = useStatistics();

  const isLoading = isLoadingAchievements || isLoadingStats;
  const isError = isErrorAchievements || isErrorStats;

  const handleRetry = async () => {
    await Promise.all([refetchAchievements(), refetchStats()]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-12 animate-pulse rounded-lg" />
        {viewMode === 'grid' && <AchievementGridSkeleton />}
        {viewMode === 'list' && <AchievementListSkeleton />}
        {viewMode === 'compact' && <AchievementCompactSkeleton />}
        {viewMode === 'timeline' && <AchievementTimelineSkeleton />}
        <DigitalBadgesTabSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={
          errorAchievements?.message ||
          'Failed to load achievements. Please try again.'
        }
        onRetry={handleRetry}
      />
    );
  }

  if (
    !achievementsData?.achievements ||
    achievementsData.achievements.length === 0
  ) {
    return (
      <div className="space-y-2">
        <AchievementHeader statistics={statistics} />
        <AchievementFilters />
        <EmptyAchievements />
        <DigitalBadgesTab />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AchievementHeader statistics={statistics} />

      <AchievementFilters />

      {viewMode === 'grid' && (
        <AchievementGrid achievements={achievementsData.achievements} />
      )}
      {viewMode === 'list' && (
        <AchievementList achievements={achievementsData.achievements} />
      )}
      {viewMode === 'compact' && (
        <AchievementCompact achievements={achievementsData.achievements} />
      )}
      {viewMode === 'timeline' && (
        <AchievementTimeline achievements={achievementsData.achievements} />
      )}

      {achievementsData.pagination && (
        <AchievementPagination
          pagination={achievementsData.pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      <AchievementDetailsModal />

      <DigitalBadgesTab />
    </div>
  );
}

export function AchievementsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="bg-muted h-32 animate-pulse rounded-lg" />
      <div className="bg-muted h-12 animate-pulse rounded-lg" />
      <AchievementGridSkeleton />
      <DigitalBadgesTabSkeleton />
    </div>
  );
}
