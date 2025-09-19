'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChatMessage } from '../types';

type SessionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useVoiceTutor = () => {
  const [status, setStatus] = useState<SessionStatus>('disconnected');
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioQueueRef = useRef<Blob[]>([]);

  const processAudioQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || isSpeaking) return;

    setIsSpeaking(true);
    const blob = audioQueueRef.current.shift();
    if (!blob) return;

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      setIsSpeaking(false);
      processAudioQueue();
    };
  }, [isSpeaking]);

  const startSession = useCallback(
    async (courseId: string) => {
      setStatus('connecting');
      setTranscript([]);

      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_WS_URL}/api/ai/voice-tutor?courseId=${courseId}`
      );

      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('connected');
        toast.success('Voice Tutor connected!');

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorderRef.current.start(1000);
      };

      ws.onmessage = async (event) => {
        const blob = new Blob([event.data], { type: 'audio/pcm' });

        audioQueueRef.current.push(blob);
        processAudioQueue();
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);

        toast.error('Voice connection error.');
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
        toast.info('Voice Tutor disconnected.');
      };
    },

    [processAudioQueue]
  );

  const stopSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  return { status, transcript, isSpeaking, startSession, stopSession };
};
