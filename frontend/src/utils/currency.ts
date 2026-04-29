const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrencyBRL(value: number) {
  return BRL_FORMATTER.format(value);
}

export function formatCurrencyInputFromCents(cents: number) {
  return formatCurrencyBRL(cents / 100);
}

export function parseCurrencyInputToNumber(input: string) {
  const digits = input.replace(/\D/g, "");
  const cents = Number(digits || "0");
  return cents / 100;
}

export function toCurrencyInputValue(value?: number | string | null) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "";
  }

  return formatCurrencyBRL(numericValue);
}