'use client';

import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../shared/logo';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
        <div
          className="bg-accent/10 absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />

        <div className="absolute inset-0 opacity-50">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="wave"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 50 Q 25 25, 50 50 T 100 50"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  className="text-muted-foreground/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex h-[90vh] items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-12 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <Logo variant="icon" />
            </div>
            <span className="text-foreground text-2xl font-bold">
              LearnSphere
            </span>
          </div>

          <Card className="">
            <CardContent className="px-8 pt-12 pb-12">
              {!isSubmitted ? (
                <div className="space-y-8">
                  <div className="flex justify-center">
                    <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                      <Logo variant="icon" />
                    </div>
                  </div>

                  <div className="space-y-4 text-center">
                    <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
                      A new way to learn
                      <br />
                      with the power of AI
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-md text-lg">
                      Be the first to experience the future of e-learning. Get
                      notified when we launch.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-md space-y-4"
                  >
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 w-full text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        'Get Notified'
                      )}
                    </Button>
                  </form>

                  <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-3">
                    {[
                      'AI-powered learning',
                      'Personalized courses',
                      'Expert instructors',
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-start"
                      >
                        <CheckCircle2 className="text-primary h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="bg-primary/10 animate-in zoom-in-50 flex h-20 w-20 items-center justify-center rounded-full duration-500">
                      <CheckCircle2 className="text-primary h-10 w-10" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-foreground text-3xl font-bold">
                      You're on the list!
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-md">
                      We've sent a confirmation to{' '}
                      <span className="text-foreground font-medium">
                        {email}
                      </span>
                      . You'll be among the first to know when we launch.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="mt-4"
                  >
                    Subscribe another email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-muted-foreground mt-8 text-center text-sm">
            Join over 10,000+ learners waiting for launch
          </p>
        </div>
      </div>
    </div>
  );
}
