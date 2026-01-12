import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  deepCopy,
  ehEscolaTipoCEI,
  ehEscolaTipoCEMEI,
  escolaNaoPossuiAlunosRegulares,
  tiposAlimentacaoETEC,
  usuarioEhEscolaCEMEI,
} from "src/helpers/utilities";
import {
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesInclusoesEtecAutorizadasEscola,
  getSolicitacoesKitLanchesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getPermissoesLancamentosEspeciaisMesAnoPorPeriodo } from "src/services/medicaoInicial/permissaoLancamentosEspeciais.service";
import { ALUNOS_EMEBS, FUNDAMENTAL_EMEBS, INFANTIL_EMEBS } from "../constants";

export const formatarPayloadPeriodoLancamento = (
  values,
  tabelaAlimentacaoRows,
  tabelaDietaEnteralRows,
  dadosIniciaisFiltered,
  diasDaSemanaSelecionada,
  ehGrupoSolicitacoesDeAlimentacaoUrlParam,
  ehGrupoETECUrlParam,
  grupoLocation,
  tabelaAlimentacaoProgramasProjetosOuEscolaSemAlunosRegularesRows,
) => {
  const valorPeriodoEscolar = values["periodo_escolar"];
  const gruposIncluidos = ["ETEC", "Programas e Projetos"];
  const grupoRecreio = ehGrupoRecreioNasFerias(grupoLocation);
  if (
    (values["periodo_escolar"] &&
      values["periodo_escolar"].includes("Solicitações")) ||
    gruposIncluidos.includes(valorPeriodoEscolar) ||
    grupoRecreio
  ) {
    values["grupo"] = valorPeriodoEscolar;
    delete values["periodo_escolar"];
  }
  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValues = valuesAsArray.filter(([key]) =>
    key.includes("categoria"),
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

  arrayCategoriesValues.map((arr) => {
    const keySplitted = arr[0].split("__");

    const categoria = keySplitted.pop();

    const idCategoria = categoria.match(/\d/g).join("");

    const dia = keySplitted[1].match(/\d/g).join("");

    const nome_campo = keySplitted[0];

    let tipoAlimentacao = tabelaAlimentacaoRows.find(
      (alimentacao) => alimentacao.name === nome_campo,
    );

    if (!tipoAlimentacao) {
      tipoAlimentacao = tabelaDietaEnteralRows.find(
        (row) => row.name === nome_campo,
      );
    }
    if (!tipoAlimentacao) {
      tipoAlimentacao =
        tabelaAlimentacaoProgramasProjetosOuEscolaSemAlunosRegularesRows.find(
          (row) => row.name === nome_campo,
        );
    }

    return valoresMedicao.push({
      dia: dia,
      valor: ["<p></p>\n", ""].includes(arr[1]) ? 0 : arr[1],
      nome_campo: nome_campo,
      categoria_medicao: idCategoria,
      tipo_alimentacao:
        !ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
        !ehGrupoETECUrlParam &&
        grupoLocation !== "Programas e Projetos"
          ? tipoAlimentacao?.uuid || ""
          : "",
    });
  });

  valoresMedicao = valoresMedicao.filter((valorMed) => {
    const diaExiste = diasDaSemanaSelecionada.some(
      (diaObj) => diaObj.dia === valorMed.dia,
    );
    return (
      !(valorMed.nome_campo === "observacoes" && valorMed.valor === 0) &&
      diaExiste
    );
  });

  Object.entries(values).forEach(([key]) => {
    return key.includes("categoria") && delete values[key];
  });

  return { ...values, valores_medicao: valoresMedicao };
};

export const formatarPayloadParaCorrecao = (payload, escolaEhEMEBS = false) => {
  let payloadParaCorrecao = payload.valores_medicao.filter(
    (valor) =>
      ![
        "matriculados",
        "dietas_autorizadas",
        "numero_de_alunos",
        "participantes",
      ].includes(valor.nome_campo),
  );
  if (escolaEhEMEBS) {
    payloadParaCorrecao.forEach((objValueParaCorrecao) => {
      objValueParaCorrecao.infantil_ou_fundamental =
        payload?.infantil_ou_fundamental;
    });
  }
  return payloadParaCorrecao;
};

export const deveExistirObservacao = (
  categoria,
  values,
  calendarioMesConsiderado,
) => {
  let diasNaoLetivos = [];
  const objDiasNaoLetivos = calendarioMesConsiderado.filter(
    (obj) => !obj.dia_letivo,
  );
  objDiasNaoLetivos.map((obj) => diasNaoLetivos.push(obj.dia));

  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValuesDiasNaoletivos = valuesAsArray.filter(
    ([key, value]) =>
      key.includes("categoria") &&
      !key.includes("matriculados") &&
      !key.includes("dietas_autorizadas") &&
      !key.includes("frequencia") &&
      !key.includes("observacoes") &&
      !["Mês anterior", "Mês posterior", null].includes(value) &&
      diasNaoLetivos.some((dia) => key.includes(dia)),
  );
  let dias = [];
  arrayCategoriesValuesDiasNaoletivos.forEach((arr) => {
    const keySplitted = arr[0].split("__");
    const dia = keySplitted[1].match(/\d/g).join("");
    dias.push(dia);
  });

  return !dias.every(
    (dia) =>
      values[`observacoes__dia_${dia}__categoria_${categoria}`] !== undefined,
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
) => {
  if (rowName === "frequencia" && value && Number(value) === 0) {
    let linhasDaTabela = null;
    if (categoria.nome.includes("ENTERAL")) {
      linhasDaTabela = tabelaDietaEnteralRows;
    } else if (categoria.nome.includes("DIETA")) {
      linhasDaTabela = tabelaDietaRows;
    } else {
      linhasDaTabela = tabelaAlimentacaoRows;
    }

    linhasDaTabela.forEach((linha) => {
      ![
        "participantes",
        "frequencia",
        "observacoes",
        "dietas_autorizadas",
      ].includes(linha.name) &&
        form.change(
          `${linha.name}__dia_${dia}__categoria_${categoria.id}`,
          "0",
        );
    });
    return !categoria.nome.includes("DIETA");
  }
  return false;
};

const validaAlimentacoesEDietasEscolaSemAlunosRegulares = (
  inclusoesAutorizadas,
  rowName,
  dia,
  nomeCategoria,
) => {
  /* REGRA VÁLIDA APENAS PARA CEU GESTÃO

    Desabilita slot caso o dia com inclusão autorizada não possua o tipo de alimentação */
  if (rowName === "frequencia" && nomeCategoria === "ALIMENTAÇÃO") return false;
  if (
    ![
      "lanche",
      "lanche_4h",
      "refeicao",
      "repeticao_refeicao",
      "sobremesa",
      "repeticao_sobremesa",
      "repeticao_2_sobremesa",
      "frequencia",
    ].includes(rowName)
  )
    return false;
  const tiposAlimentacaoExistentes = [];
  inclusoesAutorizadas
    .filter((inc) => inc.dia === dia)
    .forEach((inclusao) => {
      inclusao.alimentacoes.split(", ").forEach((alimentacao) => {
        if (!tiposAlimentacaoExistentes.includes(alimentacao)) {
          tiposAlimentacaoExistentes.push(alimentacao);
        }
      });
    });
  if (rowName === "frequencia") {
    if (nomeCategoria.includes("ENTERAL")) {
      return (
        !tiposAlimentacaoExistentes.includes("refeicao") &&
        !tiposAlimentacaoExistentes.includes("lanche") &&
        !tiposAlimentacaoExistentes.includes("lanche_4h")
      );
    }
    if (
      !tiposAlimentacaoExistentes.includes("lanche") &&
      !tiposAlimentacaoExistentes.includes("lanche_4h")
    ) {
      return true;
    }
    return false;
  }

  const tipoAlimentacao = rowName.includes("repeticao")
    ? rowName.split("_")[1]
    : rowName;
  return !tiposAlimentacaoExistentes.includes(tipoAlimentacao);
};

export const desabilitarField = (
  dia,
  rowName,
  categoria,
  nomeCategoria,
  values,
  mesAnoConsiderado,
  mesAnoDefault,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo,
  validacaoSemana,
  location,
  ehGrupoETECUrlParam = false,
  dadosValoresInclusoesEtecAutorizadasState = null,
  inclusoesEtecAutorizadas = null,
  grupoLocation = null,
  valoresPeriodosLancamentos,
  feriadosNoMes,
  inclusoesAutorizadas,
  categoriasDeMedicao,
  kitLanchesAutorizadas,
  alteracoesAlimentacaoAutorizadas,
  diasParaCorrecao,
  ehPeriodoEscolarSimples,
  permissoesLancamentosEspeciaisPorDia,
  alimentacoesLancamentosEspeciais,
  escolaEhEMEBS = false,
  alunosTabSelecionada = null,
  ehUltimoDiaLetivoDoAno,
) => {
  const EH_INCLUSAO_SOMENTE_SOBREMESA =
    inclusoesAutorizadas.length &&
    inclusoesAutorizadas.every((i) => i.alimentacoes === "sobremesa");
  if (nomeCategoria.includes("DIETA") && EH_INCLUSAO_SOMENTE_SOBREMESA) {
    return true;
  }
  const valorFieldParaCorrecao = valoresPeriodosLancamentos?.some(
    (valor) =>
      String(valor.categoria_medicao) === String(categoria) &&
      String(valor.dia) === String(dia) &&
      valor.habilitado_correcao === true,
  );
  let alimentacoesLancamentosEspeciaisDia = [];
  if (ehPeriodoEscolarSimples && permissoesLancamentosEspeciaisPorDia) {
    alimentacoesLancamentosEspeciaisDia = [
      ...new Set(
        permissoesLancamentosEspeciaisPorDia
          .filter((permissao) => permissao.dia === dia)
          .flatMap((permissao) => permissao.alimentacoes),
      ),
    ];
  }
  if (
    (valorFieldParaCorrecao ||
      (diasParaCorrecao &&
        diasParaCorrecao.find(
          (diaParaCorrecao) =>
            String(diaParaCorrecao.dia) === String(dia) &&
            String(diaParaCorrecao.categoria_medicao) === String(categoria) &&
            diaParaCorrecao.habilitado_correcao === true,
        ))) &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    ) &&
    location.state &&
    [
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRIGIDA_PELA_UE",
      "MEDICAO_CORRIGIDA_PARA_CODAE",
    ].includes(location.state.status_periodo) &&
    ![
      "matriculados",
      "numero_de_alunos",
      "dietas_autorizadas",
      "participantes",
    ].includes(rowName)
  ) {
    if (
      alimentacoesLancamentosEspeciais?.includes(rowName) &&
      !alimentacoesLancamentosEspeciaisDia?.includes(rowName)
    ) {
      return true;
    }
    if (escolaEhEMEBS) {
      if (
        ehDiaParaCorrigir(
          dia,
          categoria,
          valoresPeriodosLancamentos,
          diasParaCorrecao,
        ) &&
        diasParaCorrecao.find(
          (diaParaCorrecao) =>
            String(diaParaCorrecao.dia) === String(dia) &&
            String(diaParaCorrecao.categoria_medicao) === String(categoria) &&
            diaParaCorrecao.habilitado_correcao === true &&
            ALUNOS_EMEBS[diaParaCorrecao.infantil_ou_fundamental].key ===
              alunosTabSelecionada,
        )
      ) {
        if (
          grupoLocation === "Programas e Projetos" &&
          !valorFieldParaCorrecao
        ) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  if (
    (location.state &&
      (location.state.status_periodo === "MEDICAO_APROVADA_PELA_DRE" ||
        location.state.status_periodo === "MEDICAO_APROVADA_PELA_CODAE" ||
        location.state.status_periodo === "MEDICAO_ENVIADA_PELA_UE" ||
        ([
          "MEDICAO_CORRECAO_SOLICITADA",
          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
          "MEDICAO_CORRIGIDA_PELA_UE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
        ].includes(location.state.status_periodo) &&
          !valorFieldParaCorrecao))) ||
    [
      "matriculados",
      "numero_de_alunos",
      "dietas_autorizadas",
      "participantes",
    ].includes(rowName)
  ) {
    return true;
  }

  const mesConsiderado = format(mesAnoConsiderado, "LLLL", {
    locale: ptBR,
  }).toString();
  const mesAtual = format(mesAnoDefault, "LLLL", {
    locale: ptBR,
  }).toString();

  if (nomeCategoria.includes("SOLICITAÇÕES")) {
    if (
      (!kitLanchesAutorizadas.filter((kitLanche) => kitLanche.dia === dia)
        .length &&
        rowName === "kit_lanche") ||
      (!alteracoesAlimentacaoAutorizadas.filter(
        (lancheEmergencial) => lancheEmergencial.dia === dia,
      ).length &&
        rowName === "lanche_emergencial") ||
      validacaoSemana(dia) ||
      (mesConsiderado === mesAtual &&
        Number(dia) >= format(mesAnoDefault, "dd") &&
        !ehUltimoDiaLetivoDoAno(dia, mesConsiderado)) ||
      ["Mês anterior", "Mês posterior"].includes(
        values[`${rowName}__dia_${dia}__categoria_${categoria}`],
      )
    ) {
      return true;
    }
    return false;
  }
  if (ehGrupoETECUrlParam && nomeCategoria === "ALIMENTAÇÃO") {
    const inclusao = inclusoesEtecAutorizadas.filter(
      (inclusao) => Number(inclusao.dia) === Number(dia),
    );
    if (
      rowName === "frequencia" &&
      validacaoDiaLetivo(dia) &&
      !validacaoSemana(dia) &&
      !["Mês anterior", "Mês posterior"].includes(
        values[`frequencia__dia_${dia}__categoria_${categoria}`],
      ) &&
      Object.keys(dadosValoresInclusoesEtecAutorizadasState).some((key) =>
        String(key).includes(`__dia_${dia}__categoria_${categoria}`),
      )
    ) {
      return false;
    } else if (
      rowName === "repeticao_refeicao" &&
      validacaoDiaLetivo(dia) &&
      !validacaoSemana(dia) &&
      inclusao.length &&
      inclusao[0].alimentacoes.includes("refeicao")
    ) {
      return false;
    } else if (
      (rowName === "repeticao_sobremesa" ||
        rowName === "repeticao_2_sobremesa") &&
      validacaoDiaLetivo(dia) &&
      !validacaoSemana(dia) &&
      inclusao.length &&
      inclusao[0].alimentacoes.includes("sobremesa")
    ) {
      return false;
    } else {
      return (
        !validacaoDiaLetivo(dia) ||
        validacaoSemana(dia) ||
        rowName === "numero_de_alunos" ||
        !Object.keys(dadosValoresInclusoesEtecAutorizadasState).some((key) =>
          String(key).includes(`__dia_${dia}__categoria_${categoria}`),
        ) ||
        (inclusao.length && !inclusao[0].alimentacoes.includes(rowName)) ||
        (mesConsiderado === mesAtual &&
          Number(dia) >= format(mesAnoDefault, "dd") &&
          !ehUltimoDiaLetivoDoAno(dia, mesConsiderado))
      );
    }
  }
  if (
    grupoLocation === "Programas e Projetos" ||
    location.state.periodoEspecifico
  ) {
    return (
      validacaoSemana(dia) ||
      rowName === "numero_de_alunos" ||
      rowName === "dietas_autorizadas" ||
      (nomeCategoria === "ALIMENTAÇÃO" &&
        !values[`numero_de_alunos__dia_${dia}__categoria_${categoria}`]) ||
      (nomeCategoria.includes("DIETA ESPECIAL") &&
        !values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`]) ||
      Number(
        values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`],
      ) === 0 ||
      !values[
        `numero_de_alunos__dia_${dia}__categoria_${
          categoriasDeMedicao.find((cat) => cat.nome === "ALIMENTAÇÃO").id
        }`
      ] ||
      (mesConsiderado === mesAtual &&
        Number(dia) >= format(mesAnoDefault, "dd") &&
        !ehUltimoDiaLetivoDoAno(dia, mesConsiderado)) ||
      validaAlimentacoesEDietasEscolaSemAlunosRegulares(
        inclusoesAutorizadas,
        rowName,
        dia,
        nomeCategoria,
      )
    );
  }
  if (
    grupoLocation === "Programas e Projetos" &&
    dadosValoresInclusoesAutorizadasState
  ) {
    if (feriadosNoMes.includes(dia)) {
      return true;
    }
    if (nomeCategoria === "ALIMENTAÇÃO") {
      if (rowName === "numero_de_alunos") {
        return true;
      } else if (validacaoSemana(dia)) {
        return true;
      } else if (
        !Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
          key.includes(`__dia_${dia}`),
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (rowName === "dietas_autorizadas") {
        return true;
      } else if (validacaoSemana(dia)) {
        return true;
      } else if (
        !Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
          key.includes(`__dia_${dia}`),
        )
      ) {
        return true;
      } else if (
        !values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`]
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (ehGrupoRecreioNasFerias(grupoLocation)) {
    if (feriadosNoMes.includes(dia)) {
      return true;
    }
    if (nomeCategoria === "ALIMENTAÇÃO" || nomeCategoria.includes("DIETA")) {
      if (rowName === "participantes") {
        return true;
      } else if (
        validacaoSemana(dia) ||
        (mesConsiderado === mesAtual &&
          Number(dia) >= format(mesAnoDefault, "dd"))
      ) {
        return true;
      } else if (validacaoDiaLetivo(dia)) {
        return false;
      } else if (
        !Object.keys(values).some((key) => key.includes(`__dia_${dia}`))
      ) {
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  if (
    ehPeriodoEscolarSimples &&
    nomeCategoria === "ALIMENTAÇÃO" &&
    permissoesLancamentosEspeciaisPorDia &&
    alimentacoesLancamentosEspeciais.includes(rowName)
  ) {
    if (
      ((alimentacoesLancamentosEspeciaisDia.includes(rowName) &&
        validacaoDiaLetivo(dia)) ||
        (alimentacoesLancamentosEspeciaisDia.includes(rowName) &&
          !validacaoDiaLetivo(dia) &&
          inclusoesAutorizadas.filter((inc) => inc.dia === dia).length)) &&
      !["Mês anterior", "Mês posterior"].includes(
        values[`${rowName}__dia_${dia}__categoria_${categoria}`],
      ) &&
      values[`matriculados__dia_${dia}__categoria_${categoria}`] &&
      Number(values[`matriculados__dia_${dia}__categoria_${categoria}`]) !== 0
    ) {
      return false;
    } else {
      return true;
    }
  }
  if (
    !location.state.ehPeriodoEspecifico &&
    !values[`matriculados__dia_${dia}__categoria_${categoria}`] &&
    !nomeCategoria.includes("DIETA ESPECIAL")
  ) {
    return true;
  }
  if (
    location.state.ehPeriodoEspecifico &&
    !values[`numero_de_alunos__dia_${dia}__categoria_${categoria}`] &&
    !nomeCategoria.includes("DIETA ESPECIAL")
  ) {
    return true;
  }
  if (
    !values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`] &&
    nomeCategoria.includes("DIETA ESPECIAL")
  ) {
    return true;
  }
  if (
    (location.state.ehPeriodoEspecifico ||
      grupoLocation === "Programas e Projetos") &&
    inclusoesAutorizadas?.length > 0 &&
    nomeCategoria.includes("DIETA ESPECIAL") &&
    !inclusoesAutorizadas.some((inclusao) => inclusao.dia === dia)
  ) {
    return true;
  }

  if (
    `${rowName}__dia_${dia}__categoria_${categoria}` in
      dadosValoresInclusoesAutorizadasState &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    )
  ) {
    return false;
  } else if (
    `refeicao__dia_${dia}__categoria_${categoria}` in
      dadosValoresInclusoesAutorizadasState &&
    rowName === "repeticao_refeicao" &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    )
  ) {
    return false;
  } else if (
    `sobremesa__dia_${dia}__categoria_${categoria}` in
      dadosValoresInclusoesAutorizadasState &&
    (rowName === "repeticao_sobremesa" ||
      rowName === "repeticao_2_sobremesa") &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    )
  ) {
    return false;
  } else if (
    `${rowName}__dia_${dia}__categoria_${categoria}` ===
      `frequencia__dia_${dia}__categoria_${categoria}` &&
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria}`),
    ) &&
    !["Mês anterior", "Mês posterior"].includes(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    )
  ) {
    return false;
  } else {
    return (
      !validacaoDiaLetivo(dia) ||
      validacaoSemana(dia) ||
      rowName === "matriculados" ||
      rowName === "numero_de_alunos" ||
      rowName === "dietas_autorizadas" ||
      ((!values[`matriculados__dia_${dia}__categoria_${categoria}`] ||
        Number(values[`matriculados__dia_${dia}__categoria_${categoria}`]) ===
          0) &&
        !location.state.ehPeriodoEspecifico &&
        grupoLocation !== "Programas e Projetos" &&
        !nomeCategoria.includes("DIETA ESPECIAL")) ||
      Number(
        values[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`],
      ) === 0 ||
      (mesConsiderado === mesAtual &&
        Number(dia) >= format(mesAnoDefault, "dd") &&
        !ehUltimoDiaLetivoDoAno(dia, mesConsiderado))
    );
  }
};

export const getSolicitacoesInclusaoAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  periodos_escolares,
  location = null,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Inclusão de";
  params["mes"] = mes;
  params["ano"] = ano;
  params["periodos_escolares"] = periodos_escolares;
  if (
    location &&
    ((location.state.grupo &&
      location.state.grupo.includes("Programas e Projetos")) ||
      (location.state.periodo &&
        location.state.periodo.includes("Programas e Projetos")))
  ) {
    params["tipo_doc"] = "INC_ALIMENTA_CONTINUA";
  } else {
    params["excluir_inclusoes_continuas"] = true;
  }
  if (usuarioEhEscolaCEMEI()) {
    if (location.state.periodo.includes("Infantil")) {
      params["cemei_emei"] = true;
    } else {
      params["cemei_cei"] = true;
    }
  }
  const responseInclusoesAutorizadas =
    await getSolicitacoesInclusoesAutorizadasEscola(params);
  if (responseInclusoesAutorizadas.status === HTTP_STATUS.OK) {
    return responseInclusoesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Inclusões Autorizadas");
    return [];
  }
};

export const getSolicitacoesInclusoesEtecAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Inclusão de";
  params["mes"] = mes;
  params["ano"] = ano;
  const responseInclusoesAutorizadas =
    await getSolicitacoesInclusoesEtecAutorizadasEscola(params);
  if (responseInclusoesAutorizadas.status === HTTP_STATUS.OK) {
    return responseInclusoesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Inclusões ETEC Autorizadas");
    return [];
  }
};

export const getSolicitacoesSuspensoesAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  nome_periodo_escolar,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Suspensão";
  params["mes"] = mes;
  params["ano"] = ano;
  params["nome_periodo_escolar"] = nome_periodo_escolar;
  const responseSuspensoesAutorizadas =
    await getSolicitacoesSuspensoesAutorizadasEscola(params);
  if (responseSuspensoesAutorizadas.status === HTTP_STATUS.OK) {
    return responseSuspensoesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Suspensões Autorizadas");
    return [];
  }
};

export const getPermissoesLancamentosEspeciaisMesAnoPorPeriodoAsync = async (
  escolaUuuid,
  mes,
  ano,
  nome_periodo_escolar,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["mes"] = mes;
  params["ano"] = ano;
  params["nome_periodo_escolar"] = nome_periodo_escolar;
  const responsePermissoesLancamentosEspeciaisMesAnoPorPeriodo =
    await getPermissoesLancamentosEspeciaisMesAnoPorPeriodo(params);
  if (
    responsePermissoesLancamentosEspeciaisMesAnoPorPeriodo.status ===
    HTTP_STATUS.OK
  ) {
    return responsePermissoesLancamentosEspeciaisMesAnoPorPeriodo.data.results;
  } else {
    toastError("Erro ao carregar Permissões de Lançamentos Especiais");
    return [];
  }
};

export const getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
  nomePeriodoEscolar,
  ehLancheEmergencial = false,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Alteração";
  params["mes"] = mes;
  params["ano"] = ano;
  params["eh_lanche_emergencial"] = ehLancheEmergencial;
  if (!ehLancheEmergencial) {
    params["nome_periodo_escolar"] = nomePeriodoEscolar;
  }
  const responseAlteracoesAlimentacaoAutorizadas =
    await getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola(params);
  if (responseAlteracoesAlimentacaoAutorizadas.status === HTTP_STATUS.OK) {
    return responseAlteracoesAlimentacaoAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Alterações de Alimentação Autorizadas");
    return [];
  }
};

export const getSolicitacoesKitLanchesAutorizadasAsync = async (
  escolaUuuid,
  mes,
  ano,
) => {
  const params = {};
  params["escola_uuid"] = escolaUuuid;
  params["tipo_solicitacao"] = "Kit Lanche";
  params["mes"] = mes;
  params["ano"] = ano;
  const responseKitLanchesAutorizadas =
    await getSolicitacoesKitLanchesAutorizadasEscola(params);
  if (responseKitLanchesAutorizadas.status === HTTP_STATUS.OK) {
    return responseKitLanchesAutorizadas.data.results;
  } else {
    toastError("Erro ao carregar Kit Lanches Autorizadas");
    return [];
  }
};

export const formatarLinhasTabelaAlimentacao = (
  tipos_alimentacao,
  periodoGrupo,
  solicitacao,
  eh_periodo_especifico = false,
  ehPeriodoSimples = false,
  alimentacoesLancamentosEspeciais = null,
) => {
  const tiposAlimentacaoFormatadas = tipos_alimentacao
    .filter((alimentacao) => alimentacao.nome !== "Lanche Emergencial")
    .map((alimentacao) => {
      return {
        ...alimentacao,
        name: alimentacao.nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replaceAll(/ /g, "_"),
      };
    });
  const indexRefeicao = tiposAlimentacaoFormatadas.findIndex(
    (ali) => ali.nome === "Refeição",
  );
  if (indexRefeicao !== -1) {
    tiposAlimentacaoFormatadas[indexRefeicao].nome = "Refeição 1ª Oferta";
    tiposAlimentacaoFormatadas.splice(indexRefeicao + 1, 0, {
      nome: "Repetição Refeição",
      name: "repeticao_refeicao",
      uuid: null,
    });
  }

  const indexSobremesa = tiposAlimentacaoFormatadas.findIndex(
    (ali) => ali.nome === "Sobremesa",
  );
  if (indexSobremesa !== -1) {
    tiposAlimentacaoFormatadas[indexSobremesa].nome = "Sobremesa 1º Oferta";
    tiposAlimentacaoFormatadas.splice(indexSobremesa + 1, 0, {
      nome: "Repetição Sobremesa",
      name: "repeticao_sobremesa",
      uuid: null,
    });
  }

  const matriculadosOuNumeroDeAlunos = () => {
    return periodoGrupo.grupo === "Programas e Projetos" ||
      escolaNaoPossuiAlunosRegulares(solicitacao) ||
      eh_periodo_especifico
      ? {
          nome: "Número de Alunos",
          name: "numero_de_alunos",
          uuid: null,
        }
      : {
          nome: "Matriculados",
          name: "matriculados",
          uuid: null,
        };
  };

  tiposAlimentacaoFormatadas.unshift(matriculadosOuNumeroDeAlunos(), {
    nome: "Frequência",
    name: "frequencia",
    uuid: null,
  });

  if (ehPeriodoSimples) {
    const indexLanche = tiposAlimentacaoFormatadas.findIndex(
      (ali) => ali.nome === "Lanche",
    );
    const indexLanche4h = tiposAlimentacaoFormatadas.findIndex(
      (ali) => ali.nome === "Lanche 4h",
    );
    const cloneAlimentacoesLancamentosEspeciais = deepCopy(
      alimentacoesLancamentosEspeciais,
    );
    const lanchesLancamentosEspeciais =
      cloneAlimentacoesLancamentosEspeciais.filter((alimentacao) =>
        alimentacao.name.includes("lanche"),
      );
    for (
      let index = 0;
      index <= lanchesLancamentosEspeciais.length - 1;
      index++
    ) {
      tiposAlimentacaoFormatadas.splice(
        Math.max(indexLanche, indexLanche4h) + 1 + index,
        0,
        lanchesLancamentosEspeciais[index],
      );
    }
  }

  tiposAlimentacaoFormatadas.push({
    nome: "Observações",
    name: "observacoes",
    uuid: null,
  });

  if (ehPeriodoSimples) {
    const indexObservacoes = tiposAlimentacaoFormatadas.findIndex(
      (ali) => ali.nome === "Observações",
    );
    const cloneAlimentacoesLancamentosEspeciais = deepCopy(
      alimentacoesLancamentosEspeciais,
    );
    const lancamentosEspeciaisSemLanches =
      cloneAlimentacoesLancamentosEspeciais.filter(
        (alimentacao) => !alimentacao.name.includes("lanche"),
      );
    for (
      let index = 0;
      index <= lancamentosEspeciaisSemLanches.length - 1;
      index++
    ) {
      tiposAlimentacaoFormatadas.splice(
        indexObservacoes + index,
        0,
        lancamentosEspeciaisSemLanches[index],
      );
    }
  }

  return tiposAlimentacaoFormatadas;
};

export const formatarLinhasTabelasDietas = (tipos_alimentacao) => {
  const linhasTabelasDietas = [];
  linhasTabelasDietas.push(
    {
      nome: "Dietas Autorizadas",
      name: "dietas_autorizadas",
      uuid: null,
    },
    {
      nome: "Frequência",
      name: "frequencia",
      uuid: null,
    },
  );

  const indexLanche4h = tipos_alimentacao.findIndex((ali) =>
    ali.nome.includes("4h"),
  );
  if (indexLanche4h !== -1) {
    linhasTabelasDietas.push({
      nome: tipos_alimentacao[indexLanche4h].nome,
      name: tipos_alimentacao[indexLanche4h].nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll(/ /g, "_"),
      uuid: tipos_alimentacao[indexLanche4h].uuid,
    });
  }

  const indexLanche = tipos_alimentacao.findIndex(
    (ali) => ali.nome === "Lanche",
  );
  if (indexLanche !== -1) {
    linhasTabelasDietas.push({
      nome: "Lanche",
      name: "Lanche"
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll(/ /g, "_"),
      uuid: tipos_alimentacao[indexLanche].uuid,
    });
  }

  linhasTabelasDietas.push({
    nome: "Observações",
    name: "observacoes",
    uuid: null,
  });

  return linhasTabelasDietas;
};

export const formatarLinhasTabelaDietaEnteral = (
  tipos_alimentacao,
  linhasTabelasDietas,
) => {
  const indexRefeicaoDieta = tipos_alimentacao.findIndex(
    (ali) => ali.nome === "Refeição",
  );

  if (indexRefeicaoDieta >= 0) {
    linhasTabelasDietas.splice(linhasTabelasDietas.length - 1, 0, {
      nome: "Refeição",
      name: "refeicao",
      uuid: tipos_alimentacao[indexRefeicaoDieta].uuid,
    });
  }

  return linhasTabelasDietas;
};

export const formatarLinhasTabelaSolicitacoesAlimentacao = () => {
  const linhasTabelaSolicitacoesAlimentacao = [];
  linhasTabelaSolicitacoesAlimentacao.push(
    {
      nome: "Lanche Emergencial",
      name: "lanche_emergencial",
      uuid: null,
    },
    {
      nome: "Kit Lanche",
      name: "kit_lanche",
      uuid: null,
    },
    {
      nome: "Observações",
      name: "observacoes",
      uuid: null,
    },
  );

  return linhasTabelaSolicitacoesAlimentacao;
};

export const formatarLinhasTabelaEtecAlimentacao = () => {
  const tiposAlimentacaoEtec = tiposAlimentacaoETEC();
  const tiposAlimentacaoEtecFormatadas = tiposAlimentacaoEtec
    .filter((alimentacao) => alimentacao !== "Lanche Emergencial")
    .map((alimentacao) => {
      return {
        nome: alimentacao,
        name: alimentacao
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replaceAll(/ /g, "_"),
        uuid: null,
      };
    });

  const indexRefeicaoEtec = tiposAlimentacaoEtecFormatadas.findIndex(
    (ali) => ali.nome === "Refeição",
  );
  if (indexRefeicaoEtec !== -1) {
    tiposAlimentacaoEtecFormatadas[indexRefeicaoEtec].nome =
      "Refeição 1ª Oferta";
    tiposAlimentacaoEtecFormatadas.splice(indexRefeicaoEtec + 1, 0, {
      nome: "Repetição Refeição",
      name: "repeticao_refeicao",
      uuid: null,
    });
  }

  const indexSobremesaEtec = tiposAlimentacaoEtecFormatadas.findIndex(
    (ali) => ali.nome === "Sobremesa",
  );
  if (indexSobremesaEtec !== -1) {
    tiposAlimentacaoEtecFormatadas[indexSobremesaEtec].nome =
      "Sobremesa 1º Oferta";
    tiposAlimentacaoEtecFormatadas.splice(indexSobremesaEtec + 1, 0, {
      nome: "Repetição Sobremesa",
      name: "repeticao_sobremesa",
      uuid: null,
    });
  }

  tiposAlimentacaoEtecFormatadas.unshift(
    {
      nome: "Número de Alunos",
      name: "numero_de_alunos",
      uuid: null,
    },
    {
      nome: "Frequência",
      name: "frequencia",
      uuid: null,
    },
  );

  tiposAlimentacaoEtecFormatadas.push({
    nome: "Observações",
    name: "observacoes",
    uuid: null,
  });

  return tiposAlimentacaoEtecFormatadas;
};

export const validacaoSemana = (dia, semanaSelecionada) => {
  return (
    (Number(semanaSelecionada) === 1 && Number(dia) > 20) ||
    ([4, 5, 6].includes(Number(semanaSelecionada)) && Number(dia) < 10)
  );
};

export const defaultValue = (
  column,
  row,
  semanaSelecionada,
  valoresLancamentos,
  categoria,
  form,
  periodoGrupo,
  solicitacao,
  alunosTabSelecionada = null,
) => {
  let result = null;
  let valorLancamento = null;

  if (
    solicitacao &&
    (ehEscolaTipoCEI({ nome: solicitacao.escola }) ||
      (ehEscolaTipoCEMEI({ nome: solicitacao.escola }) &&
        ["INTEGRAL", "PARCIAL"].includes(periodoGrupo.nome_periodo_grupo)))
  ) {
    valorLancamento = valoresLancamentos.find(
      (valor) =>
        Number(valor.categoria_medicao) === Number(categoria.id) &&
        Number(valor.dia) === Number(column.dia) &&
        valor.nome_campo === row.name &&
        valor.faixa_etaria === row.uuid,
    );
  } else {
    if (solicitacao?.escola_eh_emebs === true) {
      valorLancamento = valoresLancamentos.find(
        (valor) =>
          Number(valor.categoria_medicao) === Number(categoria.id) &&
          Number(valor.dia) === Number(column.dia) &&
          valor.nome_campo === row.name &&
          valor.infantil_ou_fundamental !== "N/A" &&
          ALUNOS_EMEBS[valor.infantil_ou_fundamental].key ===
            alunosTabSelecionada,
      );
    } else {
      valorLancamento = valoresLancamentos.find(
        (valor) =>
          Number(valor.categoria_medicao) === Number(categoria.id) &&
          Number(valor.dia) === Number(column.dia) &&
          valor.nome_campo === row.name,
      );
    }
  }

  if (valorLancamento) {
    result = valorLancamento.valor;
  }
  if (Number(semanaSelecionada) === 1 && Number(column.dia) > 20) {
    result = "Mês anterior";
  }
  if (
    [4, 5, 6].includes(Number(semanaSelecionada)) &&
    Number(column.dia) < 10
  ) {
    result = "Mês posterior";
  }

  if (form && periodoGrupo) {
    if (
      solicitacao &&
      (ehEscolaTipoCEI({ nome: solicitacao.escola }) ||
        (ehEscolaTipoCEMEI({ nome: solicitacao.escola }) &&
          ["INTEGRAL", "PARCIAL"].includes(periodoGrupo.nome_periodo_grupo)))
    ) {
      form.change(
        `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${
          categoria.id
        }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
          0,
          5,
        )}`,
        result,
      );
    } else {
      form.change(
        `${row.name}__dia_${column.dia}__categoria_${
          categoria.id
        }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
          0,
          5,
        )}`,
        result,
      );
    }
  }

  return result;
};

export const ehDiaParaCorrigir = (
  dia,
  categoria,
  valoresPeriodosLancamentos,
  diasParaCorrecao,
) => {
  const existeAlgumCampoParaCorrigir = valoresPeriodosLancamentos
    .filter((valor) => String(valor.dia) === String(dia))
    .filter((valor) => String(valor.categoria_medicao) === String(categoria))
    .filter((valor) => valor.habilitado_correcao === true)[0];

  return (
    existeAlgumCampoParaCorrigir ||
    (diasParaCorrecao &&
      diasParaCorrecao.find(
        (diaParaCorrecao) =>
          String(diaParaCorrecao.dia) === String(dia) &&
          String(diaParaCorrecao.categoria_medicao) === String(categoria) &&
          diaParaCorrecao.habilitado_correcao === true,
      ))
  );
};

export const textoBotaoObservacao = (
  value,
  valoresObservacoes,
  dia,
  categoria,
  escolaEhEMEBS = false,
  alunosTabSelecionada = null,
  values = null,
) => {
  let text = "Adicionar";
  const valorObs =
    valoresObservacoes &&
    valoresObservacoes.find(
      (valor) =>
        String(valor.dia) === String(dia) &&
        String(valor.categoria_medicao) === String(categoria),
    );
  if (value && !["<p></p>", "<p></p>\n", null, "", undefined].includes(value)) {
    if (
      escolaEhEMEBS &&
      valorObs &&
      ALUNOS_EMEBS[valorObs.infantil_ou_fundamental].key !==
        alunosTabSelecionada
    ) {
      text = "Adicionar";
    } else {
      text = "Visualizar";
    }
    if (
      escolaEhEMEBS &&
      values[`observacoes__dia_${dia}__categoria_${categoria}`] === value
    ) {
      text = "Visualizar";
    }
  } else if (valorObs) {
    if (
      escolaEhEMEBS &&
      ALUNOS_EMEBS[valorObs.infantil_ou_fundamental].key !==
        alunosTabSelecionada
    ) {
      text = "Adicionar";
    } else {
      text = "Visualizar";
    }
  }
  return text;
};

export const desabilitarBotaoColunaObservacoes = (
  location,
  valoresPeriodosLancamentos,
  column,
  categoria,
  formValuesAtualizados,
  row,
  valoresObservacoes,
  dia,
  diasParaCorrecao,
) => {
  const botaoEhAdicionar =
    textoBotaoObservacao(
      formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ],
      valoresObservacoes,
      dia,
      categoria.id,
    ) === "Adicionar";

  return (
    location.state &&
    (((location.state.status_periodo === "MEDICAO_APROVADA_PELA_DRE" ||
      location.state.status_periodo === "MEDICAO_APROVADA_PELA_CODAE" ||
      location.state.status_periodo === "MEDICAO_ENVIADA_PELA_UE" ||
      ([
        "MEDICAO_CORRECAO_SOLICITADA",
        "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        "MEDICAO_CORRIGIDA_PELA_UE",
        "MEDICAO_CORRIGIDA_PARA_CODAE",
      ].includes(location.state.status_periodo) &&
        !valoresPeriodosLancamentos
          .filter((valor) => valor.nome_campo === "observacoes")
          .filter((valor) => String(valor.dia) === String(column.dia))
          .filter(
            (valor) => String(valor.categoria_medicao) === String(categoria.id),
          )[0])) &&
      botaoEhAdicionar &&
      !ehDiaParaCorrigir(
        column.dia,
        categoria.id,
        valoresPeriodosLancamentos,
        diasParaCorrecao,
      )) ||
      (["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
        location.state.status_periodo,
      ) &&
        botaoEhAdicionar) ||
      ([
        "MEDICAO_CORRECAO_SOLICITADA",
        "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        "MEDICAO_CORRIGIDA_PELA_UE",
        "MEDICAO_CORRIGIDA_PARA_CODAE",
      ].includes(location.state.status_periodo) &&
        !ehDiaParaCorrigir(
          column.dia,
          categoria.id,
          valoresPeriodosLancamentos,
          diasParaCorrecao,
        )))
  );
};

export const tabAlunosEmebs = (
  escolaEhEMEBS,
  response_matriculados,
  response_log_dietas_autorizadas,
  setAlunosTabSelecionada,
  setTabItemsAlunosEmebs,
) => {
  if (escolaEhEMEBS) {
    let itemsAlunosEmebs = [];
    if (
      response_matriculados?.data
        ?.filter(
          (matriculado) => matriculado.infantil_ou_fundamental === "INFANTIL",
        )
        .some((matriculado) => matriculado.quantidade_alunos !== 0) ||
      response_log_dietas_autorizadas?.data
        ?.filter(
          (log) =>
            log.infantil_ou_fundamental === "INFANTIL" &&
            log.classificacao.toUpperCase() !== "TIPO C",
        )
        .some((log) => log.quantidade !== 0)
    ) {
      itemsAlunosEmebs.push({
        key: INFANTIL_EMEBS.key,
        label: INFANTIL_EMEBS.label,
      });
      setAlunosTabSelecionada(INFANTIL_EMEBS.key);
    }
    itemsAlunosEmebs.push({
      key: FUNDAMENTAL_EMEBS.key,
      label: FUNDAMENTAL_EMEBS.label,
    });
    setTabItemsAlunosEmebs(itemsAlunosEmebs);
  }
};

export const desabilitarBotaoObservacoesConferenciaLancamentos = (
  valoresLancamentos,
  column,
  categoria,
  solicitacao,
  alunosTabSelecionada,
) => {
  if (solicitacao?.escola_eh_emebs === true) {
    return !valoresLancamentos.find(
      (valor) =>
        valor.nome_campo === "observacoes" &&
        Number(valor.dia) === Number(column.dia) &&
        Number(valor.categoria_medicao) === Number(categoria.id) &&
        valor.infantil_ou_fundamental !== "N/A" &&
        ALUNOS_EMEBS[valor.infantil_ou_fundamental].key ===
          alunosTabSelecionada,
    );
  } else {
    return !valoresLancamentos.find(
      (valor) =>
        valor.nome_campo === "observacoes" &&
        Number(valor.dia) === Number(column.dia) &&
        Number(valor.categoria_medicao) === Number(categoria.id),
    );
  }
};

export const ehGrupoRecreioNasFerias = (grupoRecreio) => {
  const grupos = ["Recreio nas Férias", "Colaboradores"];
  return grupos.includes(grupoRecreio);
};
