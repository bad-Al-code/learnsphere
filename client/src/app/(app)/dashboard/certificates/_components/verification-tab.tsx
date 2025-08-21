'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Search } from 'lucide-react';
import React from 'react';

interface Verification {
  id: string;
  student: string;
  course: string;
  date: string;
}

const placeholderVerifications: Verification[] = [
  {
    id: 'VER-DS101-2024-001',
    student: 'Sarah Chen',
    course: 'Data Science Fundamentals',
    date: '12/10/2024',
  },
  {
    id: 'VER-WD201-2024-002',
    student: 'Michael Rodriguez',
    course: 'Web Development Bootcamp',
    date: '12/10/2024',
  },
  {
    id: 'VER-DM301-2024-003',
    student: 'Emma Thompson',
    course: 'Digital Marketing Mastery',
    date: '12/15/2024',
  },
];

export function VerificationTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <p className="text-muted-foreground">
            Verify the authenticity of issued certificates using verification
            codes
          </p>
        </CardHeader>
        <CardContent>
          <Label htmlFor="verification-code">Verification Code</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="verification-code"
              placeholder="Enter verification code (e.g., VER-DS101-2024-001)"
            />
            <Button>
              <Search className="mr-2 h-4 w-4" /> Verify
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {placeholderVerifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-semibold">{item.id}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.student} - {item.course}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p>Verified</p>
                    <p className="text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                {index < placeholderVerifications.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function VerificationTabSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-52" />
          <Skeleton className="mt-1 h-4 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-32" />
          <div className="mt-1.5 flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
                <Skeleton className="h-5 w-24" />
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
