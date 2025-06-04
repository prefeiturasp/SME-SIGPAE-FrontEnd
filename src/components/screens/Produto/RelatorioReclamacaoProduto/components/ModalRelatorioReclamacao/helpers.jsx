import moment from "moment";

export const getConfigCabecario = (filtros) => {
  const qtde_filtros = Object.keys(filtros).length;
  const qtde_filtro_status = filtros.status_reclamacao.length;

  let config = {};

  if (qtde_filtros > 2 && qtde_filtro_status === 1) {
    config.cabecario_tipo = "CABECARIO_REDUZIDO";
    config.titulo = "Veja os resultados para a busca:";
    return config;
  }
  if (qtde_filtros === 1 && qtde_filtro_status === 1) {
    const status = retornaStatusFrontend(filtros.status_reclamacao[0]);
    config.cabecario_tipo = "CABECARIO_POR_STATUS";
    config.status_cabecario = status;
    config.titulo = `Veja os resultados para "${status}"`;
    return config;
  }
  if (qtde_filtros === 2 && qtde_filtro_status !== 1) {
    if (filtros.nome_produto) {
      const nomeProduto = filtros.nome_produto;
      config.cabecario_tipo = "CABECARIO_POR_NOME";
      config.nome_busca = nomeProduto;
      config.titulo = `Veja os resultados para "${nomeProduto}"`;
      return config;
    }
    if (filtros.nome_marca) {
      const nomeMarca = filtros.nome_marca;
      config.cabecario_tipo = "CABECARIO_POR_NOME";
      config.nome_busca = nomeMarca;
      config.titulo = `Veja os resultados para "${nomeMarca}"`;
      return config;
    }
    if (filtros.nome_fabricante) {
      const nomeFabricante = filtros.nome_fabricante;
      config.cabecario_tipo = "CABECARIO_POR_NOME";
      config.nome_busca = nomeFabricante;
      config.titulo = `Veja os resultados para "${nomeFabricante}"`;
      return config;
    }
    if (filtros.data_inicial_reclamacao) {
      const dataInicial = filtros.data_inicial_reclamacao;
      config.cabecario_tipo = "CABECARIO_POR_DATA";
      config.data_final_reclamacao = moment().format("DD/MM/YYYY");
      config.titulo = `Veja os resultados a partir de "${dataInicial}":`;
      return config;
    }

    if (filtros.data_final_reclamacao) {
      const dataFinal = filtros.data_final_reclamacao;
      config.cabecario_tipo = "CABECARIO_POR_DATA";
      config.titulo = `Veja os resultados até "${dataFinal}":`;
      return config;
    }
  }

  if (filtros.data_inicial_reclamacao && filtros.data_final_reclamacao) {
    const dataInicial = filtros.data_inicial_reclamacao;
    const dataFinal = filtros.data_final_reclamacao;
    config.cabecario_tipo = "CABECARIO_POR_DATA";
    config.titulo = `Veja os resultados para o período de ${dataInicial} à ${dataFinal}:`;
    return config;
  } else {
    config.cabecario_tipo = "CABECARIO_REDUZIDO";
    config.titulo = "Veja os resultados para a busca:";
    return config;
  }
};

const retornaStatusFrontend = (status) => {
  switch (status) {
    case "AGUARDANDO_AVALIACAO":
      return "Aguardando avaliação da CODAE";
    case "AGUARDANDO_RESPOSTA_TERCEIRIZADA":
      return "Aguardando resposta da terceirizada";
    case "RESPONDIDO_TERCEIRIZADA":
      return "Respondido pela terceirizada";
    case "CODAE_ACEITOU":
      return "CODAE aceitou";
    case "CODAE_RECUSOU":
      return "CODAE recusou";
    case "CODAE_RESPONDEU":
      return "CODAE respondeu";
    default:
      return "STATUS NÃO ENCONTRADO";
  }
};
