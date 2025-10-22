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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Book,
  Calendar,
  Check,
  ChevronRight,
  Code2,
  Database,
  DollarSign,
  Gauge,
  Gift,
  Globe,
  Lock,
  Mail,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Video,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Logo } from '../shared/logo';
import { VideoPlayer } from '../video-player';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

interface TypingEffectProps {
  texts: string[];
  speed?: number;
}

interface Service {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  description: string;
}

interface SuccessStoryProps {
  story: {
    name: string;
    avatar: string;
    role: string;
    story: string;
    metrics: Array<{
      value: string;
      label: string;
    }>;
  };
}

interface PricingCardProps {
  plan: {
    name: string;
    price: number;
    description: string;
    popular?: boolean;
    features: string[];
  };
}

interface CountdownTimerProps {
  targetDate: string;
}

interface IconProps {
  className?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | undefined;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const TypingEffect: React.FC<TypingEffectProps> = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex % texts.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => prev + 1);
          } else {
            setDisplayText(displayText.slice(0, -1));
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts, speed]);

  return (
    <span className="inline-block min-w-[200px]">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="bg-primary ml-1 inline-block h-8 w-0.5 align-middle"
      />
    </span>
  );
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="bg-primary/20 absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const ArchitectureDiagram = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: 'auth',
      name: 'Auth',
      icon: '🔐',
      x: 100,
      y: 225,
      description: 'JWT Authentication',
    },
    {
      id: 'course',
      name: 'Courses',
      icon: '📚',
      x: 250,
      y: 125,
      description: 'Course Management',
    },
    {
      id: 'video',
      name: 'Video',
      icon: '🎥',
      x: 250,
      y: 325,
      description: 'HLS Processing',
    },
    {
      id: 'ai',
      name: 'AI Q&A',
      icon: '🧠',
      x: 400,
      y: 225,
      description: 'LangChain Assistant',
    },
    {
      id: 'user',
      name: 'Users',
      icon: '👥',
      x: 550,
      y: 125,
      description: 'Profile Management',
    },
    {
      id: 'notif',
      name: 'Notifications',
      icon: '🔔',
      x: 550,
      y: 325,
      description: 'Event-driven',
    },
    {
      id: 'gateway',
      name: 'Gateway',
      icon: '☁️',
      x: 700,
      y: 225,
      description: 'API Gateway',
    },
  ];

  const connections: [string, string][] = [
    ['auth', 'course'],
    ['auth', 'video'],
    ['course', 'ai'],
    ['video', 'ai'],
    ['ai', 'user'],
    ['ai', 'notif'],
    ['user', 'gateway'],
    ['notif', 'gateway'],
  ];

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border">
      <svg className="h-full w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {connections.map(([from, to], idx) => {
          const fromService = services.find((s) => s.id === from);
          const toService = services.find((s) => s.id === to);
          if (!fromService || !toService) return null;

          return (
            <motion.line
              key={idx}
              x1={fromService.x}
              y1={fromService.y}
              x2={toService.x}
              y2={toService.y}
              stroke="url(#lineGrad)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: idx * 0.1 }}
            />
          );
        })}
      </svg>

      {services.map((service, idx) => (
        <motion.div
          key={service.id}
          className="absolute"
          style={{ left: service.x - 30, top: service.y - 30 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: idx * 0.1, type: 'spring' }}
          onHoverStart={() => setHoveredService(service.id)}
          onHoverEnd={() => setHoveredService(null)}
        >
          <motion.div
            className="bg-background border-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 text-2xl"
            whileHover={{ scale: 1.2, borderWidth: 3 }}
          >
            {service.icon}
          </motion.div>
          <div className="mt-1 text-center text-xs font-medium">
            {service.name}
          </div>

          <AnimatePresence>
            {hoveredService === service.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-popover absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md border px-3 py-2 whitespace-nowrap shadow-lg"
              >
                <p className="text-sm">{service.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <div className="absolute right-4 bottom-4 left-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>All Services Running</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3" />
          <span>4 Databases Active</span>
        </div>
      </div>
    </div>
  );
};

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      user: 'Sarah',
      action: 'completed',
      course: 'React Advanced',
      time: '2m ago',
    },
    {
      id: 2,
      user: 'Michael',
      action: 'enrolled in',
      course: 'Python AI',
      time: '5m ago',
    },
    {
      id: 3,
      user: 'Emma',
      action: 'started',
      course: 'Node.js Microservices',
      time: '8m ago',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: ['Alex', 'Jordan', 'Taylor', 'Morgan'][
          Math.floor(Math.random() * 4)
        ],
        action: ['completed', 'enrolled in', 'started'][
          Math.floor(Math.random() * 3)
        ],
        course: ['TypeScript Pro', 'AWS Mastery', 'Docker Deep Dive'][
          Math.floor(Math.random() * 3)
        ],
        time: 'just now',
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-muted/30 flex items-center gap-3 rounded-lg p-3"
          >
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
              {activity.user[0]}
            </div>
            <div className="flex-1 text-sm">
              <span className="font-medium">{activity.user}</span>{' '}
              <span className="text-muted-foreground">{activity.action}</span>{' '}
              <span className="font-medium">{activity.course}</span>
            </div>
            <span className="text-muted-foreground text-xs">
              {activity.time}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// const ComparisonSlider = () => {
//   const [position, setPosition] = useState(50);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleMove = (e: React.MouseEvent<HTMLElement>) => {
//     if (!isDragging) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const percentage = (x / rect.width) * 100;
//     setPosition(Math.max(0, Math.min(100, percentage)));
//   };

//   return (
//     <div
//       className="relative h-64 w-full cursor-col-resize overflow-hidden rounded-lg border select-none"
//       onMouseMove={handleMove}
//       onMouseDown={() => setIsDragging(true)}
//       onMouseUp={() => setIsDragging(false)}
//       onMouseLeave={() => setIsDragging(false)}
//     >
//       <div className="bg-muted absolute inset-0 flex items-center justify-center">
//         <div className="text-center">
//           <X className="text-destructive mx-auto mb-2 h-16 w-16" />
//           <p className="font-semibold">Traditional LMS</p>
//           <p className="text-muted-foreground text-sm">
//             Slow, Monolithic, Limited
//           </p>
//         </div>
//       </div>

//       <motion.div
//         className="bg-primary/10 absolute inset-0 flex items-center justify-center"
//         style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
//       >
//         <div className="text-center">
//           <Check className="text-primary mx-auto mb-2 h-16 w-16" />
//           <p className="font-semibold">LearnSphere</p>
//           <p className="text-muted-foreground text-sm">
//             Fast, Scalable, AI-Powered
//           </p>
//         </div>
//       </motion.div>

//       <motion.div
//         className="bg-primary absolute top-0 bottom-0 w-1 cursor-col-resize"
//         style={{ left: `${position}%` }}
//         drag="x"
//         dragConstraints={{ left: 0, right: 0 }}
//         dragElastic={0}
//         dragMomentum={false}
//       >
//         <div className="bg-primary absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg">
//           <ChevronRight className="text-primary-foreground h-4 w-4" />
//         </div>
//       </motion.div>
//     </div>
//   );
// };

const ComparisonTable = () => {
  const features = [
    { name: 'AI Learning Assistant', us: true, other: false },
    { name: 'Adaptive Video Streaming', us: true, other: false },
    { name: 'Microservices Architecture', us: true, other: false },
    { name: 'Real-time Notifications', us: true, other: true },
    { name: 'Course Management', us: true, other: true },
    { name: 'Cloud-Native', us: true, other: false },
    { name: 'Auto Video Transcoding', us: true, other: false },
    { name: 'API-First Design', us: true, other: false },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Feature</th>
            <th className="p-4">LearnSphere</th>
            <th className="p-4">Others</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="border-b"
            >
              <td className="p-4">{feature.name}</td>
              <td className="p-4 text-center">
                {feature.us ? (
                  <Check className="text-primary mx-auto h-5 w-5" />
                ) : (
                  <X className="text-muted-foreground mx-auto h-5 w-5" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.other ? (
                  <Check className="text-muted-foreground mx-auto h-5 w-5" />
                ) : (
                  <X className="text-muted-foreground mx-auto h-5 w-5" />
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SuccessStory: React.FC<SuccessStoryProps> = ({ story }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full">
        <CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
              {story.avatar}
            </div>
            <div>
              <CardTitle className="text-base">{story.name}</CardTitle>
              <CardDescription className="text-sm">
                {story.role}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">{story.story}</p>
          <div className="grid grid-cols-3 gap-4">
            {story.metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <div className="text-primary text-2xl font-bold">
                  {metric.value}
                </div>
                <div className="text-muted-foreground text-xs">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ROICalculator = () => {
  const [students, setStudents] = useState(100);
  const [pricePerStudent, setPricePerStudent] = useState(50);

  const monthlySavings = students * pricePerStudent * 0.3;
  const yearlySavings = monthlySavings * 12;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Calculator</CardTitle>
        <CardDescription>
          See how much you can save with LearnSphere
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Number of Students</label>
            <span className="text-muted-foreground text-sm">{students}</span>
          </div>
          <input
            type="range"
            min="10"
            max="10000"
            value={students}
            onChange={(e) => setStudents(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              Price per Student/Month
            </label>
            <span className="text-muted-foreground text-sm">
              ${pricePerStudent}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={pricePerStudent}
            onChange={(e) => setPricePerStudent(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Monthly Savings</span>
            <motion.span
              key={monthlySavings}
              initial={{ scale: 1.2, color: 'var(--primary)' }}
              animate={{ scale: 1, color: 'var(--foreground)' }}
              className="text-2xl font-bold"
            >
              ${monthlySavings.toFixed(0)}
            </motion.span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Yearly Savings</span>
            <motion.span
              key={yearlySavings}
              initial={{ scale: 1.2, color: 'var(--primary)' }}
              animate={{ scale: 1, color: 'var(--foreground)' }}
              className="text-primary text-3xl font-bold"
            >
              ${yearlySavings.toFixed(0)}
            </motion.span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemStatus = () => {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: 99.99 },
    { name: 'Auth Service', status: 'operational', uptime: 99.98 },
    { name: 'Video Processing', status: 'operational', uptime: 99.95 },
    { name: 'AI Assistant', status: 'operational', uptime: 99.92 },
  ];

  return (
    <div className="space-y-3">
      {services.map((service, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="h-2 w-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
            />
            <span className="text-sm font-medium">{service.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {service.uptime}% uptime
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {service.status}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);

  const code = `// AI-Powered Q&A Integration
import { LangChain } from '@langchain/core';

const assistant = new LangChain({
  model: 'gpt-4',
  vectorStore: 'pinecone',
  context: courseContent
});

const answer = await assistant.query(
  "Explain microservices architecture"
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-muted/30 overflow-x-auto rounded-lg border p-4 text-sm shadow-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        className="absolute top-2 right-2"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : 'Copy'}
      </Button>
    </div>
  );
};

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="h-full">
      <Card
        className={`h-full ${plan.popular ? 'border-primary border-2 pt-0' : ''}`}
      >
        {plan.popular && (
          <div className="bg-primary text-primary-foreground rounded-t-lg py-1 text-center text-sm font-medium">
            Most Popular
          </div>
        )}
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant={plan.popular ? 'default' : 'outline'}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LearningTimeline = () => {
  const steps = [
    {
      title: 'Sign Up',
      description: 'Create your account in 30 seconds',
      icon: <User className="h-5 w-5" />,
    },
    {
      title: 'Choose Path',
      description: 'Select your learning goals',
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: 'Start Learning',
      description: 'Access curated courses',
      icon: <Book className="h-5 w-5" />,
    },
    {
      title: 'Get Certified',
      description: 'Earn recognized certificates',
      icon: <Award className="h-5 w-5" />,
    },
  ];

  return (
    <div className="relative">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.2 }}
          viewport={{ once: true }}
          className="mb-8 flex gap-4 last:mb-0"
        >
          <div className="relative">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              {step.icon}
            </div>
            {idx < steps.length - 1 && (
              <div className="bg-border absolute top-12 left-6 h-8 w-0.5" />
            )}
          </div>
          <div className="flex-1 pt-2">
            <h4 className="mb-1 font-semibold">{step.title}</h4>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const User: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Stay Updated
        </CardTitle>
        <CardDescription>
          Get the latest updates and exclusive content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubmit}>Subscribe</Button>
        </div>
        <AnimatePresence>
          {subscribed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-primary mt-3 flex items-center gap-2 text-sm"
            >
              <Check className="h-4 w-4" />
              Thanks for subscribing!
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-primary/10 rounded-lg p-4">
            <motion.div
              key={value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold"
            >
              {value}
            </motion.div>
            <div className="text-muted-foreground mt-1 text-xs uppercase">
              {unit}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TrustBadges = () => {
  const badges = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'SOC 2 Certified',
      subtitle: 'Enterprise Security',
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'GDPR Compliant',
      subtitle: 'Data Protection',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'ISO 27001',
      subtitle: 'Information Security',
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: '99.9% Uptime',
      subtitle: 'Reliability Guaranteed',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {badges.map((badge, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card className="p-6 text-center">
            <div className="text-primary mb-3 flex justify-center">
              {badge.icon}
            </div>
            <h4 className="mb-1 text-sm font-semibold">{badge.title}</h4>
            <p className="text-muted-foreground text-xs">{badge.subtitle}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// const VideoPlayerMockup = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!isPlaying) return;

//     const interval = setInterval(() => {
//       setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
//     }, 100);

//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   return (
//     <div className="bg-muted relative aspect-video overflow-hidden rounded-lg border">
//       <div className="from-primary/20 to-primary/5 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsPlaying(!isPlaying)}
//           className="bg-primary/90 flex h-20 w-20 items-center justify-center rounded-full"
//         >
//           {isPlaying ? (
//             <div className="flex h-8 w-8 gap-1.5">
//               <div className="w-2 rounded bg-white" />
//               <div className="w-2 rounded bg-white" />
//             </div>
//           ) : (
//             <Play className="ml-1 h-10 w-10 text-white" />
//           )}
//         </motion.button>
//       </div>

//       <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
//         <div className="space-y-2">
//           <Progress value={progress} className="h-1" />
//           <div className="flex items-center justify-between text-xs text-white">
//             <span>{Math.floor((progress / 100) * 120)}:00</span>
//             <div className="flex gap-2">
//               <Badge variant="secondary" className="text-xs">
//                 1080p
//               </Badge>
//               <Badge variant="secondary" className="text-xs">
//                 Auto
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

interface Location {
  name: string;
  users: string;
  x: number;
  y: number;
}

const GeographicMap = () => {
  const locations: Location[] = [
    { name: 'North America', users: '45K', x: 22, y: 32 },
    { name: 'Europe', users: '38K', x: 48, y: 28 },
    { name: 'India', users: '52K', x: 65, y: 42 },
    { name: 'Japan', users: '28K', x: 78, y: 35 },
    { name: 'South America', users: '12K', x: 32, y: 62 },
    { name: 'Africa', users: '18K', x: 50, y: 52 },
    { name: 'Australia', users: '8K', x: 78, y: 68 },
  ];

  return (
    <div className="bg-card relative h-96 w-full overflow-hidden rounded-lg border">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600">
        <defs>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary))" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--border))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--border))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--border))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 60}
            x2="1000"
            y2={i * 60}
            stroke="var(--border))"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 62.5}
            y1="0"
            x2={i * 62.5}
            y2="600"
            stroke="var(--border))"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {/* Stylized continent outlines */}
        <path
          d="M 150,180 Q 180,160 220,180 L 240,200 Q 250,220 230,240 L 200,250 Q 170,240 150,220 Z"
          fill="var(--muted))"
          opacity="0.3"
        />

        <path
          d="M 450,150 Q 500,140 550,160 L 580,200 Q 590,240 560,270 L 520,280 Q 480,270 450,240 Z"
          fill="var(--muted))"
          opacity="0.3"
        />

        <path
          d="M 620,220 Q 680,210 720,240 L 740,280 Q 730,310 700,320 L 660,310 Q 630,280 620,250 Z"
          fill="var(--muted))"
          opacity="0.3"
        />

        <path
          d="M 750,190 Q 790,180 820,210 L 830,240 Q 825,270 800,280 L 770,275 Q 750,250 750,220 Z"
          fill="var(--muted))"
          opacity="0.3"
        />

        {/* Connection lines between locations */}
        <path
          d="M 220,192 Q 350,160 480,168"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4,4"
        />

        <path
          d="M 480,168 Q 580,180 650,252"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4,4"
        />

        <path
          d="M 650,252 Q 720,240 780,210"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4,4"
        />
      </svg>

      {locations.map((location, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: idx * 0.4,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-primary/20 absolute inset-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg" />
            <div className="bg-primary/40 absolute inset-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm" />
            <div className="bg-primary shadow-primary/50 ring-primary/30 relative h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ring-2" />
          </motion.div>

          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 + 0.3 }}
          >
            <div className="text-foreground mb-0.5 text-xs font-semibold">
              {location.name}
            </div>
            <div className="text-muted-foreground text-xs">
              {location.users} users
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      quote:
        'LearnSphere transformed how we deliver training. The AI assistant is incredible!',
      author: 'Sarah Johnson',
      role: 'VP of Learning, TechCorp',
      avatar: 'SJ',
      rating: 5,
    },
    {
      quote:
        'The microservices architecture scales beautifully. We went from 100 to 10K users seamlessly.',
      author: 'Michael Chen',
      role: 'CTO, EduStart',
      avatar: 'MC',
      rating: 5,
    },
    {
      quote:
        "Best learning platform we've used. The video streaming is flawless on any device.",
      author: 'Emily Rodriguez',
      role: 'Director of Education, Global Institute',
      avatar: 'ER',
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="mb-4 flex gap-1">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="fill-primary text-primary h-4 w-4" />
                ))}
              </div>
              <CardDescription className="text-base italic">
                "{testimonials[current].quote}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full font-semibold">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <div className="font-semibold">
                    {testimonials[current].author}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonials[current].role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-center gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === current ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const TechStackGrid = () => {
  const technologies = [
    { name: 'Node.js', icon: '⬢', category: 'Backend' },
    { name: 'TypeScript', icon: 'TS', category: 'Language' },
    { name: 'React', icon: '⚛️', category: 'Frontend' },
    { name: 'Go', icon: 'Go', category: 'Backend' },
    { name: 'Python', icon: '🐍', category: 'AI/ML' },
    { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
    { name: 'Redis', icon: '◆', category: 'Cache' },
    { name: 'RabbitMQ', icon: '🐰', category: 'Queue' },
    { name: 'Kubernetes', icon: '☸️', category: 'Orchestration' },
    { name: 'Docker', icon: '🐳', category: 'Container' },
    { name: 'Terraform', icon: 'TF', category: 'IaC' },
    { name: 'AWS', icon: '☁️', category: 'Cloud' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {technologies.map((tech, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="cursor-pointer p-4 text-center">
            <div className="mb-2 text-3xl">{tech.icon}</div>
            <div className="text-sm font-medium">{tech.name}</div>
            <Badge variant="secondary" className="mt-2 text-xs">
              {tech.category}
            </Badge>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      {/* <CircuitBackground /> */}
      {/* <motion.div
        className="bg-muted fixed top-0 right-0 left-0 z-50 h-1 origin-left"
        style={{ scaleX }}
      /> */}

      <section className="relative container overflow-hidden py-24 md:py-32">
        <FloatingParticles />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-8 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by AI & Cloud-Native Architecture
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Transform Learning with <br className="hidden sm:block" />
            <TypingEffect
              texts={[
                'Next-Gen Technology',
                'AI Intelligence',
                'Cloud Power',
                'Microservices',
              ]}
            />
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg sm:text-xl"
          >
            Experience a polyglot microservice platform combining adaptive video
            streaming, AI-powered assistance, and seamless course management.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div variants={scaleIn} className="my-12">
            <WaitlistPage className="h-[1vh]" />
          </motion.div>

          <motion.div variants={scaleIn}>
            <ArchitectureDiagram />
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter end={99.9} duration={2} suffix="%" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Uptime
              </div>
              <div className="text-muted-foreground text-xs">
                Cloud infrastructure
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                &lt;
                <AnimatedCounter end={100} duration={2} />
                ms
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Response Time
              </div>
              <div className="text-muted-foreground text-xs">API latency</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter end={10} duration={2} suffix="K+" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Concurrent Users
              </div>
              <div className="text-muted-foreground text-xs">
                Scalable design
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter end={8} duration={2} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Microservices
              </div>
              <div className="text-muted-foreground text-xs">
                Polyglot stack
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Real-time Activity
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Join Thousands of Active Learners
            </h2>
            <p className="text-muted-foreground text-lg">
              See what's happening right now on the platform
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <LiveActivityFeed />
          </motion.div>
        </motion.div>
      </section>

      {/* <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              See the Difference
            </h2>
            <p className="text-muted-foreground text-lg">
              Drag the slider to compare traditional platforms with LearnSphere
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <ComparisonSlider />
          </motion.div>
        </motion.div>
      </section> */}

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              Comparison
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Why Choose LearnSphere
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardContent className="p-6">
                <ComparisonTable />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Trophy className="h-3.5 w-3.5" />
              Success Stories
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Real Results from Real Users
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                name: 'Alex Kumar',
                avatar: 'AK',
                role: 'Full Stack Developer',
                story:
                  'Landed my dream job after completing the microservices course. The hands-on projects were invaluable.',
                metrics: [
                  { value: '6 months', label: 'Learning time' },
                  { value: '$120K', label: 'New salary' },
                  { value: '15+', label: 'Projects built' },
                ],
              },
              {
                name: 'Maria Garcia',
                avatar: 'MG',
                role: 'Data Scientist',
                story:
                  'The AI/ML courses with LangChain integration helped me transition into data science seamlessly.',
                metrics: [
                  { value: '4 months', label: 'Career switch' },
                  { value: '95%', label: 'Course completion' },
                  { value: '3', label: 'Certifications' },
                ],
              },
              {
                name: 'James Wilson',
                avatar: 'JW',
                role: 'DevOps Engineer',
                story:
                  'The Kubernetes and Terraform courses were exactly what I needed. Now managing cloud infrastructure at scale.',
                metrics: [
                  { value: '8 weeks', label: 'To proficiency' },
                  { value: '10K+', label: 'Users served' },
                  { value: '99.9%', label: 'Uptime achieved' },
                ],
              },
            ].map((story, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <SuccessStory story={story} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <DollarSign className="h-3.5 w-3.5" />
              Calculate Your Savings
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              See Your ROI
            </h2>
            <p className="text-muted-foreground text-lg">
              Calculate how much you'll save with our platform
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <ROICalculator />
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Gauge className="h-3.5 w-3.5" />
              System Status
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Real-Time System Health
            </h2>
            <p className="text-muted-foreground text-lg">
              All systems operational and running smoothly
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardContent className="p-6">
                <SystemStatus />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Code2 className="h-3.5 w-3.5" />
              Developer-Friendly
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Easy Integration
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple API integration with comprehensive documentation
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <CodeSnippet />
          </motion.div>
        </motion.div>
      </section>

      <section id="pricing" className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <DollarSign className="h-3.5 w-3.5" />
              Pricing
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Choose the plan that fits your needs. All plans include core
              features.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
          >
            {[
              {
                name: 'Starter',
                price: 0,
                description: 'Perfect for individuals getting started',
                features: [
                  'Access to 50+ courses',
                  'AI assistant (limited)',
                  'Community forum access',
                  'Mobile app access',
                  'Certificate of completion',
                ],
              },
              {
                name: 'Pro',
                price: 29,
                description: 'For serious learners and professionals',
                popular: true,
                features: [
                  'Access to 500+ courses',
                  'Unlimited AI assistant',
                  'Priority support',
                  'Download courses offline',
                  'Advanced analytics',
                  'Live sessions',
                  'Verified certificates',
                ],
              },
              {
                name: 'Enterprise',
                price: 99,
                description: 'For teams and organizations',
                features: [
                  'Everything in Pro',
                  'Custom branding',
                  'SSO integration',
                  'Dedicated support',
                  'Admin dashboard',
                  'API access',
                  'Custom content',
                  'SLA guarantee',
                ],
              },
            ].map((plan, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <PricingCard plan={plan} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Your Learning Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              From beginner to expert in four simple steps
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <LearningTimeline />
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Video className="h-3.5 w-3.5" />
              Video Platform
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Adaptive Video Streaming
            </h2>
            <p className="text-muted-foreground text-lg">
              HLS streaming with automatic quality adjustment for seamless
              learning
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            {/* <VideoPlayerMockup /> */}
            <VideoPlayer />
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Globe className="h-3.5 w-3.5" />
              Global Reach
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Students Worldwide
            </h2>
            <p className="text-muted-foreground text-lg">
              Join learners from over 150 countries
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <GeographicMap />
          </motion.div>
        </motion.div>
      </section>

      <section id="testimonials" className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Star className="h-3.5 w-3.5" />
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Loved by Thousands
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our users have to say
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TestimonialCarousel />
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Enterprise-Grade Security
            </h2>
            <p className="text-muted-foreground text-lg">
              Your data is protected with industry-leading security standards
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TrustBadges />
          </motion.div>
        </motion.div>
      </section>

      <section id="architecture" className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Code2 className="h-3.5 w-3.5" />
              Technology Stack
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Built with Modern Tech
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Powered by industry-leading tools and frameworks for optimal
              performance
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TechStackGrid />
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl"
        >
          <motion.div variants={scaleIn}>
            <NewsletterSignup />
          </motion.div>
        </motion.div>
      </section>

      <section id="faq" className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about LearnSphere
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question:
                    'What makes LearnSphere different from other platforms?',
                  answer:
                    'LearnSphere is built on a modern microservices architecture with AI integration, adaptive video streaming, and cloud-native infrastructure. Our polyglot approach ensures optimal performance and scalability.',
                },
                {
                  question: 'How does the AI learning assistant work?',
                  answer:
                    'Our AI assistant uses LangChain and vector databases to understand course content deeply. It provides instant answers, personalized recommendations, and contextual help based on your learning progress.',
                },
                {
                  question: 'What video formats do you support?',
                  answer:
                    'We support all major video formats. Our processing pipeline automatically transcodes videos to HLS format with adaptive bitrate streaming for optimal viewing on any device.',
                },
                {
                  question: 'Is my data secure?',
                  answer:
                    'Absolutely. We implement JWT-based authentication, encrypted data transmission, isolated service boundaries, and follow industry best practices. Your data is stored securely on AWS infrastructure with SOC 2 and GDPR compliance.',
                },
                {
                  question: 'Can I access courses offline?',
                  answer:
                    'Yes! Our mobile app allows you to download course videos and materials for offline viewing. Progress is automatically synced when you reconnect to the internet.',
                },
                {
                  question: 'Do you offer certificates?',
                  answer:
                    'Yes, we offer verified certificates of completion for all courses. Pro and Enterprise plans include verified certificates recognized by employers worldwide.',
                },
                {
                  question: 'What kind of support do you provide?',
                  answer:
                    'We offer email support for all users, priority support for Pro users, and dedicated support with SLA guarantees for Enterprise customers. Our documentation and community forums are also available 24/7.',
                },
                {
                  question: 'Can I create and sell my own courses?',
                  answer:
                    'Yes! Our platform supports course creators with easy-to-use tools, revenue sharing, and built-in marketing features. Contact us to learn more about our instructor program.',
                },
              ].map((faq, idx) => (
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
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeInUp}>
            <Card className="">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="mx-auto mb-4">
                  <Rocket className="h-3.5 w-3.5" />
                  Limited Time Offer
                </Badge>
                <CardTitle className="text-3xl md:text-4xl">
                  Early Access Launch
                </CardTitle>
                <CardDescription className="text-base">
                  Get 50% off annual plans for the first 1000 users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CountdownTimer targetDate="2025-06-01T00:00:00" />

                <div className="mt-8 text-center">
                  <Button size="lg" className="gap-2">
                    <Gift className="h-5 w-5" />
                    Claim Your Spot
                  </Button>
                  <p className="text-muted-foreground mt-4 text-sm">
                    <AnimatedCounter end={847} duration={3} /> spots remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Join thousands of students and instructors experiencing the future
              of online education
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 text-base">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Schedule a Demo
              </Button>
            </div>

            <div className="text-muted-foreground mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="bg-background mt-4">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Logo className="h-8 w-8" />
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
                    href="#pricing"
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
                    API Docs
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
                    Guides
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
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Partners
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
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-primary text-primary-foreground fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const Github: React.FC<IconProps> = (props) => (
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

const Twitter: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin: React.FC<IconProps> = (props) => (
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

export default LandingPage;
