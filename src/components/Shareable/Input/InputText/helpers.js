export const agruparMilharDecimal = (valor) => {
  if (valor === null || valor === undefined) return "";

  const nums = valor.toString().replace(/\D/g, "");
  if (nums.length <= 2) return nums;

  const decimais = nums.slice(-2);
  const inteiros = nums.slice(0, -2) || "0";

  let resultado = "";
  let contador = 0;

  for (let i = inteiros.length - 1; i >= 0; i--) {
    resultado = inteiros[i] + resultado;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      resultado = "." + resultado;
    }
  }

  return resultado + "," + decimais;
};

export const agruparMilharInteirosPositivos = (valor) => {
  if (valor === null || valor === undefined) return "";

  const nums = valor.toString().replace(/\D/g, "");
  const num = parseInt(nums, 10);

  if (isNaN(num) || num <= 0) return "";

  const numStr = num.toString();
  let resultado = "";
  let contador = 0;

  for (let i = numStr.length - 1; i >= 0; i--) {
    resultado = numStr[i] + resultado;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      resultado = "." + resultado;
    }
  }

  return resultado;
};
