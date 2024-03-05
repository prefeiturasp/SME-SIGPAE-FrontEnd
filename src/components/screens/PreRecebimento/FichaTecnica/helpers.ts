import { Dispatch, MutableRefObject, SetStateAction } from "react";
import createDecorator from "final-form-calculate";
import { getEnderecoPorCEP } from "services/cep.service";
import {
  getListaCompletaProdutosLogistica,
  getNomesMarcas,
  getNomesFabricantes,
  getInformacoesNutricionaisOrdenadas,
} from "services/produto.service";
import { getUnidadesDeMedidaLogistica } from "services/cronograma.service";
import { getTerceirizadaUUID } from "services/terceirizada.service";
import {
  cadastraRascunhoFichaTecnica,
  cadastrarFichaTecnicaDoRascunho,
  cadastrarFichaTecnica,
  editaRascunhoFichaTecnica,
  getFichaTecnica,
  getFichaTecnicaComAnalise,
  corrigirFichaTecnica,
} from "services/fichaTecnica.service";

import { removeCaracteresEspeciais, exibeError } from "helpers/utilities";
import { downloadAndConvertToBase64 } from "components/Shareable/Input/InputFile/helper";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { FICHA_TECNICA, PRE_RECEBIMENTO } from "configs/constants";

import {
  ArquivoForm,
  CategoriaFichaTecnicaChoices,
  FichaTecnicaDetalhada,
  FichaTecnicaDetalhadaComAnalise,
  OptionsGenerico,
} from "interfaces/pre_recebimento.interface";
import { TerceirizadaComEnderecoInterface } from "interfaces/terceirizada.interface";

import {
  FichaTecnicaPayload,
  InformacoesNutricionaisFichaTecnicaPayload,
  StateConferidosAnalise,
} from "./interfaces";
import { ResponseInformacoesNutricionais } from "interfaces/responses.interface";
import { InformacaoNutricional } from "interfaces/produto.interface";
import { MeusDadosInterface } from "context/MeusDadosContext/interfaces";
import {
  booleanToString,
  numberToStringDecimal,
  stringDecimalToNumber,
  stringToBoolean,
} from "helpers/parsers";
import { NavigateFunction } from "react-router-dom";
import { CATEGORIA_OPTIONS } from "./constants";

export const cepCalculator = (
  setDesabilitaEndereco: Dispatch<SetStateAction<boolean>>
) =>
  createDecorator({
    field: "cep_fabricante",
    updates: {
      dummy: (minimumValue, allValues: FichaTecnicaPayload) =>
        buscaCEP(minimumValue, allValues, setDesabilitaEndereco),
    },
  });

export const buscaCEP = async (
  cep: string,
  values: FichaTecnicaPayload,
  setDesabilitaEndereco: Dispatch<SetStateAction<boolean>>
) => {
  if (cep?.length === 9) {
    const response = await getEnderecoPorCEP(cep);
    if (response.status === 200 && !response.data.erro) {
      const { data } = response;
      values.bairro_fabricante = data.bairro;
      values.cidade_fabricante = data.localidade;
      values.endereco_fabricante = data.logradouro;
      values.estado_fabricante = data.uf;
      setDesabilitaEndereco(true);
    } else {
      setDesabilitaEndereco(false);
    }
  }
};

export const carregarProdutos = async (
  setProdutosOptions: Dispatch<SetStateAction<OptionsGenerico[]>>
) => {
  const response = await getListaCompletaProdutosLogistica();
  setProdutosOptions(response.data.results);
};

export const carregarMarcas = async (
  setMarcasOptions: Dispatch<SetStateAction<OptionsGenerico[]>>
) => {
  const response = await getNomesMarcas();
  setMarcasOptions(response.data.results);
};

export const carregarFabricantes = async (
  setFabricantesOptions: Dispatch<SetStateAction<OptionsGenerico[]>>
) => {
  const response = await getNomesFabricantes();
  setFabricantesOptions(response.data.results);
};

export const carregarUnidadesMedida = async (
  setUnidadesMedidaOptions: Dispatch<SetStateAction<OptionsGenerico[]>>
) => {
  const response = await getUnidadesDeMedidaLogistica();
  setUnidadesMedidaOptions(response.data.results);
};

export const carregarTerceirizada = async (
  ficha: FichaTecnicaDetalhada,
  meusDados: Record<string, any>,
  setProponente: Dispatch<SetStateAction<TerceirizadaComEnderecoInterface>>
) => {
  if (ficha.empresa?.uuid) {
    const response = await getTerceirizadaUUID(ficha.empresa.uuid);
    setProponente(response.data);
  } else if (meusDados) {
    const response = await getTerceirizadaUUID(
      meusDados.vinculo_atual.instituicao.uuid
    );
    setProponente(response.data);
  }
};

export const carregarDadosCadastrar = async (
  listaInformacoesNutricionaisFichaTecnica: MutableRefObject<
    InformacaoNutricional[]
  >,
  meusDados: MeusDadosInterface,
  setFicha: Dispatch<SetStateAction<FichaTecnicaDetalhada>>,
  setInitialValues: Dispatch<SetStateAction<Record<string, any>>>,
  setArquivo: Dispatch<SetStateAction<ArquivoForm[]>>,
  setProponente: Dispatch<SetStateAction<TerceirizadaComEnderecoInterface>>,
  setCarregando: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid) {
      const responseFicha = await getFichaTecnica(uuid);
      const fichaTecnica = responseFicha.data;

      listaInformacoesNutricionaisFichaTecnica.current =
        fichaTecnica.informacoes_nutricionais.map(
          ({ informacao_nutricional }) => informacao_nutricional
        );

      setFicha(fichaTecnica);
      setInitialValues(geraInitialValuesCadastrar(fichaTecnica));

      if (fichaTecnica.arquivo) {
        const arquivo = await carregarArquivo(fichaTecnica.arquivo);
        setArquivo(arquivo);
      }

      const response = await getTerceirizadaUUID(fichaTecnica.empresa.uuid);
      setProponente(response.data);
    } else if (meusDados) {
      const response = await getTerceirizadaUUID(
        meusDados.vinculo_atual.instituicao.uuid
      );
      setProponente(response.data);
    }
  } finally {
    setCarregando(false);
  }
};

export const carregarDadosCorrgir = async (
  listaInformacoesNutricionaisFichaTecnica: MutableRefObject<
    InformacaoNutricional[]
  >,
  setFicha: Dispatch<SetStateAction<FichaTecnicaDetalhadaComAnalise>>,
  setInitialValues: Dispatch<SetStateAction<Record<string, any>>>,
  setConferidos: Dispatch<SetStateAction<StateConferidosAnalise>>,
  setProponente: Dispatch<SetStateAction<TerceirizadaComEnderecoInterface>>,
  setCarregando: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    const responseFicha = await getFichaTecnicaComAnalise(uuid);
    const fichaTecnica = responseFicha.data;

    setInitialValues(geraInitialValuesCorrigir(fichaTecnica));
    carregaTagsCollapses(fichaTecnica, setConferidos);
    setFicha(fichaTecnica);

    listaInformacoesNutricionaisFichaTecnica.current =
      fichaTecnica.informacoes_nutricionais.map(
        ({ informacao_nutricional }) => informacao_nutricional
      );

    const response = await getTerceirizadaUUID(fichaTecnica.empresa.uuid);
    setProponente(response.data);
  } finally {
    setCarregando(false);
  }
};

export const carregarDadosAnalisarDetalhar = async (
  listaInformacoesNutricionaisFichaTecnica: MutableRefObject<
    InformacaoNutricional[]
  >,
  setFicha: Dispatch<SetStateAction<FichaTecnicaDetalhadaComAnalise>>,
  setConferidos: Dispatch<SetStateAction<StateConferidosAnalise>>,
  setInitialValues: Dispatch<SetStateAction<Record<string, any>>>,
  setProponente: Dispatch<SetStateAction<TerceirizadaComEnderecoInterface>>,
  setCarregando: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setCarregando(true);

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    const responseFicha = await getFichaTecnicaComAnalise(uuid);
    const fichaTecnica = responseFicha.data;
    setInitialValues(geraInitialValuesDetalharEAnalisar(fichaTecnica));
    carregaTagsCollapses(fichaTecnica, setConferidos);

    setFicha(fichaTecnica);

    listaInformacoesNutricionaisFichaTecnica.current =
      fichaTecnica.informacoes_nutricionais.map(
        ({ informacao_nutricional }) => informacao_nutricional
      );

    const response = await getTerceirizadaUUID(fichaTecnica.empresa.uuid);
    setProponente(response.data);
  } finally {
    setCarregando(false);
  }
};

export const carregaListaCompletaInformacoesNutricionais = async (
  listaCompletaInformacoesNutricionais: MutableRefObject<
    InformacaoNutricional[]
  >
) => {
  const responseInformacoes: ResponseInformacoesNutricionais =
    await getInformacoesNutricionaisOrdenadas();
  listaCompletaInformacoesNutricionais.current =
    responseInformacoes.data.results;
};

export const validaRascunho = (values: FichaTecnicaPayload): boolean => {
  return (
    !values.produto ||
    !values.marca ||
    !values.categoria ||
    !values.pregao_chamada_publica
  );
};

export const validaProximo = (
  values: FichaTecnicaPayload,
  errors: Record<string, string>,
  stepAtual: number
): boolean => {
  const validaStepMap = [
    validaProximoIdentificacaoProduto,
    validaProximoInformacoesNutricionais,
  ];

  return validaStepMap[stepAtual](values, errors);
};

export const validaProximoIdentificacaoProduto = (
  values: FichaTecnicaPayload,
  errors: Record<string, string>
): boolean => {
  const campoAlergenicosValido =
    (values.alergenicos === "1" && values.ingredientes_alergenicos) ||
    values.alergenicos === "0";

  const campoComLactoseValido =
    (values.lactose === "1" && values.lactose_detalhe) ||
    values.lactose === "0";

  const campoOrganicoValido =
    (values.organico === "1" && values.mecanismo_controle) ||
    values.organico === "0";

  const camposFormPereciveisValidos =
    values.numero_registro && values.agroecologico && campoOrganicoValido;

  return (
    Object.keys(errors).length !== 0 ||
    !values.produto ||
    !values.marca ||
    !values.categoria ||
    !values.pregao_chamada_publica ||
    !values.fabricante ||
    !values.prazo_validade ||
    !values.componentes_produto ||
    !values.gluten ||
    !campoAlergenicosValido ||
    !campoComLactoseValido ||
    (values.categoria === "PERECIVEIS" && !camposFormPereciveisValidos)
  );
};

export const validaProximoInformacoesNutricionais = (
  values: FichaTecnicaPayload,
  errors: Record<string, string>
): boolean => {
  return (
    Object.keys(errors).length !== 0 ||
    !values.porcao ||
    !values.unidade_medida_porcao ||
    !values.valor_unidade_caseira ||
    !values.unidade_medida_caseira
  );
};

export const validaAssinarEnviar = (
  values: FichaTecnicaPayload,
  errors: Record<string, string>,
  arquivo: ArquivoForm[]
): boolean => {
  return (
    Object.keys(errors).length !== 0 ||
    !values.embalagens_de_acordo_com_anexo ||
    !values.rotulo_legivel ||
    !arquivo.length
  );
};

export const geraInitialValuesCadastrar = (ficha: FichaTecnicaDetalhada) => {
  const valuesInformacoesNutricionais = {};
  ficha?.informacoes_nutricionais.forEach((informacao) => {
    valuesInformacoesNutricionais[
      `quantidade_por_100g_${informacao.informacao_nutricional.uuid}`
    ] = informacao.quantidade_por_100g;
    valuesInformacoesNutricionais[
      `quantidade_porcao_${informacao.informacao_nutricional.uuid}`
    ] = informacao.quantidade_porcao;
    valuesInformacoesNutricionais[
      `valor_diario_${informacao.informacao_nutricional.uuid}`
    ] = informacao.valor_diario;
  });

  const valuesSelect = {};
  ficha?.informacoes_nutricionais
    .filter(({ informacao_nutricional }) => !informacao_nutricional.eh_fixo)
    .forEach((informacao, index) => {
      valuesSelect[`informacao_adicional_${index}`] =
        informacao.informacao_nutricional.uuid;
    });

  const initialValues = {
    produto: ficha.produto?.nome,
    categoria: ficha.categoria as CategoriaFichaTecnicaChoices,
    marca: ficha.marca?.uuid,
    pregao_chamada_publica: ficha.pregao_chamada_publica,
    fabricante: ficha.fabricante?.nome,
    unidade_medida_porcao: ficha.unidade_medida_porcao?.uuid,
    unidade_medida_volume_primaria: ficha.unidade_medida_volume_primaria?.uuid,
    unidade_medida_primaria: ficha.unidade_medida_primaria?.uuid,
    unidade_medida_secundaria: ficha.unidade_medida_secundaria?.uuid,
    unidade_medida_primaria_vazia: ficha.unidade_medida_primaria_vazia?.uuid,
    unidade_medida_secundaria_vazia:
      ficha.unidade_medida_secundaria_vazia?.uuid,
    cnpj_fabricante: ficha.cnpj_fabricante,
    cep_fabricante: ficha.cep_fabricante,
    endereco_fabricante: ficha.endereco_fabricante,
    numero_fabricante: ficha.numero_fabricante,
    complemento_fabricante: ficha.complemento_fabricante,
    bairro_fabricante: ficha.bairro_fabricante,
    cidade_fabricante: ficha.cidade_fabricante,
    estado_fabricante: ficha.estado_fabricante,
    email_fabricante: ficha.email_fabricante,
    telefone_fabricante: ficha.telefone_fabricante,
    prazo_validade: ficha.prazo_validade,
    numero_registro: ficha.numero_registro,
    agroecologico: booleanToString(ficha.agroecologico),
    organico: booleanToString(ficha.organico),
    mecanismo_controle: ficha.mecanismo_controle,
    componentes_produto: ficha.componentes_produto,
    alergenicos: booleanToString(ficha.alergenicos),
    ingredientes_alergenicos: ficha.ingredientes_alergenicos,
    gluten: booleanToString(ficha.gluten),
    lactose: booleanToString(ficha.lactose),
    lactose_detalhe: ficha.lactose_detalhe,
    porcao: numberToStringDecimal(ficha.porcao),
    valor_unidade_caseira: numberToStringDecimal(ficha.valor_unidade_caseira),
    unidade_medida_caseira: ficha.unidade_medida_caseira,
    ...valuesInformacoesNutricionais,
    ...valuesSelect,
    prazo_validade_descongelamento: ficha.prazo_validade_descongelamento,
    condicoes_de_conservacao: ficha.condicoes_de_conservacao,
    temperatura_congelamento: numberToStringDecimal(
      ficha.temperatura_congelamento
    ),
    temperatura_veiculo: numberToStringDecimal(ficha.temperatura_veiculo),
    condicoes_de_transporte: ficha.condicoes_de_transporte,
    embalagem_primaria: ficha.embalagem_primaria,
    embalagem_secundaria: ficha.embalagem_secundaria,
    embalagens_de_acordo_com_anexo: ficha.embalagens_de_acordo_com_anexo,
    material_embalagem_primaria: ficha.material_embalagem_primaria,
    produto_eh_liquido: booleanToString(ficha.produto_eh_liquido),
    volume_embalagem_primaria: numberToStringDecimal(
      ficha.volume_embalagem_primaria
    ),
    peso_liquido_embalagem_primaria: numberToStringDecimal(
      ficha.peso_liquido_embalagem_primaria
    ),
    peso_liquido_embalagem_secundaria: numberToStringDecimal(
      ficha.peso_liquido_embalagem_secundaria
    ),
    peso_embalagem_primaria_vazia: numberToStringDecimal(
      ficha.peso_embalagem_primaria_vazia
    ),
    peso_embalagem_secundaria_vazia: numberToStringDecimal(
      ficha.peso_embalagem_secundaria_vazia
    ),
    sistema_vedacao_embalagem_secundaria:
      ficha.sistema_vedacao_embalagem_secundaria,
    rotulo_legivel: ficha.rotulo_legivel,
    variacao_percentual: numberToStringDecimal(ficha.variacao_percentual),
    nome_responsavel_tecnico: ficha.nome_responsavel_tecnico,
    habilitacao: ficha.habilitacao,
    numero_registro_orgao: ficha.numero_registro_orgao,
    modo_de_preparo: ficha.modo_de_preparo,
    informacoes_adicionais: ficha.informacoes_adicionais,
  };

  return initialValues as FichaTecnicaPayload;
};

export const geraInitialValuesCorrigir = (
  ficha: FichaTecnicaDetalhadaComAnalise
) => {
  const initialValues = {
    ...geraInitialValuesCadastrar(ficha),
    produto: ficha.produto?.nome,
    categoria: CATEGORIA_OPTIONS.find(({ uuid }) => uuid === ficha.categoria)
      ?.nome,
    marca: ficha.marca?.nome,
  };

  return initialValues;
};

export const geraInitialValuesDetalharEAnalisar = (
  ficha: FichaTecnicaDetalhadaComAnalise
) => {
  const initialValues = {
    ...geraInitialValuesCadastrar(ficha),
    marca: ficha.marca?.nome,
    fabricante: ficha.fabricante?.nome,
    categoria: CATEGORIA_OPTIONS.find(({ uuid }) => uuid === ficha.categoria)
      ?.nome,
    unidade_medida_porcao: ficha.unidade_medida_porcao?.nome,
    unidade_medida_volume_primaria: ficha.unidade_medida_volume_primaria?.nome,
    unidade_medida_primaria: ficha.unidade_medida_primaria?.nome,
    unidade_medida_secundaria: ficha.unidade_medida_secundaria?.nome,
    unidade_medida_primaria_vazia: ficha.unidade_medida_primaria_vazia?.nome,
    unidade_medida_secundaria_vazia:
      ficha.unidade_medida_secundaria_vazia?.nome,
    armazenamento_correcoes: ficha.analise?.armazenamento_correcoes,
    conservacao_correcoes: ficha.analise?.conservacao_correcoes,
    detalhes_produto_correcoes: ficha.analise?.detalhes_produto_correcoes,
    embalagem_e_rotulagem_correcoes:
      ficha.analise?.embalagem_e_rotulagem_correcoes,
    informacoes_nutricionais_correcoes:
      ficha.analise?.informacoes_nutricionais_correcoes,
    temperatura_e_transporte_correcoes:
      ficha.analise?.temperatura_e_transporte_correcoes,
  };

  return initialValues as FichaTecnicaPayload;
};

export const carregaTagsCollapses = (
  ficha: FichaTecnicaDetalhadaComAnalise,
  setConferidos: Dispatch<SetStateAction<StateConferidosAnalise>>
) => {
  const stateConferidos: StateConferidosAnalise = {
    armazenamento: ficha.analise?.armazenamento_conferido,
    conservacao: ficha.analise?.conservacao_conferido,
    detalhes_produto: ficha.analise?.detalhes_produto_conferido,
    embalagem_e_rotulagem: ficha.analise?.embalagem_e_rotulagem_conferido,
    informacoes_nutricionais: ficha.analise?.informacoes_nutricionais_conferido,
    modo_preparo: ficha.analise?.modo_preparo_conferido,
    outras_informacoes: ficha.analise?.outras_informacoes_conferido,
    responsavel_tecnico: ficha.analise?.responsavel_tecnico_conferido,
    temperatura_e_transporte: ficha.analise?.temperatura_e_transporte_conferido,
  };

  setConferidos(stateConferidos);
};

export const carregarArquivo = async (urlArquivo: string) => {
  const arquivo = Array({
    nome: "ficha-assinada-rt.pdf",
    base64: await downloadAndConvertToBase64(urlArquivo),
  });

  return arquivo;
};

export const formataPayloadCadastroFichaTecnica = (
  values: Record<string, any>,
  proponente: TerceirizadaComEnderecoInterface,
  produtosOptions: OptionsGenerico[],
  fabricantesOptions: OptionsGenerico[],
  arquivo: ArquivoForm[],
  password?: string
) => {
  const ehPereciveis = values.categoria === "PERECIVEIS";

  let payload: FichaTecnicaPayload = {
    ...gerarCamposObrigatoriosRascunho(values, produtosOptions),
    ...gerarCamposProponenteFabricante(values, proponente, fabricantesOptions),
    ...gerarCamposDetalhesProduto(values, ehPereciveis),
    ...gerarCamposInformacoesNutricionais(values),
    ...gerarCamposConservacao(values, ehPereciveis),
    ...(ehPereciveis
      ? gerarCamposTemperaturaTransporte(values, ehPereciveis)
      : {}),
    ...gerarCamposArmazenamento(values),
    ...gerarCamposEmbalagemRotulagem(values, ehPereciveis),
    ...gerarCamposResponsavelTecnico(values, arquivo),
    ...gerarCamposModoPreparo(values),
    ...gerarCamposOutrasInformacoes(values),
    password: password,
  };

  return payload;
};

export const formataPayloadCorrecaoFichaTecnica = (
  values: Record<string, any>,
  conferidos: StateConferidosAnalise,
  ehPereciveis: boolean,
  password: string
) => {
  let payload: FichaTecnicaPayload = {
    ...(!conferidos.detalhes_produto
      ? gerarCamposDetalhesProduto(values, ehPereciveis)
      : {}),
    ...(!conferidos.informacoes_nutricionais
      ? gerarCamposInformacoesNutricionais(values)
      : {}),
    ...(!conferidos.conservacao
      ? gerarCamposConservacao(values, ehPereciveis)
      : {}),
    ...(!conferidos.temperatura_e_transporte && ehPereciveis
      ? gerarCamposTemperaturaTransporte(values, ehPereciveis)
      : {}),
    ...(!conferidos.armazenamento ? gerarCamposArmazenamento(values) : {}),
    ...(!conferidos.embalagem_e_rotulagem
      ? gerarCamposEmbalagemRotulagem(values, ehPereciveis)
      : {}),
    password: password,
  };

  return payload;
};

const gerarCamposObrigatoriosRascunho = (
  values: Record<string, any>,
  produtosOptions: OptionsGenerico[]
) => {
  return {
    produto: produtosOptions.find((p) => p.nome === values.produto)?.uuid,
    marca: values.marca,
    categoria: values.categoria,
    pregao_chamada_publica: values.pregao_chamada_publica,
  };
};

const gerarCamposProponenteFabricante = (
  values: Record<string, any>,
  proponente: TerceirizadaComEnderecoInterface,
  fabricantesOptions: OptionsGenerico[]
) => {
  return {
    empresa: proponente.uuid,
    fabricante: fabricantesOptions.find((p) => p.nome === values.fabricante)
      ?.uuid,
    cnpj_fabricante: removeCaracteresEspeciais(values.cnpj_fabricante) || "",
    cep_fabricante: removeCaracteresEspeciais(values.cep_fabricante) || "",
    endereco_fabricante: values.endereco_fabricante || "",
    numero_fabricante: values.numero_fabricante || "",
    complemento_fabricante: values.complemento_fabricante || "",
    bairro_fabricante: values.bairro_fabricante || "",
    cidade_fabricante: values.cidade_fabricante || "",
    estado_fabricante: values.estado_fabricante || "",
    email_fabricante: values.email_fabricante || "",
    telefone_fabricante:
      removeCaracteresEspeciais(values.telefone_fabricante) || "",
  };
};

const gerarCamposDetalhesProduto = (
  values: Record<string, any>,
  ehPereciveis: boolean
) => {
  return {
    prazo_validade: values.prazo_validade || "",
    numero_registro: ehPereciveis ? values.numero_registro || "" : undefined,
    agroecologico: stringToBoolean(values.agroecologico as string),
    organico: stringToBoolean(values.organico as string),
    mecanismo_controle:
      retornaValorSeCategoriaPereciveis(
        values,
        ehPereciveis,
        "mecanismo_controle"
      ) || undefined,
    componentes_produto: values.componentes_produto || "",
    alergenicos: stringToBoolean(values.alergenicos as string),
    ingredientes_alergenicos: values.ingredientes_alergenicos || "",
    gluten: stringToBoolean(values.gluten as string),
    lactose: stringToBoolean(values.lactose as string),
    lactose_detalhe: values.lactose_detalhe || "",
  };
};

const gerarCamposInformacoesNutricionais = (values: Record<string, any>) => {
  return {
    porcao: stringDecimalToNumber(values.porcao),
    unidade_medida_porcao: values.unidade_medida_porcao || null,
    valor_unidade_caseira: stringDecimalToNumber(values.valor_unidade_caseira),
    unidade_medida_caseira: values.unidade_medida_caseira || "",
    informacoes_nutricionais: formataInformacoesNutricionais(values),
  };
};

const gerarCamposConservacao = (
  values: Record<string, any>,
  ehPereciveis: boolean
) => {
  return {
    prazo_validade_descongelamento: ehPereciveis
      ? values.prazo_validade_descongelamento || ""
      : undefined,
    condicoes_de_conservacao: values.condicoes_de_conservacao || "",
  };
};

const gerarCamposTemperaturaTransporte = (
  values: Record<string, any>,
  ehPereciveis: boolean
) => {
  return {
    temperatura_congelamento: stringDecimalToNumber(
      values.temperatura_congelamento
    ),
    temperatura_veiculo: stringDecimalToNumber(values.temperatura_veiculo),
    condicoes_de_transporte: retornaValorSeCategoriaPereciveis(
      values,
      ehPereciveis,
      "condicoes_de_transporte"
    ),
  };
};

const gerarCamposArmazenamento = (values: Record<string, any>) => {
  return {
    embalagem_primaria: values.embalagem_primaria || "",
    embalagem_secundaria: values.embalagem_secundaria || "",
  };
};

const gerarCamposEmbalagemRotulagem = (
  values: Record<string, any>,
  ehPereciveis: boolean
) => {
  return {
    embalagens_de_acordo_com_anexo:
      values.embalagens_de_acordo_com_anexo || false,
    material_embalagem_primaria: values.material_embalagem_primaria || "",
    produto_eh_liquido: stringToBoolean(values.produto_eh_liquido as string),
    volume_embalagem_primaria: !ehPereciveis
      ? stringDecimalToNumber(values.volume_embalagem_primaria)
      : undefined,
    unidade_medida_volume_primaria: !ehPereciveis
      ? values.unidade_medida_volume_primaria || null
      : undefined,
    peso_liquido_embalagem_primaria: stringDecimalToNumber(
      values.peso_liquido_embalagem_primaria
    ),
    unidade_medida_primaria: values.unidade_medida_primaria || null,
    peso_liquido_embalagem_secundaria: stringDecimalToNumber(
      values.peso_liquido_embalagem_secundaria
    ),
    unidade_medida_secundaria: values.unidade_medida_secundaria || null,
    peso_embalagem_primaria_vazia: stringDecimalToNumber(
      values.peso_embalagem_primaria_vazia
    ),
    unidade_medida_primaria_vazia: values.unidade_medida_primaria_vazia || null,
    peso_embalagem_secundaria_vazia: stringDecimalToNumber(
      values.peso_embalagem_secundaria_vazia
    ),
    unidade_medida_secundaria_vazia:
      values.unidade_medida_secundaria_vazia || null,
    variacao_percentual: ehPereciveis
      ? stringDecimalToNumber(values.variacao_percentual)
      : undefined,
    sistema_vedacao_embalagem_secundaria:
      values.sistema_vedacao_embalagem_secundaria || "",
    rotulo_legivel: values.rotulo_legivel || false,
  };
};

const gerarCamposResponsavelTecnico = (
  values: Record<string, any>,
  arquivo: ArquivoForm[]
) => {
  return {
    nome_responsavel_tecnico: values.nome_responsavel_tecnico || "",
    habilitacao: values.habilitacao || "",
    numero_registro_orgao: values.numero_registro_orgao || "",
    arquivo: arquivo[0]?.base64 || "",
  };
};

const gerarCamposModoPreparo = (values: Record<string, any>) => {
  return {
    modo_de_preparo: values.modo_de_preparo || "",
  };
};

const gerarCamposOutrasInformacoes = (values: Record<string, any>) => {
  return {
    informacoes_adicionais: values.informacoes_adicionais || "",
  };
};

const retornaValorSeCategoriaPereciveis = (
  values: Record<string, any>,
  ehPereciveis: boolean,
  campo: string
) => (ehPereciveis ? values[campo] : undefined);

export const formataInformacoesNutricionais = (values: Record<string, any>) => {
  const uuids_informacoes = Object.keys(values)
    .filter((key) => key.startsWith("quantidade_por_100g_"))
    .map((key) => key.split("_").pop());

  const payload = uuids_informacoes.map((uuid) => {
    return {
      informacao_nutricional: uuid,
      quantidade_por_100g: values[`quantidade_por_100g_${uuid}`],
      quantidade_porcao: values[`quantidade_porcao_${uuid}`],
      valor_diario: values[`valor_diario_${uuid}`],
    };
  });

  return payload as InformacoesNutricionaisFichaTecnicaPayload[];
};

export const inserirArquivoFichaAssinadaRT = (
  files: ArquivoForm[],
  setArquivo: Dispatch<SetStateAction<ArquivoForm[]>>
) => {
  setArquivo(files);
};

export const removerArquivoFichaAssinadaRT = (
  setArquivo: Dispatch<SetStateAction<ArquivoForm[]>>
) => {
  setArquivo([]);
};

export const salvarRascunho = async (
  payload: FichaTecnicaPayload,
  ficha: FichaTecnicaDetalhada,
  setFicha: Dispatch<SetStateAction<FichaTecnicaDetalhada>>,
  setCarregando: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setCarregando(true);

    const response = ficha.uuid
      ? await editaRascunhoFichaTecnica(payload, ficha.uuid)
      : await cadastraRascunhoFichaTecnica(payload);

    if (response.status === 201 || response.status === 200) {
      toastSuccess("Rascunho salvo com sucesso!");
      setFicha(response.data);
    } else {
      toastError("Ocorreu um erro ao salvar a Ficha Técnica");
    }
  } catch (error) {
    exibeError(error, "Ocorreu um erro ao salvar a Ficha Técnica");
  } finally {
    setCarregando(false);
  }
};

export const assinarEnviarFichaTecnica = async (
  payload: FichaTecnicaPayload,
  ficha: FichaTecnicaDetalhada,
  setCarregando: Dispatch<SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  try {
    setCarregando(true);

    const response = ficha.uuid
      ? await cadastrarFichaTecnicaDoRascunho(payload, ficha.uuid)
      : await cadastrarFichaTecnica(payload);

    if (response.status === 201 || response.status === 200) {
      toastSuccess("Ficha Técnica Assinada e Enviada com sucesso!");
      navigate(`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`);
    } else {
      toastError("Ocorreu um erro ao assinar e enviar a Ficha Técnica");
    }
  } catch (error) {
    exibeError(error, "Ocorreu um erro ao assinar e enviar a Ficha Técnica");
  } finally {
    setCarregando(false);
  }
};

export const assinarCorrigirFichaTecnica = async (
  payload: FichaTecnicaPayload,
  ficha: FichaTecnicaDetalhadaComAnalise,
  setCarregando: Dispatch<SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  try {
    setCarregando(true);

    const response = await corrigirFichaTecnica(payload, ficha.uuid);

    if (response.status === 200) {
      toastSuccess("Ficha Técnica Assinada e Enviada com sucesso!");
      navigate(`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`);
    } else {
      toastError("Ocorreu um erro ao assinar e enviar a Ficha Técnica");
    }
  } catch (error) {
    exibeError(error, "Ocorreu um erro ao assinar e enviar a Ficha Técnica");
  } finally {
    setCarregando(false);
  }
};

export const gerenciaModalCadastroExterno = (
  tipo: string,
  setTipoCadastro: Dispatch<SetStateAction<string>>,
  setShowModalCadastro: Dispatch<SetStateAction<boolean>>
) => {
  setTipoCadastro(tipo);
  setShowModalCadastro(true);
};
