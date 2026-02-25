import React, { useEffect, useRef } from 'react';
import { X, Download, Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    pdfBlob: Blob | null;
    title?: string;
    isLoading?: boolean;
    onClose: () => void;
    onDownload?: () => void;
    downloadFileName?: string;
}

/**
 * PdfPreviewModal
 * Displays a PDF Blob inside an <iframe> using a Blob URL.
 * Provides Download and Close actions.
 */
export const PdfPreviewModal: React.FC<Props> = ({
    isOpen,
    pdfBlob,
    title = 'PDF Preview',
    isLoading = false,
    onClose,
    onDownload,
    downloadFileName = 'document.pdf',
}) => {
    const blobUrlRef = useRef<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Build blob URL when blob changes
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            blobUrlRef.current = url;
            if (iframeRef.current) {
                iframeRef.current.src = url;
            }
            return () => URL.revokeObjectURL(url);
        }
    }, [pdfBlob]);

    // Trap Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDownload = () => {
        if (onDownload) { onDownload(); return; }
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm animate-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
                <div className="flex items-center gap-2">
                    {pdfBlob && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-200 dark:bg-gray-950 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-gray-900/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Preparing PDF preview…</p>
                    </div>
                )}
                {!isLoading && pdfBlob && (
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        title={title}
                        style={{ minHeight: '100%' }}
                    />
                )}
                {!isLoading && !pdfBlob && (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        No PDF available
                    </div>
                )}
            </div>
        </div>
    );
};
