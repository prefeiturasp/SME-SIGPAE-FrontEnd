const buscaOPeriodoAtual = (periodo, vinculosTPAlimentacaoResponse) => {
  let tpAlimentacao = null;
  vinculosTPAlimentacaoResponse.forEach(alimentacao => {
    if (alimentacao.periodo_escolar.uuid === periodo.uuid) {
      tpAlimentacao = alimentacao;
    }
  });
  return tpAlimentacao;
};

const buscaCombosDoPeriodoIntegral = vinculosTPAlimentacaoResponse => {
  let tpAlimentacao = null;
  vinculosTPAlimentacaoResponse.forEach(alimentacao => {
    if (alimentacao.periodo_escolar.nome === "INTEGRAL") {
      tpAlimentacao = alimentacao;
    }
  });
  return tpAlimentacao;
};

export const montatiposAlimentacaoPorPeriodo = (
  vinculosTPAlimentacaoResponse,
  periodos
) => {
  periodos.forEach(periodo => {
    if (periodo.nome !== "PARCIAL") {
      const periodoAtual = buscaOPeriodoAtual(
        periodo,
        vinculosTPAlimentacaoResponse
      );
      periodo.tipos_alimentacao = periodoAtual.tipos_alimentacao;
    } else {
      const periodoIntegral = buscaCombosDoPeriodoIntegral(
        vinculosTPAlimentacaoResponse
      );
      periodo.tipos_alimentacao = periodoIntegral.tipos_alimentacao;
    }
  });
  return periodos;
};

export const montaNomeCombosAlimentacao = tiposAlimentacao => {
  tiposAlimentacao.forEach(tpAlimentacao => {
    tpAlimentacao.tipos_alimentacao.forEach(tipo_alimentacao => {
      tipo_alimentacao["nome"] = tipo_alimentacao.label;
    });
  });
  return tiposAlimentacao;
};

const retornaUuidPeriodoIntegral = periodosEscolares => {
  let uuid = null;
  periodosEscolares.forEach(periodo => {
    if (periodo.periodo_escolar.nome === "INTEGRAL") {
      uuid = periodo.uuid;
    }
  });
  return uuid;
};

export const retornaUuidEscolaPeriodoEscolar = (periodo, periodosEscolares) => {
  let uuidPeriodo = null;
  periodosEscolares.forEach(item => {
    if (item.periodo_escolar.nome === periodo.nome) {
      uuidPeriodo = item.uuid;
    } else if (periodo.nome === "PARCIAL") {
      uuidPeriodo = retornaUuidPeriodoIntegral(periodosEscolares);
    }
  });
  return uuidPeriodo;
};

export const renderizarLabelTipoAlimentacao = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione";
  }
  if (selected.length === options.length) {
    return "Todos os itens estão selecionados";
  }
  if (selected.length === 1) {
    return `${selected.length} tipo de alimentação selecionado`;
  }
  return `${selected.length} tipos de alimentações selecionados`;
};
