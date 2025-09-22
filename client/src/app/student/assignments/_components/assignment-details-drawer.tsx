import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useDevice } from '@/hooks/use-mobile';
import Link from 'next/link';
import { useAssignmentStore } from '../stores/assignment.store';

export function AssignmentDetails() {
  const { isDrawerOpen, selectedAssignment, actions } = useAssignmentStore();
  const device = useDevice();

  const onOpenChange = (open: boolean) => {
    if (!open) actions.closeDrawer();
  };

  if (!selectedAssignment) return null;

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{selectedAssignment.title}</DialogTitle>
        <DialogDescription>{selectedAssignment.course}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 p-4">
        <p className="text-muted-foreground text-sm">
          {selectedAssignment.description}
        </p>
        <div>
          <strong>Due:</strong>{' '}
          {new Date(selectedAssignment.dueDate!).toLocaleString()}
        </div>
        <div>
          <strong>Points:</strong> {selectedAssignment.points}
        </div>
        <Button asChild className="w-full">
          <Link href={`/student/assignments/${selectedAssignment.id}`}>
            Start Assignment
          </Link>
        </Button>
      </div>
    </>
  );

  if (device === 'desktop') {
    return (
      <Dialog open={isDrawerOpen} onOpenChange={onOpenChange}>
        <DialogContent className="">{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onOpenChange}>
      <DrawerContent>{content} </DrawerContent>
    </Drawer>
  );
}
