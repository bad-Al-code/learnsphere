import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="h-12 w-full bg-muted rounded-md"></div>
          </CardContent>
          <CardFooter>
            <div className="h-10 w-1/2 bg-muted rounded-md"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
