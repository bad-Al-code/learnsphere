import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | null | undefined,
  currency: string = 'INR'
): string {
  if (price === null || typeof price === 'undefined' || price === 0) {
    return 'Free';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export const getInitials = (
  firstName?: string | null,
  lastName?: string | null
) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatTime(seconds: number): string {
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration in minutes into a human-readable string (e.g., 90 -> "1h 30m").
 * @param totalMinutes The total duration in minutes.
 * @returns A formatted string.
 */
export function formatDuration(
  totalMinutes: number | null | undefined
): string {
  if (totalMinutes === null || totalMinutes === undefined || totalMinutes === 0)
    return '0m';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim() || '0m';
}

export const getLetterGrade = (grade: number | null | undefined): string => {
  if (grade === null || grade === undefined) return 'N/A';

  if (grade >= 97) return 'A+';
  if (grade >= 93) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 87) return 'B+';
  if (grade >= 83) return 'B';
  if (grade >= 80) return 'B-';
  if (grade >= 77) return 'C+';
  if (grade >= 73) return 'C';
  if (grade >= 70) return 'C-';
  if (grade >= 67) return 'D+';
  if (grade >= 63) return 'D';
  if (grade >= 60) return 'D-';

  return 'F';
};

export const generateOptimisticTitle = (prompt: string): string => {
  const promptWords = prompt.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && 
    !['what', 'how', 'why', 'when', 'where', 'can', 'could', 'would', 'should', 'explain', 'tell', 'about'].includes(word)
  );

  const keyWords = promptWords.slice(0, 4).join(' ');
  
  if (keyWords.length > 0) {
    const title = keyWords.replace(/\b\w/g, l => l.toUpperCase());

    return title.length > 50 ? title.substring(0, 47) + '...' : title;
  }

  return prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;
};