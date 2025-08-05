import { BookOpen, Home, LayoutGrid, Users } from "lucide-react";

export const navItems = [
  { href: "/admin", label: "Dashboard", value: "dashboard", icon: Home },
  { href: "/admin/users", label: "Users", value: "users", icon: Users },
  {
    href: "/admin/courses",
    label: "Courses",
    value: "courses",
    icon: BookOpen,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    value: "categories",
    icon: LayoutGrid,
  },
];
