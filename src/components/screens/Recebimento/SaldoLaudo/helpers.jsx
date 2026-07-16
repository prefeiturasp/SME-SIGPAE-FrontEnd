export const validarQuantidadeDescontada = (value, calculoSaldoDisponivel) => {
  if (value === undefined || value === null || value === "") return undefined;
  try {
    const valorLimpo = String(value).replace(/\./g, "").replace(/,/g, ".");
    const valorDesconto = parseFloat(parseFloat(valorLimpo).toFixed(2)) || 0;
    const saldoLaudo = calculoSaldoDisponivel();
    if (valorDesconto > saldoLaudo) {
      return "O desconto não pode ser maior que o saldo do laudo.";
    }
  } catch {
    return "Valor inválido";
  }

  return undefined;
};
