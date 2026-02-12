import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { cn } from '../../../utils/cn';
import * as noticeService from '../services/noticeService';
import type { Notice } from '../types/notice.types';

export const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadNotice = async () => {
      setIsLoading(true);
      try {
        const data = await noticeService.getNotice(id);
        setNotice(data);
        
        // Mark as read if not already
        if (!data.isRead) { // Note: In real app, check user specific read status
           await noticeService.markAsRead(id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notice');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotice();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Notice not found'}</p>
        <button
          onClick={() => navigate('/notices')}
          className="text-blue-600 hover:underline"
        >
          Back to Notice Board
        </button>
      </div>
    );
  }

  const priorityColors = {
    Low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Navigation */}
      <button
        onClick={() => navigate('/notices')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Board
      </button>

      {/* Main Content */}
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Ribbon */}
        <div className={cn(
          "h-2 w-full",
          notice.priority === 'Urgent' ? "bg-red-500" :
          notice.priority === 'High' ? "bg-orange-500" :
          notice.priority === 'Medium' ? "bg-blue-500" : "bg-gray-300"
        )}></div>

        <div className="p-6 sm:p-8">
          {/* Metadata Header */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={cn(
              "px-3 py-1 text-sm font-semibold rounded-full",
              priorityColors[notice.priority]
            )}>
              {notice.priority} Priority
            </span>
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(notice.publishDate).toLocaleDateString()}
            </span>
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1.5" />
              {new Date(notice.publishDate).toLocaleTimeString()}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {notice.title}
          </h1>

          {/* Author & Audience */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4 text-gray-400" />
              <span>Posted by <strong>{notice.authorName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Tag className="w-4 h-4 text-gray-400" />
              <span>Audience: <strong>{notice.audience}</strong></span>
            </div>
          </div>

          {/* Body */}
          <div 
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />

          {/* Attachments Placeholder */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Attachments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notice.attachments.map(att => (
                   <div key={att.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                     <span className="text-sm font-medium">{att.name}</span>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Expiry Notice */}
      {notice.expiryDate && (
        <div className="flex justify-center">
            <p className="text-xs text-gray-400">
                This notice expires on {new Date(notice.expiryDate).toLocaleDateString()}
            </p>
        </div>
      )}
    </div>
  );
};
