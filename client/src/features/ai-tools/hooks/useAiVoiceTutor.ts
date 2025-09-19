'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ChatMessage } from '../types';

type SessionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useVoiceTutor = () => {
  const [status, setStatus] = useState<SessionStatus>('disconnected');
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isPlayingRef = useRef(false);

  const processAudioData = useCallback(
    async (audioBlob: Blob): Promise<ArrayBuffer | null> => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
        }

        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const arrayBuffer = await audioBlob.arrayBuffer();

        if (arrayBuffer.byteLength === 0) {
          console.warn('Empty audio buffer received');
          return null;
        }

        let audioBuffer: AudioBuffer;
        try {
          audioBuffer =
            await audioContextRef.current.decodeAudioData(arrayBuffer);
        } catch (decodeError) {
          console.warn(
            'Failed to decode audio data, might be silence or invalid format:',
            decodeError
          );
          return null;
        }

        const channelData = audioBuffer.getChannelData(0);

        const hasSignal = channelData.some(
          (sample) => Math.abs(sample) > 0.001
        );
        if (!hasSignal) {
          console.debug('Audio chunk appears to be silence, skipping');
          return null;
        }

        let processedData = channelData;
        if (audioBuffer.sampleRate !== 16000) {
          const resampleRatio = 16000 / audioBuffer.sampleRate;
          const newLength = Math.round(channelData.length * resampleRatio);
          const resampledData = new Float32Array(newLength);

          for (let i = 0; i < newLength; i++) {
            const sourceIndex = i / resampleRatio;
            const index = Math.floor(sourceIndex);
            const fraction = sourceIndex - index;

            if (index + 1 < channelData.length) {
              resampledData[i] =
                channelData[index] * (1 - fraction) +
                channelData[index + 1] * fraction;
            } else {
              resampledData[i] = channelData[index] || 0;
            }
          }
          processedData = resampledData;
        }

        const pcmBuffer = new ArrayBuffer(processedData.length * 2);
        const pcmView = new Int16Array(pcmBuffer);

        for (let i = 0; i < processedData.length; i++) {
          const clampedValue = Math.max(-1, Math.min(1, processedData[i]));
          pcmView[i] = Math.round(clampedValue * 32767);
        }

        return pcmBuffer;
      } catch (error) {
        console.error('Error processing audio data:', error);
        return null;
      }
    },
    []
  );

  const playPCMAudio = useCallback(async (pcmBuffer: ArrayBuffer) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const pcmArray = new Int16Array(pcmBuffer);
      const floatArray = new Float32Array(pcmArray.length);

      for (let i = 0; i < pcmArray.length; i++) {
        floatArray[i] = pcmArray[i] / 32767;
      }

      const audioBuffer = audioContextRef.current.createBuffer(
        1,
        floatArray.length,
        16000
      );
      audioBuffer.copyToChannel(floatArray, 0);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      setIsSpeaking(true);
      isPlayingRef.current = true;

      source.onended = () => {
        setIsSpeaking(false);
        isPlayingRef.current = false;
        processAudioQueue();
      };

      source.start(0);
    } catch (error) {
      console.error('Error playing PCM audio:', error);
      setIsSpeaking(false);
      isPlayingRef.current = false;
      processAudioQueue();
    }
  }, []);

  const processAudioQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;

    const audioData = audioQueueRef.current.shift();
    if (audioData) {
      playPCMAudio(audioData);
    }
  }, [playPCMAudio]);

  const addToTranscript = useCallback(
    (role: 'user' | 'assistant', content: string) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: role === 'assistant' ? 'model' : 'user',
        content,
        timestamp: new Date(),
      };

      setTranscript((prev) => [...prev, newMessage]);
    },
    []
  );

  const startSession = useCallback(
    async (courseId: string) => {
      try {
        setStatus('connecting');
        setTranscript([]);

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
        }

        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const wsUrl = `${process.env.NEXT_PUBLIC_USER_SERVICE_URL?.replace(/^http/, 'ws')}/api/ai/voice-tutor?courseId=${courseId}`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = async () => {
          try {
            setStatus('connected');
            toast.success('Voice Tutor connected!');

            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                sampleRate: { ideal: 16000 },
                channelCount: { exact: 1 },
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleSize: { ideal: 16 },
              },
            });

            streamRef.current = stream;

            let mimeType = '';
            const possibleTypes = [
              'audio/webm;codecs=opus',
              'audio/webm',
              'audio/mp4',
              'audio/ogg;codecs=opus',
              'audio/wav',
            ];

            for (const type of possibleTypes) {
              if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                console.log('Using MIME type:', mimeType);
                break;
              }
            }

            const mediaRecorderOptions: MediaRecorderOptions = {
              audioBitsPerSecond: 16000,
            };

            if (mimeType) {
              mediaRecorderOptions.mimeType = mimeType;
            }

            const mediaRecorder = new MediaRecorder(
              stream,
              mediaRecorderOptions
            );
            mediaRecorderRef.current = mediaRecorder;

            let chunkCount = 0;

            mediaRecorder.ondataavailable = async (event) => {
              if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                chunkCount++;
                console.log(
                  `Processing audio chunk ${chunkCount}, size: ${event.data.size}`
                );

                try {
                  const pcmBuffer = await processAudioData(event.data);
                  if (pcmBuffer && pcmBuffer.byteLength > 0) {
                    ws.send(pcmBuffer);
                    console.log(`Sent PCM data, size: ${pcmBuffer.byteLength}`);
                  } else {
                    console.debug('Skipped empty or invalid audio chunk');
                  }
                } catch (error) {
                  console.error('Error processing audio chunk:', error);

                  if (chunkCount % 10 === 0) {
                    toast.error('Audio processing issues detected');
                  }
                }
              }
            };

            mediaRecorder.onerror = (event) => {
              console.error('MediaRecorder error:', event);
              toast.error('Microphone recording error');
            };

            mediaRecorder.start(500);
            setIsRecording(true);
            console.log('MediaRecorder started with:', {
              mimeType: mediaRecorder.mimeType,
              state: mediaRecorder.state,
            });
          } catch (error) {
            console.error('Error setting up audio recording:', error);
            toast.error('Failed to access microphone');
            setStatus('error');
          }
        };

        ws.onmessage = async (event) => {
          try {
            if (event.data instanceof ArrayBuffer) {
              audioQueueRef.current.push(event.data);
              if (!isPlayingRef.current) {
                processAudioQueue();
              }
            } else if (event.data instanceof Blob) {
              const arrayBuffer = await event.data.arrayBuffer();

              audioQueueRef.current.push(arrayBuffer);
              if (!isPlayingRef.current) {
                processAudioQueue();
              }
            } else if (typeof event.data === 'string') {
              try {
                const data = JSON.parse(event.data);

                if (data.type === 'transcript' && data.text) {
                  addToTranscript(
                    data.role === 'user' ? 'user' : 'assistant',
                    data.text
                  );
                } else if (data.type === 'error') {
                  toast.error(data.message || 'Session error');
                }
              } catch {
                addToTranscript('assistant', event.data);
              }
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          toast.error('Voice connection error');
          setStatus('error');
        };

        ws.onclose = (event) => {
          setStatus('disconnected');
          setIsRecording(false);
          setIsSpeaking(false);
          isPlayingRef.current = false;

          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
          ) {
            mediaRecorderRef.current.stop();
          }

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          audioQueueRef.current = [];

          if (event.code !== 1000) {
            toast.error(
              `Connection closed: ${event.reason || 'Unknown error'}`
            );
          } else {
            toast.info('Voice Tutor disconnected');
          }
        };
      } catch (error) {
        console.error('Error starting voice session:', error);
        toast.error('Failed to start voice session');
        setStatus('error');
      }
    },
    [processAudioData, processAudioQueue, addToTranscript]
  );

  const stopSession = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
  }, []);

  const sendTextMessage = useCallback(
    (message: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(message);
        addToTranscript('user', message);
      }
    },
    [addToTranscript]
  );

  return {
    status,
    transcript,
    isSpeaking,
    isRecording,
    startSession,
    stopSession,
    sendTextMessage,
  };
};
