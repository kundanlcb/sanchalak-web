/**
 * Role Guard Component
 * Conditionally renders children based on user role
 */

import React, { type ReactNode } from 'react';
import { useAuth } from '../services/authContext';
import { type UserRole } from '../../../utils/permissions/checkPermission';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
