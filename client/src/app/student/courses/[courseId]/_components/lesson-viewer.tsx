'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Bookmark,
  CheckCircle2,
  Download,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

interface LessonViewerProps {
  lessonId: string;
}

const LESSON_DATA: Record<string, any> = {
  'lesson-1': {
    title: 'Introduction to React',
    type: 'video',
    duration: '12:45',
    completed: true,
    description:
      "Learn what React is and why it's used for building modern web applications.",
    content:
      'https://placeholder.svg?height=600&width=1000&query=React video player',
    transcript:
      "Welcome to React! In this lesson, we'll explore the fundamentals of React...",
  },
  'lesson-2': {
    title: 'JSX Basics',
    type: 'text',
    completed: true,
    description:
      'Understanding JSX syntax and how to write JSX in React components.',
    content: `
      <h3>What is JSX?</h3>
      <p>JSX is a syntax extension to JavaScript. It produces React "elements".</p>
      <pre><code>const element = &lt;h1&gt;Hello, world!&lt;/h1&gt;;</code></pre>
      <p>JSX looks similar to HTML, but it's actually JavaScript.</p>
    `,
  },
  'lesson-3': {
    title: 'Components & Props',
    type: 'video',
    duration: '18:30',
    completed: false,
    description:
      'Learn how to create reusable components and pass data through props.',
    content:
      'https://placeholder.svg?height=600&width=1000&query=React components',
  },
  'lesson-4': {
    title: 'Quiz: React Fundamentals',
    type: 'quiz',
    completed: false,
    description: 'Test your knowledge of React fundamentals.',
    questions: [
      {
        id: 1,
        question: 'What does React stand for?',
        options: ['A', 'B', 'C'],
        correct: 0,
      },
      { id: 2, question: 'What is JSX?', options: ['A', 'B', 'C'], correct: 1 },
    ],
  },
  'lesson-5': {
    title: 'Understanding State',
    type: 'video',
    duration: '15:20',
    completed: false,
    description: 'Learn about React state and how to manage component state.',
    content: 'https://placeholder.svg?height=600&width=1000&query=React state',
  },
  'lesson-6': {
    title: 'useState Hook',
    type: 'audio',
    duration: '8:15',
    completed: false,
    description:
      'Deep dive into the useState hook for managing component state.',
    content: 'https://placeholder.svg?height=100&width=400&query=audio player',
  },
  'lesson-7': {
    title: 'useEffect Hook',
    type: 'text',
    completed: false,
    description: 'Understanding side effects and the useEffect hook.',
    content: `
      <h3>The useEffect Hook</h3>
      <p>The Effect Hook lets you perform side effects in function components.</p>
      <pre><code>useEffect(() => { /* effect */ }, [dependencies])</code></pre>
    `,
  },
  'lesson-8': {
    title: 'Assignment: Build a Counter',
    type: 'assignment',
    completed: false,
    description: 'Build a counter application using React state.',
    instructions:
      'Create a counter component that increments and decrements a value.',
  },
  'lesson-9': {
    title: 'Custom Hooks',
    type: 'video',
    duration: '22:10',
    completed: false,
    description: 'Learn how to create custom hooks for reusable logic.',
    content: 'https://placeholder.svg?height=600&width=1000&query=Custom hooks',
  },
  'lesson-10': {
    title: 'Context API',
    type: 'text',
    completed: false,
    description: 'Master the Context API for state management.',
    content: `
      <h3>Context API</h3>
      <p>Context provides a way to pass data through the component tree.</p>
    `,
  },
  'lesson-11': {
    title: 'Resources & Best Practices',
    type: 'resource',
    completed: false,
    description:
      'Additional resources and best practices for React development.',
    resources: [
      { name: 'React Documentation', url: '#' },
      { name: 'React Patterns Guide', url: '#' },
    ],
  },
};

export function LessonViewer({ lessonId }: LessonViewerProps) {
  const lesson = LESSON_DATA[lessonId] || LESSON_DATA['lesson-1'];
  const [isCompleted, setIsCompleted] = useState(lesson.completed);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl p-6">
        {/* Video/Content Area */}
        <Card className="mb-6 overflow-hidden">
          {lesson.type === 'video' && (
            <div className="flex aspect-video items-center justify-center bg-black">
              <img
                src={lesson.content || '/placeholder.svg'}
                alt={lesson.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {lesson.type === 'audio' && (
            <div className="bg-muted p-6">
              <audio controls className="w-full">
                <source src={lesson.content} type="audio/mpeg" />
              </audio>
            </div>
          )}
          {lesson.type === 'text' && (
            <div
              className="prose prose-sm max-w-none p-6"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          )}
          {lesson.type === 'quiz' && (
            <div className="p-6">
              <h3 className="mb-4 font-semibold">Quiz Questions</h3>
              {lesson.questions?.map((q: any) => (
                <div
                  key={q.id}
                  className="border-border mb-4 rounded-lg border p-4"
                >
                  <p className="mb-3 font-medium">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option: string, idx: number) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {lesson.type === 'assignment' && (
            <div className="p-6">
              <h3 className="mb-4 font-semibold">Assignment Instructions</h3>
              <p className="text-muted-foreground mb-4">
                {lesson.instructions}
              </p>
              <Button>Submit Assignment</Button>
            </div>
          )}
          {lesson.type === 'resource' && (
            <div className="p-6">
              <h3 className="mb-4 font-semibold">Resources</h3>
              <div className="space-y-2">
                {lesson.resources?.map((resource: any, idx: number) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    {resource.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Lesson Info */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground mb-4">{lesson.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsCompleted(!isCompleted)}
              variant={isCompleted ? 'default' : 'outline'}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? 'bg-yellow-50' : ''}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
              />
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <Card className="p-6">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-primary mb-4 flex items-center gap-2 font-semibold transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            Comments ({showComments ? 'Hide' : 'Show'})
          </button>

          {showComments && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Great explanation! This really helped me understand React.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium">Jane Smith</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Can you provide more examples?
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
