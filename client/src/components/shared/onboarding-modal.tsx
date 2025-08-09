'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OnboardingForm } from './onboarding-form';

interface OnboardingModalProps {
  user: {
    firstName: string | null;
    email: string;
    headline: string | null;
    bio: string | null;
    websiteUrl: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function OnboardingModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: OnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome, {user.firstName}!
          </DialogTitle>
          <DialogDescription>
            Just one more step. Let's complete your profile to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <OnboardingForm userData={user} onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
