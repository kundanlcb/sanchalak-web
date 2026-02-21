import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ShieldCheck,
    Save,
    UserCog,
    ChevronRight,
    Info,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { schoolOpsApi } from '../services/api';
import { cn } from '../../../utils/cn';

const ROLES = [
    { id: 'ROLE_TEACHER', name: 'Teacher', description: 'Access to classroom, students, and grading' },
    { id: 'ROLE_STAFF', name: 'Staff', description: 'General administration and support access' },
    { id: 'ROLE_STUDENT', name: 'Student', description: 'View academics, marks, and pay fees' },
    { id: 'ROLE_PARENT', name: 'Parent', description: 'Monitor children progress and pay fees' },
];

const RoleManagementPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedRole, setSelectedRole] = useState(ROLES[0].id);

    // Fetch both available features and current role permissions
    const { data: permissionData, isLoading } = useQuery({
        queryKey: ['school-permissions'],
        queryFn: () => schoolOpsApi.getSchoolPermissions(),
    });

    const mutation = useMutation({
        mutationFn: ({ roleName, features }: { roleName: string, features: string[] }) =>
            schoolOpsApi.updateRolePermissions(roleName, features),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['school-permissions'] });
            // In a real app, you'd show a success toast here
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Process data from backend DTO structure
    const availableFeatures = (permissionData as any)?.availableFeatures || [];
    const rolePermissions = (permissionData as any)?.rolePermissions || [];

    // Filter permissions for the currently selected role
    const currentRoleFeatures = rolePermissions
        .filter((p: any) => p.roleName === selectedRole)
        .map((p: any) => p.featureCode);

    const togglePermission = (featureCode: string) => {
        const newFeatures = currentRoleFeatures.includes(featureCode)
            ? currentRoleFeatures.filter((f: string) => f !== featureCode)
            : [...currentRoleFeatures, featureCode];

        mutation.mutate({ roleName: selectedRole, features: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                        Access Control
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage what features are available for each role in your school.
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    <Info className="w-4 h-4" />
                    Admins always have full access.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Role Selection Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {ROLES.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={cn(
                                "w-full text-left px-4 py-4 rounded-xl transition-all border-2",
                                selectedRole === role.id
                                    ? "bg-white dark:bg-gray-800 border-blue-500 shadow-md transform scale-[1.02]"
                                    : "bg-gray-50 dark:bg-gray-900/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        selectedRole === role.id ? "bg-blue-100 text-blue-600" : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                    )}>
                                        <UserCog className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{role.name}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{role.description}</div>
                                    </div>
                                </div>
                                <ChevronRight className={cn(
                                    "w-4 h-4 transition-transform",
                                    selectedRole === role.id ? "rotate-90 text-blue-500" : "text-gray-400"
                                )} />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Feature Permissions Grid */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Features for {ROLES.find(r => r.id === selectedRole)?.name}
                                </h3>
                                <p className="text-sm text-gray-500">Toggle the features this role can access.</p>
                            </div>
                            {mutation.isPending && (
                                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium animate-pulse">
                                    <Save className="w-4 h-4" />
                                    Saving changes...
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            {availableFeatures.length === 0 ? (
                                <div className="text-center py-12">
                                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No features found in your current subscription plan.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableFeatures.map((featureCode: string) => {
                                        const isAllowed = currentRoleFeatures.includes(featureCode);
                                        return (
                                            <button
                                                key={featureCode}
                                                onClick={() => togglePermission(featureCode)}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                                    isAllowed
                                                        ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30"
                                                        : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        isAllowed ? "bg-blue-100 text-blue-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                    )}>
                                                        {isAllowed ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6 opacity-30" />}
                                                    </div>
                                                    <div className="text-left font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                                                        {featureCode.replace('_', ' ')}
                                                    </div>
                                                </div>

                                                <div className={cn(
                                                    "w-12 h-6 rounded-full relative transition-colors duration-200",
                                                    isAllowed ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                                        isAllowed ? "left-7" : "left-1"
                                                    )} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManagementPage;
