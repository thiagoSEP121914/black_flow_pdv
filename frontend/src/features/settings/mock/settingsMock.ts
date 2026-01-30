import type { AllSettings, Role } from "../types/settings";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isoNow = () => new Date().toISOString();

const discountByRole = (admin: number, gerente: number, caixa: number, estoquista: number, financeiro: number) =>
  ({
    Admin: admin,
    Gerente: gerente,
    Caixa: caixa,
    Estoquista: estoquista,
    Financeiro: financeiro,
  } satisfies Record<Role, number>);

let state: AllSettings = {
  company: {
    name: "NextFlow Mercadinho LTDA",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 99999-9999",
    email: "contato@nextflow.com.br",
    address: "Rua das Flores, 123 - Artur Alvim - São Paulo/SP",
  },
  user: {
    name: "Gustavo Guilherme",
    email: "gustavo@email.com",
    phone: "(11) 98888-7777",
    role: "Admin",
    avatarUrl: "",
  },

  stores: [
    { id: "s1", name: "Loja Matriz", address: "Rua A, 100 - São Paulo/SP", active: true },
    { id: "s2", name: "Filial 01", address: "Av. B, 200 - São Paulo/SP", active: false },
  ],
  terminals: [
    { id: "t1", name: "PDV-01", storeId: "s1", status: "online" },
    { id: "t2", name: "PDV-02", storeId: "s1", status: "offline" },
  ],

  cashPdv: {
    requireReasonOnCriticalOps: true,
    allowReopenCash: false,
    quickModeShortcuts: true,
    discountLimitByRole: discountByRole(30, 20, 5, 0, 10),
  },

  payments: {
    enabled: { cash: true, pix: true, card: true, voucher: false },
    changeRule: "only_cash",
  },

  stock: {
    blockSaleWithoutStock: true,
    minStockAlertDefault: 10,
    lotEnabled: false,
    expiryEnabled: true,
  },

  notifications: {
    channels: { inApp: true, email: true, whatsapp: false },
    toggles: {
      stockLow: true,
      dailyReports: true,
      newSales: false,
      systemUpdates: true,
      nearExpiry: true,
      cashDiffOnClose: true,
      salesGoal: false,
    },
  },

  security: {
    twoFactorEnabled: false,
    passwordPolicy: { minLength: 8, requireUpperLowerNumber: true },
    lockout: { enabled: true, maxAttempts: 5 },
  },

  appearance: {
    theme: "light",
    compactMenu: false,
    density: "comfortable",
  },

  sessions: [
    { id: "ss1", device: "Chrome • Windows", lastActiveAt: isoNow(), ipHint: "179.xxx.xxx.10", current: true },
    { id: "ss2", device: "Android • App", lastActiveAt: isoNow(), ipHint: "179.xxx.xxx.22", current: false },
  ],

  teamUsers: [
    { id: "u1", name: "Gustavo Guilherme", email: "gustavo@email.com", role: "Admin", active: true },
    { id: "u2", name: "Ana Operadora", email: "ana@loja.com", role: "Caixa", active: true },
    { id: "u3", name: "João Estoque", email: "joao@loja.com", role: "Estoquista", active: true },
  ],

  auditLogs: [
    { id: "a1", userName: "Gustavo", action: "Alterou limite de desconto", module: "Caixa/PDV", createdAt: isoNow() },
    { id: "a2", userName: "Gustavo", action: "Ativou bloqueio sem estoque", module: "Estoque", createdAt: isoNow() },
    { id: "a3", userName: "Ana", action: "Login bem-sucedido", module: "Segurança", createdAt: isoNow() },
  ],
};

export const settingsMock = {
  async getAll(): Promise<AllSettings> {
    await wait(250);
    return structuredClone(state);
  },

  async saveAll(next: AllSettings): Promise<void> {
    await wait(450);
    state = structuredClone(next);
  },
};
