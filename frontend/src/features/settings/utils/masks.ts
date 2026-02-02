const digitsOnly = (v: string) => (v || "").replace(/\D/g, "");

export const maskCnpj = (value: string) => {
  const d = digitsOnly(value).slice(0, 14);
  // 00.000.000/0000-00
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const maskPhoneBR = (value: string) => {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length <= 10) {
    // (11) 9999-9999
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  // (11) 99999-9999
  return d
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};
