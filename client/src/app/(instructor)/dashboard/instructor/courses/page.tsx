import { MyCoursesTable } from "@/app/(instructor)/_components/my-course-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getMyCourses } from "../../../actions";

export default async function MyCoursesPage() {
  const courses = await getMyCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      <MyCoursesTable courses={courses} />
    </div>
  );
}
