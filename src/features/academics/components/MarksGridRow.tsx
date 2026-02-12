import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface MarksGridRowProps {
  student: {
    studentID: string;
    name: string;
    rollNumber: number;
  };
  marksObtained?: number; // Current saved value
  maxMarks: number;
  isUpdating: boolean;
  onUpdate: (value: number) => void;
}

export const MarksGridRow: React.FC<MarksGridRowProps> = ({
  student,
  marksObtained,
  maxMarks,
  isUpdating,
  onUpdate,
}) => {
  const [value, setValue] = useState<string>(marksObtained?.toString() ?? '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop updates (e.g. if updated from server or optimistic rollback)
  useEffect(() => {
    if (marksObtained !== undefined && marksObtained !== null) {
      if (!isUpdating) { // Don't overwrite if user is typing/updating currently? 
         // Actually for optimistic update, marksObtained effectively becomes the new value immediately.
         setValue(marksObtained.toString());
      }
    }
  }, [marksObtained, isUpdating]);

  const handleBlur = () => {
    const num = parseFloat(value);
    
    // Basic Validation
    if (value === '') return; // Do nothing if empty? Or delete?
    if (isNaN(num)) {
        setError('Invalid');
        return;
    }
    if (num < 0 || num > maxMarks) {
        setError(`Max ${maxMarks}`);
        // Reset or keep error?
        return;
    }

    setError(null);
    if (num !== marksObtained) {
        onUpdate(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        inputRef.current?.blur();
        // focus next row logic handled by parent hooks usually
    }
  };

  // Status Indicator
  let statusIcon = null;
  if (isUpdating) {
      statusIcon = <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
  } else if (error) {
      statusIcon = <AlertCircle className="w-4 h-4 text-red-500" />;
  } else if (marksObtained !== undefined) {
      statusIcon = <Check className="w-4 h-4 text-green-500" />;
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        {student.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {student.rollNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap relative">
        <input
          ref={inputRef}
          type="number"
          min="0"
          max={maxMarks}
          className={clsx(
            "block w-24 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3",
            error 
             ? "ring-red-300 focus:ring-red-500 bg-red-50" 
             : "ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 disabled:opacity-50"
          )}
          value={value}
          onChange={(e) => {
             setValue(e.target.value);
             if (error) setError(null);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isUpdating}
        />
        {error && (
            <span className="absolute left-6 bottom-0 text-xs text-red-500">{error}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {statusIcon}
      </td>
    </tr>
  );
};
