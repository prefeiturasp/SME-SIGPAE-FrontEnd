import moment from "moment";

export const gerarLabelPorFiltro = (filtros) => {
  let qtdeFiltros = 0;

  for (let valor of Object.values(filtros)) {
    if (valor !== undefined) {
      qtdeFiltros += 1;
    }
  }

  if (filtros.data_inicial && filtros.data_final && qtdeFiltros === 2) {
    return `Veja os resultados para o período "${moment(
      filtros.data_inicial,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")} à ${moment(filtros.data_final, "DD/MM/YYYY").format(
      "DD/MM/YYYY"
    )}":`;
  }
  if (qtdeFiltros !== 1) {
    return "Veja os resultados para a busca";
  }
  if (filtros.nome_produto) {
    return `Veja os resultados para "${filtros.nome_produto}"`;
  }
  if (filtros.nome_terceirizada) {
    return `Veja os resultados para "${filtros.nome_terceirizada}"`;
  }
  if (filtros.nome_marca) {
    return `Veja os resultados para "${filtros.nome_marca}"`;
  }
  if (filtros.nome_fabricante) {
    return `Veja os resultados para "${filtros.nome_fabricante}"`;
  }
  if (filtros.situacao) {
    return `Veja os resultados para "${filtros.situacao}"`;
  }
  if (filtros.data_inicial) {
    return `Veja os resultados a partir de "${moment(
      filtros.data_inicial,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else if (filtros.data_final) {
    return `Veja os resultados até "${moment(
      filtros.data_final,
      "DD/MM/YYYY"
    ).format("DD/MM/YYYY")}":`;
  } else {
    return "Veja os resultados para a busca:";
  }
};
