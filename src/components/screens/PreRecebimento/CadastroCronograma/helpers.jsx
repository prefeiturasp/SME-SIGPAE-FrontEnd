import moment from "moment";
import { stringDecimalToNumber } from "src/helpers/parsers";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";

export const getOpcoesContrato = (empresaSelecionada) => {
  if (!empresaSelecionada || !empresaSelecionada.contratos) return [];
  return empresaSelecionada.contratos.map((contrato) => ({
    nome: contrato.numero,
    uuid: contrato.uuid,
    programa: contrato.programa,
  }));
};

export const geraOptionsFichasTecnicas = (
  fichasTecnicas,
  empresaSelecionada,
) => {
  const options = fichasTecnicas
    .filter((ficha) => ficha.uuid_empresa === empresaSelecionada?.uuid)
    .map((ficha) => {
      const nomeFormatado = formatarNumeroEProdutoFichaTecnica(ficha);
      return {
        uuid: ficha.uuid,
        nome: ficha.flv_ponto_a_ponto
          ? `${nomeFormatado} (PONTO A PONTO)`
          : nomeFormatado,
        programa: ficha.programa,
        flv_ponto_a_ponto: ficha.flv_ponto_a_ponto,
      };
    });

  return options;
};

export const getEmpresaFiltrado = (fornecedores, empresa) => {
  if (empresa) {
    const reg = new RegExp(empresa, "iu");
    return fornecedores.filter((a) => reg.test(a.value));
  }
  return fornecedores;
};

export const validaRascunho = (values) => {
  return !values.ficha_tecnica;
};

export const formataPayload = (
  values,
  rascunho,
  empresaSelecionada,
  fichaTecnicaSelecionada,
  etapas,
  recebimentos,
) => {
  const isPontoAPonto = fichaTecnicaSelecionada?.flv_ponto_a_ponto;
  let payload = {};
  payload.cadastro_finalizado = !rascunho;
  payload.ponto_a_ponto = isPontoAPonto;
  payload.contrato = values.contrato;
  payload.empresa = empresaSelecionada.uuid;
  payload.ficha_tecnica = fichaTecnicaSelecionada?.uuid;

  if (!isPontoAPonto) {
    payload.armazem = values.armazem;
    payload.tipo_embalagem_secundaria = values.tipo_embalagem_secundaria;
  }

  payload.qtd_total_programada = values.quantidade_total
    ?.replaceAll(".", "")
    .replace(",", ".");
  payload.unidade_medida = values.unidade_medida;
  payload.custo_unitario_produto =
    stringDecimalToNumber(values.custo_unitario_produto) || undefined;

  if (isPontoAPonto) {
    payload.numero_empenho = values.numero_empenho;
    payload.qtd_total_empenho =
      stringDecimalToNumber(values.qtd_total_empenho) || undefined;
  }

  payload.etapas = etapas.map((etapa, index) => {
    let etapaPayload = {
      etapa:
        parseInt(values[`etapa_${index}`]?.replace("Etapa ", ""), 10) ||
        undefined,
      parte:
        parseInt(values[`parte_${index}`]?.replace("Parte ", ""), 10) ||
        undefined,
      quantidade: values[`quantidade_${index}`]
        ?.replaceAll(".", "")
        .replace(",", "."),
    };

    if (isPontoAPonto) {
      // Para FLV PP, data_programada vem do month picker (MM/YYYY)
      etapaPayload.data_programada = values[`data_programada_${index}`];
    } else {
      etapaPayload.numero_empenho = values[`empenho_${index}`];
      etapaPayload.qtd_total_empenho =
        stringDecimalToNumber(values[`qtd_total_empenho_${index}`]) ||
        undefined;
      etapaPayload.data_programada = values[`data_programada_${index}`]
        ? moment(values[`data_programada_${index}`], "DD/MM/YYYY").format(
            "YYYY-MM-DD",
          )
        : undefined;
      etapaPayload.total_embalagens = values[`total_embalagens_${index}`]
        ?.replaceAll(".", "")
        .replace(",", ".");
    }

    return etapaPayload;
  });

  if (!isPontoAPonto) {
    payload.programacoes_de_recebimento = recebimentos.map((etapa, index) => ({
      data_programada: values[`data_recebimento_${index}`],
      tipo_carga: values[`tipo_recebimento_${index}`],
    }));
  }

  payload.observacoes = values.observacoes;

  return payload;
};
