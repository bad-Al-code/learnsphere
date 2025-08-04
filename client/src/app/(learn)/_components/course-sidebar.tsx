"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lesson = { id: string; title: string };
type Module = { id: string; title: string; lessons: Lesson[] };
type Course = { id: string; title: string; modules: Module[] };

export function CourseSidebar({ course }: { course: Course }) {
  const pathname = usePathname();

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-4">
        <h1 className="text-lg font-semibold">{course.title}</h1>
      </div>
      <div className="flex flex-col w-full">
        <Accordion
          type="multiple"
          defaultValue={course.modules.map((m) => m.id)}
        >
          {course.modules.map((module) => (
            <AccordionItem
              value={module.id}
              key={module.id}
              className="border-none"
            >
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                <span className="text-sm font-medium">{module.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-1">
                  {module.lessons.map((lesson) => {
                    const lessonPath = `/learn/${course.id}/${lesson.id}`;
                    const isActive = pathname === lessonPath;
                    return (
                      <Button
                        key={lesson.id}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto whitespace-normal py-2 px-6"
                      >
                        <Link href={lessonPath}>{lesson.title}</Link>
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
