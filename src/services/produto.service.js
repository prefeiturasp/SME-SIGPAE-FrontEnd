import { saveAs } from "file-saver";

import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const getProduto = (uuid) => {
  const url = `${API_URL}/produtos/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const getInformacoesNutricionais = () => {
  const url = `${API_URL}/informacoes-nutricionais/agrupadas/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const getInformacoesGrupo = async () => {
  return await axios.get(`/informacoes-nutricionais/agrupadas/`);
};

export const getInformacoesNutricionaisOrdenadas = async () => {
  return await axios.get(`/informacoes-nutricionais/ordenadas/`);
};

export const getNomesProdutos = async (queryparams) => {
  let url = `/produtos/lista-nomes/`;
  if (queryparams) url += queryparams + "/";
  return await axios.get(url);
};

export const getNomesUnicosProdutos = async () =>
  await axios.get("/produtos/lista-nomes-unicos/");

export const getNomesMarcas = async (queryparams) => {
  let url = `/marcas/lista-nomes/`;
  if (queryparams) url += queryparams + "/";
  return await axios.get(url);
};

export const getNomesUnicosMarcas = async () =>
  await axios.get("/marcas/lista-nomes-unicos/");

export const getNomesFabricantes = async (queryparams) => {
  let url = `/fabricantes/lista-nomes/`;
  if (queryparams) url += queryparams + "/";
  return await axios.get(url);
};

export const getNomesUnicosFabricantes = async () =>
  await axios.get("/fabricantes/lista-nomes-unicos/");

export const getNovaReclamacaoNomesProdutos = async (params) => {
  const url = `/produtos/lista-nomes-nova-reclamacao/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getNovaReclamacaoNomesMarcas = async (params) => {
  const url = `/marcas/lista-nomes-nova-reclamacao/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getNovaReclamacaoNomesFabricantes = async (params) => {
  const url = `/fabricantes/lista-nomes-nova-reclamacao/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAvaliarReclamacaoNomesProdutos = async () =>
  await axios.get("/produtos/lista-nomes-avaliar-reclamacao/");

export const getAvaliarReclamacaoNomesMarcas = async () =>
  await axios.get("/marcas/lista-nomes-avaliar-reclamacao/");

export const getAvaliarReclamacaoNomesFabricantes = async () =>
  await axios.get("/fabricantes/lista-nomes-avaliar-reclamacao/");

export const getResponderReclamacaoNomesProdutos = async () =>
  await axios.get("/produtos/lista-nomes-responder-reclamacao/");

export const getResponderReclamacaoNomesMarcas = async () =>
  await axios.get("/marcas/lista-nomes-responder-reclamacao/");

export const getResponderReclamacaoNomesFabricantes = async () =>
  await axios.get("/fabricantes/lista-nomes-responder-reclamacao/");

export const getNomesTerceirizadas = async (params) => {
  const url = `/terceirizadas/lista-nomes/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEditaisDre = async () => {
  return await axios.get(`/produtos-editais/lista-editais-dre/`);
};

export const getNomesUnicosEditais = async () => {
  return await axios.get(`/produtos-editais/lista-nomes-unicos/`);
};

export const getProdutosPorNome = async (nomeProduto) => {
  return await axios.get(`/produtos/filtro-por-nome/${nomeProduto}/`);
};

export const getProdutosPorMarca = async (nomeMarca) => {
  return await axios.get(`/produtos/filtro-por-marca/${nomeMarca}/`);
};

export const getHomologacao = async (uuid) => {
  return await axios.get(`/homologacoes-produtos/${uuid}/`);
};

export const getProdutosPorFabricante = async (nomeFabricante) => {
  return await axios.get(`/produtos/filtro-por-fabricante/${nomeFabricante}/`);
};

export const getProdutosPorParametros = async (parametros, page, pageSize) => {
  return await axios.get(
    `/produtos/filtro-homologados-por-parametros/`,
    parametros,
    { params: { page, page_size: pageSize } }
  );
};

export const getReclamacoesTerceirizadaPorFiltro = async (params) => {
  return await axios.get(`/produtos/filtro-reclamacoes-terceirizada/`, {
    params,
  });
};

export const getProdutosRelatorioAnaliseSensorial = async (params) => {
  return await axios.get(`/produtos/filtro-relatorio-em-analise-sensorial/`, {
    params,
  });
};

export const getProdutosRelatorioSuspenso = async (params) => {
  return await axios.get(`/produtos/filtro-relatorio-produto-suspenso/`, {
    params,
  });
};

export const relatorioProdutosSuspensosPDF = async (params) => {
  return await axios.get(`/produtos/relatorio-produto-suspenso-pdf/`, {
    params,
  });
};

export const getProtocolosDietaEspecial = async () => {
  return await axios.get(`/protocolo-dieta-especial/lista-nomes/`);
};

export const getMarcasProdutos = async () => {
  return await axios.get(`/marcas/`);
};

export const getNomeDeProdutosEdital = async () => {
  return await axios.get(`/nome-de-produtos-edital/`);
};

export const getFabricantesProdutos = async () => {
  return await axios.get(`/fabricantes/`);
};

export const criarMarcaProduto = async (data) => {
  return await axios.post(`/marcas/`, data);
};

export const getUnidadesDeMedidaProduto = async () => {
  return await axios.get(`/unidades-medida/`);
};

export const getEmbalagensProduto = async () => {
  return await axios.get(`/embalagens-produto/`);
};

export const submitProduto = async (payload) => {
  const url = `${API_URL}/produtos/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    headers: authToken,
    body: JSON.stringify(payload),
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const updateProduto = async (payload) => {
  const url = `${API_URL}/produtos/${payload.uuid}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const alteracaoProdutoHomologado = async (payload, uuid) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/alteracao-produto-homologado/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const respostaAnaliseSensorial = async (payload) => {
  const url = `${API_URL}/analise-sensorial/terceirizada-responde-analise-sensorial/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const criarFabricanteProduto = async (data) => {
  return await axios.post(`/fabricantes/`, data);
};

export const getHomologacaoProduto = async (uuid, params) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEHomologaProduto = async (uuid, payload) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-homologa/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEPedeAnaliseReclamacao = async (uuid, payload) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-pede-analise-reclamacao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAERecusaReclamacao = async (uuid, payload) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-recusa-reclamacao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAceitaReclamacao = async (uuid, payload) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-aceita-reclamacao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEPedeAnaliseSensorialProduto = (
  uuid,
  justificativa,
  uuidTerceirizada
) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-pede-analise-sensorial/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
    body: JSON.stringify({ justificativa, uuidTerceirizada }),
  })
    .then((res) => {
      status = res.status;
      console.log("RES", res);
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const CODAECancelaAnaliseSensorialProduto = (uuid, justificativa) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-cancela-analise-sensorial/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
    body: JSON.stringify({ justificativa }),
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const CODAENaoHomologaProduto = (uuid, justificativa) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-nao-homologa/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
    body: JSON.stringify({ justificativa }),
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const CODAECancelaSoliticaoCorrecao = async (uuid, justificativa) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-cancela-solicitacao-correcao/`;
  let status = 0;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: authToken,
      body: JSON.stringify({ justificativa }),
    });
    status = res.status;
    const data = await res.json();
    return { data: data, status: status };
  } catch (error) {
    return error;
  }
};

export const TerceirizadaCancelaSoliticaoCorrecao = async (
  uuid,
  justificativa
) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/terceirizada-cancela-solicitacao-correcao/`;
  let status = 0;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: authToken,
      body: JSON.stringify({ justificativa }),
    });
    status = res.status;
    const data = await res.json();
    return { data: data, status: status };
  } catch (error) {
    return error;
  }
};

export const CODAEPedeCorrecao = (uuid, justificativa) => {
  const url = `${API_URL}/homologacoes-produtos/${uuid}/codae-questiona-pedido/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
    body: JSON.stringify({ justificativa }),
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const getRascunhosDeProduto = async () => {
  return await axios.get(
    `/painel-gerencial-homologacoes-produtos/filtro-por-status/rascunho/`
  );
};

export const excluirRascunhoDeProduto = async (uuid) => {
  return await axios.delete(`/homologacoes-produtos/${uuid}/`);
};

export const getHomologacoesDeProdutoPorStatus = async (status, page = 0) => {
  const url = `/painel-gerencial-homologacoes-produtos/filtro-por-status/${status}/`;
  if (page > 0) {
    return await axios.get(url, {
      params: {
        page: page,
      },
    });
  }

  return await axios.get(url);
};

export const getHomologacoesDeProdutoPorStatusTitulo = async (
  status,
  params
) => {
  const url = `/painel-gerencial-homologacoes-produtos/filtro-por-status/${status}/`;
  return await axios.get(url, { params });
};

export const getTodosOsProdutos = async () => {
  return await axios.get(`/produtos/todos-produtos/`);
};

export const excluirImagemDoProduto = async (uuid) => {
  return await axios.delete(`/produto-imagens/${uuid}/`);
};

export const escolaOuNutriReclamaDoProduto = async (uuid, payload) => {
  return await axios.patch(
    `/homologacoes-produtos/${uuid}/escola-ou-nutri-reclama/`,
    payload
  );
};

export const ativarProduto = async (uuid, payload) => {
  return await axios
    .patch(`/homologacoes-produtos/${uuid}/ativar/`, payload)
    .catch(ErrorHandlerFunction);
};

export const suspenderProduto = async (uuid, payload) => {
  return await axios
    .patch(`/homologacoes-produtos/${uuid}/suspender/`, payload)
    .catch(ErrorHandlerFunction);
};

export const vinculosAtivosProdutoEditais = async (uuid) => {
  return await axios
    .get(`/homologacoes-produtos/${uuid}/vinculos-ativos-produto-edital/`)
    .catch(ErrorHandlerFunction);
};

export const getNumeroProtocoloAnaliseSensorial = async () => {
  return await axios.get(`/homologacoes-produtos/numero_protocolo/`);
};

export const getReclamacaoDeProduto = async (uuid) => {
  return await axios.get(`/homologacoes-produtos/${uuid}/reclamacao/`);
};

export const getHomologacoesDeProdutoAnaliseSensorial = async () => {
  return await axios.get(
    `/homologacoes-produtos/aguardando-analise-sensorial/`
  );
};

export const responderReclamacaoProduto = async (uuid, payload) => {
  return await axios.patch(
    `/reclamacoes-produtos/${uuid}/terceirizada-responde/`,
    payload
  );
};

export const getReclamacao = async (uuid) => {
  return await axios.get(`/reclamacoes-produtos/${uuid}/`);
};

export const flegarHomologacaoPDF = async (uuid) => {
  return await axios.post(`/homologacoes-produtos/${uuid}/gerar-pdf/`);
};

export const getProdutosPorTerceirizada = async (params) => {
  const url = `/painel-gerencial-homologacoes-produtos/filtro-por-parametros-agrupado-terceirizada/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPDFRelatorioProdutosHomologados = async (params) => {
  const url = "/painel-gerencial-homologacoes-produtos/exportar-pdf/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosSuspensos = async (payload) => {
  return await axios.post(
    `/homologacoes-produtos/homologacoes_suspensas/`,
    payload
  );
};

export const getProdutosListagem = async (params) => {
  return await axios.get(`/produtos/`, {
    params: params,
  });
};

export const solicitarCadastroProdutoDieta = async (payload) => {
  return await axios.post(`/solicitacao-cadastro-produto-dieta/`, payload);
};

export const getSubstitutos = async () => {
  return await axios.get(`/produtos/lista-substitutos/`);
};

export const getNomesProdutosSolicitacaoInclusao = async () =>
  await axios.get("/solicitacao-cadastro-produto-dieta/nomes-produtos/");

export const getSolicitacoesCadastroProdutoDieta = async (params) =>
  await axios.get("/solicitacao-cadastro-produto-dieta/", { params });

export const updateSolicitacaoCadastroProdutoDieta = async (uuid, params) =>
  await axios.patch(
    `/solicitacao-cadastro-produto-dieta/${uuid}/confirma-previsao/`,
    params
  );

export const getProdutosReclamacoes = async (params) =>
  await axios.get("/produtos/filtro-reclamacoes/", { params });

export const getProdutosAvaliacaoReclamacao = async (params) =>
  await axios.get("/produtos/filtro-avaliar-reclamacoes/", { params });

export const produtoJaExiste = async (params) =>
  await axios.get("/produtos/ja-existe/", { params });

export const cancelaHomologacao = async (uuid, payload) =>
  await axios.patch(
    `/homologacoes-produtos/${uuid}/cancela-solicitacao-homologacao/`,
    payload
  );

export const getNomesItems = async () =>
  axios.get("/itens-cadastros/lista-nomes/");

export const getTiposItems = async () => axios.get("/itens-cadastros/tipos/");

export const consultaItems = async (params) =>
  axios.get(`/itens-cadastros/`, { params });

export const cadastrarItem = async (payload) =>
  await axios.post(`/itens-cadastros/`, payload);

export const atualizarItem = async (payload, uuid) =>
  await axios.patch(`/itens-cadastros/${uuid}/`, payload);

export const deletarItem = async (uuid) =>
  await axios.delete(`/itens-cadastros/${uuid}/`);

export const filtrosVincularProdutoEdital = () =>
  axios.get("/produtos-editais/filtros/");

export const filtrarPorEditalNomeTipo = async (params) =>
  await axios.get("/produtos-editais/filtrar/", { params });

export const ativarInativarProduto = async (uuid) =>
  await axios.patch(`/produtos-editais/${uuid}/ativar-inativar-produto/`);

export const getListaProdutos = async (params) =>
  await axios.get(`/produtos-editais/lista-produtos-opcoes/`, {
    params: params,
  });

export const criarVinculoProdutosEditais = async (payload) =>
  await axios.post(`/produtos-editais/`, payload);

export const getNomesProdutosEdital = async () =>
  axios.get("/cadastro-produtos-edital/lista-nomes/");

export const getNomesProdutosLogistica = async () =>
  axios.get("/cadastro-produtos-edital/lista-nomes-logistica/");

export const getCadastroProdutosEdital = async (params) =>
  axios.get(`/cadastro-produtos-edital/`, { params });

export const getListaCompletaProdutosLogistica = async (params) =>
  axios.get(`/cadastro-produtos-edital/lista-completa-logistica/`, { params });

export const getListaProdutosLogistica = async (params) =>
  axios.get(`/cadastro-produtos-edital/produtos-logistica/`, { params });

export const cadastrarProdutoEdital = async (payload) =>
  await axios.post(`/cadastro-produtos-edital/`, payload);

export const atualizarProdutoEdital = async (payload, uuid) =>
  await axios.patch(`/cadastro-produtos-edital/${uuid}/`, payload);

export const imprimeFichaIdentificacaoProduto = async (uuid, params) => {
  const url = `/homologacoes-produtos/${uuid}/gerar-pdf-ficha-identificacao-produto/`;
  const { data } = await axios.get(url, {
    params,
    responseType: "blob",
  });
  saveAs(data, "ficha_identificacao_produto.pdf");
};

export const gerarExcelRelatorioProdutosHomologados = async (params) => {
  const url = `/produtos/exportar-xlsx/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
