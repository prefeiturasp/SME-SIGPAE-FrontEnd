import {
  ALTERACAO_TIPO_ALIMENTACAO,
  INCLUSAO_ALIMENTACAO,
  INVERSAO_CARDAPIO,
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
} from "../configs/constants";

export const ENTER = 13;
export const TAMANHO_RF = 7;
export const TAMANHO_CPF = 11;
export const DOIS_MB = 2097152;
export const DEZ_MB = 10485760;
export const VINTE_CINCO_MB = 26214400;
export const TODOS = "TODOS";

export const JS_DATE_JANEIRO = 0;
export const JS_DATE_FEVEREIRO = 1;
export const JS_DATE_JULHO = 6;
export const JS_DATE_NOVEMBRO = 10;
export const JS_DATE_DEZEMBRO = 11;

export const PERFIL = {
  DIRETOR_UE: `"DIRETOR_UE"`,
  ADMINISTRADOR_UE: `"ADMINISTRADOR_UE"`,
  COORDENADOR_LOGISTICA: `"COORDENADOR_LOGISTICA"`,
  COORDENADOR_CODAE_DILOG_LOGISTICA: `"COORDENADOR_CODAE_DILOG_LOGISTICA"`,
  COGESTOR_DRE: `"COGESTOR_DRE"`,
  COORDENADOR_DRE: `"COORDENADOR_DRE"`,
  COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA: `"COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA"`,
  ADMINISTRADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA: `"ADMINISTRADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA"`,
  COORDENADOR_DIETA_ESPECIAL: `"COORDENADOR_DIETA_ESPECIAL"`,
  ADMINISTRADOR_DIETA_ESPECIAL: `"ADMINISTRADOR_DIETA_ESPECIAL"`,
  COORDENADOR_GESTAO_PRODUTO: `"COORDENADOR_GESTAO_PRODUTO"`,
  ADMINISTRADOR_GESTAO_PRODUTO: `"ADMINISTRADOR_GESTAO_PRODUTO"`,
  ADMINISTRADOR_EMPRESA: `"ADMINISTRADOR_EMPRESA"`,
  USUARIO_EMPRESA: `"USUARIO_EMPRESA"`,
  COORDENADOR_SUPERVISAO_NUTRICAO: `"COORDENADOR_SUPERVISAO_NUTRICAO"`,
  ADMINISTRADOR_SUPERVISAO_NUTRICAO: `"ADMINISTRADOR_SUPERVISAO_NUTRICAO"`,
  ADMINISTRADOR_CODAE_GABINETE: `"ADMINISTRADOR_CODAE_GABINETE"`,
  ADMINISTRADOR_CODAE_DILOG_CONTABIL: `"ADMINISTRADOR_CODAE_DILOG_CONTABIL"`,
  ADMINISTRADOR_CODAE_DILOG_JURIDICO: `"ADMINISTRADOR_CODAE_DILOG_JURIDICO"`,
  DILOG_CRONOGRAMA: `"DILOG_CRONOGRAMA"`,
  DILOG_QUALIDADE: `"DILOG_QUALIDADE"`,
  DILOG_DIRETORIA: `"DILOG_DIRETORIA"`,
  DINUTRE_DIRETORIA: `"DINUTRE_DIRETORIA"`,
  ADMINISTRADOR_REPRESENTANTE_CODAE: `"ADMINISTRADOR_REPRESENTANTE_CODAE"`,
  USUARIO_RELATORIOS: `"USUARIO_RELATORIOS"`,
  USUARIO_GTIC_CODAE: `"USUARIO_GTIC_CODAE"`,
  ADMINISTRADOR_CONTRATOS: `"ADMINISTRADOR_CONTRATOS"`,
  DILOG_ABASTECIMENTO: `"DILOG_ABASTECIMENTO"`,
  DILOG_VISUALIZACAO: `"DILOG_VISUALIZACAO"`,
  ADMINITRADOR_MEDICAO: `"ADMINISTRADOR_MEDICAO"`,
};

export const VISAO = {
  ESCOLA: "escola",
  DIRETORIA_REGIONAL: "dre",
  CODAE: "codae",
  TERCEIRIZADA: "terceirizada",
  ALUNO: "aluno",
};

export const TIPO_PERFIL = {
  ESCOLA: `"escola"`,
  DIRETORIA_REGIONAL: `"diretoriaregional"`,
  GESTAO_ALIMENTACAO_TERCEIRIZADA: `"gestao_alimentacao_terceirizada"`,
  SUPERVISAO_NUTRICAO: `"supervisao_nutricao"`,
  DIETA_ESPECIAL: `"dieta_especial"`,
  GESTAO_PRODUTO: `"gestao_produto"`,
  TERCEIRIZADA: `"terceirizada"`,
  LOGISTICA: `"logistica_abastecimento"`,
  NUTRICAO_MANIFESTACAO: `"nutricao_manifestacao"`,
  PRE_RECEBIMENTO: `"pre_recebimento"`,
  PRE_RECEBIMENTO_VISUALIZACAO: `"pre_recebimento_visualizacao"`,
  MEDICAO: `"medicao"`,
  ORGAO_FISCALIZADOR: `"orgao_fiscalizador"`,
  CODAE_GABINETE: `"codae_gabinete"`,
  DINUTRE: `"dinutre"`,
};

export const TIPO_USUARIO = {
  ESCOLA: `escola`,
  DIRETORIA_REGIONAL: `diretoriaregional`,
  GESTAO_ALIMENTACAO_TERCEIRIZADA: `gestao_alimentacao_terceirizada`,
  DIETA_ESPECIAL: `dieta_especial`,
  GESTAO_PRODUTO: `gestao_produto`,
  TERCEIRIZADA: `terceirizada`,
  NUTRICIONISTA_SUPERVISAO: "supervisao_nutricao",
};

export const TIPO_GESTAO = {
  PARCEIRA: `"PARCEIRA"`,
  DIRETA: `"DIRETA"`,
  MISTA: `"MISTA"`,
  TERC_TOTAL: `"TERC TOTAL"`,
};

export const MODULO_GESTAO = {
  TERCEIRIZADA: `"TERCEIRIZADA"`,
  ABASTECIMENTO: `"ABASTECIMENTO"`,
};

export const TIPO_SERVICO = {
  TERCEIRIZADA: `"TERCEIRIZADA"`,
  DISTRIBUIDOR_ARMAZEM: `"DISTRIBUIDOR_ARMAZEM"`,
  FORNECEDOR: `"FORNECEDOR"`,
  FORNECEDOR_E_DISTRIBUIDOR: `"FORNECEDOR_E_DISTRIBUIDOR"`,
};

export const TIPODECARD = {
  PRIORIDADE: "priority",
  NO_LIMITE: "on-limit",
  REGULAR: "regular",
};

export const FiltroEnum = {
  SEM_FILTRO: "sem_filtro",
  HOJE: "hoje",
  DAQUI_A_7_DIAS: "daqui_a_7_dias",
  DAQUI_A_30_DIAS: "daqui_a_30_dias",
};

export const FILTRO_VISAO = {
  POR_TIPO_SOLICITACAO: "tipo_solicitacao",
  LOTE: "lote",
  DRE: "dre",
};

export const TEMPO_PASSEIO = {
  QUATRO_HORAS: "0",
  CINCO_A_SETE_HORAS: "1",
  OITO_HORAS_OU_MAIS: "2",
};

export const visaoPorCombo = [
  {
    nome: "Visão por dia",
    uuid: "",
  },
  {
    nome: "Dia",
    uuid: "day",
  },
  {
    nome: "Semana",
    uuid: "week",
  },
  {
    nome: "Mês",
    uuid: "month",
  },
  {
    nome: "Lote",
    uuid: "lote",
  },
];

export const visaoPorComboSomenteDatas = [
  {
    nome: "Sem filtro",
    uuid: "sem_filtro",
  },
  {
    nome: "Daqui a 7 dias",
    uuid: "daqui_a_7_dias",
  },
  {
    nome: "Daqui a 30 dias",
    uuid: "daqui_a_30_dias",
  },
];

export const statusEnum = {
  INFORMADO: "INFORMADO",
  RASCUNHO: "RASCUNHO",
  DRE_A_VALIDAR: "DRE_A_VALIDAR",
  DRE_VALIDADO: "DRE_VALIDADO",
  CODAE_A_AUTORIZAR: "CODAE_A_AUTORIZAR",
  CODAE_AUTORIZADO: "CODAE_AUTORIZADO",
  CODAE_NEGOU_PEDIDO: "CODAE_NEGOU_PEDIDO",
  CODAE_QUESTIONADO: "CODAE_QUESTIONADO",
  TERCEIRIZADA_TOMOU_CIENCIA: "TERCEIRIZADA_TOMOU_CIENCIA",
  TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO:
    "TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO",
  ESCOLA_CANCELOU: "ESCOLA_CANCELOU",
  CANCELADO_AUTOMATICAMENTE: "CANCELADO_AUTOMATICAMENTE",
  DRE_CANCELOU: "DRE_CANCELOU",
  ESCOLA_SOLICITOU_INATIVACAO: "ESCOLA_SOLICITOU_INATIVACAO",
  CODAE_AUTORIZOU_INATIVACAO: "CODAE_AUTORIZOU_INATIVACAO",
  CODAE_NEGOU_INATIVACAO: "CODAE_NEGOU_INATIVACAO",
  TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO:
    "TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO",
  TERMINADA_AUTOMATICAMENTE_SISTEMA: "TERMINADA_AUTOMATICAMENTE_SISTEMA",
};

export const escolaPodeCancelar = (status) => {
  return (
    status === statusEnum.TERCEIRIZADA_TOMOU_CIENCIA ||
    status === statusEnum.CODAE_AUTORIZADO ||
    status === statusEnum.CODAE_A_AUTORIZAR ||
    status === statusEnum.DRE_VALIDADO ||
    status === statusEnum.DRE_A_VALIDAR ||
    status === statusEnum.CODAE_QUESTIONADO ||
    status === statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO
  );
};

export const TIPO_SOLICITACAO = {
  SOLICITACAO_NORMAL: "solicitacao-normal",
  SOLICITACAO_CONTINUA: "solicitacao-continua",
  SOLICITACAO_CEI: "solicitacao-cei",
  SOLICITACAO_CEMEI: "solicitacao-cemei",
};

export const TIPOS_SOLICITACAO_LABEL = {
  INCLUSAO_DE_ALIMENTACAO: "Inclusão de Alimentação",
  INCLUSAO_DE_ALIMENTACAO_CEI: "Inclusão de Alimentacao de CEI",
  INCLUSAO_DE_ALIMENTACAO_CONTINUA: "Inclusão de Alimentação Contínua",
  ALTERACAO_DO_TIPO_DE_ALIMENTACAO: "Alteração do tipo de Alimentação",
  ALTERACAO_DO_TIPO_DE_ALIMENTACAO_CEI:
    "Alteração do Tipo de Alimentação de CEI",
  SOLICITACAO_DE_KIT_LANCHE_PASSEIO: "Kit Lanche Passeio",
  SOLICITACAO_DE_KIT_LANCHE_PASSEIO_CEI: "Kit Lanche Passeio de CEI",
  INVERSAO_DE_DIA_DE_CARDAPIO: "Inversão de dia de Cardápio",
  SOLICITACAO_UNIFICADA: "Kit Lanche Unificado",
  SUSPENSAO_DE_ALIMENTACAO: "Suspensão de Alimentação",
};

export const TIPOS_SOLICITACAO_LISTA = [
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INCLUSAO_DE_ALIMENTACAO,
    cor: "rgba(205, 100, 2, 1)",
    link: INCLUSAO_ALIMENTACAO,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.ALTERACAO_DO_TIPO_DE_ALIMENTACAO,
    cor: "rgba(1, 68, 111, 1)",
    link: ALTERACAO_TIPO_ALIMENTACAO,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SOLICITACAO_DE_KIT_LANCHE_PASSEIO,
    cor: "rgba(173, 0, 7, 1)",
    link: SOLICITACAO_KIT_LANCHE,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INVERSAO_DE_DIA_DE_CARDAPIO,
    cor: "rgba(41, 120, 5, 1)",
    link: INVERSAO_CARDAPIO,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SOLICITACAO_UNIFICADA,
    cor: "rgba(244, 77, 167, 1)",
    link: SOLICITACAO_KIT_LANCHE_UNIFICADA,
  },
];

export const TIPOS_SOLICITACAO_LISTA_DRE = [
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INCLUSAO_DE_ALIMENTACAO,
    cor: "rgba(205, 100, 2, 1)",
    link: INCLUSAO_ALIMENTACAO,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.ALTERACAO_DO_TIPO_DE_ALIMENTACAO,
    cor: "rgba(1, 68, 111, 1)",
    link: ALTERACAO_TIPO_ALIMENTACAO,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.SOLICITACAO_DE_KIT_LANCHE_PASSEIO,
    cor: "rgba(173, 0, 7, 1)",
    link: SOLICITACAO_KIT_LANCHE,
  },
  {
    titulo: TIPOS_SOLICITACAO_LABEL.INVERSAO_DE_DIA_DE_CARDAPIO,
    cor: "rgba(41, 120, 5, 1)",
    link: INVERSAO_CARDAPIO,
  },
];

const ENDPOINT = {
  ALIMENTOS: "alimentos",
  ALTERACOES_CARDAPIO: "alteracoes-cardapio",
  ALTERACOES_CARDAPIO_CEI: "alteracoes-cardapio-cei",
  CATEGORIA_PERGUNTAS_FREQUENTES: "categorias-pergunta-frequente",
  FAIXAS_ETARIAS: "faixas-etarias",
  INCLUSOES_ALIMENTACAO_DA_CEI: "inclusoes-alimentacao-da-cei",
  SUSPENSAO_ALIMENTACAO_DA_CEI: "suspensao-alimentacao-de-cei",
  INICIO_PEDIDO: "inicio-pedido",
  MINHAS_SOLICITACOES: "minhas-solicitacoes",
  PERGUNTAS_FREQUENTES: "perguntas-frequentes",
  PERIODOS_ESCOLARES: "periodos-escolares",
  QUANTIDADE_ALUNOS_POR_PERIODO: "quantidade-alunos-por-periodo",
  SOLICITACOES_DIETA_ESPECIAL: "solicitacoes-dieta-especial",
  SOLICITACOES_DIETA_ESPECIAL_ATIVAS_INATIVAS:
    "solicitacoes-dieta-especial-ativas-inativas",
  PERIODOS_COM_MATRICULADOS_POR_UE: "periodos-com-matriculados-por-ue",
};
ENDPOINT.AUTORIZAR_DIETA = (uuid) =>
  `${ENDPOINT.SOLICITACOES_DIETA_ESPECIAL}/${uuid}/autorizar`;

ENDPOINT.ATUALIZA_PROTOCOLO_DIETA = (uuid) =>
  `${ENDPOINT.SOLICITACOES_DIETA_ESPECIAL}/${uuid}/codae-atualiza-protocolo`;

ENDPOINT.INFORMA_SUSPENSAO_DA_CEI = (uuid) =>
  `${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/${uuid}/informa-suspensao/`;

export { ENDPOINT };

export const ENDPOINT_RELATORIO_QUANTITATIVO =
  "/terceirizadas/relatorio-quantitativo/";

export const ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS = {
  CODAE_AUTORIZOU_RECLAMACAO: "codae_autorizou_reclamacao",
  CODAE_SUSPENDEU: "codae_suspendeu",
  CODAE_QUESTIONADO: "codae_questionado",
  CODAE_PEDIU_ANALISE_RECLAMACAO: "codae_pediu_analise_reclamacao",
  CODAE_PEDIU_ANALISE_SENSORIAL: "codae_pediu_analise_sensorial",
  CODAE_PENDENTE_HOMOLOGACAO: "codae_pendente_homologacao",
  CODAE_HOMOLOGADO: "codae_homologado",
  CODAE_NAO_HOMOLOGADO: "codae_nao_homologado",
  ESCOLA_OU_NUTRICIONISTA_RECLAMOU: "escola_ou_nutricionista_reclamou",
  TERCEIRIZADA_RESPONDEU_RECLAMACAO: "terceirizada_respondeu_reclamacao",
  TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO:
    "terceirizada_cancelou_solicitacao_homologacao",
  CODAE_QUESTIONOU_UE: "codae_questionou_ue",
  UE_RESPONDEU_QUESTIONAMENTO: "ue_respondeu_questionamento",
  CODAE_QUESTIONOU_NUTRISUPERVISOR: "codae_questionou_nutrisupervisor",
  NUTRISUPERVISOR_RESPONDEU_QUESTIONAMENTO:
    "nutrisupervisor_respondeu_questionamento",
  RESPONDER_QUESTIONAMENTO_DA_CODAE: "responder_questionamentos_da_codae",
};

export const RECLAMACAO_PRODUTO_STATUS_EXPLICACAO = {
  CODAE_AUTORIZOU_RECLAMACAO: "CODAE autorizou reclamação",
  CODAE_RECUSOU_RECLAMACAO: "CODAE recusou reclamação",
  CODAE_QUESTIONOU_TERCEIRIZADA:
    "CODAE questionou terceirizada sobre reclamação",
  CODAE_QUESTIONOU_UE: "CODAE questionou U.E. sobre reclamação",
  CODAE_RESPONDEU_RECLAMACAO: "CODAE respondeu ao reclamante da reclamação",
  CODAE_QUESTIONOU_NUTRISUPERVISOR:
    "CODAE questionou nutrisupervisor sobre reclamação",
  TERCEIRIZADA_RESPONDEU_RECLAMACAO: "Terceirizada respondeu a reclamação",
  UE_RESPONDEU_RECLAMACAO: "U.E. respondeu a reclamação",
  NUTRISUPERVISOR_RESPONDEU_RECLAMACAO:
    "Nutrisupervisor respondeu a reclamação",
  AGUARDANDO_ANALISE_SENSORIAL: "CODAE pediu análise sensorial",
  ANALISE_SENSORIAL_RESPONDIDA: "Terceirizada respondeu a análise",
};

export const RECLAMACAO_PRODUTO_STATUS = {
  AGUARDANDO_AVALIACAO: "AGUARDANDO_AVALIACAO",
  AGUARDANDO_RESPOSTA_TERCEIRIZADA: "AGUARDANDO_RESPOSTA_TERCEIRIZADA",
  RESPONDIDO_TERCEIRIZADA: "RESPONDIDO_TERCEIRIZADA",
  ANALISE_SENSORIAL_RESPONDIDA: "ANALISE_SENSORIAL_RESPONDIDA",
  AGUARDANDO_ANALISE_SENSORIAL: "AGUARDANDO_ANALISE_SENSORIAL",
  AGUARDANDO_RESPOSTA_UE: "AGUARDANDO_RESPOSTA_UE",
  RESPONDIDO_UE: "RESPONDIDO_UE",
  AGUARDANDO_RESPOSTA_NUTRISUPERVISOR: "AGUARDANDO_RESPOSTA_NUTRISUPERVISOR",
  CODAE_ACEITOU: "CODAE_ACEITOU",
  CODAE_RECUSOU: "CODAE_RECUSOU",
  CODAE_RESPONDEU: "CODAE_RESPONDEU",
  RESPONDIDO_NUTRISUPERVISOR: "RESPONDIDO_NUTRISUPERVISOR",
};

export const STATUS_RECLAMACAO_PRODUTO = [
  "Aguardando resposta terceirizada",
  "Aguardando avaliação CODAE",
  "Respondido terceirizada",
];

export const TIPO_SOLICITACAO_DIETA = {
  COMUM: "COMUM",
  ALUNO_NAO_MATRICULADO: "ALUNO_NAO_MATRICULADO",
  ALTERACAO_UE: "ALTERACAO_UE",
};

export const STATUS_DOWNLOAD = {
  CONCLUIDO: "Concluído",
  EM_PROCESSAMENTO: "Em processamento",
  ERRO: "Erro",
};

export const OPTIONS_STATUS_DOWNLOAD = [
  {
    uuid: "",
    nome: "Selecione um Status",
  },
  {
    uuid: "CONCLUIDO",
    nome: STATUS_DOWNLOAD.CONCLUIDO,
  },
  {
    uuid: "EM_PROCESSAMENTO",
    nome: STATUS_DOWNLOAD.EM_PROCESSAMENTO,
  },
  {
    uuid: "ERRO",
    nome: STATUS_DOWNLOAD.ERRO,
  },
];

export const OPTIONS_VISTO_DOWNLOAD = [
  {
    uuid: "",
    nome: "Selecione",
  },
  {
    uuid: true,
    nome: "Visto",
  },
  {
    uuid: false,
    nome: "Não Visto",
  },
];

export const STATUS_DIETAS = {
  AUTORIZADAS: "Autorizadas",
  CANCELADAS: "Canceladas",
};

export const OPTIONS_STATUS_DIETA = [
  {
    uuid: "",
    nome: "Selecione",
  },
  {
    uuid: "AUTORIZADAS",
    nome: STATUS_DIETAS.AUTORIZADAS,
  },
  {
    uuid: "CANCELADAS",
    nome: STATUS_DIETAS.CANCELADAS,
  },
];

export const PAGINACAO_DEFAULT = 10;
export const PAGINACAO_DASHBOARD_DEFAULT = 6;

export const TIPOS_SOLICITACOES_OPTIONS = [
  { nome: "Tipo de Solicitação", uuid: "" },
  { nome: "Inclusão de Alimentação", uuid: "Inclusão de" },
  {
    nome: "Alteração do Tipo de Alimentação",
    uuid: "Alteração",
  },
  { nome: "Kit Lanche", uuid: "KIT_LANCHE" },
  { nome: "Kit Lanche Unificado", uuid: "Kit Lanche Unificado" },
  { nome: "Inversão de dia de Cardápio", uuid: "Inversão" },
  { nome: "Suspensão de Alimentação", uuid: "Suspensão" },
];

export const TIPOS_OCORRENCIAS_OPTIONS = [
  {
    value: "QTD_MENOR",
    label: "Quantidade menor que a prevista",
  },
  {
    value: "PROBLEMA_QUALIDADE",
    label: "Problema de qualidade do produto",
  },
  {
    value: "ALIMENTO_DIFERENTE",
    label: "Alimento diferente do previsto",
  },
  {
    value: "EMBALAGEM_DANIFICADA",
    label: "Embalagem danificada",
  },
  {
    value: "EMBALAGEM_VIOLADA",
    label: "Embalagem violada",
  },
  {
    value: "VALIDADE_EXPIRADA",
    label: "Prazo de validade expirado",
  },
  {
    value: "ATRASO_ENTREGA",
    label: "Atraso na entrega",
  },
  {
    value: "AUSENCIA_PRODUTO",
    label: "Ausência do produto",
  },
  {
    value: "FALTA_URBANIDADE",
    label: "Falta de urbanidade na entrega",
  },
  {
    value: "FALTA_ESPACO_ARMAZENAMENTO",
    label: "Falta de espaço no freezer para armazenamento",
  },
];

export const cnpjMask = [
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];

export const telefoneMask = [
  "(",
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const cpfMask = [
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const numeroProcessoContratoSEIMask = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
];

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const PERIODOS_OPTIONS = [
  { nome: "Últimos 2 meses", uuid: "60" },
  { nome: "Últimos 6 meses", uuid: "180" },
  { nome: "Últimos 12 meses", uuid: "365" },
  { nome: "Todos", uuid: "" },
];

export const numeroChamadaPublicamMask = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "/",
  "S",
  "M",
  "E",
  "/",
  "C",
  "O",
  "D",
  "A",
  "E",
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const dataMask = [
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const STATUS_IMR_FORMULARIO_SUPERVISAO = {
  EM_PREENCHIMENTO: "EM_PREENCHIMENTO",
  NUTRIMANIFESTACAO_A_VALIDAR: "NUTRIMANIFESTACAO_A_VALIDAR",
  COM_COMENTARIOS_DE_CODAE: "COM_COMENTARIOS_DE_CODAE",
  VALIDADO_POR_CODAE: "VALIDADO_POR_CODAE",
};

export const STATUS_DOCUMENTOS_DE_RECEBIMENTO = {
  APROVADO: "Aprovado",
};
