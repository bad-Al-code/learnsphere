import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookCheck, Clock } from 'lucide-react';

type Module = {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    lessonType: 'video' | 'text' | 'quiz';
  }[];
};

interface CurriculumProps {
  modules: Module[];
}

export function Curriculum({ modules }: CurriculumProps) {
  if (!modules || modules.length === 0) {
    return (
      <p className="text-muted-foreground">
        No curriculum has been added to this course yet.
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Course Curriculum</h2>
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module, index) => (
          <AccordionItem value={`item-${index}`} key={module.id}>
            <AccordionTrigger>
              <div className="flex flex-col text-left">
                <span className="font-semibold">Module {index + 1}</span>
                <span className="text-lg">{module.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-4">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="text-muted-foreground flex items-center gap-3"
                  >
                    {lesson.lessonType === 'video' ? (
                      <Clock className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <BookCheck className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="flex-grow">{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
