import { getCategories } from "@/app/(admin)/actions";
import { getCurrentUser } from "@/app/(auth)/actions";
import { getCourseDetails } from "@/app/courses/actions";
import { IconBadge } from "@/components/shared/icon-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CourseEditorPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = params;

  const user = await getCurrentUser();
  const course = await getCourseDetails(courseId);
  const categories = await getCategories();

  if (!course || !user || user.userId !== course.instructorId) {
    redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.modules.some((module: any) =>
      module.lessons.some((lesson: any) => lesson.isPublished)
    ),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full mt-8">
        <TabsList className="flex overflow-x-auto no-scrollbar ">
          <TabsTrigger value="details">
            <LayoutDashboard className="h-4 w-4 mr-0" />
            Customize Details
          </TabsTrigger>
          <TabsTrigger value="curriculum">
            <ListChecks className="h-4 w-4 mr-0" />
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <File className="h-4 w-4 mr-0" />
            Attachments & Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Course Details</h2>
              </div>
              <p className="mt-4">Details form will go here.</p>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Course Thumbnail</h2>
              </div>
              <p className="mt-4">Thumbnail uploader will go here.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="curriculum" className="mt-6">
          <h2 className="text-xl font-medium">Course Curriculum</h2>
          <p className="mt-4">Curriculum editor will go here.</p>
        </TabsContent>
        <TabsContent value="attachments" className="mt-6">
          <h2 className="text-xl font-medium">Attachments & Resources</h2>
          <p className="mt-4">Attachments manager will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
