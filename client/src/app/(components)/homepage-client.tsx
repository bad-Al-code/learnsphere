"use client";

import OnboardingModal from "@/components/shared/onboarding-modal";
import { useEffect, useState } from "react";

type User = {
  firstName: string | null;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
} | null;

interface HomepageClientProps {
  user: User;
}

export function HomepageClient({ user }: HomepageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && !user.headline) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <OnboardingModal
      user={user}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  );
}
