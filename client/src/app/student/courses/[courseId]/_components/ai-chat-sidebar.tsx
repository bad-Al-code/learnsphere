'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface AIChatSidebarProps {
  lessonId: string;
  onClose: () => void;
}

export function AIChatSidebar({ lessonId, onClose }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI learning assistant. Ask me anything about this lesson!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "That's a great question! Let me explain that concept in more detail...",
        "Based on what we covered in this lesson, here's what you need to know...",
        'I can help you understand that better. Think of it this way...',
        'Excellent question! This is an important concept in React development.',
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomResponse },
      ]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-card flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-lg px-4 py-2">
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
      </div>

      <div className="border-border space-y-2 border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-muted-foreground text-xs">
          💡 Try asking: "Summarize this lesson" or "Give me examples"
        </div>
      </div>
    </div>
  );
}
