import { z } from 'zod';

export const AchievementStatus = z.enum(['earned', 'in_progress', 'locked']);
export const AchievementCategory = z.enum([
  'academic',
  'social',
  'streak',
  'milestone',
  'special_event',
  'hidden',
]);
export const AchievementDifficulty = z.enum([
  'easy',
  'medium',
  'hard',
  'legendary',
]);
export const AchievementRarity = z.enum([
  'common',
  'rare',
  'epic',
  'legendary',
]);
export const SortOption = z.enum([
  'date_earned',
  'rarity',
  'name',
  'progress',
  'difficulty',
]);
export const ViewMode = z.enum(['grid', 'list', 'compact', 'timeline']);

export type TAchievementStatus = z.infer<typeof AchievementStatus>;
export type TAchievementCategory = z.infer<typeof AchievementCategory>;
export type TAchievementDifficulty = z.infer<typeof AchievementDifficulty>;
export type TAchievementRarity = z.infer<typeof AchievementRarity>;
export type TSortOption = z.infer<typeof SortOption>;
export type TViewMode = z.infer<typeof ViewMode>;

export const RequirementSchema = z.object({
  id: z.string(),
  description: z.string(),
  completed: z.boolean(),
  current: z.number().optional(),
  target: z.number().optional(),
});

export type TRequirement = z.infer<typeof RequirementSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  status: AchievementStatus,
  category: AchievementCategory,
  difficulty: AchievementDifficulty,
  rarity: AchievementRarity,
  isStarred: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  isLimitedTime: z.boolean().default(false),
  points: z.number(),
  progress: z.number().min(0).max(100).default(0),
  requirements: z.array(RequirementSchema).optional(),
  earnedAt: z.string().datetime().nullable().optional(),
  unlockedBy: z.number().optional(),
  collectionId: z.string().nullable().optional(),
  seriesNumber: z.number().nullable().optional(),
  estimatedCompletion: z.string().datetime().nullable().optional(),
});

export type TAchievement = z.infer<typeof AchievementSchema>;

export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  achievementIds: z.array(z.string()),
  completed: z.boolean(),
  bonusPoints: z.number(),
});

export type TCollection = z.infer<typeof CollectionSchema>;

export const StatisticsSchema = z.object({
  totalAchievements: z.number(),
  earnedAchievements: z.number(),
  completionPercentage: z.number(),
  totalPoints: z.number(),
  rarityScore: z.number(),
  leaderboardPosition: z.number().nullable(),
  averageEarningRate: z.number(),
  fastestEarned: z
    .object({
      achievementId: z.string(),
      timeToEarn: z.number(),
    })
    .nullable(),
  rarestOwned: z
    .object({
      achievementId: z.string(),
      rarity: z.number(),
    })
    .nullable(),
});

export type TStatistics = z.infer<typeof StatisticsSchema>;

export const FilterSchema = z.object({
  search: z.string().optional(),
  status: z.array(AchievementStatus).optional(),
  category: z.array(AchievementCategory).optional(),
  difficulty: z.array(AchievementDifficulty).optional(),
  rarity: z.array(AchievementRarity).optional(),
  starred: z.boolean().optional(),
  showHidden: z.boolean().default(false),
});

export type TFilter = z.infer<typeof FilterSchema>;

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number(),
  totalPages: z.number(),
});

export type TPagination = z.infer<typeof PaginationSchema>;

export const AchievementListResponseSchema = z.object({
  achievements: z.array(AchievementSchema),
  pagination: PaginationSchema,
  statistics: StatisticsSchema.optional(),
});

export type TAchievementListResponse = z.infer<
  typeof AchievementListResponseSchema
>;

export const CollectionListResponseSchema = z.object({
  collections: z.array(CollectionSchema),
});

export type TCollectionListResponse = z.infer<
  typeof CollectionListResponseSchema
>;

export const UpdateStarredSchema = z.object({
  achievementId: z.string(),
  isStarred: z.boolean(),
});

export type TUpdateStarred = z.infer<typeof UpdateStarredSchema>;

export const BulkUpdateStarredSchema = z.object({
  achievementIds: z.array(z.string()),
  isStarred: z.boolean(),
});

export type TBulkUpdateStarred = z.infer<typeof BulkUpdateStarredSchema>;

export const ShareAchievementSchema = z.object({
  achievementId: z.string(),
  platform: z.enum(['twitter', 'linkedin', 'facebook', 'copy_link']),
});

export type TShareAchievement = z.infer<typeof ShareAchievementSchema>;

export const ExportFormatSchema = z.enum(['pdf', 'json', 'csv']);
export type TExportFormat = z.infer<typeof ExportFormatSchema>;

export const ExportRequestSchema = z.object({
  format: ExportFormatSchema,
  achievementIds: z.array(z.string()).optional(),
  includeStatistics: z.boolean().default(true),
});

export type TExportRequest = z.infer<typeof ExportRequestSchema>;
