'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Flame,
  Gift,
  HelpCircle,
  Home,
  Lightbulb,
  Mail,
  Medal,
  MessageCircle,
  MessageSquare,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const upcomingEvents = [
  {
    id: 9,
    title: 'Advanced JavaScript Workshop',
    instructor: 'John Doe',
    date: '2023-10-15',
  },
  {
    id: 10,
    title: 'UI/UX Design Live Session',
    instructor: 'Jane Smith',
    date: '2023-10-20',
  },
];

const blogHighlights = [
  {
    id: 11,
    title: 'Top 10 JavaScript Tips for Beginners',
    category: 'Development',
    readTime: '5 min read',
  },
  {
    id: 12,
    title: 'Understanding CSS Flexbox',
    category: 'Design',
    readTime: '7 min read',
  },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');

  const recommendedCourses = [
    {
      id: 1,
      title: 'Complete JavaScript Course',
      category: 'Development',
      thumbnail: 'https://picsum.photos/seed/javascript/400/250',
      students: 15420,
      rating: 4.8,
      duration: '12 hours',
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      category: 'Design',
      thumbnail: 'https://picsum.photos/seed/design/400/250',
      students: 8930,
      rating: 4.9,
      duration: '8 hours',
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      category: 'Marketing',
      thumbnail: 'https://picsum.photos/seed/marketing/400/250',
      students: 12100,
      rating: 4.7,
      duration: '10 hours',
    },
    {
      id: 4,
      title: 'Python for Data Science',
      category: 'Data Science',
      thumbnail: 'https://picsum.photos/seed/python/400/250',
      students: 9850,
      rating: 4.8,
      duration: '15 hours',
    },
  ];

  const lastCourse = {
    title: 'React Advanced Patterns',
    progress: 68,
    thumbnail: 'https://picsum.photos/seed/pattern/400/250',
  };

  const recentlyViewed = [
    {
      id: 5,
      title: 'Advanced React Hooks',
      category: 'Development',

      thumbnail: 'https://picsum.photos/seed/typescript/400/250',
      lastViewed: '2 hours ago',
    },
    {
      id: 6,
      title: 'Figma to Code Workflow',
      category: 'Design',
      thumbnail: 'https://picsum.photos/seed/design/400/250',
      lastViewed: 'Yesterday',
    },
  ];

  const userStats = {
    coursesCompleted: 12,
    totalCourses: 30,
    completionRate: 40,
    currentStreak: 5,
    longestStreak: 12,
    totalHours: 156,
    badges: 8,
    rank: 'Advanced Learner',
    points: 2450,
    nextBadge: 'Expert',
    pointsToNext: 550,
  };

  const userBadges = [
    { name: 'First Course', icon: '🎯', earned: true },
    { name: 'Week Warrior', icon: '⚡', earned: true },
    { name: 'Code Master', icon: '💻', earned: true },
    { name: 'Design Pro', icon: '🎨', earned: false },
  ];

  const recentActivity = [
    {
      type: 'lesson',
      title: 'React Hooks Deep Dive',
      course: 'Advanced React Patterns',
      timestamp: '2 hours ago',
      progress: 75,
    },
    {
      type: 'quiz',
      title: 'JavaScript Fundamentals Quiz',
      course: 'Complete JavaScript Course',
      timestamp: 'Yesterday',
      score: 85,
    },
    {
      type: 'project',
      title: 'Portfolio Website',
      course: 'Web Development Bootcamp',
      timestamp: '2 days ago',
      status: 'completed',
    },
  ];

  const aiSuggestions = [
    {
      id: 7,
      title: 'Advanced TypeScript Patterns',
      reason: 'Based on your React progress',
      confidence: 95,
      category: 'Development',
    },
    {
      id: 8,
      title: 'Node.js Backend Development',
      reason: 'Complements your frontend skills',
      confidence: 88,
      category: 'Development',
    },
  ];

  const communityHighlights = [
    {
      title: 'Best practices for React state management?',
      course: 'Advanced React Patterns',
      replies: 23,
      lastActivity: '1 hour ago',
    },
    {
      title: 'How to optimize bundle size in Next.js?',
      course: 'Next.js Mastery',
      replies: 15,
      lastActivity: '3 hours ago',
    },
  ];

  const quizQuestion = {
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets',
    ],
    correct: 1,
    explanation:
      "CSS stands for Cascading Style Sheets - it's used to style HTML elements!",
  };

  const learningFacts = [
    'The human brain can process visual information 60,000 times faster than text!',
    'Learning a new skill creates new neural pathways in your brain.',
    'The average person forgets 50% of new information within an hour.',
    'Active learning increases retention by up to 90%!',
  ];

  const randomFact =
    learningFacts[Math.floor(Math.random() * learningFacts.length)];

  const categories = [
    'Development',
    'Design',
    'Marketing',
    'Business',
    'Data Science',
    'AI/ML',
    'Photography',
    'Music',
  ];

  const motivationalQuotes = [
    'Every mistake is progress in disguise.',
    'Learning never exhausts the mind.',
    'The expert in anything was once a beginner.',
    'Knowledge is power, but learning is a superpower.',
  ];

  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      setFeedback('');
      setFeedbackOpen(false);
    }
  };

  const handleQuizSubmit = () => {
    if (Number.parseInt(quizAnswer) === quizQuestion.correct) {
      alert('Correct! 🎉 ' + quizQuestion.explanation);
    } else {
      alert('Not quite! ' + quizQuestion.explanation);
    }
    setShowQuiz(false);
    setQuizAnswer('');
  };

  return (
    <div className="">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <div className="relative">
            <div className="relative mx-auto mb-8 h-64 w-64">
              <svg
                viewBox="0 0 400 300"
                className="text-muted-foreground/60 h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="200"
                  cy="120"
                  r="25"
                  fill="currentColor"
                  opacity="0.2"
                />
                <circle
                  cx="200"
                  cy="115"
                  r="20"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="195"
                  cy="112"
                  r="2"
                  fill="currentColor"
                  opacity="0.8"
                />
                <circle
                  cx="205"
                  cy="112"
                  r="2"
                  fill="currentColor"
                  opacity="0.8"
                />
                <path
                  d="M190 120 Q200 125 210 120"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.6"
                  fill="none"
                />

                <rect
                  x="170"
                  y="140"
                  width="60"
                  height="35"
                  rx="3"
                  fill="currentColor"
                  opacity="0.3"
                />
                <rect
                  x="172"
                  y="142"
                  width="56"
                  height="25"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <rect
                  x="175"
                  y="145"
                  width="50"
                  height="19"
                  rx="1"
                  fill="currentColor"
                  opacity="0.1"
                />
                <line
                  x1="200"
                  y1="167"
                  x2="200"
                  y2="175"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <ellipse
                  cx="200"
                  cy="175"
                  rx="8"
                  ry="2"
                  fill="currentColor"
                  opacity="0.2"
                />

                <rect
                  x="120"
                  y="160"
                  width="35"
                  height="6"
                  rx="1"
                  fill="currentColor"
                  opacity="0.4"
                />
                <rect
                  x="122"
                  y="154"
                  width="31"
                  height="6"
                  rx="1"
                  fill="currentColor"
                  opacity="0.3"
                />
                <rect
                  x="124"
                  y="148"
                  width="27"
                  height="6"
                  rx="1"
                  fill="currentColor"
                  opacity="0.2"
                />

                <circle
                  cx="280"
                  cy="140"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.5"
                />
                <circle
                  cx="280"
                  cy="140"
                  r="12"
                  fill="currentColor"
                  opacity="0.1"
                />
                <line
                  x1="294"
                  y1="154"
                  x2="308"
                  y2="168"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.5"
                />

                <path
                  d="M275 135 Q280 130 285 135 Q285 140 280 142"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.7"
                  fill="none"
                />
                <circle
                  cx="280"
                  cy="147"
                  r="1.5"
                  fill="currentColor"
                  opacity="0.7"
                />

                <circle
                  cx="100"
                  cy="80"
                  r="12"
                  fill="currentColor"
                  opacity="0.15"
                />
                <text
                  x="100"
                  y="85"
                  textAnchor="middle"
                  className="fill-current text-sm opacity-60"
                >
                  💡
                </text>

                <circle
                  cx="320"
                  cy="100"
                  r="10"
                  fill="currentColor"
                  opacity="0.15"
                />
                <text
                  x="320"
                  y="105"
                  textAnchor="middle"
                  className="fill-current text-xs opacity-60"
                >
                  📚
                </text>

                <circle
                  cx="80"
                  cy="200"
                  r="8"
                  fill="currentColor"
                  opacity="0.15"
                />
                <text
                  x="80"
                  y="205"
                  textAnchor="middle"
                  className="fill-current text-xs opacity-60"
                >
                  🎯
                </text>

                <circle
                  cx="340"
                  cy="180"
                  r="9"
                  fill="currentColor"
                  opacity="0.15"
                />
                <text
                  x="340"
                  y="185"
                  textAnchor="middle"
                  className="fill-current text-xs opacity-60"
                >
                  🚀
                </text>

                <polygon
                  points="250,90 270,85 290,90 270,95"
                  fill="currentColor"
                  opacity="0.3"
                />
                <rect
                  x="268"
                  y="90"
                  width="4"
                  height="15"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="270"
                  cy="105"
                  r="2"
                  fill="currentColor"
                  opacity="0.4"
                />

                <circle
                  cx="150"
                  cy="120"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                  className="animate-pulse"
                />
                <circle
                  cx="180"
                  cy="110"
                  r="1.5"
                  fill="currentColor"
                  opacity="0.4"
                  className="animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                />
                <circle
                  cx="220"
                  cy="105"
                  r="1.5"
                  fill="currentColor"
                  opacity="0.4"
                  className="animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
                <circle
                  cx="250"
                  cy="115"
                  r="2"
                  fill="currentColor"
                  opacity="0.3"
                  className="animate-pulse"
                  style={{ animationDelay: '1.5s' }}
                />

                <circle
                  cx="60"
                  cy="60"
                  r="3"
                  fill="currentColor"
                  opacity="0.3"
                  className="animate-bounce"
                  style={{ animationDelay: '0s', animationDuration: '3s' }}
                />
                <circle
                  cx="350"
                  cy="80"
                  r="2"
                  fill="currentColor"
                  opacity="0.4"
                  className="animate-bounce"
                  style={{ animationDelay: '1s', animationDuration: '3s' }}
                />
                <circle
                  cx="40"
                  cy="220"
                  r="2.5"
                  fill="currentColor"
                  opacity="0.3"
                  className="animate-bounce"
                  style={{ animationDelay: '2s', animationDuration: '3s' }}
                />
                <circle
                  cx="360"
                  cy="200"
                  r="2"
                  fill="currentColor"
                  opacity="0.4"
                  className="animate-bounce"
                  style={{ animationDelay: '0.5s', animationDuration: '3s' }}
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            {isLoggedIn ? (
              <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                Hey there! 👋 Looks like you took a wrong turn
              </h1>
            ) : (
              <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                Oops! Page Not Found
              </h1>
            )}
            <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed md:text-xl">
              {isLoggedIn
                ? "No worries! Let's get you back on track with your learning journey."
                : "Join 50,000+ learners and discover amazing courses. Let's get you started!"}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 hover:border-primary/30 mx-auto max-w-md border-2 border-dashed backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="text-muted-foreground mb-3 text-sm font-medium">
                  Search for a course instead:
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      type="text"
                      placeholder="e.g., JavaScript, Python, Design..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-primary/20 pl-10 transition-all duration-200 focus:ring-2"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="default"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group min-w-[160px] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Link href="/">
                <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group min-w-[160px] bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Link href="/courses">
                <BookOpen className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Browse Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {isLoggedIn && (
              <>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="group min-w-[160px] transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Link href="/dashboard">
                    <Users className="h-5 w-5" />
                    My Dashboard
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="group border-primary/30 hover:border-primary min-w-[160px] border border-dashed transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Link href="/continue">
                    <Play className="h-5 w-5" />
                    Resume Last Course
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <Award className="h-6 w-6 text-yellow-500" />
              Your Achievements
            </h2>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {userBadges.map((badge, index) => (
                <Card
                  key={index}
                  className={`text-center transition-all duration-300 ${badge.earned ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20' : 'opacity-50 grayscale'}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 text-2xl">{badge.icon}</div>
                    <h3 className="text-sm font-semibold">{badge.name}</h3>
                    {badge.earned && (
                      <CheckCircle className="mx-auto mt-2 h-4 w-4 text-green-500" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-100 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-800/20">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <Medal className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-foreground text-xl font-bold">
                      {userStats.rank}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {userStats.points} points
                    </p>
                  </div>
                </div>
                <div className="mx-auto max-w-xs">
                  <div className="text-muted-foreground mb-2 flex justify-between text-sm">
                    <span>Progress to {userStats.nextBadge}</span>
                    <span>{userStats.pointsToNext} points to go</span>
                  </div>
                  <Progress
                    value={
                      (userStats.points /
                        (userStats.points + userStats.pointsToNext)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoggedIn && aiSuggestions.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <Brain className="h-6 w-6 text-purple-500" />
              AI Recommendations Just for You
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {aiSuggestions.map((course) => (
                <Card
                  key={course.id}
                  className="group border-2 border-dashed border-purple-200 transition-all duration-300 hover:shadow-lg dark:border-purple-800"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      >
                        {course.confidence}% match
                      </Badge>
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <h3 className="text-foreground mb-2 font-semibold">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {course.reason}
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Explore Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && recentActivity.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <Clock className="h-6 w-6 text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          {activity.type === 'lesson' && (
                            <Play className="text-primary h-5 w-5" />
                          )}
                          {activity.type === 'quiz' && (
                            <Brain className="text-primary h-5 w-5" />
                          )}
                          {activity.type === 'project' && (
                            <Target className="text-primary h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-foreground font-semibold">
                            {activity.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {activity.course} • {activity.timestamp}
                          </p>
                          {activity.progress && (
                            <div className="mt-1 flex items-center gap-2">
                              <Progress
                                value={activity.progress}
                                className="h-1 w-20"
                              />
                              <span className="text-muted-foreground text-xs">
                                {activity.progress}%
                              </span>
                            </div>
                          )}
                          {activity.score && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Score: {activity.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Resume
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && communityHighlights.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <MessageSquare className="h-6 w-6 text-green-500" />
              Join the Discussion
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {communityHighlights.map((discussion, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <h3 className="text-foreground group-hover:text-primary mb-2 font-semibold transition-colors">
                      {discussion.title}
                    </h3>
                    <div className="text-muted-foreground mb-3 flex items-center justify-between text-sm">
                      <span>{discussion.course}</span>
                      <span>{discussion.lastActivity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MessageCircle className="h-3 w-3" />
                        {discussion.replies} replies
                      </div>
                      <Button size="sm" variant="outline">
                        Join Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-100 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-800/20">
            <CardContent className="p-6 text-center">
              <Gift className="mx-auto mb-3 h-8 w-8 text-orange-600" />
              <h3 className="text-foreground mb-2 font-semibold">
                Quick Learning Break!
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Take a quick quiz to keep your mind sharp while you're here
              </p>

              {!showQuiz ? (
                <Button
                  onClick={() => setShowQuiz(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Brain className="h-4 w-4" />
                  Take Quick Quiz
                </Button>
              ) : (
                <div className="space-y-2 text-left">
                  <h4 className="text-foreground font-semibold">
                    {quizQuestion.question}
                  </h4>
                  <div className="space-y-2">
                    {quizQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="quiz"
                          value={index}
                          checked={quizAnswer === index.toString()}
                          onChange={(e) => setQuizAnswer(e.target.value)}
                          className="text-orange-600"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowQuiz(false)}
                    >
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleQuizSubmit}
                      disabled={!quizAnswer}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Submit Answer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isLoggedIn && recentlyViewed.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <Eye className="text-primary h-6 w-6" />
              Recently Viewed Courses
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recentlyViewed.map((course) => (
                <Card
                  key={course.id}
                  className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.thumbnail || '/placeholder.svg'}
                        alt={course.title}
                        className="h-10 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-foreground mb-1 font-semibold">
                          {course.title}
                        </h3>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                          <span>•</span>
                          <span>{course.lastViewed}</span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>Continue</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Your Learning Progress
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-6 text-center">
                  <Trophy className="mx-auto mb-3 h-8 w-8 text-yellow-600" />
                  <h3 className="text-foreground mb-2 font-semibold">
                    Course Completion
                  </h3>
                  <div className="mb-1 text-2xl font-bold text-yellow-600">
                    {userStats.completionRate}%
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {userStats.coursesCompleted} of {userStats.totalCourses}{' '}
                    courses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-100 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-800/20">
                <CardContent className="p-6 text-center">
                  <Flame className="mx-auto mb-3 h-8 w-8 text-orange-600" />
                  <h3 className="text-foreground mb-2 font-semibold">
                    Learning Streak
                  </h3>
                  <div className="mb-1 text-2xl font-bold text-orange-600">
                    {userStats.currentStreak} days
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Don't break it now! Keep going 🔥
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6 text-center">
                  <Target className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                  <h3 className="text-foreground mb-2 font-semibold">
                    Total Hours
                  </h3>
                  <div className="mb-1 text-2xl font-bold text-blue-600">
                    {userStats.totalHours}h
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Time invested in learning
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
              Continue Your Learning Journey
            </h2>
            <Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-r">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={lastCourse.thumbnail || '/placeholder.svg'}
                    alt={lastCourse.title}
                    className="h-12 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-foreground mb-2 font-semibold">
                      {lastCourse.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <Progress
                        value={lastCourse.progress}
                        className="max-w-xs flex-1"
                      />
                      <span className="text-muted-foreground text-sm">
                        {lastCourse.progress}% complete
                      </span>
                    </div>
                  </div>
                  <Button asChild className="shrink-0">
                    <Link href="/continue">
                      <Play className="h-4 w-4" />
                      Resume
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
            <Calendar className="text-primary h-6 w-6" />
            Upcoming Live Sessions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="group transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2 font-semibold">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mb-1 text-sm">
                        with {event.instructor}
                      </p>
                      <div className="text-primary flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
            Popular Courses You Might Like
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.thumbnail || '/placeholder.svg'}
                      alt={course.title}
                      className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="bg-primary/90 text-primary-foreground absolute top-2 left-2">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="text-foreground group-hover:text-primary line-clamp-2 font-semibold transition-colors">
                      {course.title}
                    </h3>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors"
                    >
                      <Link href={`/courses/${course.id}`}>
                        Start Learning
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <h2 className="text-foreground mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
            <TrendingUp className="text-primary h-6 w-6" />
            Latest Learning Resources
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {blogHighlights.map((article, index) => (
              <Card
                key={index}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {article.category}
                      </Badge>
                      <h3 className="text-foreground group-hover:text-primary mb-2 font-semibold transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {article.readTime}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/blog">
                        Read
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mb-4 text-xl font-semibold">
            Explore by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer px-4 py-2 transition-colors"
                asChild
              >
                <Link
                  href={`/courses?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              </Badge>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <Card className="from-muted/30 to-muted/10 border-dashed bg-gradient-to-r">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-2 text-lg italic">
                "{randomQuote}"
              </p>
              <p className="text-muted-foreground/70 text-sm">
                Keep learning, keep growing! 🌱
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-cyan-100 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-cyan-800/20">
            <CardContent className="p-6">
              <Lightbulb className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
              <h3 className="text-foreground mb-2 font-semibold">
                Did You Know?
              </h3>
              <p className="text-muted-foreground text-sm">{randomFact}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-4 text-center">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <h3 className="text-foreground mb-2 font-semibold">
                  Need Help?
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  Chat with our AI assistant to find the perfect course
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4" />
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-4 text-center">
                <MessageCircle className="mx-auto mb-3 h-8 w-8 text-green-600" />
                <h3 className="text-foreground mb-2 font-semibold">
                  Quick Feedback
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  What were you looking for? Help us improve!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 bg-transparent text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={() => setFeedbackOpen(!feedbackOpen)}
                >
                  Give Feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          {feedbackOpen && (
            <Card className="border-primary/30 border-2 border-dashed">
              <CardContent className="p-4">
                <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                  <h3 className="text-foreground font-semibold">
                    What were you looking for?
                  </h3>
                  <Input
                    type="text"
                    placeholder="e.g., Advanced React course, Python tutorial..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeedbackOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Submit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/faq" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                FAQ
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-border/50 border-t pt-8 text-center">
          <p className="text-muted-foreground/70 text-sm">
            Lost but not forgotten! We're here to help you find your way back to
            learning.
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotFoundSkeleton() {
  return (
    <div className="">
      <div className="mx-auto max-w-6xl animate-pulse space-y-12 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <Skeleton className="mx-auto h-64 w-64 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="mx-auto h-12 w-4/5" />
            <Skeleton className="mx-auto h-6 w-full max-w-md" />
          </div>
          <Card className="border-border/50 bg-card/50 mx-auto max-w-md border-2 border-dashed">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-44" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <Skeleton className="mx-auto mb-6 h-8 w-1/2 max-w-xs" />
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-2 p-4 text-center">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <Skeleton className="h-8 w-8" />
                <div className="w-1/2 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="mx-auto h-4 w-1/2" />
                </div>
              </div>
              <div className="mx-auto mt-4 max-w-xs space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto max-w-4xl">
          <Skeleton className="mx-auto mb-6 h-8 w-2/3 max-w-md" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <Skeleton className="mx-auto mb-6 h-8 w-1/2 max-w-xs" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="space-y-2 p-6 text-center">
              <Skeleton className="mx-auto h-8 w-8 rounded-full" />
              <Skeleton className="mx-auto h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-10 w-1/2" />
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto max-w-6xl">
          <Skeleton className="mx-auto mb-6 h-8 w-3/4 max-w-md" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-32 w-full" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <div className="flex items-center gap-4 pt-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <Skeleton className="mx-auto mb-4 h-7 w-1/2 max-w-xs" />
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <Card>
            <CardContent className="space-y-2 p-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mx-auto h-4 w-1/3" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <Skeleton className="mx-auto h-8 w-8 rounded-full" />
              <Skeleton className="mx-auto h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-2 p-4 text-center">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                  <Skeleton className="mx-auto h-6 w-1/2" />
                  <Skeleton className="mx-auto h-4 w-full" />
                  <Skeleton className="mx-auto h-9 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-border/50 border-t pt-8 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="mx-auto h-5 w-full max-w-sm" />
        </div>
      </div>
    </div>
  );
}
