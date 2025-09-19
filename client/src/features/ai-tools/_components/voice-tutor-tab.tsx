'use client';

import {
  Bot,
  Brain,
  Clock,
  MessageCircle,
  Mic,
  MicOff,
  Play,
  Send,
  Square,
  User,
  Volume2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useVoiceTutor } from '../hooks/useAiVoiceTutor';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

const voiceFeatures = [
  {
    icon: MessageCircle,
    label: 'Natural conversation flow',
    color: 'text-blue-500',
  },
  { icon: Zap, label: 'Real-time responses', color: 'text-yellow-500' },
  { icon: Brain, label: 'Context-aware tutoring', color: 'text-purple-500' },
  { icon: Volume2, label: 'High-quality audio', color: 'text-green-500' },
];

const quickPrompts = [
  { text: 'Explain this concept to me', category: 'Understanding' },
  { text: 'Quiz me on this topic', category: 'Practice' },
  { text: 'Help me with my assignment', category: 'Support' },
  { text: 'Create a study plan', category: 'Planning' },
];

function ConnectionStatus({ status }: { status: string }) {
  const statusConfig = {
    disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
      description: 'Ready to connect',
    },
    connecting: {
      color: 'bg-yellow-500 animate-pulse',
      text: 'Connecting',
      description: 'Establishing connection...',
    },
    connected: {
      color: 'bg-green-500 animate-pulse',
      text: 'Connected',
      description: 'Voice session active',
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      description: 'Connection failed',
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.disconnected;

  return (
    <div className="flex items-center gap-3">
      <div className={cn('h-3 w-3 rounded-full', config.color)} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{config.text}</span>
        <span className="text-muted-foreground text-xs">
          {config.description}
        </span>
      </div>
    </div>
  );
}

function VoiceVisualizer({
  isSpeaking,
  isRecording,
}: {
  isSpeaking: boolean;
  isRecording: boolean;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div
          className={cn(
            'h-24 w-24 rounded-full border-4 transition-all duration-300',
            {
              'animate-pulse border-green-500 shadow-lg shadow-green-500/25':
                isRecording,
              'animate-pulse border-blue-500 shadow-lg shadow-blue-500/25':
                isSpeaking,
              'border-muted': !isRecording && !isSpeaking,
            }
          )}
        />

        <div
          className={cn(
            'absolute inset-2 flex items-center justify-center rounded-full transition-all duration-300',
            {
              'bg-green-500/20': isRecording,
              'bg-blue-500/20': isSpeaking,
              'bg-muted': !isRecording && !isSpeaking,
            }
          )}
        >
          {isRecording ? (
            <Mic className="h-8 w-8 animate-pulse text-green-600" />
          ) : isSpeaking ? (
            <Volume2 className="h-8 w-8 animate-pulse text-blue-600" />
          ) : (
            <MicOff className="text-muted-foreground h-8 w-8" />
          )}
        </div>

        {(isRecording || isSpeaking) && (
          <div className="absolute -inset-4 flex items-center justify-center">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 animate-pulse rounded-full',
                    isRecording ? 'bg-green-500' : 'bg-blue-500'
                  )}
                  style={{
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatMessage({
  message,
  isUser,
}: {
  message: { content: string; timestamp?: Date };
  isUser: boolean;
}) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg p-4 transition-all duration-200',
        isUser ? 'bg-primary/5 ml-8' : 'bg-muted/50 mr-8'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'AI Tutor'}
          </span>
          {message.timestamp && (
            <span className="text-muted-foreground text-xs">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
      </div>
    </div>
  );
}

function QuickPrompts({
  onPromptClick,
  disabled,
}: {
  onPromptClick: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
          Quick Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onPromptClick(prompt.text)}
            className="h-auto w-full justify-start p-2 text-left hover:bg-emerald-500/10"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {prompt.category}
              </span>
              <span className="text-sm">{prompt.text}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function VoiceFeatures() {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
          Voice Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {voiceFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', feature.color)} />
              <span className="text-sm text-blue-700 dark:text-blue-400">
                {feature.label}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function TextInput({
  onSendMessage,
  disabled,
}: {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}

function MainVoiceInterface({
  status,
  isSpeaking,
  isRecording,
  onToggleSession,
  onSendMessage,
}: {
  status: string;
  isSpeaking: boolean;
  isRecording: boolean;
  onToggleSession: () => void;
  onSendMessage: (message: string) => void;
}) {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <Card className="relative overflow-hidden">
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

      <CardHeader className="relative space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="from-primary to-primary/60 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
            <Mic className="text-primary-foreground h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Voice AI Tutor</CardTitle>
            <CardDescription>
              Interactive voice conversations with your learning assistant
            </CardDescription>
          </div>
        </div>

        <ConnectionStatus status={status} />
      </CardHeader>

      <CardContent className="relative space-y-6">
        <VoiceVisualizer isSpeaking={isSpeaking} isRecording={isRecording} />

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={onToggleSession}
            disabled={isConnecting}
            size="lg"
            className={cn('min-w-[160px] transition-all duration-200', {
              'bg-green-600 text-white hover:bg-green-700': isConnected,
              'bg-red-600 text-white hover:bg-red-700': status === 'error',
            })}
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting...
              </div>
            ) : isConnected ? (
              <>
                <Square className="h-4 w-4" />
                End Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Voice Chat
              </>
            )}
          </Button>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            {isConnected && (
              <>
                <Badge
                  variant={isRecording ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  <Mic className="h-3 w-3" />
                  {isRecording ? 'Recording' : 'Listening'}
                </Badge>
                <Badge
                  variant={isSpeaking ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  <Volume2 className="h-3 w-3" />
                  {isSpeaking ? 'Speaking' : 'Ready'}
                </Badge>
              </>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="space-y-2">
            <Separator />
            <div className="space-y-2">
              <p className="text-muted-foreground text-center text-sm">
                Or type a message
              </p>
              <TextInput
                onSendMessage={onSendMessage}
                disabled={!isConnected}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConversationPanel({
  transcript,
  isSpeaking,
}: {
  transcript: Array<{
    id: string;
    role: string;
    content: string;
    timestamp?: Date;
  }>;
  isSpeaking: boolean;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Live Transcript
            </CardTitle>
            <CardDescription>Real-time conversation history</CardDescription>
          </div>
          {transcript.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {transcript.length} messages
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 pb-4">
            {transcript.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <MessageCircle className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  Your conversation will appear here
                </p>
              </div>
            ) : (
              transcript.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={{
                    content: msg.content,
                    timestamp: msg.timestamp,
                  }}
                  isUser={msg.role === 'user'}
                />
              ))
            )}

            {isSpeaking && (
              <div className="bg-muted/50 mr-8 flex items-center gap-3 rounded-lg p-4">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <Bot className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">AI Tutor</span>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-primary h-2 w-2 animate-pulse rounded-full"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function VoiceTutorTab({ courseId }: { courseId?: string }) {
  const {
    status,
    transcript,
    isSpeaking,
    isRecording,
    startSession,
    stopSession,
    sendTextMessage,
  } = useVoiceTutor();

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  const handleToggleSession = () => {
    if (status === 'connected') {
      stopSession();
    } else {
      startSession(courseId);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (status === 'connected') {
      sendTextMessage(prompt);
    }
  };

  const handleSendMessage = (message: string) => {
    if (status === 'connected') {
      sendTextMessage(message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="lg:col-span-2">
        <MainVoiceInterface
          status={status}
          isSpeaking={isSpeaking}
          isRecording={isRecording}
          onToggleSession={handleToggleSession}
          onSendMessage={handleSendMessage}
        />
      </div>

      <ConversationPanel transcript={transcript} isSpeaking={isSpeaking} />
      <div className="grid grid-cols-1 space-x-2 lg:grid-cols-2">
        <VoiceFeatures />
        <QuickPrompts
          onPromptClick={handleQuickPrompt}
          disabled={status !== 'connected'}
        />
      </div>
    </div>
  );
}

export function VoiceTutorTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VoiceInterfaceSkeleton />
        </div>
        <div className="space-y-2">
          <FeatureCardSkeleton />
          <FeatureCardSkeleton />
        </div>
      </div>
      <ConversationSkeleton />
    </div>
  );
}

function VoiceInterfaceSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="h-3 w-3 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ConversationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3 rounded-lg p-4',
              i % 2 === 0 ? 'ml-8' : 'mr-8'
            )}
          >
            <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
