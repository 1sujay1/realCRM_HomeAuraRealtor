
export type Role = 'admin' | 'agent';
export type Module = 'Leads' | 'Expenses' | 'Users' | 'Projects';
export type Action = 'create' | 'read' | 'update' | 'delete';

export const RBAC_CONFIG = {
  Leads: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: true, read: true, update: true, delete: false }
  },
  Expenses: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false }
  },
  Users: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false }
  },
  Projects: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false }
  }
};

export function checkPermission(role: string, module: Module, action: Action): boolean {
  const r = role as Role;
  return RBAC_CONFIG[module]?.[r]?.[action] ?? false;
}

export function getUserPermissions(role: string) {
  const r = role as Role;
  return {
    canDeleteLeads: RBAC_CONFIG.Leads[r]?.delete ?? false,
    canDeleteExpenses: RBAC_CONFIG.Expenses[r]?.delete ?? false,
    canViewExpenses: RBAC_CONFIG.Expenses[r]?.read ?? false,
    canManageUsers: RBAC_CONFIG.Users[r]?.read ?? false,
  };
}
