export const getTituloRelatorio = (filtros) => {
  const qtde_filtros = Object.keys(filtros).length;

  if (qtde_filtros === 0 || qtde_filtros > 2)
    return "Veja os resultados para a busca:";

  if (qtde_filtros === 1) {
    if (filtros.nome_produto)
      return `Veja os resultados para "${filtros.nome_produto}"`;

    if (filtros.nome_terceirizada)
      return `Veja os resultados para "${filtros.nome_terceirizada}"`;

    if (filtros.nome_marca)
      return `Veja os resultados para "${filtros.nome_marca}"`;

    if (filtros.nome_fabricante)
      return `Veja os resultados para "${filtros.nome_fabricante}"`;

    if (filtros.data_analise_inicial) {
      return `Veja os resultados a partir de "${filtros.data_analise_inicial}":`;
    }

    if (filtros.data_analise_final) {
      return `Veja os resultados até "${filtros.data_analise_final}"`;
    }
  }

  if (filtros.data_analise_inicial && filtros.data_analise_final) {
    return `Veja os resultados para o período de ${filtros.data_analise_inicial} à ${filtros.data_analise_final}:`;
  } else {
    return "Veja os resultados para a busca:";
  }
};
