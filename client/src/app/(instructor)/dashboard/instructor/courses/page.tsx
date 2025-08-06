"use client";

import { MyCoursesTable } from "@/app/(instructor)/_components/my-course-table";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyCourses } from "../../../actions";
import { CreateCourseModal } from "./_components/create-course-modal";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMyCourses().then((data) => {
      setCourses(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        <MyCoursesTable courses={courses} />
      )}

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
