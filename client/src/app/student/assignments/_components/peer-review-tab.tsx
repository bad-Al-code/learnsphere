'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Pencil,
  Play,
  Save,
  Send,
  Star,
  Target,
  ThumbsUp,
  Timer,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

type TReviewStatus = 'pending' | 'completed' | 'not-started';
type TReviewStep = 'overview' | 'content' | 'scoring' | 'feedback' | 'summary';

type TPeerReview = {
  id: string;
  title: string;
  status: TReviewStatus;
  author: string;
  course: string;
  submittedDate: string;
  reviewDueDate: string;
  criteria: TCriterion[];
  score?: number;
  feedback?: string;
  reviewProgress?: number;
  assignmentContent: string;
  assignmentType: string;
  maxScore: number;
  requirements: string[];
  attachments?: string[];
  isOverdue?: boolean;
};

type TCriterion = {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
};

type TReviewForm = {
  scores: { [key: string]: number };
  feedback: { [key: string]: string };
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  overallScore: number;
  timeSpent: number;
};

const sampleAssignment: TPeerReview = {
  id: '1',
  title: 'Responsive Web Design Portfolio Project',
  status: 'not-started',
  author: 'Emma Wilson',
  course: 'Advanced Web Development - CS 445',
  submittedDate: '2024-01-18',
  reviewDueDate: '2024-01-22',
  assignmentType: 'Portfolio Project',
  maxScore: 100,
  assignmentContent: `# My Web Development Portfolio

## Project Overview
This portfolio showcases my skills in responsive web design, featuring five distinct projects that demonstrate proficiency in HTML5, CSS3, JavaScript, and modern frameworks.

## Featured Projects

### 1. E-Commerce Landing Page
Built with React and styled-components, this project features:
- Fully responsive design across all devices
- Interactive product carousel with touch support
- Dynamic cart functionality with local storage
- Performance optimized with lazy loading
- Accessibility compliant (WCAG 2.1 AA)

**Technologies Used:** React, styled-components, Framer Motion, Webpack
**Live Demo:** https://emma-ecommerce-demo.netlify.app
**GitHub:** https://github.com/emmawilson/ecommerce-landing

### 2. Weather Dashboard Application
A Progressive Web App (PWA) that provides comprehensive weather information:
- Real-time weather data from OpenWeatherMap API
- 7-day forecast with detailed hourly breakdowns
- Interactive maps with weather overlay
- Offline functionality with service workers
- Push notifications for weather alerts

**Technologies Used:** Vanilla JavaScript, Service Workers, Chart.js, Mapbox API
**Live Demo:** https://emma-weather-pwa.herokuapp.com
**GitHub:** https://github.com/emmawilson/weather-dashboard

### 3. Task Management System
A collaborative project management tool featuring:
- Drag-and-drop task organization (Kanban board)
- Real-time collaboration with Socket.io
- User authentication and authorization
- File upload and sharing capabilities
- Mobile-responsive design with touch interactions

**Technologies Used:** Node.js, Express, Socket.io, MongoDB, React
**Live Demo:** https://taskflow-manager.herokuapp.com
**GitHub:** https://github.com/emmawilson/task-manager

### 4. Interactive Data Visualization
COVID-19 data dashboard with dynamic charts and filters:
- Multiple chart types (line, bar, pie, map)
- Interactive filtering by date range and location
- Real-time data updates from public APIs
- Export functionality for reports
- Color-blind friendly palette

**Technologies Used:** D3.js, React, Node.js, PostgreSQL
**Live Demo:** https://covid-data-viz.netlify.app
**GitHub:** https://github.com/emmawilson/covid-dashboard

### 5. Personal Blog Platform
A full-stack blogging platform with CMS capabilities:
- Markdown editor with live preview
- SEO optimized with meta tags and structured data
- Comment system with moderation
- Search functionality with full-text indexing
- RSS feed generation

**Technologies Used:** Next.js, Prisma, PostgreSQL, Tailwind CSS
**Live Demo:** https://emmawilson-blog.vercel.app
**GitHub:** https://github.com/emmawilson/blog-platform

## Technical Skills Demonstrated

### Frontend Development
- **Languages:** HTML5, CSS3, JavaScript (ES6+), TypeScript
- **Frameworks:** React, Next.js, Vue.js
- **Styling:** Tailwind CSS, styled-components, Sass/SCSS
- **Tools:** Webpack, Vite, ESLint, Prettier

### Backend Development
- **Runtime:** Node.js, Express.js
- **Databases:** MongoDB, PostgreSQL, Redis
- **APIs:** RESTful services, GraphQL
- **Authentication:** JWT, OAuth 2.0, Passport.js

### DevOps & Deployment
- **Version Control:** Git, GitHub Actions
- **Cloud Platforms:** Netlify, Vercel, Heroku, AWS
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions, Jenkins

### Design & UX
- **Responsive Design:** Mobile-first approach
- **Accessibility:** WCAG 2.1 compliance
- **Performance:** Lighthouse scores 90+
- **Cross-browser:** Chrome, Firefox, Safari, Edge

## Code Quality & Best Practices

All projects follow industry best practices:
- **Clean Code:** Meaningful variable names, proper commenting
- **Testing:** Unit tests with Jest, integration tests with Cypress
- **Documentation:** Comprehensive README files and code comments
- **Security:** Input validation, XSS protection, secure authentication
- **Performance:** Optimized images, code splitting, caching strategies

## Learning Outcomes & Reflection

Through these projects, I've gained substantial experience in:
1. **Problem Solving:** Breaking down complex requirements into manageable tasks
2. **User Experience:** Designing intuitive interfaces that prioritize user needs
3. **Performance Optimization:** Implementing strategies to improve load times and user experience
4. **Collaboration:** Working with version control and following team development workflows
5. **Continuous Learning:** Staying updated with modern web development trends and technologies

## Future Enhancements

Plans for continued development include:
- Implementing Progressive Web App features across all projects
- Adding comprehensive test coverage (currently at 75%)
- Exploring new technologies like GraphQL and serverless architecture
- Improving accessibility compliance to WCAG 2.2 standards
- Implementing advanced performance monitoring and analytics

## Conclusion

This portfolio demonstrates my evolution as a web developer, showcasing both technical proficiency and creative problem-solving abilities. Each project represents not just code, but solutions to real-world problems, built with attention to user experience, performance, and maintainability.

I'm excited to continue growing as a developer and contributing to innovative web solutions that make a positive impact on users' lives.

---

**Contact Information:**
- Email: emma.wilson@university.edu
- LinkedIn: https://linkedin.com/in/emmawilson-dev
- Portfolio: https://emmawilson.dev
- GitHub: https://github.com/emmawilson`,
  criteria: [
    {
      id: 'technical-implementation',
      name: 'Technical Implementation',
      description:
        'Quality of code, use of appropriate technologies, and technical complexity',
      maxPoints: 30,
      weight: 0.3,
    },
    {
      id: 'design-ux',
      name: 'Design & User Experience',
      description:
        'Visual design quality, usability, responsiveness, and accessibility',
      maxPoints: 25,
      weight: 0.25,
    },
    {
      id: 'functionality',
      name: 'Functionality & Features',
      description:
        'Completeness of features, interactivity, and overall functionality',
      maxPoints: 25,
      weight: 0.25,
    },
    {
      id: 'documentation',
      name: 'Documentation & Presentation',
      description:
        'Code comments, README files, project presentation, and communication',
      maxPoints: 20,
      weight: 0.2,
    },
  ],
  requirements: [
    'Minimum 5 projects showcasing different technologies',
    'Responsive design across all devices',
    'Live deployed versions with working links',
    'Clean, well-documented code on GitHub',
    'Professional presentation and documentation',
    'Accessibility considerations (WCAG guidelines)',
    'Performance optimization techniques',
  ],
  attachments: [
    'portfolio-wireframes.pdf',
    'project-screenshots.zip',
    'accessibility-audit.pdf',
  ],
};

function PeerReviewInterface() {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TReviewStep>('overview');
  const [reviewForm, setReviewForm] = useState<TReviewForm>({
    scores: {},
    feedback: {},
    overallFeedback: '',
    strengths: [],
    improvements: [],
    overallScore: 0,
    timeSpent: 0,
  });
  const [startTime] = useState(Date.now());
  const [tempStrength, setTempStrength] = useState('');
  const [tempImprovement, setTempImprovement] = useState('');
  const [assignment] = useState<TPeerReview>(sampleAssignment);

  const steps: {
    id: TReviewStep;
    title: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'overview',
      title: 'Assignment Overview',
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Review assignment details and requirements',
    },
    {
      id: 'content',
      title: 'Content Review',
      icon: <Eye className="h-4 w-4" />,
      description: 'Read and analyze the submission',
    },
    {
      id: 'scoring',
      title: 'Criterion Scoring',
      icon: <Target className="h-4 w-4" />,
      description: 'Score each evaluation criterion',
    },
    {
      id: 'feedback',
      title: 'Detailed Feedback',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Provide constructive feedback',
    },
    {
      id: 'summary',
      title: 'Review Summary',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Final review and submission',
    },
  ];

  const getCurrentStepIndex = () =>
    steps.findIndex((step) => step.id === currentStep);
  const canGoNext = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex < steps.length - 1;
  };
  const canGoPrevious = () => getCurrentStepIndex() > 0;

  const handleNext = () => {
    if (canGoNext()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleScoreChange = (criterionId: string, score: number) => {
    setReviewForm((prev) => ({
      ...prev,
      scores: { ...prev.scores, [criterionId]: score },
    }));
  };

  const handleFeedbackChange = (criterionId: string, feedback: string) => {
    setReviewForm((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, [criterionId]: feedback },
    }));
  };

  const addStrength = () => {
    if (tempStrength.trim()) {
      setReviewForm((prev) => ({
        ...prev,
        strengths: [...prev.strengths, tempStrength.trim()],
      }));
      setTempStrength('');
    }
  };

  const addImprovement = () => {
    if (tempImprovement.trim()) {
      setReviewForm((prev) => ({
        ...prev,
        improvements: [...prev.improvements, tempImprovement.trim()],
      }));
      setTempImprovement('');
    }
  };

  const removeStrength = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }));
  };

  const removeImprovement = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index),
    }));
  };

  const calculateOverallScore = () => {
    const totalScore = assignment.criteria.reduce((sum, criterion) => {
      const score = reviewForm.scores[criterion.id] || 0;
      return sum + score * criterion.weight;
    }, 0);
    return Math.round(totalScore);
  };

  const getTimeSpent = () => {
    return Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
  };

  const isStepComplete = (stepId: TReviewStep) => {
    switch (stepId) {
      case 'overview':
        return true; // Always complete after viewing
      case 'content':
        return true; // Complete after viewing content
      case 'scoring':
        return assignment.criteria.every(
          (c) => reviewForm.scores[c.id] !== undefined
        );
      case 'feedback':
        return (
          reviewForm.strengths.length > 0 && reviewForm.improvements.length > 0
        );
      case 'summary':
        return reviewForm.overallFeedback.length > 10;
      default:
        return false;
    }
  };

  const allStepsComplete = steps.every((step) => isStepComplete(step.id));

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Author
                    </Label>
                    <p className="font-medium">{assignment.author}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Course
                    </Label>
                    <p className="font-medium">{assignment.course}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Assignment Type
                    </Label>
                    <p className="font-medium">{assignment.assignmentType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Submitted
                      </Label>
                      <p className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {assignment.submittedDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Review Due
                      </Label>
                      <p className="flex items-center gap-1 text-sm">
                        <Timer className="h-3 w-3" />
                        {assignment.reviewDueDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Evaluation Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {criterion.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {criterion.maxPoints} points
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(criterion.weight * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Assignment Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assignment.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <span className="text-sm">{attachment}</span>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Content</CardTitle>
                <CardDescription>
                  Review the complete submission carefully. Take notes as
                  needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                      {assignment.assignmentContent}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6">
            {assignment.criteria.map((criterion) => (
              <Card key={criterion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {criterion.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {criterion.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {reviewForm.scores[criterion.id] || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        out of {criterion.maxPoints}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Score (0 - {criterion.maxPoints} points)
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="range"
                        min="0"
                        max={criterion.maxPoints}
                        value={reviewForm.scores[criterion.id] || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            criterion.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor (0)</span>
                        <span>
                          Fair ({Math.floor(criterion.maxPoints * 0.25)})
                        </span>
                        <span>
                          Good ({Math.floor(criterion.maxPoints * 0.75)})
                        </span>
                        <span>Excellent ({criterion.maxPoints})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor={`feedback-${criterion.id}`}
                      className="text-sm font-medium"
                    >
                      Specific Feedback for {criterion.name}
                    </Label>
                    <Textarea
                      id={`feedback-${criterion.id}`}
                      placeholder={`Provide specific feedback on ${criterion.name.toLowerCase()}...`}
                      value={reviewForm.feedback[criterion.id] || ''}
                      onChange={(e) =>
                        handleFeedbackChange(criterion.id, e.target.value)
                      }
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-blue-600">
                    {calculateOverallScore()}/100
                  </div>
                  <div className="text-sm text-blue-800">
                    Calculated Overall Score
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <ThumbsUp className="h-5 w-5" />
                  Strengths & Positive Aspects
                </CardTitle>
                <CardDescription>
                  Highlight what the student did well. Be specific and
                  encouraging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a strength or positive aspect..."
                    value={tempStrength}
                    onChange={(e) => setTempStrength(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                  />
                  <Button onClick={addStrength} disabled={!tempStrength.trim()}>
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {reviewForm.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border-green-200 bg-green-50 p-3"
                    >
                      <span className="text-sm">{strength}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStrength(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {reviewForm.strengths.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No strengths added yet. Add at least one positive aspect.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Provide constructive suggestions for improvement. Be specific
                  and actionable.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an area for improvement..."
                    value={tempImprovement}
                    onChange={(e) => setTempImprovement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
                  />
                  <Button
                    onClick={addImprovement}
                    disabled={!tempImprovement.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {reviewForm.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border-blue-200 bg-blue-50 p-3"
                    >
                      <span className="text-sm">{improvement}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImprovement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {reviewForm.improvements.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No improvements added yet. Add at least one suggestion.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Comments</CardTitle>
                <CardDescription>
                  Provide comprehensive feedback summarizing your review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your overall feedback, summary, and any additional comments..."
                  value={reviewForm.overallFeedback}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      overallFeedback: e.target.value,
                    }))
                  }
                  className="min-h-[150px]"
                />
                <div className="mt-2 text-xs text-gray-500">
                  {reviewForm.overallFeedback.length}/500 characters (minimum 10
                  required)
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-center">Review Summary</CardTitle>
                <CardDescription className="text-center">
                  Final review before submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="text-6xl font-bold text-blue-600">
                    {calculateOverallScore()}
                  </div>
                  <div className="text-lg text-gray-700">
                    Overall Score out of 100
                  </div>
                  <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>Time Spent: {getTimeSpent()} minutes</span>
                    <span>•</span>
                    <span>{reviewForm.strengths.length} strengths noted</span>
                    <span>•</span>
                    <span>
                      {reviewForm.improvements.length} improvements suggested
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Criterion Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {criterion.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Weight: {Math.round(criterion.weight * 100)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">
                            {reviewForm.scores[criterion.id] || 0}
                          </span>
                          <span className="text-gray-500">
                            /{criterion.maxPoints}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-2">
                        {isStepComplete(step.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span
                          className={`text-sm ${isStepComplete(step.id) ? 'text-green-700' : 'text-gray-500'}`}
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Final Review Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium text-green-700">
                    Strengths:
                  </h4>
                  <ul className="space-y-1">
                    {reviewForm.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-green-500">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-medium text-blue-700">
                    Areas for Improvement:
                  </h4>
                  <ul className="space-y-1">
                    {reviewForm.improvements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-blue-500">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {reviewForm.overallFeedback && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-2 font-medium">Overall Comments:</h4>
                      <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {reviewForm.overallFeedback}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <Badge className="bg-gray-100 text-gray-800 capitalize">
                  {assignment.status.replace('-', ' ')}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                by {assignment.author} • {assignment.course}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Submitted: {assignment.submittedDate} • Review due:{' '}
                {assignment.reviewDueDate}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold">Review Criteria:</h4>
            <div className="flex flex-wrap gap-2">
              {assignment.criteria.map((c) => (
                <Badge key={c.id} variant="outline" className="text-xs">
                  {c.name} ({c.maxPoints}pts)
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              className="min-w-[120px] flex-1"
              onClick={() => setIsReviewOpen(true)}
            >
              <Play className="h-4 w-4" />
              Start Review
            </Button>

            <Button variant="outline" className="min-w-[120px] flex-1">
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-6xl flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Peer Review: {assignment.title}
            </DialogTitle>
            <DialogDescription>
              Reviewing {assignment.author}'s {assignment.assignmentType}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-shrink-0 border-b px-2 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex cursor-pointer flex-col items-center gap-2 transition-all ${
                      currentStep === step.id
                        ? 'text-blue-600'
                        : isStepComplete(step.id)
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        currentStep === step.id
                          ? 'border-blue-600 bg-blue-50'
                          : isStepComplete(step.id)
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {isStepComplete(step.id) && currentStep !== step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="text-center">
                      <div className="hidden text-xs font-medium sm:block">
                        {step.title}
                      </div>
                      <div className="hidden text-xs text-gray-500 md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        isStepComplete(step.id) ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4">
            {renderStepContent()}
          </div>

          <div className="flex flex-shrink-0 items-center justify-between border-t bg-gray-50 px-2 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
              <div className="text-sm text-gray-600">
                Time: {getTimeSpent()} minutes
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrevious()}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  // Save draft functionality
                }}
              >
                <Save className="mr-1 h-4 w-4" />
                Save Draft
              </Button>

              {canGoNext() ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // Submit review
                    console.log('Submitting review:', {
                      assignmentId: assignment.id,
                      scores: reviewForm.scores,
                      feedback: reviewForm.feedback,
                      overallScore: calculateOverallScore(),
                      strengths: reviewForm.strengths,
                      improvements: reviewForm.improvements,
                      overallFeedback: reviewForm.overallFeedback,
                      timeSpent: getTimeSpent(),
                    });
                    setIsReviewOpen(false);
                  }}
                  disabled={!allStepsComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="mr-1 h-4 w-4" />
                  Submit Review
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PeerReviewInterfaceSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-72" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-30" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 min-w-[120px] flex-1" />
            <Skeleton className="h-10 min-w-[120px] flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex items-center justify-between">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2 w-20" />
                </div>
                {i < 4 && <Skeleton className="mx-2 h-0.5 flex-1" />}
              </React.Fragment>
            ))}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="p-4">
                <Skeleton className="mb-3 h-5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
              <Card className="p-4">
                <Skeleton className="mb-3 h-5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { PeerReviewInterface, PeerReviewInterfaceSkeleton };

export function PeerReviewTab() {
  const [reviews, setReviews] = useState<TPeerReview[]>([
    sampleAssignment,
    {
      ...sampleAssignment,
      id: '2',
      title: 'JavaScript Algorithm Challenge',
      status: 'completed',
      author: 'Mike Johnson',
      score: 87,
      feedback: 'Excellent implementation with clear documentation.',
      assignmentType: 'Coding Assignment',
      assignmentContent:
        'Algorithm implementation with comprehensive test cases...',
    },
    {
      ...sampleAssignment,
      id: '3',
      title: 'User Research Report',
      status: 'pending',
      author: 'Sarah Chen',
      reviewProgress: 45,
      assignmentType: 'Research Report',
      assignmentContent: 'Comprehensive user research analysis...',
      isOverdue: true,
    },
  ]);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'completed' | 'not-started'
  >('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleReviewUpdate = (id: string, updates: Partial<TPeerReview>) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, ...updates } : review
      )
    );
  };

  const filteredReviews = reviews.filter(
    (review) => filter === 'all' || review.status === filter
  );

  const stats = {
    total: reviews.length,
    completed: reviews.filter((r) => r.status === 'completed').length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    notStarted: reviews.filter((r) => r.status === 'not-started').length,
    overdue: reviews.filter((r) => r.isOverdue).length,
  };

  if (isLoading) {
    return <PeerReviewTabSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Peer Review Assignments</CardTitle>
          </div>
          <CardDescription>
            Review your classmates' work and provide constructive feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-xs text-blue-800">Total</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-xs text-green-800">Completed</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-xs text-yellow-800">In Progress</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.notStarted}
              </div>
              <div className="text-xs text-gray-800">Not Started</div>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.overdue}
              </div>
              <div className="text-xs text-red-800">Overdue</div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {(['all', 'not-started', 'pending', 'completed'] as const).map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status === 'all'
                    ? 'All Reviews'
                    : status === 'not-started'
                      ? 'Not Started'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              )
            )}
          </div>

          {stats.overdue > 0 && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Overdue Reviews</AlertTitle>
              <AlertDescription className="text-red-700">
                You have {stats.overdue} overdue review
                {stats.overdue > 1 ? 's' : ''} that need immediate attention.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                assignment={review}
                onReviewUpdate={handleReviewUpdate}
              />
            ))}

            {filteredReviews.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No reviews found for the selected filter.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewCard({
  assignment,
  onReviewUpdate,
}: {
  assignment: TPeerReview;
  onReviewUpdate: (id: string, updates: Partial<TPeerReview>) => void;
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TReviewStep>('overview');
  const [reviewForm, setReviewForm] = useState<TReviewForm>({
    scores: {},
    feedback: {},
    overallFeedback: assignment.feedback || '',
    strengths: [],
    improvements: [],
    overallScore: assignment.score || 0,
    timeSpent: 0,
  });
  const [startTime] = useState(Date.now());
  const [tempStrength, setTempStrength] = useState('');
  const [tempImprovement, setTempImprovement] = useState('');

  const getStatusColor = (status: TReviewStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return assignment.isOverdue
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusAction = () => {
    switch (assignment.status) {
      case 'pending':
        return {
          text: 'Continue Review',
          Icon: Pencil,
          variant: 'default' as const,
        };
      case 'completed':
        return { text: 'View Review', Icon: Eye, variant: 'outline' as const };
      case 'not-started':
        return {
          text: 'Start Review',
          Icon: Play,
          variant: 'default' as const,
        };
      default:
        return { text: 'Review', Icon: Pencil, variant: 'outline' as const };
    }
  };

  const { text: actionText, Icon: ActionIcon, variant } = getStatusAction();

  const handleStartReview = () => {
    if (assignment.status === 'not-started') {
      onReviewUpdate(assignment.id, {
        status: 'pending',
        reviewProgress: 0,
      });
    }
    setIsReviewOpen(true);
  };

  const steps: {
    id: TReviewStep;
    title: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'overview',
      title: 'Assignment Overview',
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Review assignment details and requirements',
    },
    {
      id: 'content',
      title: 'Content Review',
      icon: <Eye className="h-4 w-4" />,
      description: 'Read and analyze the submission',
    },
    {
      id: 'scoring',
      title: 'Criterion Scoring',
      icon: <Target className="h-4 w-4" />,
      description: 'Score each evaluation criterion',
    },
    {
      id: 'feedback',
      title: 'Detailed Feedback',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Provide constructive feedback',
    },
    {
      id: 'summary',
      title: 'Review Summary',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Final review and submission',
    },
  ];

  const getCurrentStepIndex = () =>
    steps.findIndex((step) => step.id === currentStep);
  const canGoNext = () => getCurrentStepIndex() < steps.length - 1;
  const canGoPrevious = () => getCurrentStepIndex() > 0;

  const handleNext = () => {
    if (canGoNext()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleScoreChange = (criterionId: string, score: number) => {
    setReviewForm((prev) => ({
      ...prev,
      scores: { ...prev.scores, [criterionId]: score },
    }));
  };

  const handleFeedbackChange = (criterionId: string, feedback: string) => {
    setReviewForm((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, [criterionId]: feedback },
    }));
  };

  const addStrength = () => {
    if (tempStrength.trim()) {
      setReviewForm((prev) => ({
        ...prev,
        strengths: [...prev.strengths, tempStrength.trim()],
      }));
      setTempStrength('');
    }
  };

  const addImprovement = () => {
    if (tempImprovement.trim()) {
      setReviewForm((prev) => ({
        ...prev,
        improvements: [...prev.improvements, tempImprovement.trim()],
      }));
      setTempImprovement('');
    }
  };

  const removeStrength = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }));
  };

  const removeImprovement = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index),
    }));
  };

  const calculateOverallScore = () => {
    const totalScore = assignment.criteria.reduce((sum, criterion) => {
      const score = reviewForm.scores[criterion.id] || 0;
      return sum + score * criterion.weight;
    }, 0);
    return Math.round(totalScore);
  };

  const getTimeSpent = () => {
    return Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
  };

  const isStepComplete = (stepId: TReviewStep) => {
    switch (stepId) {
      case 'overview':
        return true;
      case 'content':
        return true;
      case 'scoring':
        return assignment.criteria.every(
          (c) => reviewForm.scores[c.id] !== undefined
        );
      case 'feedback':
        return (
          reviewForm.strengths.length > 0 && reviewForm.improvements.length > 0
        );
      case 'summary':
        return reviewForm.overallFeedback.length > 10;
      default:
        return false;
    }
  };

  const allStepsComplete = steps.every((step) => isStepComplete(step.id));

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Author
                    </Label>
                    <p className="font-medium">{assignment.author}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Course
                    </Label>
                    <p className="font-medium">{assignment.course}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Assignment Type
                    </Label>
                    <p className="font-medium">{assignment.assignmentType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Submitted
                      </Label>
                      <p className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {assignment.submittedDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Review Due
                      </Label>
                      <p className="flex items-center gap-1 text-sm">
                        <Timer className="h-3 w-3" />
                        {assignment.reviewDueDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Evaluation Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {criterion.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {criterion.maxPoints} points
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(criterion.weight * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Assignment Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assignment.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <span className="text-sm">{attachment}</span>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Content</CardTitle>
                <CardDescription>
                  Review the complete submission carefully. Take notes as
                  needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                      {assignment.assignmentContent}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6">
            {assignment.criteria.map((criterion) => (
              <Card key={criterion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {criterion.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {criterion.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {reviewForm.scores[criterion.id] || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        out of {criterion.maxPoints}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Score (0 - {criterion.maxPoints} points)
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="range"
                        min="0"
                        max={criterion.maxPoints}
                        value={reviewForm.scores[criterion.id] || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            criterion.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor (0)</span>
                        <span>
                          Fair ({Math.floor(criterion.maxPoints * 0.25)})
                        </span>
                        <span>
                          Good ({Math.floor(criterion.maxPoints * 0.75)})
                        </span>
                        <span>Excellent ({criterion.maxPoints})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor={`feedback-${criterion.id}`}
                      className="text-sm font-medium"
                    >
                      Specific Feedback for {criterion.name}
                    </Label>
                    <Textarea
                      id={`feedback-${criterion.id}`}
                      placeholder={`Provide specific feedback on ${criterion.name.toLowerCase()}...`}
                      value={reviewForm.feedback[criterion.id] || ''}
                      onChange={(e) =>
                        handleFeedbackChange(criterion.id, e.target.value)
                      }
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-blue-600">
                    {calculateOverallScore()}/100
                  </div>
                  <div className="text-sm text-blue-800">
                    Calculated Overall Score
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <ThumbsUp className="h-5 w-5" />
                  Strengths & Positive Aspects
                </CardTitle>
                <CardDescription>
                  Highlight what the student did well. Be specific and
                  encouraging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a strength or positive aspect..."
                    value={tempStrength}
                    onChange={(e) => setTempStrength(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                  />
                  <Button onClick={addStrength} disabled={!tempStrength.trim()}>
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {reviewForm.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border-green-200 bg-green-50 p-3"
                    >
                      <span className="text-sm">{strength}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStrength(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {reviewForm.strengths.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No strengths added yet. Add at least one positive aspect.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Provide constructive suggestions for improvement. Be specific
                  and actionable.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an area for improvement..."
                    value={tempImprovement}
                    onChange={(e) => setTempImprovement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
                  />
                  <Button
                    onClick={addImprovement}
                    disabled={!tempImprovement.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {reviewForm.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border-blue-200 bg-blue-50 p-3"
                    >
                      <span className="text-sm">{improvement}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImprovement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {reviewForm.improvements.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No improvements added yet. Add at least one suggestion.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Comments</CardTitle>
                <CardDescription>
                  Provide comprehensive feedback summarizing your review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your overall feedback, summary, and any additional comments..."
                  value={reviewForm.overallFeedback}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      overallFeedback: e.target.value,
                    }))
                  }
                  className="min-h-[150px]"
                />
                <div className="mt-2 text-xs text-gray-500">
                  {reviewForm.overallFeedback.length}/500 characters (minimum 10
                  required)
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-center">Review Summary</CardTitle>
                <CardDescription className="text-center">
                  Final review before submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="text-6xl font-bold text-blue-600">
                    {calculateOverallScore()}
                  </div>
                  <div className="text-lg text-gray-700">
                    Overall Score out of 100
                  </div>
                  <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>Time Spent: {getTimeSpent()} minutes</span>
                    <span>•</span>
                    <span>{reviewForm.strengths.length} strengths noted</span>
                    <span>•</span>
                    <span>
                      {reviewForm.improvements.length} improvements suggested
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Criterion Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {criterion.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Weight: {Math.round(criterion.weight * 100)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">
                            {reviewForm.scores[criterion.id] || 0}
                          </span>
                          <span className="text-gray-500">
                            /{criterion.maxPoints}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-2">
                        {isStepComplete(step.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span
                          className={`text-sm ${isStepComplete(step.id) ? 'text-green-700' : 'text-gray-500'}`}
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Final Review Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium text-green-700">
                    Strengths:
                  </h4>
                  <ul className="space-y-1">
                    {reviewForm.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-green-500">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-medium text-blue-700">
                    Areas for Improvement:
                  </h4>
                  <ul className="space-y-1">
                    {reviewForm.improvements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-blue-500">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {reviewForm.overallFeedback && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-2 font-medium">Overall Comments:</h4>
                      <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {reviewForm.overallFeedback}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card
        className={`transition-all hover:shadow-md ${assignment.isOverdue && assignment.status === 'not-started' ? 'border-red-200' : ''}`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <Badge
                  className={`capitalize ${getStatusColor(assignment.status)}`}
                >
                  {assignment.status.replace('-', ' ')}
                </Badge>
                {assignment.isOverdue &&
                  assignment.status === 'not-started' && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Overdue
                    </Badge>
                  )}
              </div>
              <p className="text-muted-foreground text-sm">
                by {assignment.author} • {assignment.course}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Submitted: {assignment.submittedDate} • Review due:{' '}
                {assignment.reviewDueDate}
              </p>

              {assignment.status === 'pending' && assignment.reviewProgress && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Review Progress</span>
                    <span>{assignment.reviewProgress}%</span>
                  </div>
                  <Progress value={assignment.reviewProgress} className="h-2" />
                </div>
              )}
            </div>

            {assignment.status === 'completed' && (
              <div className="flex-shrink-0 text-center sm:text-right">
                <div className="mb-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor((assignment.score || 0) / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold">{assignment.score}/100</p>
                <p className="text-muted-foreground text-xs">Your Score</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold">Review Criteria:</h4>
            <div className="flex flex-wrap gap-2">
              {assignment.criteria.map((c) => (
                <Badge key={c.id} variant="outline" className="text-xs">
                  {c.name} ({c.maxPoints}pts)
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              className="min-w-[120px] flex-1"
              variant={variant}
              onClick={handleStartReview}
            >
              <ActionIcon className="h-4 w-4" />
              {actionText}
            </Button>

            <Button variant="outline" className="min-w-[120px] flex-1">
              <Eye className="h-4 w-4" />
              Quick View
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob(
                  [
                    `Assignment: ${assignment.title}\nAuthor: ${assignment.author}\nContent: ${assignment.assignmentContent}`,
                  ],
                  { type: 'text/plain' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${assignment.title.replace(/\s+/g, '_')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-6xl flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Peer Review: {assignment.title}
            </DialogTitle>
            <DialogDescription>
              Reviewing {assignment.author}'s {assignment.assignmentType}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-shrink-0 border-b px-2 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex cursor-pointer flex-col items-center gap-2 transition-all ${
                      currentStep === step.id
                        ? 'text-blue-600'
                        : isStepComplete(step.id)
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        currentStep === step.id
                          ? 'border-blue-600 bg-blue-50'
                          : isStepComplete(step.id)
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {isStepComplete(step.id) && currentStep !== step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="text-center">
                      <div className="hidden text-xs font-medium sm:block">
                        {step.title}
                      </div>
                      <div className="hidden text-xs text-gray-500 md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        isStepComplete(step.id) ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4">
            {renderStepContent()}
          </div>

          <div className="flex flex-shrink-0 items-center justify-between border-t bg-gray-50 px-2 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
              <div className="text-sm text-gray-600">
                Time: {getTimeSpent()} minutes
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrevious()}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <Button variant="outline">
                <Save className="mr-1 h-4 w-4" />
                Save Draft
              </Button>

              {canGoNext() ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const finalScore = calculateOverallScore();
                    onReviewUpdate(assignment.id, {
                      status: 'completed',
                      score: finalScore,
                      feedback: reviewForm.overallFeedback,
                      reviewProgress: 100,
                    });
                    setIsReviewOpen(false);
                  }}
                  disabled={!allStepsComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="mr-1 h-4 w-4" />
                  Submit Review
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PeerReviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3 text-center">
                <Skeleton className="mx-auto mb-2 h-8 w-8" />
                <Skeleton className="mx-auto h-3 w-12" />
              </div>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>

          <div className="space-y-4">
            <PeerReviewInterfaceSkeleton />
            <PeerReviewInterfaceSkeleton />
            <PeerReviewInterfaceSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
