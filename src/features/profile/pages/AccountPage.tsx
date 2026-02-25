import React from 'react';
import { useAuth } from '../../auth/services/authContext';
import {
    User,
    Mail,
    Shield,
    Calendar,
    LogOut,
    Camera,
    MapPin,
    Phone
} from 'lucide-react';

export const AccountPage: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const initials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user.email[0].toUpperCase();

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20 ring-4 ring-white dark:ring-gray-800 overflow-hidden transform transition-transform group-hover:scale-[1.02]">
                        {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{user.name}</h1>
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                            {user.role}
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-100 dark:border-red-500/20"
                >
                    <LogOut className="w-5 h-5" />
                    Logout Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <User className="w-5 h-5" />
                            </span>
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DetailItem label="Full Name" value={user.name} icon={User} />
                            <DetailItem label="Email Address" value={user.email} icon={Mail} />
                            <DetailItem label="Role" value={user.role} icon={Shield} />
                            <DetailItem label="Join Date" value="September 15, 2023" icon={Calendar} />
                            <DetailItem label="Phone Number" value="+91 98765 43210" icon={Phone} />
                            <DetailItem label="Location" value="New Delhi, India" icon={MapPin} />
                        </div>
                    </div>
                </div>

                {/* Account Security Info / Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-lg font-bold mb-4 relative z-10">Security Status</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-blue-100 text-sm">2FA Enabled</span>
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-100 text-sm">Last login</span>
                                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md">Today, 09:24 AM</span>
                            </div>
                            <button className="w-full mt-4 py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Account ID</p>
                        <code className="text-[10px] font-mono bg-gray-50 dark:bg-white/5 p-3 rounded-xl block text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5">
                            {user.userID}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-4 group">
        <div className="mt-1 p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors border border-gray-100 dark:border-white/5">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-gray-900 dark:text-white font-bold tracking-tight">{value}</p>
        </div>
    </div>
);
