'use client';

import {
  StudentProfileCard,
  StudentProfileCardSkeleton,
} from './student-profile-card';

type Status = 'Active' | 'At Risk' | 'Inactive';
interface StudentData {
  name: string;
  email: string;
  avatarUrl?: string;
  status: Status;
  progress: number;
  grade: string;
  timeSpent: string;
  certificates: number;
  enrolledCourses: string[];
}

const placeholderData: StudentData[] = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    status: 'Active',
    progress: 92,
    grade: 'A',
    timeSpent: '45h 30m',
    certificates: 2,
    enrolledCourses: ['Data Science', 'Machine Learning'],
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    status: 'Active',
    progress: 88,
    grade: 'A-',
    timeSpent: '38h 15m',
    certificates: 1,
    enrolledCourses: ['Web Development', 'JavaScript'],
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@email.com',
    status: 'Active',
    progress: 76,
    grade: 'B+',
    timeSpent: '28h 45m',
    certificates: 0,
    enrolledCourses: ['Digital Marketing', 'SEO Fundamentals'],
  },
  {
    name: 'David Kim',
    email: 'david.kim@email.com',
    status: 'At Risk',
    progress: 45,
    grade: 'B',
    timeSpent: '15h 20m',
    certificates: 0,
    enrolledCourses: ['Graphic Design'],
  },
  {
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    status: 'Inactive',
    progress: 0,
    grade: 'N/A',
    timeSpent: '2h 10m',
    certificates: 0,
    enrolledCourses: ['Data Science'],
  },
];

export async function StudentProfilesTab() {
  const students = placeholderData;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {students.map((student) => (
        <StudentProfileCard key={student.email} data={student} />
      ))}
    </div>
  );
}

export function StudentProfilesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <StudentProfileCardSkeleton key={index} />
      ))}
    </div>
  );
}
