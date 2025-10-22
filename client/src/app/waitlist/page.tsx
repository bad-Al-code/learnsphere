'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  Cloud,
  Code,
  Copy,
  Gift,
  Linkedin,
  Loader,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  Twitter,
  Users,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useJoinWaitlist,
  useUpdateInterests,
  useWaitlistStats,
  useWaitlistStatus,
} from './hooks/use-waitlist';
import {
  JoinWaitlistInput,
  joinWaitlistSchema,
} from './schema/waitlist.schema';

const WAITLIST_EMAIL_KEY = 'learnsphere-waitlist-email';
const REWARD_TIERS = [
  {
    id: '1_MONTH_FREE',
    count: 3,
    title: '1 Month Free',
    description: 'Get 1 month of full access at launch.',
  },
  {
    id: 'LIFETIME_DISCOUNT_25',
    count: 5,
    title: '25% Lifetime Discount',
    description: 'Enjoy a 25% discount forever.',
  },
  {
    id: 'FOUNDING_MEMBER',
    count: 10,
    title: 'Founding Member',
    description: 'Get a free course and an exclusive badge.',
  },
];

const INTEREST_TAGS = [
  { id: 'web-development', label: 'Web Development', Icon: Code },
  { id: 'data-science', label: 'Data Science', Icon: BrainCircuit },
  { id: 'cloud-computing', label: 'Cloud Computing', Icon: Cloud },
  { id: 'design', label: 'Design', Icon: Palette },
  { id: 'business', label: 'Business', Icon: Briefcase },
  { id: 'marketing', label: 'Marketing', Icon: Megaphone },
];

function InterestSelector({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const { mutate: updateInterests, isPending } = useUpdateInterests();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest.');
      return;
    }
    updateInterests({ email, interests: selectedInterests }, { onSuccess });
  };

  return (
    <div className="space-y-8 py-8 text-center">
      <h2 className="text-foreground text-3xl font-bold">One last step!</h2>
      <p className="text-muted-foreground mx-auto max-w-md">
        Tell us what you're excited to learn about so we can tailor your
        experience.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {INTEREST_TAGS.map(({ id, label, Icon }) => {
          const isSelected = selectedInterests.includes(id);
          return (
            <Button
              key={id}
              variant={isSelected ? 'default' : 'outline'}
              className="h-20 flex-col gap-2"
              onClick={() => handleToggleInterest(id)}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </Button>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending || selectedInterests.length === 0}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : 'Continue'}
      </Button>
    </div>
  );
}

function RewardsTracker({
  referralCount,
  unlockedRewards,
}: {
  referralCount: number;
  unlockedRewards: string[];
}) {
  const nextTier = REWARD_TIERS.find((tier) => tier.count > referralCount);
  const progress = nextTier ? (referralCount / nextTier.count) * 100 : 100;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Gift className="text-primary h-5 w-5" />
          Unlock Rewards
        </h3>

        <div className="space-y-4">
          {REWARD_TIERS.map((tier) => {
            const isUnlocked = unlockedRewards.includes(tier.id);
            return (
              <div
                key={tier.id}
                className={`flex items-start gap-4 transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {isUnlocked ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="font-bold">{tier.count}</span>
                  )}
                </div>
                <div>
                  <p className="flex items-start font-semibold">{tier.title}</p>
                  <p className="text-muted-foreground flex items-start text-sm">
                    {tier.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {nextTier && (
          <div className="mt-6">
            <div className="text-muted-foreground mb-1 flex justify-between text-sm">
              <span>Your Progress</span>
              <span>
                {referralCount} / {nextTier.count} Referrals
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WaitlistStatus({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) {
  const { data, isLoading, isError, error } = useWaitlistStatus(email);

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/waitlist?ref=${data?.referralCode}`
      : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const shareText = `I just joned the waitlist for LearnSphere, a new AI-powered learning platform. Join me to get early access! ${referralLink}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent('Join me on the LearnSphere Waitlist!')}&summary=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-8 text-center">
        <div className="flex justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-full max-w-md" />
          <Skeleton className="mx-auto h-4 w-full max-w-sm" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-destructive">{error.message}</p>
        <Button variant="outline" onClick={onReset}>
          Try a different email
        </Button>
      </div>
    );
  }

  if (!data) {
    return <WaitlistStatusSkeleton />;
  }

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <div className="animate-in zoom-in-50 bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full duration-500">
          <CheckCircle2 className="text-primary h-10 w-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-foreground text-3xl font-bold">
          You're on the list!
        </h2>
        <p className="text-muted-foreground mx-auto max-w-md">
          Your current position is{' '}
          <span className="text-foreground font-bold">
            #{data?.waitlistPosition.toLocaleString()}
          </span>
          .
        </p>
      </div>

      <Card className="bg-muted/20 border-dashed text-center">
        <CardContent className="p-6">
          <h3 className="flex items-center justify-center gap-2 font-semibold">
            <Users className="h-5 w-5" />
            Move up the list!
          </h3>

          <p className="text-muted-foreground mt-2 text-sm">
            Invite friends to move up the waitlist faster. You've referred{' '}
            <span className="text-foreground font-bold">
              {data?.referralCount}
            </span>{' '}
            {data?.referralCount === 1 ? 'person' : 'people'} so far.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              readOnly
              value={referralLink}
              className="text-center sm:text-left"
            />
            <Button onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.twitter, '_blank')}
            >
              <Twitter className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.linkedin, '_blank')}
            >
              <Linkedin className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.whatsapp, '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <RewardsTracker
        referralCount={data.referralCount}
        unlockedRewards={data.rewardsUnlocked}
      />

      <Button variant="outline" onClick={onReset} className="">
        Subscribe another email
      </Button>
    </div>
  );
}

export default function WaitlistPage({
  className = '',
}: {
  className?: string;
}) {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  const [waitlistState, setWaitlistState] = useState<
    'form' | 'interests' | 'status'
  >('form');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();
  const { data: stats } = useWaitlistStats();

  useEffect(() => {
    const storedEmail = localStorage.getItem(WAITLIST_EMAIL_KEY);
    if (storedEmail) {
      setSubmittedEmail(storedEmail);
      setWaitlistState('status');
    }
  }, []);

  const form = useForm<JoinWaitlistInput>({
    resolver: zodResolver(joinWaitlistSchema),
    defaultValues: {
      email: '',
      referredByCode: refCode || undefined,
    },
    mode: 'onBlur',
  });

  const handleSubmit = (data: JoinWaitlistInput) => {
    const submissionData = { ...data, referredByCode: refCode };

    joinWaitlist(submissionData, {
      onSuccess: () => {
        if (data.email) {
          localStorage.setItem(WAITLIST_EMAIL_KEY, data.email);
          setSubmittedEmail(data.email);
          setWaitlistState('interests');
          form.reset();
        }
      },
    });
  };

  const handleReset = () => {
    localStorage.removeItem(WAITLIST_EMAIL_KEY);
    setSubmittedEmail(null);
    setWaitlistState('form');
    form.reset({ email: '', referredByCode: refCode || undefined });
  };

  const handleInterestsSubmitted = () => {
    if (submittedEmail) {
      localStorage.setItem(WAITLIST_EMAIL_KEY, submittedEmail);
      setWaitlistState('status');
    }
  };

  const renderContent = () => {
    switch (waitlistState) {
      case 'interests':
        return (
          <InterestSelector
            email={submittedEmail!}
            onSuccess={handleInterestsSubmitted}
          />
        );
      case 'status':
        return <WaitlistStatus email={submittedEmail!} onReset={handleReset} />;
      case 'form':
      default:
        return (
          <div className="space-y-8">
            {!submittedEmail ? (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <Logo variant="icon" />
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
                    A new way to learn
                    <br />
                    <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                      with the power of AI
                    </span>
                  </h1>
                  <p className="text-muted-foreground mx-auto max-w-md text-lg">
                    Be the first to experience the future of e-learning. Get
                    notified when we launch.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mx-auto max-w-md space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                {...field}
                                disabled={isPending}
                                className="h-12 pl-10 text-base"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 w-full text-base font-semibold"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader className="h-4 w-4 animate-spin" />
                          Joining waitlist...
                        </span>
                      ) : (
                        'Get Notified'
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-3">
                  {[
                    { icon: '🤖', text: 'AI-powered learning' },
                    { icon: '📚', text: 'Personalized courses' },
                    { icon: '👨‍🏫', text: 'Expert instructors' },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-center"
                    >
                      <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                        <span className="text-base">{feature.icon}</span>
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <WaitlistStatus email={submittedEmail} onReset={handleReset} />
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-background relative overflow-hidden">
      {/* <div className="absolute inset-0 overflow-hidden">
        <div
          className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
        <div
          className="bg-accent/10 absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />

        <div className="absolute inset-0 opacity-50">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="wave"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 50 Q 25 25, 50 50 T 100 50"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  className="text-muted-foreground/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      </div> */}

      <div className="relative z-10 flex max-h-[90vh] items-center justify-center p-4">
        <div className="w-full">
          {/* <div className="mb-12 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <Logo variant="icon" />
            </div>
            <span className="text-foreground text-2xl font-bold">
              LearnSphere
            </span>
          </div> */}

          <Card className="">
            <CardContent className="px-8 pt-12 pb-12">
              {renderContent()}
            </CardContent>
          </Card>

          <p className="text-muted-foreground mt-8 text-center text-sm">
            Join over{' '}
            <span className="text-foreground font-semibold">
              {' '}
              {stats?.total.toLocaleString() || '10,000+'}
            </span>{' '}
            learners waiting for launch
          </p>
        </div>
      </div>
    </div>
  );
}

export function WaitlistStatusSkeleton() {
  return (
    <div className="animate-pulse space-y-6 py-8 text-center">
      <div className="flex justify-center">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-full max-w-md" />
        <Skeleton className="mx-auto h-4 w-full max-w-sm" />
      </div>

      <div className="bg-muted/20 mx-auto w-full max-w-md rounded-lg border p-6">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-10 w-full" />
          <div className="mt-2 flex justify-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md space-y-2">
        <Skeleton className="mx-auto h-6 w-32" />
        <Skeleton className="h-4 w-full" />
      </div>

      <Skeleton className="mx-auto h-10 w-48" />
    </div>
  );
}
