'use client';

import { ErrorState } from '@/components/ui/error-state';
import { useAchievements, useBulkUpdateStarred, useExportAchievements, useShareAchievement, useStatistics, useUpdateStarred } from '../hooks/use-achievement';
import { useAchievementStore } from '../store/achievement.store';
import { DigitalBadgesTab, DigitalBadgesTabSkeleton } from './digital-badges-tab';
import { useState } from 'react';


import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { TAchievement, TStatistics } from '../schemas/achievement.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  LayoutGrid,
  Clock,
  Star,
  Download,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Lock,
  Sparkles,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import page from '../page';

interface AchievementCardProps {
  achievement: TAchievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const {
    openDetailsModal,
    selectedAchievements,
    toggleSelectAchievement,
  } = useAchievementStore();

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
        'relative cursor-pointer transition-all hover:shadow-lg group',
        isLocked && 'opacity-60',
        isSelected && 'ring-2 ring-primary',
        achievement.rarity === 'legendary' && 'animate-pulse-slow'
      )}
      onClick={() => openDetailsModal(achievement.id)}
    >
      {(achievement.rarity === 'epic' || achievement.rarity === 'legendary') && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r rounded-lg opacity-20',
            getRarityColor()
          )}
        />
      )}

     </Card>
  )
}
     

export function AchievementFilters() {
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        <div className="flex gap-1 border rounded-md p-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className="px-2"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="px-2"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('compact')}
            className="px-2"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('timeline')}
            className="px-2"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 " />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  •
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('earned')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'earned']
                  : filters.status?.filter((s) => s !== 'earned');
                setFilters({ status: newStatus?.length ? newStatus : undefined });
              }}
            >
              Earned
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('in_progress')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'in_progress']
                  : filters.status?.filter((s) => s !== 'in_progress');
                setFilters({ status: newStatus?.length ? newStatus : undefined });
              }}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status?.includes('locked')}
              onCheckedChange={(checked) => {
                const newStatus = checked
                  ? [...(filters.status || []), 'locked']
                  : filters.status?.filter((s) => s !== 'locked');
                setFilters({ status: newStatus?.length ? newStatus : undefined });
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
                    category: newCategory?.length ? (newCategory as any) : undefined,
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
              <Star className="h-4 w-4 " />
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
      </div>

      {(hasActiveFilters || selectedAchievements.size > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}

          {selectedAchievements.size > 0 && (
            <>
              <Badge variant="secondary">
                {selectedAchievements.size} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkStar(true)}
                className="h-7"
              >
                <Star className="h-3 w-3 mr-1" />
                Star All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkStar(false)}
                className="h-7"
              >
                Unstar All
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem onClick={() => handleExport('pdf')}>
                    PDF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onClick={() => handleExport('json')}>
                    JSON
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onClick={() => handleExport('csv')}>
                    CSV
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-7"
              >
                Clear
              </Button>
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

export function AchievementHeader({ statistics }: AchievementHeaderProps) {
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
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-12 bg-muted animate-pulse rounded-lg" />
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

  if (!achievementsData?.achievements || achievementsData.achievements.length === 0) {
    return (
      <div className="space-y-6">
        <AchievementHeader statistics={statistics} />
        <AchievementFilters />
        <EmptyAchievements />
        <DigitalBadgesTab />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {achievementsData.pagination && 
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
    <div className="space-y-6">
      <div className="h-32 bg-muted animate-pulse rounded-lg" />
      <div className="h-12 bg-muted animate-pulse rounded-lg" />
      <AchievementGridSkeleton />
      <DigitalBadgesTabSkeleton />
    </div>
  );
}