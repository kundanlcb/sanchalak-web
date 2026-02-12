/**
 * Theme Toggle Component
 * Switches between light, dark, and system theme modes
 * Uses icons: Sun (light), Moon (dark), Monitor (system)
 */

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themeOptions.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'p-2 rounded-md transition-colors',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            theme === value && 'bg-white dark:bg-gray-900 shadow-sm'
          )}
          aria-label={`Switch to ${label} theme`}
          title={`${label} theme`}
        >
          <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
      ))}
    </div>
  );
};

export { ThemeToggle };
