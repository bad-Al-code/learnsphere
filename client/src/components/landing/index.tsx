'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Award,
  BarChart,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock,
  Github,
  Globe,
  Linkedin,
  MessageSquare,
  PenTool,
  Play,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
}) => {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animation: 'float 6s ease-in-out infinite',
      }}
    >
      {children}
    </div>
  );
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24">
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

      <div className="bg-muted/50 absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full blur-3xl"></div>
      <div
        className="bg-muted/50 absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full blur-3xl"
        style={{ animationDelay: '1s' }}
      ></div>

      <div
        className={`relative z-10 mx-auto max-w-7xl transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="mb-16 space-y-8 text-center">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-xs font-medium tracking-wider"
          >
            <Sparkles className="inline h-3 w-3" />
            THE FUTURE OF LEARNING IS HERE
          </Badge>

          <h1 className="text-foreground text-5xl leading-tight font-bold tracking-tight md:text-7xl lg:text-8xl">
            Your AI-Powered
            <br />
            <span className="text-muted-foreground">Community for</span>
            <br />
            Lifelong Learning
          </h1>

          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">
            Join thousands of learners in collaborative study rooms, get instant
            help from your AI tutor, and master new skills with expert-led
            courses. Transform the way you learn.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
            <Button size="lg" className="group h-12 px-8 text-base">
              Browse Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group h-12 px-8 text-base"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 pt-16 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-foreground text-3xl font-bold md:text-4xl">
                <AnimatedCounter end={50} suffix="K+" />
              </div>
              <div className="text-muted-foreground text-sm">
                Active Learners
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-foreground text-3xl font-bold md:text-4xl">
                <AnimatedCounter end={1200} suffix="+" />
              </div>
              <div className="text-muted-foreground text-sm">
                Expert Courses
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-foreground text-3xl font-bold md:text-4xl">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="text-muted-foreground text-sm">
                Satisfaction Rate
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-foreground text-3xl font-bold md:text-4xl">
                <AnimatedCounter end={24} suffix="/7" />
              </div>
              <div className="text-muted-foreground text-sm">AI Support</div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          <FloatingElement delay={0}>
            <Card className="border-2 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Bot className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  AI-Powered Learning
                </h3>
                <p className="text-muted-foreground text-sm">
                  Personalized study plans and instant answers to any question
                </p>
              </CardContent>
            </Card>
          </FloatingElement>

          <FloatingElement delay={0.2}>
            <Card className="border-2 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Live Study Rooms</h3>
                <p className="text-muted-foreground text-sm">
                  Collaborate in real-time with peers around the globe
                </p>
              </CardContent>
            </Card>
          </FloatingElement>

          <FloatingElement delay={0.4}>
            <Card className="border-2 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <BarChart className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground text-sm">
                  Advanced analytics to monitor your learning journey
                </p>
              </CardContent>
            </Card>
          </FloatingElement>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI Tutor',
      description:
        'Get unstuck instantly with 24/7 AI-powered help for any course question. Your personal learning assistant.',
      benefits: ['Instant answers', 'Smart explanations', 'Always available'],
    },
    {
      icon: Users,
      title: 'Study Rooms',
      description:
        'Join live, collaborative study sessions with peers learning the same topics. Learn together, grow together.',
      benefits: ['Real-time collaboration', 'Screen sharing', 'Voice chat'],
    },
    {
      icon: BarChart,
      title: 'Dynamic Dashboard',
      description:
        'Track your progress with personalized insights and performance analytics. See your growth in real-time.',
      benefits: ['Visual progress', 'Smart insights', 'Goal tracking'],
    },
    {
      icon: MessageSquare,
      title: 'Community Discussions',
      description:
        'Engage in course-specific forums and get answers from instructors and peers. Never learn alone.',
      benefits: ['Expert answers', 'Peer support', 'Rich discussions'],
    },
    {
      icon: Star,
      title: 'Mentorship Programs',
      description:
        'Apply for one-on-one mentorship with industry experts to accelerate your growth and career.',
      benefits: ['1-on-1 guidance', 'Industry experts', 'Career advice'],
    },
    {
      icon: PenTool,
      title: 'AI Writing Assistant',
      description:
        'Get intelligent feedback on assignments and improve your writing with AI-powered suggestions.',
      benefits: ['Grammar checks', 'Style improvement', 'Plagiarism detection'],
    },
  ];

  return (
    <section className="w-full rounded-lg px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="inline h-3 w-3" />
            POWERFUL FEATURES
          </Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            A complete learning ecosystem designed for the modern student
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader>
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors">
                  <feature.icon className="text-primary h-7 w-7" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-center text-sm"
                    >
                      <CheckCircle2 className="text-primary h-4 w-4" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: BookOpen,
      title: 'Browse & Enroll',
      description:
        'Explore our vast library of courses and find the perfect match for your goals',
    },
    {
      icon: Target,
      title: 'Learn & Practice',
      description:
        'Follow structured lessons with hands-on projects and real-world applications',
    },
    {
      icon: Users,
      title: 'Connect & Collaborate',
      description:
        'Join study rooms and discuss with peers to deepen your understanding',
    },
    {
      icon: Award,
      title: 'Achieve & Certify',
      description:
        'Earn certificates and showcase your new skills to the world',
    },
  ];

  return (
    <section className="bg-background w-full px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <Badge variant="secondary" className="mb-4">
            <Target className="inline h-3 w-3" />
            SIMPLE PROCESS
          </Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
            How It Works
          </h2>
          <p className="text-muted-foreground text-xl">
            Start learning in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="space-y-4 text-center">
                <div className="relative inline-block">
                  <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl">
                    <step.icon className="text-primary h-10 w-10" />
                  </div>
                  <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="bg-border absolute top-10 left-full hidden h-0.5 w-full -translate-x-1/2 lg:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const testimonials = [
    {
      name: 'Jessica L.',
      role: 'Full-Stack Student',
      avatar: 'JL',
      content:
        "The AI study planner and live study rooms are game-changers. I'm learning faster and feel more connected than ever. The community support is incredible!",
      rating: 5,
    },
    {
      name: 'David C.',
      role: 'Senior Data Scientist & Instructor',
      avatar: 'DC',
      content:
        "LearnSphere's analytics dashboard gives me incredible insight into where my students are struggling. It's made me a better teacher and helped improve course outcomes.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: TrendingUp, value: '95%', label: 'Course Completion Rate' },
    { icon: Clock, value: '10M+', label: 'Hours of Learning' },
    { icon: Globe, value: '180+', label: 'Countries Reached' },
    { icon: Shield, value: '100%', label: 'Secure Platform' },
  ];

  return (
    <section className="w-full px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="inline h-3 w-3" />
            TESTIMONIALS
          </Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
            Loved by Students and Instructors Alike
          </h2>
          <p className="text-muted-foreground text-xl">
            Join thousands of successful learners worldwide
          </p>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 p-4 text-center">
              <stat.icon className="text-primary mx-auto mb-3 h-8 w-8" />
              <div className="mb-1 text-3xl font-bold">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-2 transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-primary text-primary h-4 w-4"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="relative w-full overflow-hidden px-6 py-32">
      <div className="from-muted/30 to-muted/5 absolute inset-0 rounded-lg bg-gradient-to-br via-transparent"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="bg-primary/10 mb-8 inline-block rounded-full p-4">
          <Sparkles className="text-primary h-12 w-12" />
        </div>

        <h2 className="text-foreground mb-6 text-5xl font-bold md:text-6xl">
          Ready to Start Your
          <br />
          Learning Journey?
        </h2>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
          Sign up for free and get instant access to our community, AI tools,
          and thousands of expert-led courses.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="group h-14 px-10 text-base">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-base">
            Talk to Sales
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-sm">
          No credit card required • Free forever • Cancel anytime
        </p>
      </div>
    </section>
  );
};

const Footer = () => {
  const links = {
    platform: [
      { label: 'Courses', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Mentorship', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
    resources: [
      { label: 'Blog', href: '#' },
      { label: 'About Us', href: '#' },
      { label: 'Become an Instructor', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
    company: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  };

  return (
    <footer className="bg-muted/5 w-full border-t">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-foreground text-2xl font-bold">LearnSphere</h3>
            <p className="text-muted-foreground max-w-sm">
              Empowering lifelong learners with AI-powered tools and a vibrant
              community. Learn, collaborate, and grow with us.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Platform</h4>
            <ul className="space-y-3">
              {links.platform.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LearnSphere. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for learners worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LearnSphereLanding() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
}
