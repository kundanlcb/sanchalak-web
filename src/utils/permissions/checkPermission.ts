/**
 * Permission Utility
 * RBAC permission checking logic
 */

export type Feature =
  | 'Auth'
  | 'Students'
  | 'Attendance'
  | 'Notices'
  | 'Reports'
  | 'Documents'
  | 'Classes'
  | 'Users';

export type Action = 'Create' | 'Read' | 'Update' | 'Delete' | 'Execute';

export type UserRole = 'Admin' | 'Teacher' | 'Staff' | 'Parent' | 'Student';

export interface Permission {
  feature: Feature;
  actions: Action[];
}

// Role-permission matrix (matches contracts/README.md RBAC matrix)
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    { feature: 'Auth', actions: ['Read', 'Update'] },
    { feature: 'Students', actions: ['Create', 'Read', 'Update', 'Delete'] },
    { feature: 'Attendance', actions: ['Create', 'Read', 'Update', 'Delete'] },
    { feature: 'Notices', actions: ['Create', 'Read', 'Update', 'Delete'] },
    { feature: 'Reports', actions: ['Read', 'Execute'] },
    { feature: 'Documents', actions: ['Create', 'Read', 'Update', 'Delete'] },
    { feature: 'Classes', actions: ['Create', 'Read', 'Update', 'Delete'] },
    { feature: 'Users', actions: ['Create', 'Read', 'Update', 'Delete'] },
  ],
  Teacher: [
    { feature: 'Auth', actions: ['Read'] },
    { feature: 'Students', actions: ['Read'] },
    { feature: 'Attendance', actions: ['Create', 'Read', 'Update'] },
    { feature: 'Notices', actions: ['Create', 'Read'] },
    { feature: 'Reports', actions: ['Read'] },
    { feature: 'Classes', actions: ['Read'] },
  ],
  Staff: [
    { feature: 'Auth', actions: ['Read'] },
    { feature: 'Students', actions: ['Create', 'Read', 'Update'] },
    { feature: 'Attendance', actions: ['Read'] },
    { feature: 'Notices', actions: ['Create', 'Read'] },
    { feature: 'Documents', actions: ['Create', 'Read', 'Update'] },
    { feature: 'Classes', actions: ['Read'] },
  ],
  Parent: [
    { feature: 'Auth', actions: ['Read'] },
    { feature: 'Students', actions: ['Read'] },
    { feature: 'Attendance', actions: ['Read'] },
    { feature: 'Notices', actions: ['Read'] },
    { feature: 'Reports', actions: ['Read'] },
  ],
  Student: [
    { feature: 'Auth', actions: ['Read'] },
    { feature: 'Attendance', actions: ['Read'] },
    { feature: 'Notices', actions: ['Read'] },
    { feature: 'Reports', actions: ['Read'] },
  ],
};

/**
 * Check if a user role has permission for a specific feature and action
 */
export function checkPermission(
  userRole: UserRole,
  feature: Feature,
  action: Action
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  const featurePermission = permissions.find((p) => p.feature === feature);
  
  if (!featurePermission) {
    return false;
  }
  
  return featurePermission.actions.includes(action);
}

/**
 * Check if user has any of the required roles
 */
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export default checkPermission;
