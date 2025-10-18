'use client';

import WaitlistPage from '@/app/waitlist/page';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  Book,
  Brain,
  Check,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gauge,
  Play,
  Server,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '../shared/logo';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const architectureFeatures = [
    {
      icon: <Server className="h-5 w-5" />,
      title: 'Microservices Architecture',
      description:
        'Decoupled services for auth, courses, enrollment, video processing, and AI-powered Q&A',
      tech: ['Node.js', 'TypeScript', 'Go', 'Python'],
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: 'Polyglot Persistence',
      description:
        'PostgreSQL for relational data, Redis for caching, RabbitMQ for messaging, Pinecone for vectors',
      tech: ['PostgreSQL', 'Redis', 'RabbitMQ', 'Pinecone'],
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: 'Cloud-Native & IaC',
      description:
        'Kubernetes orchestration with Helm charts, Terraform for AWS infrastructure, GitHub Actions CI/CD',
      tech: ['K8s', 'Terraform', 'AWS', 'Helm'],
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: 'AI Integration',
      description:
        'LangChain-powered Q&A assistant, auto-generated content from transcripts using LLMs',
      tech: ['LangChain', 'OpenAI', 'Vector DB'],
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Video Pipeline',
      description:
        'Event-driven video processing with FFmpeg transcoding to HLS adaptive bitrate streams',
      tech: ['FFmpeg', 'HLS', 'Event-Driven'],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Security First',
      description:
        'JWT-based authentication, token blacklisting, isolated service boundaries, secure by design',
      tech: ['JWT', 'OAuth', 'RBAC'],
    },
  ];

  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Adaptive Video Streaming',
      description:
        'Watch courses on any device with automatic quality adjustment based on your connection speed.',
      benefits: ['HLS streaming', 'Auto quality', 'Offline mode'],
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI Learning Assistant',
      description:
        'Ask questions about course content and get instant, contextual answers from our intelligent assistant.',
      benefits: ['24/7 availability', 'Context-aware', 'Multi-language'],
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Rich Course Builder',
      description:
        'Create engaging courses with lessons, quizzes, assignments, and interactive multimedia content.',
      benefits: ['Drag & drop', 'Templates', 'Analytics'],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Collaborative Learning',
      description:
        'Join study groups, participate in discussions, and learn together with peers worldwide.',
      benefits: ['Forums', 'Live sessions', 'Peer review'],
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Gamification',
      description:
        'Earn badges, track progress, and compete on leaderboards as you master new skills.',
      benefits: ['Achievements', 'Streaks', 'Rewards'],
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description:
        'Deep insights into learning patterns, progress tracking, and personalized recommendations.',
      benefits: ['Progress tracking', 'Insights', 'Reports'],
    },
  ];

  const Building = (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  );

  const useCases = [
    {
      role: 'students',
      title: 'For Students',
      description: 'Learn at your own pace with AI assistance',
      icon: <Users className="h-5 w-5" />,
      features: [
        'Access courses anywhere, anytime',
        'Get instant help from AI assistant',
        'Track your learning progress',
        'Earn certificates and badges',
        'Join community discussions',
      ],
    },
    {
      role: 'instructors',
      title: 'For Instructors',
      description: 'Create and manage courses effortlessly',
      icon: <Book className="h-5 w-5" />,
      features: [
        'Easy-to-use course builder',
        'Auto-generate video metadata',
        'Real-time student analytics',
        'Automated grading system',
        'Revenue sharing program',
      ],
    },
    {
      role: 'organizations',
      title: 'For Organizations',
      description: 'Scale training across your company',
      icon: <Building className="h-5 w-5" />,
      features: [
        'Custom branding options',
        'SSO integration',
        'Advanced user management',
        'Compliance reporting',
        'Dedicated support',
      ],
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime', sublabel: 'Cloud infrastructure' },
    { value: '<100ms', label: 'Response Time', sublabel: 'API latency' },
    { value: '10K+', label: 'Concurrent Users', sublabel: 'Scalable design' },
    { value: '8', label: 'Microservices', sublabel: 'Polyglot stack' },
  ];

  const testimonials = [
    {
      quote:
        "The AI assistant is a game-changer. It's like having a personal tutor available 24/7.",
      author: 'Sarah Chen',
      role: 'Computer Science Student',
      avatar: 'SC',
    },
    {
      quote:
        'Building courses has never been easier. The video processing pipeline is incredibly fast.',
      author: 'Dr. Michael Roberts',
      role: 'Online Instructor',
      avatar: 'MR',
    },
    {
      quote:
        'The architecture is impressive. We scaled from 100 to 10,000 users without any issues.',
      author: 'Alex Kumar',
      role: 'CTO, EdTech Startup',
      avatar: 'AK',
    },
  ];

  const faqs = [
    {
      question:
        'What makes LearnSphere different from other learning platforms?',
      answer:
        'LearnSphere is built on a modern microservices architecture with AI integration, adaptive video streaming, and cloud-native infrastructure. Our polyglot approach uses the best tools for each service, ensuring optimal performance and scalability.',
    },
    {
      question: 'How does the AI learning assistant work?',
      answer:
        'Our AI assistant uses LangChain and vector databases to understand course content. It can answer questions, provide explanations, and offer personalized learning recommendations based on your progress and learning style.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We implement JWT-based authentication, encrypted data transmission, isolated service boundaries, and follow industry best practices for security. Your data is stored securely on AWS infrastructure.',
    },
    {
      question: 'Can I access courses offline?',
      answer:
        'Yes! Our mobile app allows you to download course videos and materials for offline viewing. Progress is automatically synced when you reconnect.',
    },
    {
      question: 'What video formats are supported?',
      answer:
        'We support all major video formats. Our processing pipeline automatically transcodes videos to HLS format with adaptive bitrate streaming for optimal viewing experience on any device.',
    },
  ];

  return (
    <div className="">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" /> */}
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="var(--border)"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div
          className="bg-primary/5 absolute top-0 right-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div
          className="bg-primary/3 absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{
            transform: `translateY(${-scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </div>

      {/* <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Book className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-xl font-bold">LearnSphere</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Architecture
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav> */}

      <section className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI & Cloud-Native Architecture
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Transform Learning with{' '}
            <span className="from-foreground to-foreground/50 bg-gradient-to-r bg-clip-text text-transparent">
              Next-Gen Technology
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
            Experience a polyglot microservice platform combining adaptive video
            streaming, AI-powered assistance, and seamless course management in
            one powerful interface.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Interactive Demo Card */}
          <Card className="mt-12 w-full max-w-4xl">
            <CardContent className="p-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <svg className="h-full w-full" viewBox="0 0 800 450">
                  <defs>
                    <linearGradient
                      id="lineGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity="0.5"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>

                  <g stroke="url(#lineGrad)" strokeWidth="2" fill="none">
                    <path d="M 100,225 Q 250,100 400,225" opacity="0.6">
                      <animate
                        attributeName="d"
                        values="M 100,225 Q 250,100 400,225; M 100,225 Q 250,350 400,225; M 100,225 Q 250,100 400,225"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path d="M 400,225 Q 550,100 700,225" opacity="0.6">
                      <animate
                        attributeName="d"
                        values="M 400,225 Q 550,100 700,225; M 400,225 Q 550,350 700,225; M 400,225 Q 550,100 700,225"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>

                  <g>
                    <circle
                      cx="100"
                      cy="225"
                      r="40"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="100"
                      y="235"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="32"
                    >
                      🔐
                    </text>

                    <circle
                      cx="250"
                      cy="125"
                      r="35"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="250"
                      y="135"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="28"
                    >
                      📚
                    </text>

                    <circle
                      cx="250"
                      cy="325"
                      r="35"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="250"
                      y="335"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="28"
                    >
                      🎥
                    </text>

                    <circle
                      cx="400"
                      cy="225"
                      r="45"
                      fill="var(--primary)"
                      fillOpacity="0.1"
                      stroke="var(--primary)"
                      strokeWidth="3"
                    >
                      <animate
                        attributeName="r"
                        values="45;50;45"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x="400"
                      y="235"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="36"
                    >
                      🧠
                    </text>

                    <circle
                      cx="550"
                      cy="125"
                      r="35"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="550"
                      y="135"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="28"
                    >
                      👥
                    </text>

                    <circle
                      cx="550"
                      cy="325"
                      r="35"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="550"
                      y="335"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="28"
                    >
                      🔔
                    </text>

                    <circle
                      cx="700"
                      cy="225"
                      r="40"
                      fill="var(--background)"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <text
                      x="700"
                      y="235"
                      textAnchor="middle"
                      fill="var(--foreground)"
                      fontSize="32"
                    >
                      ☁️
                    </text>
                  </g>

                  <text
                    x="100"
                    y="285"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Auth
                  </text>
                  <text
                    x="250"
                    y="90"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Courses
                  </text>
                  <text
                    x="250"
                    y="360"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Video
                  </text>
                  <text
                    x="400"
                    y="285"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    AI Assistant
                  </text>
                  <text
                    x="550"
                    y="90"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Users
                  </text>
                  <text
                    x="550"
                    y="360"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Notifications
                  </text>
                  <text
                    x="700"
                    y="285"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                    fontWeight="500"
                  >
                    Gateway
                  </text>
                </svg>

                <div className="absolute right-4 bottom-4 left-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span>8 Services Running</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1.5">
                      <Database className="h-3 w-3" />
                      <span>8 Databases</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3 w-3" />
                      <span>Cloud-Native</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold tracking-tight md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1 text-sm font-medium">
                  {stat.label}
                </div>
                <div className="text-muted-foreground mt-0.5 text-xs">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Whether you're a student, instructor, or organization, LearnSphere
              adapts to your needs
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-3">
              {useCases.map((useCase) => (
                <TabsTrigger
                  key={useCase.role}
                  value={useCase.role}
                  className="gap-2"
                >
                  {useCase.icon}
                  <span className="hidden sm:inline">{useCase.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {useCases.map((useCase) => (
              <TabsContent key={useCase.role} value={useCase.role}>
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        {useCase.icon}
                      </div>
                      <div>
                        <CardTitle>{useCase.title}</CardTitle>
                        <CardDescription>{useCase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {useCase.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="features" className="container py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Comprehensive features designed to enhance learning and teaching
              experiences
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="group transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit, bidx) => (
                      <Badge key={bidx} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="container py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Code2 className="h-3.5 w-3.5" />
              Technical Architecture
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Built on Modern Infrastructure
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              A polyglot microservice architecture designed for scale,
              resilience, and performance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {architectureFeatures.map((feature, idx) => (
              <Card key={idx} className="relative overflow-hidden">
                <div className="bg-primary/5 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full" />
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {feature.tech.map((tech, tidx) => (
                      <Badge
                        key={tidx}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Sparkles className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Portfolio Showcase</CardTitle>
                  <CardDescription>
                    This project demonstrates expertise across multiple domains
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium">Backend</div>
                  <div className="text-muted-foreground text-xs">
                    Node.js, Go, Python
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium">DevOps</div>
                  <div className="text-muted-foreground text-xs">
                    K8s, Terraform, CI/CD
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium">Frontend</div>
                  <div className="text-muted-foreground text-xs">
                    React, TypeScript, tRPC
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium">AI/ML</div>
                  <div className="text-muted-foreground text-xs">
                    LangChain, Vector DB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="testimonials" className="container py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Loved by Students & Instructors
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-primary text-primary h-4 w-4"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {testimonial.author}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about LearnSphere
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <WaitlistPage />
      {/* <section className="container py-24">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2">
            <CardHeader className="space-y-4 pb-8 text-center">
              <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Sparkles className="text-primary-foreground h-8 w-8" />
              </div>
              <div>
                <CardTitle className="mb-3 text-3xl md:text-4xl">
                  Join the Waitlist
                </CardTitle>
                <CardDescription className="text-base">
                  Be among the first to experience the future of learning. Get
                  early access, exclusive benefits, and help shape the platform.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full flex-1 rounded-md border px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button size="lg" className="whitespace-nowrap sm:w-auto">
                    Join Waitlist
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="text-muted-foreground flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Early access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Exclusive perks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>No spam</span>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 text-center sm:grid-cols-3">
                  <div>
                    <div className="text-2xl font-bold">2,847</div>
                    <div className="text-muted-foreground text-xs">
                      People waiting
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Q2 2025</div>
                    <div className="text-muted-foreground text-xs">
                      Expected launch
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100+</div>
                    <div className="text-muted-foreground text-xs">
                      Courses ready
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      <section className="container py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Powered by Modern Technology
            </h2>
            <p className="text-muted-foreground">
              Industry-leading tools and frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: 'Node.js', icon: <NodeIcon /> },
              { name: 'TypeScript', icon: <TypeScriptIcon /> },
              { name: 'React', icon: '⚛' },
              { name: 'Go', icon: <GoIcon /> },
              { name: 'Python', icon: '🐍' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'Redis', icon: '◆' },
              { name: 'Kubernetes', icon: '☸' },
              { name: 'Docker', icon: '🐳' },
              { name: 'Terraform', icon: 'TF' },
              { name: 'AWS', icon: '☁' },
              { name: 'RabbitMQ', icon: '🐰' },
            ].map((tech, idx) => (
              <Card
                key={idx}
                className="flex flex-col items-center justify-center p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 text-3xl">{tech.icon}</div>
                <div className="text-center text-sm font-medium">
                  {tech.name}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of students and instructors who are already
            experiencing the future of online education.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="text-base">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Logo variant="icon" />
                </div>
                <span className="text-lg font-bold">LearnSphere</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xs text-sm">
                A modern e-learning platform built with microservices, AI, and
                cloud-native technologies.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Product</h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Resources</h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Company</h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <p>© 2025 LearnSphere. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Github = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const NodeIcon = ({
  className = 'w-8 h-8 text-foreground',
  title = 'Node.js',
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    preserveAspectRatio="xMidYMid"
    fill="currentColor"
  >
    <path d="M14.656.427c.8-.453 1.82-.455 2.6 0L29.2 7.16c.747.42 1.247 1.253 1.24 2.114v13.5c.005.897-.544 1.748-1.332 2.16l-11.88 6.702a2.6 2.6 0 0 1-2.639-.073l-3.565-2.06c-.243-.145-.516-.26-.688-.495.152-.204.422-.23.642-.32.496-.158.95-.4 1.406-.656.115-.08.256-.05.366.022l3.04 1.758c.217.125.437-.04.623-.145l11.665-6.583c.144-.07.224-.222.212-.38V9.334c.016-.18-.087-.344-.25-.417L16.19 2.244a.41.41 0 0 0-.465-.001L3.892 8.93c-.16.073-.27.235-.25.415v13.37c-.014.158.07.307.215.375l3.162 1.785c.594.32 1.323.5 1.977.265a1.5 1.5 0 0 0 .971-1.409l.003-13.29c-.014-.197.172-.36.363-.34h1.52c.2-.005.357.207.33.405L12.18 23.88c.001 1.188-.487 2.48-1.586 3.063-1.354.7-3.028.553-4.366-.12l-3.4-1.88c-.8-.4-1.337-1.264-1.332-2.16v-13.5a2.46 2.46 0 0 1 1.282-2.141L14.656.427zM18.1 9.785c1.727-.1 3.576-.066 5.13.785 1.203.652 1.87 2.02 1.892 3.358-.034.18-.222.28-.394.267-.5-.001-1.002.007-1.504-.003-.213.008-.336-.188-.363-.376-.144-.64-.493-1.273-1.095-1.582-.924-.463-1.996-.44-3.004-.43-.736.04-1.527.103-2.15.535-.48.328-.624 1-.453 1.522.16.383.603.506.964.62 2.082.544 4.287.5 6.33 1.207.845.292 1.672.86 1.962 1.745.378 1.186.213 2.604-.63 3.556-.684.784-1.68 1.2-2.675 1.442-1.323.295-2.695.302-4.038.17-1.263-.144-2.577-.476-3.552-1.336-.834-.724-1.24-1.852-1.2-2.94.01-.184.193-.312.37-.297h1.5c.202-.014.35.16.36.35.093.6.322 1.25.854 1.6 1.026.662 2.313.616 3.487.635.973-.043 2.065-.056 2.86-.7.42-.367.543-.98.43-1.508-.123-.446-.6-.653-1-.8-2.055-.65-4.285-.414-6.32-1.15-.826-.292-1.625-.844-1.942-1.693-.443-1.2-.24-2.687.693-3.607.9-.915 2.22-1.268 3.47-1.394z" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 30 30"
    fill="currentColor"
  >
    <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
  </svg>
);

const GoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <path d="M 22.462891 15.003906 C 21.863562 15.016969 21.255125 15.082359 20.640625 15.193359 C 17.634625 15.742359 15.176312 17.284797 13.320312 19.716797 C 11.595313 21.964797 10.759609 24.526953 11.099609 27.376953 C 11.387609 29.781953 12.485922 31.715688 14.419922 33.179688 C 16.510922 34.748688 18.889172 35.244297 21.451172 34.904297 C 24.562172 34.486297 27.019344 32.943938 28.902344 30.460938 C 28.950344 30.397938 28.98525 30.328625 29.03125 30.265625 C 29.51625 31.165625 30.168375 31.974688 30.984375 32.679688 C 32.831375 34.262687 35.020875 34.948953 37.421875 35.001953 C 38.107875 34.922953 38.81825 34.896625 39.53125 34.765625 C 41.98425 34.264625 44.121281 33.156672 45.863281 31.388672 C 48.316281 28.905672 49.346437 26.002406 48.898438 22.441406 C 48.555437 19.908406 47.261734 17.983594 45.177734 16.558594 C 42.882734 15.001594 40.349203 14.739844 37.658203 15.214844 C 34.536203 15.765844 32.224688 17.075078 30.304688 19.580078 C 29.658687 18.328078 28.768359 17.267609 27.568359 16.474609 C 25.980609 15.396109 24.260875 14.964719 22.462891 15.003906 z M 4 20 A 1.0001 1.0001 0 1 0 4 22 L 8 22 A 1.0001 1.0001 0 1 0 8 20 L 4 20 z M 22.134766 20.011719 C 22.734971 20.038039 23.345266 20.193922 23.962891 20.498047 C 24.511891 20.759047 24.799406 21.048188 25.191406 21.492188 C 25.531406 21.884187 25.557219 21.858906 25.949219 21.753906 C 27.262219 21.414906 28.261844 21.140125 29.464844 20.828125 C 29.007844 21.595125 28.760625 22.155422 28.515625 22.982422 L 21.798828 22.982422 C 21.406828 22.982422 21.223531 23.243391 21.144531 23.400391 C 20.778531 24.080391 20.1525 25.44 19.8125 26.25 C 19.6305 26.695 19.759594 27.035156 20.308594 27.035156 L 25.353516 27.035156 C 25.092516 27.401156 24.770156 27.948328 24.535156 28.236328 C 23.359156 29.569328 21.868797 30.198891 20.091797 29.962891 C 18.026797 29.674891 16.5885 27.948422 16.5625 25.857422 C 16.5365 23.739422 17.452469 22.040625 19.230469 20.890625 C 20.161719 20.28625 21.134424 19.967852 22.134766 20.011719 z M 39.410156 20.207031 C 41.50291 20.138521 43.346828 21.521578 43.751953 23.751953 C 43.802953 24.008953 43.802125 24.265609 43.828125 24.599609 C 43.699125 26.813609 42.594547 28.461578 40.560547 29.517578 C 39.196547 30.212578 37.779281 30.289875 36.363281 29.671875 C 34.510281 28.847875 33.532094 26.814641 33.996094 24.806641 C 34.562094 22.386641 36.107953 20.867172 38.501953 20.326172 C 38.807578 20.255422 39.111191 20.216818 39.410156 20.207031 z M 1 24 A 1.0001 1.0001 0 1 0 1 26 L 7 26 A 1.0001 1.0001 0 1 0 7 24 L 1 24 z M 4 28 A 1.0001 1.0001 0 1 0 4 30 L 6 30 A 1.0001 1.0001 0 1 0 6 28 L 4 28 z"></path>
  </svg>
);
const TypeScriptIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    fill="currentColor"
    y="0px"
    width="32"
    height="32"
    viewBox="0 0 50 50"
  >
    <path d="M45,4H5C4.447,4,4,4.448,4,5v40c0,0.552,0.447,1,1,1h40c0.553,0,1-0.448,1-1V5C46,4.448,45.553,4,45,4z M29,26.445h-5V42h-4	V26.445h-5V23h14V26.445z M30.121,41.112v-4.158c0,0,2.271,1.712,4.996,1.712c2.725,0,2.62-1.782,2.62-2.026	c0-2.586-7.721-2.586-7.721-8.315c0-7.791,11.25-4.717,11.25-4.717l-0.14,3.704c0,0-1.887-1.258-4.018-1.258s-2.9,1.013-2.9,2.096	c0,2.795,7.791,2.516,7.791,8.141C42,44.955,30.121,41.112,30.121,41.112z"></path>
  </svg>
);

export default HomePage;
