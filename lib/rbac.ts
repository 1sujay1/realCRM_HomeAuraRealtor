export type Role = "admin" | "agent";
export type Module = "Leads" | "Expenses" | "Users" | "Projects" | "SiteVisits";
export type Action = "create" | "read" | "update" | "delete";

export const RBAC_CONFIG = {
  Leads: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: true, read: true, update: true, delete: false },
  },
  Expenses: {
    admin: { create: true, read: true, update: true, delete: false },
    agent: { create: false, read: false, update: false, delete: false },
  },
  Users: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false },
  },
  Projects: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: true, update: false, delete: false },
  },
  SiteVisits: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: true, read: true, update: true, delete: true },
  },
};

export function checkPermission(
  role: string,
  module: Module,
  action: Action,
): boolean {
  try {
    if (!role || !module || !action) {
      return false;
    }

    const roleKey = role as Role;
    const moduleConfig = RBAC_CONFIG[module];

    if (!moduleConfig) {
      return false;
    }

    const rolePermissions = moduleConfig[roleKey];
    if (!rolePermissions) {
      return false;
    }

    return rolePermissions[action] === true;
  } catch (error) {
    console.error("checkPermission error:", error);
    return false;
  }
}

export function getUserPermissions(role: string) {
  try {
    const permissions = {
      canDeleteLeads: false,
      canDeleteExpenses: false,
      canViewExpenses: false,
      canCreateExpenses: false,
      canEditExpenses: false,
      canManageUsers: false,
      canDeleteSiteVisits: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
    };

    if (!role) {
      return permissions;
    }

    const roleKey = role as Role;

    const leadsConfig = RBAC_CONFIG.Leads[roleKey];
    if (leadsConfig) {
      permissions.canDeleteLeads = leadsConfig.delete === true;
    }

    const expensesConfig = RBAC_CONFIG.Expenses[roleKey];
    if (expensesConfig) {
      permissions.canDeleteExpenses = expensesConfig.delete === true;
      permissions.canViewExpenses = expensesConfig.read === true;
      permissions.canCreateExpenses = expensesConfig.create === true;
      permissions.canEditExpenses = expensesConfig.update === true;
    }

    const usersConfig = RBAC_CONFIG.Users[roleKey];
    if (usersConfig) {
      permissions.canManageUsers = usersConfig.read === true;
    }

    const siteVisitsConfig = RBAC_CONFIG.SiteVisits[roleKey];
    if (siteVisitsConfig) {
      permissions.canDeleteSiteVisits = siteVisitsConfig.delete === true;
    }

    const projectsConfig = RBAC_CONFIG.Projects[roleKey];
    if (projectsConfig) {
      permissions.canCreateProjects = projectsConfig.create === true;
      permissions.canEditProjects = projectsConfig.update === true;
      permissions.canDeleteProjects = projectsConfig.delete === true;
    }

    return permissions;
  } catch (error) {
    console.error("getUserPermissions error:", error);
    return {
      canDeleteLeads: false,
      canDeleteExpenses: false,
      canViewExpenses: false,
      canManageUsers: false,
      canDeleteSiteVisits: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
    };
  }
}
