import React from 'react';
import { TeacherManager } from '../components/TeacherManager';

export const TeacherListPage: React.FC = () => {
    return (
        <div className="space-y-4 sm:space-y-8">
            <TeacherManager />
        </div>
    );
};
