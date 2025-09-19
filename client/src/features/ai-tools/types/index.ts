export type ChatMessage = {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
};
