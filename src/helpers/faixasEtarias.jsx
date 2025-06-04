export const mesesToMesEAnoString = (totalMeses) => {
  const anos = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;

  let saida = "";

  if (anos > 0) {
    saida = `${anos.toString().padStart(2, "0")} ${
      anos === 1 ? "ano" : "anos"
    }`;
    if (meses > 0) {
      saida += " e ";
    }
  }
  if (anos === 0 || meses > 0) {
    saida += `${meses.toString().padStart(2, "0")} ${
      meses === 1 ? "mês" : "meses"
    }`;
  }

  return saida;
};

export const range = (stop, startAt = 0) => {
  const arr = [...Array(stop).keys()];
  if (startAt > 0) {
    return arr.map((i) => i + startAt).filter((i) => i < stop);
  }
  return arr;
};

export const ordenaFaixas = (faixas) => {
  // Recebe faixas etárias no formato:
  // [
  //   {inicio: X1, fim: Y1},
  //   {inicio: X2, fim: Y2},
  //   {inicio: X3, fim: Y3},
  //   ...
  // ]
  // E as retorna ordenadas pelo mês de inicio
  return faixas.sort((a, b) => {
    if (a.inicio < b.inicio) return -1;
    else if (a.inicio > b.inicio) return 1;
    return 0;
  });
};

export const mesesForaDasFaixas = (faixas, totalDeMeses = 60) => {
  // Recebe faixas etárias no formato:
  // [
  //   {inicio: X1, fim: Y1},
  //   {inicio: X2, fim: Y2},
  //   {inicio: X3, fim: Y3},
  //   ...
  // ]
  // Sendo que um mês faz parte de uma faixa etária se inicio <= valor < fim
  // E retorna quais meses (numericamente) estão fora dessa faixa, dado o limite de totalDeMeses(inclusive)
  // Exemplo:
  // faixas = {inicio: 2, fim: 5}, {inicio:8, fim: 11}
  // totalDeMeses = 12
  // retorno = [0, 1, 5, 6, 7, 11]

  // Ordena faixas
  const meses = [];
  for (let mes of range(totalDeMeses - 1)) {
    if (!mesEstaDentroDeAlgumaFaixa(mes, faixas)) {
      meses.push(mes);
    }
  }
  return meses;
};

export const mesEstaDentroDeAlgumaFaixa = (mes, faixasEtarias) => {
  let dentroDeAlgumaFaixa = false;
  for (const faixa of faixasEtarias) {
    if (faixa.inicio <= mes && mes < faixa.fim) {
      dentroDeAlgumaFaixa = true;
      break;
    }
  }
  return dentroDeAlgumaFaixa;
};

export const mesesFinaisValidos = (mesInicial, faixasEtarias, limite = 60) => {
  const mesesValidos = [mesInicial];
  let mesAtual = mesInicial + 1;
  while (mesAtual < limite) {
    if (mesEstaDentroDeAlgumaFaixa(mesAtual, faixasEtarias)) break;
    mesesValidos.push(mesAtual);
    mesAtual++;
  }
  return mesesValidos;
};

export const faixaToString = ({ inicio, fim }) => {
  if (inicio === 0 && fim === 1) {
    return "0 meses a 1 mês (antes de)";
  }
  if (fim - inicio === 1) {
    return mesesToMesEAnoString(inicio);
  }
  return `${
    inicio >= 12
      ? mesesToMesEAnoString(inicio)
      : inicio.toString().padStart(2, "0")
  } a ${fim === 72 ? "06 anos" : mesesToMesEAnoString(fim - 1)}`;
};
