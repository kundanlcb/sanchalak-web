import React, { useState } from 'react';
import { BadgeCheck, FileText } from 'lucide-react';
import { IDCardGenerator } from '../components/IDCardGenerator';
import { TCGenerator } from '../components/TCGenerator';

type DocumentTab = 'id-cards' | 'tc';

const tabConfig: { key: DocumentTab; label: string; icon: React.ElementType }[] = [
    { key: 'id-cards', label: 'ID Cards', icon: BadgeCheck },
    { key: 'tc', label: 'Transfer Certificates', icon: FileText },
];

export const DocumentManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DocumentTab>('id-cards');

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between items-start gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Document Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generate, preview, and download student ID cards and Transfer Certificates.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Document Tabs">
                    {tabConfig.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    flex items-center gap-2 whitespace-nowrap pb-3 px-4 border-b-2 font-medium text-sm transition-colors
                                    ${isActive
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'id-cards' && <IDCardGenerator />}
            {activeTab === 'tc' && <TCGenerator />}
        </div>
    );
};
