'use client';

import type { Lesson } from '../../schema/course-detail.schema';

interface TextLessonProps {
  lesson: Lesson;
}

export function TextLesson({ lesson }: TextLessonProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="text-foreground space-y-4">
        <p>
          {lesson.content ||
            `This is a text-based lesson on ${lesson.title}. 
          It contains detailed explanations, code examples, and best practices 
          for understanding the topic. Read through the content carefully and 
          take notes on important concepts.`}
        </p>

        <div className="border-border bg-muted rounded-lg border p-4">
          <h4 className="text-foreground font-semibold">Key Points:</h4>
          <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
            <li>• Understand the fundamental concepts</li>
            <li>• Practice with real-world examples</li>
            <li>• Apply the knowledge to your projects</li>
          </ul>
        </div>

        <div className="border-border bg-muted rounded-lg border p-4">
          <h4 className="text-foreground font-semibold">Code Example:</h4>
          <pre className="bg-background mt-2 overflow-x-auto rounded p-3 text-xs">
            <code>{`const example = () => {
  return "Hello, World!";
};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
