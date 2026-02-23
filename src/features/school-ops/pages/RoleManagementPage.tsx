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
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                        Access Control
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage what features are available for each role in your school. (Only Admins and School Admins can manage rules)
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    <Info className="w-4 h-4" />
                    Admins always have full access.
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none">
                            <UserCog className="w-6 h-6" />
                        </div>
                        <div className="min-w-[320px] md:min-w-[400px]">
                            <label htmlFor="role-select" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                                School Role
                            </label>
                            <div className="relative group">
                                <select
                                    id="role-select"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="block w-full pl-4 pr-10 py-2.5 text-base border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm rounded-xl transition-all shadow-sm appearance-none font-medium group-hover:border-gray-300 dark:group-hover:border-gray-500"
                                >
                                    {ROLES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} — {role.description}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <ChevronRight className="h-5 w-5 rotate-90" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {mutation.isPending && (
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium animate-pulse bg-blue-50 px-3 py-1.5 rounded-md">
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
                        <div>
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        Feature Permissions
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enable or disable access to the following modules for the selected role.</p>
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                    {availableFeatures.length} Master Features
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Icon</th>
                                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Module Name</th>
                                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Code</th>
                                            <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                        {availableFeatures.map((featureCode: string) => {
                                            const isAllowed = currentRoleFeatures.includes(featureCode);
                                            return (
                                                <tr key={featureCode} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                                                            isAllowed ? "bg-blue-100 text-blue-600 shadow-blue-50 dark:bg-blue-900/40 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                        )}>
                                                            {isAllowed ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 opacity-40" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {featureCode.split('_').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded border border-gray-100 dark:border-gray-700 inline-block">
                                                            {featureCode}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => togglePermission(featureCode)}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold transition-all",
                                                                    isAllowed
                                                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400"
                                                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                                                                )}
                                                            >
                                                                <div className={cn("w-2 h-2 rounded-full", isAllowed ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600")} />
                                                                <span className="text-[10px] uppercase tracking-wider">
                                                                    {isAllowed ? "Active" : "Disabled"}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleManagementPage;
