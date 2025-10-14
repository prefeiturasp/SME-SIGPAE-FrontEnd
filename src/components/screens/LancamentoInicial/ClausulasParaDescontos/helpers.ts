export const formataValor = (value: number) => {
  if (value === null) return "";

  const [integer, decimal] = value.toString().split(".");

  const n = Number(integer);
  const formattedInteger = n.toLocaleString("pt-BR");

  let result = decimal
    ? `${formattedInteger},${decimal.slice(0, 2)}`
    : formattedInteger;
  result = result.replace(/,00$/, "").replace(/,0$/, "");

  return `${result}%`;
};
