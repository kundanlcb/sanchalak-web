/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx and tailwind-merge for proper class handling
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
