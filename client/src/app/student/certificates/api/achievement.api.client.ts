import { faker } from '@faker-js/faker';

import type {
  TAchievement,
  TAchievementListResponse,
  TBulkUpdateStarred,
  TCollection,
  TCollectionListResponse,
  TExportRequest,
  TFilter,
  TShareAchievement,
  TSortOption,
  TStatistics,
  TUpdateStarred,
} from '../schemas/achievement.schema';

let mockAchievements: TAchievement[] = [];

const generateMockAchievements = (count: number): TAchievement[] => {
  return Array.from({ length: count }, (_, index) => {
    const status = faker.helpers.arrayElement([
      'earned',
      'in_progress',
      'locked',
    ] as const);
    const progress =
      status === 'in_progress'
        ? faker.number.int({ min: 20, max: 90 })
        : status === 'earned'
          ? 100
          : 0;

    return {
      id: faker.string.uuid(),
      icon: faker.helpers.arrayElement([
        '🌅',
        '⚔️',
        '🤝',
        '💯',
        '🏃♂️',
        '🎓',
        '⭐',
        '🔥',
        '💎',
        '🏆',
        '🎯',
        '🚀',
      ]),
      title: faker.helpers.arrayElement([
        'Early Bird',
        'Code Warrior',
        'Team Player',
        'Perfect Score',
        'Marathon Learner',
        'Quick Learner',
        'Discussion Master',
        'Night Owl',
        'Problem Solver',
        'Community Hero',
        'Study Streak',
        'First Steps',
      ]),
      description: faker.lorem.sentence(),
      status,
      category: faker.helpers.arrayElement([
        'academic',
        'social',
        'streak',
        'milestone',
        'special_event',
        'hidden',
      ] as const),
      difficulty: faker.helpers.arrayElement([
        'easy',
        'medium',
        'hard',
        'legendary',
      ] as const),
      rarity: faker.helpers.arrayElement([
        'common',
        'rare',
        'epic',
        'legendary',
      ] as const),
      isStarred: faker.datatype.boolean({ probability: 0.3 }),
      isHidden: faker.datatype.boolean({ probability: 0.1 }),
      isLimitedTime: faker.datatype.boolean({ probability: 0.15 }),
      points: faker.number.int({ min: 10, max: 500 }),
      progress,
      requirements: Array.from(
        { length: faker.number.int({ min: 2, max: 5 }) },
        () => {
          const target = faker.number.int({ min: 5, max: 20 });
          const current = faker.number.int({ min: 0, max: target });
          return {
            id: faker.string.uuid(),
            description: faker.lorem.sentence(),
            completed: current >= target,
            current,
            target,
          };
        }
      ),
      earnedAt:
        status === 'earned'
          ? faker.date.past({ years: 1 }).toISOString()
          : null,
      unlockedBy: faker.number.int({ min: 5, max: 95 }),
      collectionId: faker.datatype.boolean({ probability: 0.4 })
        ? faker.string.uuid()
        : null,
      seriesNumber: faker.datatype.boolean({ probability: 0.3 })
        ? faker.number.int({ min: 1, max: 5 })
        : null,
      estimatedCompletion:
        status === 'in_progress'
          ? faker.date.future({ years: 0.5 }).toISOString()
          : null,
    };
  });
};

const initializeMockData = () => {
  if (mockAchievements.length === 0) {
    mockAchievements = generateMockAchievements(50);
  }
};

export class AchievementApiClient {
  async getAchievements(params: {
    filters?: TFilter;
    sort?: TSortOption;
    page?: number;
    limit?: number;
  }): Promise<TAchievementListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    initializeMockData();
    let filteredAchievements = [...mockAchievements];

    if (params.filters) {
      const {
        search,
        status,
        category,
        difficulty,
        rarity,
        starred,
        showHidden,
      } = params.filters;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredAchievements = filteredAchievements.filter(
          (ach) =>
            ach.title.toLowerCase().includes(searchLower) ||
            ach.description.toLowerCase().includes(searchLower)
        );
      }

      if (status && status.length > 0) {
        filteredAchievements = filteredAchievements.filter((ach) =>
          status.includes(ach.status)
        );
      }

      if (category && category.length > 0) {
        filteredAchievements = filteredAchievements.filter((ach) =>
          category.includes(ach.category)
        );
      }

      if (difficulty && difficulty.length > 0) {
        filteredAchievements = filteredAchievements.filter((ach) =>
          difficulty.includes(ach.difficulty)
        );
      }

      if (rarity && rarity.length > 0) {
        filteredAchievements = filteredAchievements.filter((ach) =>
          rarity.includes(ach.rarity)
        );
      }

      if (starred === true) {
        filteredAchievements = filteredAchievements.filter(
          (ach) => ach.isStarred
        );
      }

      if (!showHidden) {
        filteredAchievements = filteredAchievements.filter(
          (ach) => !ach.isHidden
        );
      }
    }

    if (params.sort) {
      filteredAchievements.sort((a, b) => {
        switch (params.sort) {
          case 'date_earned':
            if (!a.earnedAt) return 1;
            if (!b.earnedAt) return -1;
            return (
              new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
            );
          case 'rarity':
            const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
          case 'name':
            return a.title.localeCompare(b.title);
          case 'progress':
            return b.progress - a.progress;
          case 'difficulty':
            const difficultyOrder = {
              easy: 0,
              medium: 1,
              hard: 2,
              legendary: 3,
            };
            return (
              difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
            );
          default:
            return 0;
        }
      });
    }

    filteredAchievements.sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      return 0;
    });

    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAchievements = filteredAchievements.slice(
      startIndex,
      endIndex
    );

    return {
      achievements: paginatedAchievements,
      pagination: {
        page,
        limit,
        total: filteredAchievements.length,
        totalPages: Math.ceil(filteredAchievements.length / limit),
      },
    };
  }

  async getAchievement(id: string): Promise<TAchievement> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    initializeMockData();
    const achievement = mockAchievements.find((ach) => ach.id === id);

    if (achievement) {
      return achievement;
    }

    return generateMockAchievements(1)[0];
  }

  async getStatistics(): Promise<TStatistics> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    initializeMockData();
    const earnedAchievements = mockAchievements.filter(
      (ach) => ach.status === 'earned'
    ).length;
    const totalPoints = mockAchievements
      .filter((ach) => ach.status === 'earned')
      .reduce((sum, ach) => sum + ach.points, 0);

    return {
      totalAchievements: mockAchievements.length,
      earnedAchievements,
      completionPercentage:
        (earnedAchievements / mockAchievements.length) * 100,
      totalPoints,
      rarityScore: faker.number.float({
        min: 50,
        max: 100,
        fractionDigits: 1,
      }),
      leaderboardPosition: faker.number.int({ min: 1, max: 100 }),
      averageEarningRate: faker.number.float({
        min: 1,
        max: 5,
        fractionDigits: 1,
      }),
      fastestEarned: {
        achievementId: mockAchievements[0]?.id || faker.string.uuid(),
        timeToEarn: faker.number.int({ min: 1, max: 30 }),
      },
      rarestOwned: {
        achievementId:
          mockAchievements.find((ach) => ach.rarity === 'legendary')?.id ||
          faker.string.uuid(),
        rarity: faker.number.int({ min: 1, max: 10 }),
      },
    };
  }

  async updateStarred(data: TUpdateStarred): Promise<TAchievement> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    initializeMockData();
    const achievement = mockAchievements.find(
      (ach) => ach.id === data.achievementId
    );

    if (achievement) {
      achievement.isStarred = data.isStarred;
      return achievement;
    }

    throw new Error('Achievement not found');
  }

  async bulkUpdateStarred(data: TBulkUpdateStarred): Promise<TAchievement[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    initializeMockData();
    const updatedAchievements: TAchievement[] = [];

    data.achievementIds.forEach((id) => {
      const achievement = mockAchievements.find((ach) => ach.id === id);
      if (achievement) {
        achievement.isStarred = data.isStarred;
        updatedAchievements.push(achievement);
      }
    });

    return updatedAchievements;
  }

  async shareAchievement(
    data: TShareAchievement
  ): Promise<{ url: string; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const baseUrl = 'https://example.com/achievements';
    const url = `${baseUrl}/${data.achievementId}`;

    const messages: Record<string, string> = {
      twitter: `Check out my achievement! ${url}`,
      linkedin: `I'm proud to share that I've earned a new achievement! ${url}`,
      facebook: `Just earned a new achievement! ${url}`,
      copy_link: 'Link copied to clipboard',
    };

    return {
      url,
      message: messages[data.platform],
    };
  }

  async getCollections(): Promise<TCollectionListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    initializeMockData();

    const collections: TCollection[] = Array.from({ length: 5 }, () => {
      const achievementCount = faker.number.int({ min: 3, max: 8 });
      const completedCount = faker.number.int({
        min: 0,
        max: achievementCount,
      });

      return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
          'Academic Excellence',
          'Social Butterfly',
          'Streak Master',
          'Course Completion',
          'Leadership Path',
        ]),
        description: faker.lorem.sentence(),
        achievementIds: Array.from({ length: achievementCount }, () =>
          faker.string.uuid()
        ),
        completed: completedCount === achievementCount,
        bonusPoints: faker.number.int({ min: 100, max: 500 }),
      };
    });

    return { collections };
  }

  async exportAchievements(data: TExportRequest): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    initializeMockData();
    let achievementsToExport = mockAchievements;

    if (data.achievementIds && data.achievementIds.length > 0) {
      achievementsToExport = mockAchievements.filter((ach) =>
        data.achievementIds!.includes(ach.id)
      );
    }

    let content = '';

    switch (data.format) {
      case 'json':
        content = JSON.stringify(achievementsToExport, null, 2);
        return new Blob([content], { type: 'application/json' });

      case 'csv':
        const headers =
          'Title,Description,Status,Category,Points,Earned Date\n';
        const rows = achievementsToExport
          .map(
            (ach) =>
              `"${ach.title}","${ach.description}","${ach.status}","${ach.category}",${ach.points},"${ach.earnedAt || ''}"`
          )
          .join('\n');
        content = headers + rows;
        return new Blob([content], { type: 'text/csv' });

      case 'pdf':
        content = `Achievement Portfolio\n\n${achievementsToExport
          .map(
            (ach) =>
              `${ach.title}\n${ach.description}\nPoints: ${ach.points}\n\n`
          )
          .join('')}`;
        return new Blob([content], { type: 'application/pdf' });

      default:
        throw new Error('Unsupported format');
    }
  }

  async getSuggestions(): Promise<TAchievement[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    initializeMockData();

    const suggestions = mockAchievements
      .filter((ach) => ach.status === 'in_progress' || ach.status === 'locked')
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);

    return suggestions;
  }

  async markNotificationSeen(achievementId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return;
  }

  async getLeaderboard(params?: { page?: number; limit?: number }): Promise<{
    leaderboard: Array<{
      userId: string;
      username: string;
      points: number;
      achievementCount: number;
      rank: number;
    }>;
    currentUser: {
      rank: number;
      points: number;
    };
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const limit = params?.limit || 10;
    const page = params?.page || 1;

    const leaderboard = Array.from({ length: limit }, (_, index) => {
      const rank = (page - 1) * limit + index + 1;
      return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        points: faker.number.int({ min: 500, max: 5000 }),
        achievementCount: faker.number.int({ min: 10, max: 50 }),
        rank,
      };
    }).sort((a, b) => b.points - a.points);

    return {
      leaderboard,
      currentUser: {
        rank: faker.number.int({ min: 1, max: 100 }),
        points: faker.number.int({ min: 500, max: 5000 }),
      },
    };
  }
}

export const achievementApi = new AchievementApiClient();
