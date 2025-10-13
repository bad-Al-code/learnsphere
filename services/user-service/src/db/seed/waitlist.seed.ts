import { faker } from '@faker-js/faker';
import { db } from '..';
import { waitlist } from '../schema';

function generateReferralCode(): string {
  return faker.string.alphanumeric(8).toUpperCase();
}

function determineRewards(referralCount: number): string[] {
  const rewards: string[] = [];

  if (referralCount >= 1) rewards.push('early_access');
  if (referralCount >= 3) rewards.push('beta_tester');
  if (referralCount >= 5) rewards.push('premium_badge');
  if (referralCount >= 10) rewards.push('founder_status');
  if (referralCount >= 25) rewards.push('lifetime_pro');

  return rewards;
}

async function seedWaitlist() {
  try {
    console.log('Clearing existing waitlist data...');
    await db.delete(waitlist);

    const totalUsers = 500;
    const usersWithReferrals = Math.floor(totalUsers * 0.6);
    const usersData: any[] = [];
    const userIds: string[] = [];
    const referralCodes: Set<string> = new Set();

    console.log(`Generating ${totalUsers} waitlist entries...`);

    for (let i = 0; i < totalUsers; i++) {
      const id = faker.string.uuid();
      let referralCode: string;

      do {
        referralCode = generateReferralCode();
      } while (referralCodes.has(referralCode));

      referralCodes.add(referralCode);
      userIds.push(id);

      usersData.push({
        id,
        email: faker.internet.email().toLowerCase(),
        referralCode,
        referredById: null,
        referralCount: 0,
        rewardsUnlocked: [],
        createdAt: faker.date.recent({ days: 90 }),
      });
    }

    usersData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const minIndexForReferral = Math.floor(totalUsers * 0.1);

    for (let i = minIndexForReferral; i < totalUsers; i++) {
      if (i < minIndexForReferral + usersWithReferrals) {
        const possibleReferrers = usersData.slice(0, i);
        const referrer = faker.helpers.arrayElement(possibleReferrers);
        usersData[i].referredById = referrer.id;
      }
    }

    const referralCountMap = new Map<string, number>();

    for (const user of usersData) {
      if (user.referredById) {
        const count = referralCountMap.get(user.referredById) || 0;
        referralCountMap.set(user.referredById, count + 1);
      }
    }

    for (const user of usersData) {
      const count = referralCountMap.get(user.id) || 0;
      user.referralCount = count;
      user.rewardsUnlocked = determineRewards(count);
    }

    console.log('Inserting waitlist data in batches...');

    for (let i = 0; i < usersData.length; i += 100) {
      const batch = usersData.slice(i, i + 100);
      await db.insert(waitlist).values(batch);
      console.log(
        `Inserted batch ${Math.floor(i / 100) + 1}/${Math.ceil(usersData.length / 100)}`
      );
    }

    const stats = {
      totalUsers: usersData.length,
      usersWithReferrals: usersData.filter((u) => u.referredById).length,
      topReferrers: usersData
        .filter((u) => u.referralCount > 0)
        .sort((a, b) => b.referralCount - a.referralCount)
        .slice(0, 5)
        .map((u) => ({
          email: u.email,
          referrals: u.referralCount,
          rewards: u.rewardsUnlocked.length,
        })),
      rewardDistribution: {
        earlyAccess: usersData.filter((u) =>
          u.rewardsUnlocked.includes('early_access')
        ).length,
        betaTester: usersData.filter((u) =>
          u.rewardsUnlocked.includes('beta_tester')
        ).length,
        premiumBadge: usersData.filter((u) =>
          u.rewardsUnlocked.includes('premium_badge')
        ).length,
        founderStatus: usersData.filter((u) =>
          u.rewardsUnlocked.includes('founder_status')
        ).length,
        lifetimePro: usersData.filter((u) =>
          u.rewardsUnlocked.includes('lifetime_pro')
        ).length,
      },
    };

    console.log('\nStatistics:');
    console.log(`Total users: ${stats.totalUsers}`);
    console.log(`Users referred by others: ${stats.usersWithReferrals}`);
    console.log(`\nTop 5 referrers:`);
    stats.topReferrers.forEach((ref, idx) => {
      console.log(
        `  ${idx + 1}. ${ref.email} - ${ref.referrals} referrals, ${ref.rewards} rewards`
      );
    });
    console.log(`\nReward distribution:`);
    console.log(`  Early Access: ${stats.rewardDistribution.earlyAccess}`);
    console.log(`  Beta Tester: ${stats.rewardDistribution.betaTester}`);
    console.log(`  Premium Badge: ${stats.rewardDistribution.premiumBadge}`);
    console.log(`  Founder Status: ${stats.rewardDistribution.founderStatus}`);
    console.log(`  Lifetime Pro: ${stats.rewardDistribution.lifetimePro}`);
  } catch (err) {
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedWaitlist();
