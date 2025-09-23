export const agruparMilharDecimal = (valor) => {
  if (valor === null || valor === undefined) return "";

  const nums = valor.toString().replace(/\D/g, "");
  if (nums.length <= 2) return nums;

  const decimais = nums.slice(-2);
  const inteiros = nums.slice(0, -2) || "0";

  return inteiros.replace(/\d(?=(\d{3})+$)/g, "$&.") + "," + decimais;
};
