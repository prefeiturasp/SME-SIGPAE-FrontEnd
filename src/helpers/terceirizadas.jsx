import { TIPO_PERFIL, PERFIL } from "src/constants/shared";
import { getRelatorioQuantitativo } from "src/services/terceirizada.service";

// Por algum motivo não consegui usar as constantes de status como chave do objeto
const MAPEAMENTO_STATUS_LABEL = {
  CODAE_AUTORIZOU_RECLAMACAO: "RECLAMACAO_DE_PRODUTO",
  CODAE_SUSPENDEU: "PRODUTOS_SUSPENSOS",
  CODAE_QUESTIONADO: "PRODUTOS_AGUARDANDO_CORRECAO",
  CODAE_PEDIU_ANALISE_RECLAMACAO: "PRODUTOS_ANALISE_RECLAMACAO",
  CODAE_PEDIU_ANALISE_SENSORIAL: "PRODUTOS_AGUARDANDO_ANALISE_SENSORIAL",
  CODAE_PENDENTE_HOMOLOGACAO: "PRODUTOS_PENDENTES_HOMOLOGACAO",
  CODAE_HOMOLOGADO: "PRODUTOS_HOMOLOGADOS",
  CODAE_NAO_HOMOLOGADO: "PRODUTOS_NAO_HOMOLOGADOS",
  ESCOLA_OU_NUTRICIONISTA_RECLAMOU: "PRODUTOS_ANALISE_RECLAMACAO",
  TERCEIRIZADA_RESPONDEU_RECLAMACAO: "PRODUTOS_ANALISE_RECLAMACAO",
};

const tipoPerfil = localStorage.getItem("tipo_perfil");
const perfil = localStorage.getItem("perfil");

export const obterRelatorioQuantitativo = async (params) => {
  const dadosRelatorio = await getRelatorioQuantitativo(params);
  const qtdePorStatusZerado = {};
  const relatorio = [];
  let totalProdutos = 0;

  Object.values(MAPEAMENTO_STATUS_LABEL).forEach(
    (status) => (qtdePorStatusZerado[status] = 0)
  );

  dadosRelatorio.data.results.forEach((dadosTerceirizada) => {
    const qtdePorStatus = Object.assign({}, qtdePorStatusZerado);
    let totalProdutosTerceirizada = 0;
    dadosTerceirizada.qtde_por_status.forEach((statusEQtde) => {
      totalProdutosTerceirizada += statusEQtde.qtde;
      totalProdutos += statusEQtde.qtde;
      qtdePorStatus[MAPEAMENTO_STATUS_LABEL[statusEQtde.status]] +=
        statusEQtde.qtde;
    });
    relatorio.push({
      nomeTerceirizada: dadosTerceirizada.nome_terceirizada,
      qtdePorStatus,
      totalProdutos: totalProdutosTerceirizada,
    });
  });

  return {
    totalProdutos,
    detalhes: relatorio,
    qtdeDias: dadosRelatorio.data.dias,
  };
};

export const conferidaClass = (solicitation, cardTitle) => {
  const condicaoNutriCODAE =
    perfil === PERFIL.COORDENADOR_DIETA_ESPECIAL &&
    cardTitle.includes("Recebidas");

  const condicaoTerceirizada =
    tipoPerfil === TIPO_PERFIL.TERCEIRIZADA &&
    ["Autorizadas", "Canceladas", "Negadas"].includes(cardTitle);

  const ehConferida = condicaoTerceirizada
    ? solicitation.conferido
    : solicitation.tipo_solicitacao_dieta === "CANCELAMENTO_DIETA";

  let conferida = "";
  if (condicaoTerceirizada || condicaoNutriCODAE) {
    conferida = ehConferida ? "conferida" : "";
  }

  return conferida;
};

export const formataLotes = (lotes, lista = [], obj = {}) => {
  try {
    lotes.forEach((lote) => {
      obj.uuid = lote["uuid"];
      obj.label = lote["nome"];
      obj.value = lote["uuid"];
      lista.push(obj);
      obj = {};
    });
  } catch (err) {
    return lista;
  }
  return lista;
};

export const formataClassificacoes = (classificacoes, lista = [], obj = {}) => {
  try {
    classificacoes.forEach((classificacao) => {
      obj.uuid = classificacao["id"];
      obj.label = classificacao["nome"];
      obj.value = classificacao["id"];
      lista.push(obj);
      obj = {};
    });
  } catch (err) {
    return lista;
  }
  return lista;
};

export const formataProtocolos = (protocolos, lista = [], obj = {}) => {
  try {
    protocolos.forEach((protocolo) => {
      obj.uuid = protocolo["nome_protocolo"] || protocolo;
      obj.label = protocolo["nome_protocolo"] || protocolo;
      obj.value = protocolo["nome_protocolo"] || protocolo;
      lista.push(obj);
      obj = {};
    });
  } catch (err) {
    return lista;
  }
  return lista;
};

export const formataDiagnosticos = (diagnosticos, lista = [], obj = {}) => {
  try {
    diagnosticos.forEach((diagnostico) => {
      obj.uuid = diagnostico["descricao"] || diagnostico;
      obj.label = diagnostico["descricao"] || diagnostico;
      obj.value = diagnostico["descricao"] || diagnostico;
      lista.push(obj);
      obj = {};
    });
  } catch (err) {
    return lista;
  }
  return lista;
};
