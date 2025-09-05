import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart,
  Copy,
  Download,
  Eye,
  Link as LinkIcon,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCourseForEditor } from '../../actions';

interface CourseSettingsData {
  details: {
    title: string;
    price: number;
    description: string;
    category: string;
    difficulty: string;
    status: string;
    thumbnailUrl: string;
  };
  settings: {
    enableReviews: boolean;
    enableDiscussions: boolean;
    certificateOnCompletion: boolean;
    dripContent: boolean;
  };
  stats: {
    totalStudents: number;
    completionRate: number;
    averageRating: number;
    totalRevenue: number;
    lastUpdated: string;
  };
}

const placeholderData: CourseSettingsData = {
  details: {
    title: 'Financial Accounting Basics',
    price: 129,
    description: 'Understanding fundamental accounting principles',
    category: 'Finance',
    difficulty: 'Beginner',
    status: 'Published',
    thumbnailUrl: 'https://picsum.photos/seed/accounting/400/200',
  },
  settings: {
    enableReviews: true,
    enableDiscussions: true,
    certificateOnCompletion: true,
    dripContent: false,
  },
  stats: {
    totalStudents: 120,
    completionRate: 75,
    averageRating: 4.3,
    totalRevenue: 12000,
    lastUpdated: '1 week ago',
  },
};

function CourseDetailsForm({ data }: { data: CourseSettingsData['details'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>
          Update your course information and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="grid w-full items-center gap-1.5 sm:col-span-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" defaultValue={data.title} />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" defaultValue={data.price} />
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            defaultValue={data.description}
            className="min-h-24"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="grid w-full items-center gap-1.5">
            <Label>Category</Label>
            <Select defaultValue={data.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Difficulty Level</Label>
            <Select defaultValue={data.difficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Status</Label>
            <Select defaultValue={data.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseThumbnail({ url }: { url: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Thumbnail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-md border-2 border-dashed">
          <Image
            src={url}
            alt="Course Thumbnail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4" /> Change Image
          </Button>
          <Button variant="ghost">
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseSettings({ data }: { data: CourseSettingsData['settings'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Course Reviews</Label>
            <p className="text-muted-foreground text-xs">
              Allow students to rate and review this course
            </p>
          </div>
          <Switch defaultChecked={data.enableReviews} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Discussions</Label>
            <p className="text-muted-foreground text-xs">
              Allow students to participate in course discussions
            </p>
          </div>
          <Switch defaultChecked={data.enableDiscussions} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Certificate on Completion</Label>
            <p className="text-muted-foreground text-xs">
              Issue certificates when students complete the course
            </p>
          </div>
          <Switch defaultChecked={data.certificateOnCompletion} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Drip Content</Label>
            <p className="text-muted-foreground text-xs">
              Release lessons gradually over time
            </p>
          </div>
          <Switch defaultChecked={data.dripContent} />
        </div>
      </CardContent>
    </Card>
  );
}

function CourseStatistics({ data }: { data: CourseSettingsData['stats'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Students</span>
          <span className="font-semibold">{data.totalStudents}</span>
        </div>
        <div className="flex justify-between">
          <span>Completion Rate</span>
          <span className="font-semibold">{data.completionRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>Average Rating</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{data.averageRating}</span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="flex justify-between">
          <span>Total Revenue</span>
          <span className="font-semibold">
            ${data.totalRevenue.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Last Updated</span>
          <span className="text-muted-foreground">{data.lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Eye className="h-4 w-4" /> Preview Course
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <LinkIcon className="h-4 w-4" /> Share Course Link
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Download className="h-4 w-4" /> Export Course Data
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <BarChart className="h-4 w-4" /> View Analytics
        </Button>
      </CardContent>
    </Card>
  );
}

interface SettingsTabProps {
  courseId: string;
}
export async function SettingsTab({ courseId }: SettingsTabProps) {
  const result = await getCourseForEditor(courseId);

  if (!result.success || !result.data) {
    notFound();
  }
  const course = result.data;

  const data: CourseSettingsData = {
    details: {
      title: course.title,
      price: course.price || 0,
      description: course.description || '',
      category: course.category?.name || 'N/A',
      difficulty: course.level,
      status: course.status,
      thumbnailUrl: course.imageUrl || '',
    },

    settings: {
      enableReviews: true,
      enableDiscussions: true,
      certificateOnCompletion: true,
      dripContent: false,
    },

    stats: {
      totalStudents: course.enrollmentCount || 0,
      completionRate: 75, // Placeholder
      averageRating: course.averageRating || 0,
      totalRevenue: 12000, // Placeholder
      lastUpdated: new Date(course.updatedAt).toLocaleDateString(),
    },
  };

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-2">
        <CourseDetailsForm data={data.details} />
        <CourseThumbnail url={data.details.thumbnailUrl} />
        <CourseSettings data={data.settings} />
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost">
              <Copy className="h-4 w-4" /> Duplicate Course
            </Button>
            <Button variant="destructive" className="">
              <Trash2 className="h-4 w-4" /> Delete Course
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">Preview Course</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <CourseStatistics data={data.stats} />
        <QuickActions />
      </div>
    </div>
  );
}

function CourseStatisticsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function SettingsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
            <div className="mt-4 flex justify-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-10" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-10" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-5 w-10" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <CourseStatisticsSkeleton />
        <QuickActionsSkeleton />
      </div>
    </div>
  );
}
