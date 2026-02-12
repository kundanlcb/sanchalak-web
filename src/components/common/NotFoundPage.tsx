import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, MoveLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center space-y-6 max-w-md animate-in">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <MoveLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
