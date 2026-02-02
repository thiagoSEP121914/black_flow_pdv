export type Role = "Admin" | "Gerente" | "Caixa" | "Estoquista" | "Financeiro";

export interface CompanySettings {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: Role;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  active: boolean;
}

export interface Terminal {
  id: string;
  name: string;
  storeId: string;
  status: "online" | "offline" | "maintenance";
}

export interface CashPdvSettings {
  requireReasonOnCriticalOps: boolean;
  allowReopenCash: boolean;
  quickModeShortcuts: boolean;
  discountLimitByRole: Record<Role, number>; // percentual (0..100)
}

export interface PaymentSettings {
  enabled: {
    cash: boolean;
    pix: boolean;
    card: boolean;
    voucher: boolean;
  };
  changeRule: "always_allow" | "only_cash" | "never";
}

export interface StockSettings {
  blockSaleWithoutStock: boolean;
  minStockAlertDefault: number;
  lotEnabled: boolean;
  expiryEnabled: boolean;
}

export interface NotificationSettings {
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  toggles: {
    stockLow: boolean;
    dailyReports: boolean;
    newSales: boolean;
    systemUpdates: boolean;
    nearExpiry: boolean;
    cashDiffOnClose: boolean;
    salesGoal: boolean;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;

  // Admin/Gerente (governança)
  passwordPolicy: {
    minLength: number;
    requireUpperLowerNumber: boolean;
  };
  lockout: {
    enabled: boolean;
    maxAttempts: number;
  };
}

export interface AppearanceSettings {
  theme: "light" | "dark";
  compactMenu: boolean;
  density: "comfortable" | "compact";
}

export interface SessionEntry {
  id: string;
  device: string;
  lastActiveAt: string; // ISO
  ipHint: string;
  current: boolean;
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  userName: string;
  action: string;
  module: string;
  createdAt: string; // ISO
}

export interface AllSettings {
  company: CompanySettings;
  user: UserProfile;

  stores: Store[];
  terminals: Terminal[];

  cashPdv: CashPdvSettings;
  payments: PaymentSettings;
  stock: StockSettings;

  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;

  sessions: SessionEntry[];
  teamUsers: TeamUser[];
  auditLogs: AuditLogEntry[];
}
