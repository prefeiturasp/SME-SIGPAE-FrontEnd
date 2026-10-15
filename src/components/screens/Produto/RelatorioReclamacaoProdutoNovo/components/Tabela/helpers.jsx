import moment from "moment";

const configCabecarioReduzido = () => {
  const config = {};
  config.cabecario_tipo = "CABECARIO_REDUZIDO";
  config.titulo = "Veja os resultados para a busca:";
  return config;
};

const configPorStatus = (statusReclamacao) => {
  const status = retornaStatusFrontend(statusReclamacao);
  const config = {};
  config.cabecario_tipo = "CABECARIO_POR_STATUS";
  config.status_cabecario = status;
  config.titulo = `Veja os resultados para "${status}"`;
  return config;
};

const configPorNome = (nome) => {
  const config = {};
  config.cabecario_tipo = "CABECARIO_POR_NOME";
  config.nome_busca = nome;
  config.titulo = `Veja os resultados para "${nome}"`;
  return config;
};

const configPorDataInicial = (dataInicial) => {
  const config = {};
  config.cabecario_tipo = "CABECARIO_POR_DATA";
  config.data_final_reclamacao = moment().format("DD/MM/YYYY");
  config.titulo = `Veja os resultados a partir de "${dataInicial}":`;
  return config;
};

const configPorDataFinal = (dataFinal) => {
  const config = {};
  config.cabecario_tipo = "CABECARIO_POR_DATA";
  config.titulo = `Veja os resultados até "${dataFinal}":`;
  return config;
};

const configPorPeriodo = (dataInicial, dataFinal) => {
  const config = {};
  config.cabecario_tipo = "CABECARIO_POR_DATA";
  config.titulo = `Veja os resultados para o período de ${dataInicial} à ${dataFinal}:`;
  return config;
};

const configPorNomeOuData = (filtros) => {
  if (filtros.nome_produto) {
    return configPorNome(filtros.nome_produto);
  }
  if (filtros.nome_marca) {
    return configPorNome(filtros.nome_marca);
  }
  if (filtros.nome_fabricante) {
    return configPorNome(filtros.nome_fabricante);
  }
  if (filtros.data_inicial_reclamacao) {
    return configPorDataInicial(filtros.data_inicial_reclamacao);
  }
  if (filtros.data_final_reclamacao) {
    return configPorDataFinal(filtros.data_final_reclamacao);
  }
};

export const getConfigCabecario = (filtros) => {
  const qtde_filtros = Object.keys(filtros).length;
  const qtde_filtro_status = filtros.status_reclamacao.length;

  if (qtde_filtros > 2 && qtde_filtro_status === 1) {
    return configCabecarioReduzido();
  }
  if (qtde_filtros === 1 && qtde_filtro_status === 1) {
    return configPorStatus(filtros.status_reclamacao[0]);
  }
  if (qtde_filtros === 2 && qtde_filtro_status !== 1) {
    const config = configPorNomeOuData(filtros);
    if (config) {
      return config;
    }
  }

  if (filtros.data_inicial_reclamacao && filtros.data_final_reclamacao) {
    return configPorPeriodo(
      filtros.data_inicial_reclamacao,
      filtros.data_final_reclamacao,
    );
  }
  return configCabecarioReduzido();
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
