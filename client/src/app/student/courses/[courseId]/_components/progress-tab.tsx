'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CourseDetail } from '../schema/course-detail.schema';

interface ProgressTabProps {
  courseDetail: CourseDetail;
}

export function ProgressTab({ courseDetail }: ProgressTabProps) {
  const moduleProgress = courseDetail.modules.map((m) => ({
    name: m.title,
    progress: m.completionPercentage,
  }));

  const weeklyProgress = [
    { week: 'Week 1', completed: 3, total: 5 },
    { week: 'Week 2', completed: 4, total: 5 },
    { week: 'Week 3', completed: 2, total: 5 },
    { week: 'Week 4', completed: 5, total: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Course Completion</span>
              <span className="text-sm font-semibold">
                {courseDetail.progressPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={courseDetail.progressPercentage} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-primary text-2xl font-bold">
                {courseDetail.totalLessons}
              </p>
              <p className="text-muted-foreground text-xs">Total Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-2xl font-bold">
                {Math.round(
                  (courseDetail.progressPercentage / 100) *
                    courseDetail.totalLessons
                )}
              </p>
              <p className="text-muted-foreground text-xs">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-2xl font-bold">
                {courseDetail.totalLessons -
                  Math.round(
                    (courseDetail.progressPercentage / 100) *
                      courseDetail.totalLessons
                  )}
              </p>
              <p className="text-muted-foreground text-xs">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Module Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleProgress.map((module) => (
              <div key={module.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{module.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {module.progress}%
                  </span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-xs">Total Time Spent</p>
              <p className="text-foreground mt-1 text-2xl font-bold">12h 45m</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-xs">Average Score</p>
              <p className="text-foreground mt-1 text-2xl font-bold">87%</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-xs">Assignments Done</p>
              <p className="text-foreground mt-1 text-2xl font-bold">8/10</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-xs">Quizzes Passed</p>
              <p className="text-foreground mt-1 text-2xl font-bold">6/8</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
