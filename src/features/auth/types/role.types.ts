/**
 * Role Types
 * Permission definitions for RBAC system
 */

import { type Feature, type Action, type UserRole } from '../../../utils/permissions/checkPermission';

export interface Permission {
  feature: Feature;
  actions: Action[];
}

export interface Role {
  roleID: string;
  roleName: UserRole;
  description: string;
  permissions: Permission[];
  createdDate: string;
  updatedDate?: string;
}

// Permission check
export interface CheckPermissionRequest {
  userID: string;
  feature: Feature;
  action: Action;
}

export interface CheckPermissionResponse {
  allowed: boolean;
  reason?: string;
}

// Re-export types for convenience
export type { Feature, Action, UserRole };
