import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "components/Shareable/Toast/dialogs";
import {
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola
} from "services/medicaoInicial/periodoLancamentoMedicao.service";

export const formatarPayloadPeriodoLancamento = (
  values,
  tabelaAlimentacaoRows,
  tabelaDietaEnteralRows,
  dadosIniciaisFiltered,
  diasDaSemanaSelecionada
) => {
  if (values["periodo_escolar"].includes(" - ")) {
    values["grupo"] = values["periodo_escolar"].split(" - ")[0];
    values["periodo_escolar"] = values["periodo_escolar"].split(" - ")[1];
  }
  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValues = valuesAsArray.filter(([key]) =>
    key.includes("categoria")
  );
  let valoresMedicao = [];

  dadosIniciaisFiltered.forEach(([keyDado]) => {
    if (
      arrayCategoriesValues.filter(([key]) => key.includes(keyDado)).length ===
      0
    ) {
      arrayCategoriesValues.push([keyDado, -1]);
    }
  });

  arrayCategoriesValues.map(arr => {
    const keySplitted = arr[0].split("__");
    const categoria = keySplitted.pop();
    const idCategoria = categoria.match(/\d/g).join("");
    const dia = keySplitted[1].match(/\d/g).join("");
    const nome_campo = keySplitted[0];
    let tipoAlimentacao = tabelaAlimentacaoRows.find(
      alimentacao => alimentacao.name === nome_campo
    );

    if (!tipoAlimentacao) {
      tipoAlimentacao = tabelaDietaEnteralRows.find(
        row => row.name === nome_campo
      );
    }

    return valoresMedicao.push({
      dia: dia,
      valor: ["<p></p>\n", ""].includes(arr[1]) ? 0 : arr[1],
      nome_campo: nome_campo,
      categoria_medicao: idCategoria,
      tipo_alimentacao: tipoAlimentacao.uuid || ""
    });
  });

  valoresMedicao = valoresMedicao.filter(valorMed => {
    return (
      !(valorMed.nome_campo === "observacoes" && valorMed.valor === 0) &&
      diasDaSemanaSelecionada.includes(valorMed.dia)
    );
  });

  Object.entries(values).forEach(([key]) => {
    return key.includes("categoria") && delete values[key];
  });

  return { ...values, valores_medicao: valoresMedicao };
};

export const deveExistirObservacao = (
  categoria,
  values,
  calendarioMesConsiderado
) => {
  let diasNaoLetivos = [];
  const objDiasNaoLetivos = calendarioMesConsiderado.filter(
    obj => !obj.dia_letivo
  );
  objDiasNaoLetivos.map(obj => diasNaoLetivos.push(obj.dia));

  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValuesDiasNaoletivos = valuesAsArray.filter(
    ([key, value]) =>
      key.includes("categoria") &&
      !key.includes("matriculados") &&
      !key.includes("dietas_autorizadas") &&
      !key.includes("frequencia") &&
      !key.includes("observacoes") &&
      !["Mês anterior", "Mês posterior", null].includes(value) &&
      diasNaoLetivos.some(dia => key.includes(dia))
  );
  let dias = [];
  arrayCategoriesValuesDiasNaoletivos.forEach(arr => {
    const keySplitted = arr[0].split("__");
    const dia = keySplitted[1].match(/\d/g).join("");
    dias.push(dia);
  });

  return !dias.every(
    dia =>
      values[`observacoes__dia_${dia}__categoria_${categoria}`] !== undefined
  );
};

export const valorZeroFrequencia = (
  value,
  rowName,
  categoria,
  dia,
  form,
  tabelaAlimentacaoRows,
  tabelaDietaRows,
  tabelaDietaEnteralRows,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo
) => {
  if (rowName === "frequencia" && value && Number(value) === 0) {
    let linhasDaTabela = null;
    if (categoria.nome.includes("ENTERAL")) {
      linhasDaTabela = tabelaDietaEnteralRows;
    } else if (categoria.nome.includes("DIETA")) {
      linhasDaTabela = tabelaDietaRows;
    } else {
      linhasDaTabela = tabelaAlimentacaoRows;
      if (
        Object.keys(dadosValoresInclusoesAutorizadasState).some(key =>
          String(key).includes(`__dia_${dia}__categoria_${categoria.id}`)
        ) &&
        !validacaoDiaLetivo(dia)
      ) {
        linhasDaTabela = linhasDaTabela.filter(linha =>
          Object.keys(
            Object.fromEntries(
              Object.entries(dadosValoresInclusoesAutorizadasState).filter(
                ([key]) => key.includes(dia)
              )
            )
          ).some(key => key.includes(linha.name))
        );
      }
    }

    linhasDaTabela.forEach(linha => {
      ![
        "matriculados",
        "frequencia",
        "observacoes",
        "dietas_autorizadas"
      ].includes(linha.name) &&
        form.change(
          `${linha.name}__dia_${dia}__categoria_${categoria.id}`,
          "0"
        );
    });
    return true;
  }
  return;
};

export const desabilitarField = (
  dia,
  rowName,
  categoria,
  values,
  mesAnoConsiderado,
  mesAnoDefault,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo,
  validacaoSemana
) => {
  const mesConsiderado = format(mesAnoConsiderado, "LLLL", {
    locale: ptBR
  }).toString();
  const mesAtual = format(mesAnoDefault, "LLLL", {
    locale: ptBR
  }).toString();

  if (!values[`matriculados__dia_${dia}__categoria_${categoria}`]) {
    return true;
  }
  if (
    `${rowName}__dia_${dia}__categoria_${categoria}` in
      dadosValoresInclusoesAutorizadasState &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`]
    )
  ) {
    return false;
  } else if (
    `${rowName}__dia_${dia}__categoria_${categoria}` ===
      `frequencia__dia_${dia}__categoria_${categoria}` &&
    Object.keys(dadosValoresInclusoesAutorizadasState).some(key =>
      String(key).includes(`__dia_${dia}__categoria_${categoria}`)
    ) &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`]
    )
  ) {
    return false;
  } else {
    return (
      !validacaoDiaLetivo(dia) ||
      validacaoSemana(dia) ||
      rowName === "matriculados" ||
      rowName === "dietas_autorizadas" ||
      !values[`matriculados__dia_${dia}__categoria_${categoria}`] ||
      Number(
        values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`]
      ) === 0 ||
      (mesConsiderado === mesAtual &&
        Number(dia) >= format(mesAnoDefault, "dd"))
    );
  }
};

export const getSolicitacoesInclusaoAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  nome_periodo_escolar,
  location
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Inclusão de";
  params["mes"] = mes;
  params["ano"] = ano;
  params["nome_periodo_escolar"] = nome_periodo_escolar;
  if (
    location.state.grupo &&
    location.state.grupo.includes("Programas e Projetos")
  ) {
    params["tipo_doc"] = "INC_ALIMENTA_CONTINUA";
  } else {
    params["excluir_inclusoes_continuas"] = true;
  }
  const responseInclusoesAutorizadas = await getSolicitacoesInclusoesAutorizadasEscola(
    params
  );
  if (responseInclusoesAutorizadas.status === HTTP_STATUS.OK) {
    return responseInclusoesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Inclusões Autorizadas");
    return [];
  }
};

export const getSolicitacoesSuspensoesAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  nome_periodo_escolar
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Suspensão";
  params["mes"] = mes;
  params["ano"] = ano;
  params["nome_periodo_escolar"] = nome_periodo_escolar;
  const responseSuspensoesAutorizadas = await getSolicitacoesSuspensoesAutorizadasEscola(
    params
  );
  if (responseSuspensoesAutorizadas.status === HTTP_STATUS.OK) {
    return responseSuspensoesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Suspensões Autorizadas");
    return [];
  }
};

export const getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  nome_periodo_escolar
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Alteração";
  params["mes"] = mes;
  params["ano"] = ano;
  params["nome_periodo_escolar"] = nome_periodo_escolar;
  const responseAlteracoesAlimentacaoAutorizadas = await getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola(
    params
  );
  if (responseAlteracoesAlimentacaoAutorizadas.status === HTTP_STATUS.OK) {
    return responseAlteracoesAlimentacaoAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Alterações de Alimentação Autorizadas");
    return [];
  }
};
