export const formatBRL = (cents: number) => {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const parseDigitsToCents = (raw: string) => {
  const digits = (raw || "").replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
};

export const formatHour = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};
