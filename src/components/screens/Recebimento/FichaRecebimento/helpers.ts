import { Dispatch, SetStateAction } from "react";
import { FichaRecebimentoDetalhada } from "../FichaRecebimento/interfaces";
import { getFichaRecebimentoDetalhada } from "../../../../services/fichaRecebimento.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export const carregarEdicaoFichaDeRecebimento = async (
  setInitialValues: Dispatch<SetStateAction<Record<string, any>>>,
  setCarregando: Dispatch<SetStateAction<boolean>>,
  setVeiculos?: Dispatch<SetStateAction<any[]>>,
  setOcorrenciasCount?: Dispatch<SetStateAction<number>>,
  setArquivos?: Dispatch<SetStateAction<any[]>>
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");

  if (!uuid) {
    return;
  }

  try {
    setCarregando(true);

    const response = await getFichaRecebimentoDetalhada(uuid);
    const fichaRecebimento = response.data;

    if (
      setVeiculos &&
      fichaRecebimento.veiculos &&
      fichaRecebimento.veiculos.length > 0
    ) {
      setVeiculos(fichaRecebimento.veiculos.map(() => ({})));
    }

    if (
      setOcorrenciasCount &&
      fichaRecebimento.ocorrencias &&
      fichaRecebimento.ocorrencias.length > 0
    ) {
      setOcorrenciasCount(fichaRecebimento.ocorrencias.length);
    }

    if (setArquivos && fichaRecebimento.arquivos) {
      setArquivos(fichaRecebimento.arquivos);
    }

    setInitialValues(geraInitialValuesCadastrar(fichaRecebimento));
  } catch (error) {
    toastError("Erro ao carregar ficha de recebimento:", error);
  } finally {
    setCarregando(false);
  }
};

const booleanToString = (value: boolean | undefined): string => {
  if (value === undefined || value === null) return "";
  return value ? "1" : "0";
};

export const geraInitialValuesCadastrar = (
  ficha: FichaRecebimentoDetalhada
) => {
  let initialValues: Record<string, any> = {
    uuid: ficha.uuid,
    cronograma: ficha.dados_cronograma.numero,
    etapa: ficha.etapa,
    data_entrega: ficha.data_entrega || "",

    documentos_recebimento: ficha.documentos_recebimento,

    lote_fabricante_de_acordo: booleanToString(
      ficha.lote_fabricante_de_acordo as boolean
    ),
    data_fabricacao_de_acordo: booleanToString(
      ficha.data_fabricacao_de_acordo as boolean
    ),
    data_validade_de_acordo: booleanToString(
      ficha.data_validade_de_acordo as boolean
    ),

    numero_lote_armazenagem: ficha.numero_lote_armazenagem,
    numero_paletes: ficha.numero_paletes,

    peso_embalagem_primaria_1: ficha.peso_embalagem_primaria_1,
    peso_embalagem_primaria_2: ficha.peso_embalagem_primaria_2,
    peso_embalagem_primaria_3: ficha.peso_embalagem_primaria_3,
    peso_embalagem_primaria_4: ficha.peso_embalagem_primaria_4,

    sistema_vedacao_embalagem_secundaria:
      ficha.sistema_vedacao_embalagem_secundaria ===
      ficha.dados_cronograma?.sistema_vedacao_embalagem_secundaria
        ? "0"
        : "1",
    sistema_vedacao_embalagem_secundaria_outra_opcao:
      ficha.sistema_vedacao_embalagem_secundaria !==
      ficha.dados_cronograma?.sistema_vedacao_embalagem_secundaria
        ? ficha.sistema_vedacao_embalagem_secundaria
        : "",
  };

  if (!ficha.lote_fabricante_de_acordo) {
    initialValues.lote_fabricante_divergencia =
      ficha.lote_fabricante_divergencia;
  }

  if (!ficha.data_fabricacao_de_acordo) {
    initialValues.data_fabricacao_divergencia =
      ficha.data_fabricacao_divergencia;
  }

  if (!ficha.data_validade_de_acordo) {
    initialValues.data_validade_divergencia = ficha.data_validade_divergencia;
  }

  if (ficha.observacao) {
    initialValues.observacao = ficha.observacao;
  }

  if (ficha.observacoes_conferencia) {
    initialValues.observacoes_conferencia = ficha.observacoes_conferencia;
  }

  if (ficha.veiculos && ficha.veiculos.length > 0) {
    ficha.veiculos.forEach((veiculo, index) => {
      initialValues[`numero_${index}`] =
        veiculo.numero || `Veículo ${index + 1}`;
      initialValues[`temperatura_recebimento_${index}`] =
        veiculo.temperatura_recebimento;
      initialValues[`temperatura_produto_${index}`] =
        veiculo.temperatura_produto;
      initialValues[`placa_${index}`] = veiculo.placa;
      initialValues[`lacre_${index}`] = veiculo.lacre;
      initialValues[`numero_sif_sisbi_sisp_${index}`] =
        veiculo.numero_sif_sisbi_sisp;
      initialValues[`numero_nota_fiscal_${index}`] = veiculo.numero_nota_fiscal;
      initialValues[`quantidade_nota_fiscal_${index}`] =
        veiculo.quantidade_nota_fiscal;
      initialValues[`embalagens_nota_fiscal_${index}`] =
        veiculo.embalagens_nota_fiscal;
      initialValues[`quantidade_recebida_${index}`] =
        veiculo.quantidade_recebida;
      initialValues[`embalagens_recebidas_${index}`] =
        veiculo.embalagens_recebidas;
      initialValues[`estado_higienico_adequado_${index}`] = booleanToString(
        veiculo.estado_higienico_adequado as boolean
      );
      initialValues[`termografo_${index}`] = booleanToString(
        veiculo.termografo as boolean
      );
    });
  }

  if (ficha.questoes && ficha.questoes.length > 0) {
    ficha.questoes.forEach((questao) => {
      initialValues[
        `${questao.tipo_questao}_${questao.questao_conferencia.uuid}`
      ] = booleanToString(questao.resposta);
    });
  }

  if (ficha.ocorrencias && ficha.ocorrencias.length > 0) {
    initialValues.ocorrencias = { houve_ocorrencia: "1" };
    ficha.ocorrencias.forEach((ocorrencia, index) => {
      initialValues[`tipo_${index}`] = ocorrencia.tipo;
      initialValues[`relacao_${index}`] = ocorrencia.relacao;
      initialValues[`numero_nota_${index}`] = ocorrencia.numero_nota;
      initialValues[`quantidade_${index}`] = ocorrencia.quantidade;
      initialValues[`descricao_${index}`] = ocorrencia.descricao;
    });
  } else {
    initialValues.ocorrencias = { houve_ocorrencia: "0" };
  }

  return initialValues as Record<string, any>;
};
