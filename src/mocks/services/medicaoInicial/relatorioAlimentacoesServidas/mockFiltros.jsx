export const DRE_BUTANTA = {
  uuid: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
  nome: "DIRETORIA REGIONAL DE EDUCACAO BUTANTA",
  codigo_eol: "108100",
  iniciais: "BT",
};

export const DRE_IPIRANGA = {
  uuid: "3972e0e9-2d8e-472a-9dfa-30cd219a6d9a",
  nome: "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA",
  codigo_eol: "108500",
  iniciais: "IP",
};

export const DRE_PENHA = {
  uuid: "adbd7bbb-28be-4e46-99de-0b10181e7b8a",
  nome: "DIRETORIA REGIONAL DE EDUCACAO PENHA",
  codigo_eol: "108700",
  iniciais: "PE",
};

export const mockDiretoriasRegionais = {
  count: 3,
  next: null,
  previous: null,
  results: [DRE_BUTANTA, DRE_IPIRANGA, DRE_PENHA],
};

export const LOTE_BUTANTA = {
  uuid: "29b5f1d0-7a3c-4c47-8a2b-4c2e9e1d1a01",
  nome: "LOTE 01",
  tipo_gestao: "TERC TOTAL",
  diretoria_regional: DRE_BUTANTA,
};

export const LOTE_IPIRANGA = {
  uuid: "5c1e8a4b-0f2d-4e5a-9b3c-7d6e5f4a3b02",
  nome: "LOTE 02",
  tipo_gestao: "TERC TOTAL",
  diretoria_regional: DRE_IPIRANGA,
};

export const mockLotes = {
  count: 2,
  next: null,
  previous: null,
  results: [LOTE_BUTANTA, LOTE_IPIRANGA],
};

export const SUBPREFEITURA_BUTANTA = {
  uuid: "5ce0ea5d-5458-4924-9677-5db048eb9ab5",
  nome: "BUTANTA",
  diretoria_regional_uuid: DRE_BUTANTA.uuid,
};

export const SUBPREFEITURA_IPIRANGA = {
  uuid: "0e7b2a6c-3d4f-4a1b-8c9d-2e3f4a5b6c03",
  nome: "IPIRANGA",
  diretoria_regional_uuid: DRE_IPIRANGA.uuid,
};

export const mockSubprefeituras = [
  SUBPREFEITURA_BUTANTA,
  SUBPREFEITURA_IPIRANGA,
];

export const TIPO_UNIDADE_EMEI = "3f1aee3f-51f4-4759-aa2c-9ccf5c013c1c";
export const TIPO_UNIDADE_CEU_EMEI = "068aae34-1c72-40f2-8042-460c840c10fc";
export const TIPO_UNIDADE_CEI = "1f43b785-006e-41ba-87db-8e44a5fc1ed0";
export const TIPO_UNIDADE_EMEF = "1cc69b3e-6210-4825-bf67-274d3c050bc0";

export const ESCOLA_EMEI_BUTANTA = {
  uuid: "a1a1a1a1-0000-4000-8000-000000000001",
  nome: "EMEI BUTANTA",
  codigo_eol: "000001",
  diretoria_regional: { uuid: DRE_BUTANTA.uuid, nome: "BUTANTA" },
  tipo_unidade: { uuid: TIPO_UNIDADE_EMEI, iniciais: "EMEI" },
  lote: { uuid: LOTE_BUTANTA.uuid, nome: LOTE_BUTANTA.nome },
  subprefeitura_uuid: SUBPREFEITURA_BUTANTA.uuid,
};

export const ESCOLA_CEI_BUTANTA = {
  uuid: "a1a1a1a1-0000-4000-8000-000000000002",
  nome: "CEI BUTANTA",
  codigo_eol: "000002",
  diretoria_regional: { uuid: DRE_BUTANTA.uuid, nome: "BUTANTA" },
  tipo_unidade: { uuid: TIPO_UNIDADE_CEI, iniciais: "CEI" },
  lote: { uuid: LOTE_BUTANTA.uuid, nome: LOTE_BUTANTA.nome },
  subprefeitura_uuid: SUBPREFEITURA_BUTANTA.uuid,
};

export const ESCOLA_EMEF_IPIRANGA = {
  uuid: "a1a1a1a1-0000-4000-8000-000000000003",
  nome: "EMEF IPIRANGA",
  codigo_eol: "000003",
  diretoria_regional: { uuid: DRE_IPIRANGA.uuid, nome: "IPIRANGA" },
  tipo_unidade: { uuid: TIPO_UNIDADE_EMEF, iniciais: "EMEF" },
  lote: { uuid: LOTE_IPIRANGA.uuid, nome: LOTE_IPIRANGA.nome },
  subprefeitura_uuid: SUBPREFEITURA_IPIRANGA.uuid,
};

export const mockEscolas = [
  ESCOLA_EMEI_BUTANTA,
  ESCOLA_CEI_BUTANTA,
  ESCOLA_EMEF_IPIRANGA,
];
