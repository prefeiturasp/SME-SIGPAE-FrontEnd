export const agruparMilharDecimal = (valor) => {
  if (valor === null || valor === undefined) return "";

  const nums = valor.toString().replace(/\D/g, "");
  if (nums.length <= 2) return nums;

  const decimais = nums.slice(-2);
  const inteiros = nums.slice(0, -2) || "0";

  return inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + decimais;
};

export const agruparMilharInteirosPositivos = (valor) => {
  if (valor === null || valor === undefined) return "";

  const nums = valor.toString().replace(/\D/g, "");
  const num = parseInt(nums, 10);

  if (isNaN(num) || num <= 0) return "";

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
