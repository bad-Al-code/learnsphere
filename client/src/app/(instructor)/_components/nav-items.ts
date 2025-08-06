import { BookOpen, LayoutDashboard, MessageSquare, Star } from "lucide-react";

export const instructorNavItems = [
  {
    href: "/dashboard/instructor",
    label: "Dashboard",
    icon: LayoutDashboard,
    value: "dashboard",
  },
  {
    href: "/dashboard/instructor/courses",
    label: "My Courses",
    icon: BookOpen,
    value: "courses",
  },
  {
    href: "/dashboard/instructor/q-and-a",
    label: "Q&A",
    icon: MessageSquare,
    value: "q-and-a",
  },
  {
    href: "/dashboard/instructor/reviews",
    label: "Reviews",
    icon: Star,
    value: "reviews",
  },
];
