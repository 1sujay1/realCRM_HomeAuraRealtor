
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  permissions: {
    canDeleteLeads: boolean;
    canViewExpenses: boolean;
    canManageUsers: boolean;
  };
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  source: string;
  mailStatus: string;
  message?: string;
  project?: string;
  status: string;
  budget?: string;
  type?: string;
  location?: string;
  createdAt: string;
  createdByName?: string;
  assignedToName?: string;
  notes?: string;
  visitDate?: string;
}

export interface Expense {
  _id: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  paymentMode: string;
  paymentMadeBy: string;
  expenseType: string;
  notes?: string;
  status: string;
}
