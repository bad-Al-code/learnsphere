'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AIChatSidebarProps {
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'Summarize this lesson',
  'Give me practice questions',
  'Explain this in simpler terms',
  'Show me real-world examples',
];

export function AIChatSidebar({
  lessonId,
  lessonTitle,
  onClose,
}: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI learning assistant. I can help you understand "${lessonTitle}" better. Feel free to ask me anything!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me explain that concept in detail...",
        'Based on what we covered in this lesson, here are the key points...',
        'I can help you understand that better. Think of it this way...',
        'Excellent question! This is an important concept in this lesson.',
        'Let me break that down into simpler terms for you...',
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomResponse },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="bg-card flex h-full flex-col border-l">
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1.5">
            <Sparkles className="text-primary h-4 w-4" />
          </div>
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm break-words whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-4 py-2.5">
                <div className="flex gap-1">
                  <div className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
                  <div
                    className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-border space-y-3 border-t p-4">
        {messages.length <= 1 && (
          <div className="space-y-2">
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
              <Lightbulb className="h-3 w-3" />
              <span>Suggested prompts:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start px-3 py-2 text-left text-xs whitespace-normal"
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSendMessage()
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
