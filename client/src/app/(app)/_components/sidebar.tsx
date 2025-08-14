import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  return (
    <div className="hidden md:block">
      <SidebarNav type="instructor" />
    </div>
  );
}
