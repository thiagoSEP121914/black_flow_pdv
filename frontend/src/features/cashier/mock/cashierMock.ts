// FRONT-ONLY mock service (in-memory)
export type MovementType = "SALE" | "WITHDRAW" | "DEPOSIT" | "VOID";

export interface CashStatus {
  isOpen: boolean;
  openedAt?: string;
  openingAmountCents?: number;
}

export interface CashMovement {
  id: string;
  type: MovementType;
  title: string;
  createdAt: string;
  amountCents: number; // + entrada, - saída
  reason?: string;
}

export interface CashSummary {
  openedAt: string;
  openingAmountCents: number;
  salesTotalCents: number;
  depositsTotalCents: number;
  withdrawalsTotalCents: number;
  currentBalanceCents: number;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const nowIso = () => new Date().toISOString();

const state: {
  isOpen: boolean;
  openedAt?: string;
  openingAmountCents?: number;
  movements: CashMovement[];
} = {
  isOpen: false,
  openedAt: undefined,
  openingAmountCents: undefined,
  movements: [],
};

const calcSummary = (): CashSummary => {
  const opening = state.openingAmountCents ?? 0;

  const sales = state.movements
    .filter((m) => m.type === "SALE")
    .reduce((acc, m) => acc + m.amountCents, 0);

  const deposits = state.movements
    .filter((m) => m.type === "DEPOSIT")
    .reduce((acc, m) => acc + m.amountCents, 0);

  const withdrawals = state.movements
    .filter((m) => m.type === "WITHDRAW")
    .reduce((acc, m) => acc + Math.abs(m.amountCents), 0);

  const balance = opening + sales + deposits - withdrawals; // withdrawals já é absoluto acima

  return {
    openedAt: state.openedAt ?? nowIso(),
    openingAmountCents: opening,
    salesTotalCents: sales,
    depositsTotalCents: deposits,
    withdrawalsTotalCents: withdrawals,
    currentBalanceCents: balance,
  };
};

const seedDemoSales = () => {
  const base = Date.now();
  const demo: CashMovement[] = [
    {
      id: `m-${base}-1`,
      type: "SALE",
      title: "Venda #001",
      createdAt: nowIso(),
      amountCents: 2590,
    },
    {
      id: `m-${base}-2`,
      type: "SALE",
      title: "Venda #002",
      createdAt: nowIso(),
      amountCents: 1499,
    },
  ];
  state.movements = [...demo, ...state.movements];
};

export const cashierMock = {
  async getStatus(): Promise<CashStatus> {
    await wait(200);
    return {
      isOpen: state.isOpen,
      openedAt: state.openedAt,
      openingAmountCents: state.openingAmountCents,
    };
  },

  async openCash(openingAmountCents: number): Promise<void> {
    await wait(350);
    state.isOpen = true;
    state.openedAt = nowIso();
    state.openingAmountCents = openingAmountCents;
    state.movements = [];
    seedDemoSales(); // só pra você já ver o Painel preenchido
  },

  async getSummary(): Promise<CashSummary> {
    await wait(200);
    return calcSummary();
  },

  async getMovements(): Promise<CashMovement[]> {
    await wait(250);
    // mais recente primeiro
    return [...state.movements].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );
  },

  async deposit(amountCents: number, reason?: string) {
    await wait(250);
    state.movements.unshift({
      id: `m-${Date.now()}`,
      type: "DEPOSIT",
      title: "Suprimento",
      createdAt: nowIso(),
      amountCents,
      reason,
    });
  },

  async withdraw(amountCents: number, reason?: string) {
    await wait(250);
    state.movements.unshift({
      id: `m-${Date.now()}`,
      type: "WITHDRAW",
      title: "Sangria",
      createdAt: nowIso(),
      amountCents: -Math.abs(amountCents),
      reason,
    });
  },

  async closeCash(note?: string) {
    await wait(350);
    // poderia guardar "relatório" aqui no futuro
    state.isOpen = false;
    state.openedAt = undefined;
    state.openingAmountCents = undefined;
    state.movements = [];
    void note;
  },
};
