'use client';

import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session-store';
import { InstructorApplicationModal } from '../shared/instructor-appliaction-modal';

export function InstructorApplyButton() {
  const user = useSessionStore((state) => state.user);

  if (!user || user.status === 'instructor' || user.role === 'admin') {
    return null;
  }

  if (user.status === 'pending_instructor_review') {
    return (
      <Button variant="outline" disabled className="w-full sm:w-auto">
        Application Pending
      </Button>
    );
  }

  if (user.role === 'student' && user.status === 'active') {
    return (
      <InstructorApplicationModal>
        <Button variant="secondary" className="w-full sm:w-auto">
          Become an Instructor
        </Button>
      </InstructorApplicationModal>
    );
  }

  return null;
}
