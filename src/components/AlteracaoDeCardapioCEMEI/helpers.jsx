export const backgroundLabelPeriodo = (periodos) => {
  const periodosComStyles = periodos.map((periodo) => {
    switch (periodo.nome) {
      case "MANHA":
        periodo["background"] = "#fff7cb";
        periodo["borderColor"] = "#ffd79b";
        break;

      case "TARDE":
        periodo["background"] = "#ffeed6";
        periodo["borderColor"] = "#ffbb8a";
        break;

      case "NOITE":
        periodo["background"] = "#e4f1ff";
        periodo["borderColor"] = "#82b7e8";
        break;

      case "INTEGRAL":
        periodo["background"] = "#ebedff";
        periodo["borderColor"] = "#b2baff";
        break;

      default:
        periodo["background"] = "#eaffe3";
        periodo["borderColor"] = "#79cf91";
        break;
    }
    return periodo;
  });
  return periodosComStyles;
};

export const formataDadosTabelaCEMEI = (solicitacao) => {
  let substituicoes =
    solicitacao.substituicoes_cemei_cei_periodo_escolar.concat(
      solicitacao.substituicoes_cemei_emei_periodo_escolar
    );
  let periodos = substituicoes.sort(
    (a, b) => a.periodo_escolar.posicao - b.periodo_escolar.posicao
  );
  periodos = periodos.map((s) => s.periodo_escolar.nome);
  periodos = [...new Set(periodos)];
  periodos = periodos.map((p) => {
    return { nome: p };
  });
  periodos = backgroundLabelPeriodo(periodos);
  substituicoes = periodos.map((p) => {
    const alunosPorFaixaCEI =
      solicitacao.substituicoes_cemei_cei_periodo_escolar.filter(
        (s) => s.periodo_escolar.nome === p.nome
      )[0];
    const alunosPorFaixaEMEI =
      solicitacao.substituicoes_cemei_emei_periodo_escolar.filter(
        (s) => s.periodo_escolar.nome === p.nome
      )[0];
    p["substituicoesCEI"] = alunosPorFaixaCEI;
    p["substituicoesEMEI"] = alunosPorFaixaEMEI;
    return p;
  });
  return substituicoes;
};

export const totalMatriculados = (faixas) => {
  let total = 0;
  faixas
    .filter((faixa) => faixa.inicio > 11)
    .forEach((faixa) => {
      total += faixa.quantidade_alunos;
    });
  return total;
};

export const totalSolicitacao = (values, periodoCEI) => {
  let total = 0;
  values.substituicoes.forEach((substituicao) => {
    if (
      periodoCEI.periodo_escolar.uuid === substituicao.periodo_uuid &&
      substituicao.cei &&
      substituicao.cei.faixas_etarias
    ) {
      substituicao.cei.faixas_etarias.forEach((faixa) => {
        total += faixa.quantidade_alunos
          ? parseInt(faixa.quantidade_alunos)
          : 0;
      });
    }
  });
  return total;
};

export const formatarPayload = (values, meusDados) => {
  let substituicoes_cemei_cei_periodo_escolar = [];
  let substituicoes_cemei_emei_periodo_escolar = [];

  values.substituicoes.forEach((substituicao) => {
    if (substituicao && substituicao.checked) {
      if (substituicao.cei) {
        substituicoes_cemei_cei_periodo_escolar.push({
          periodo_escolar: substituicao.periodo_uuid,
          tipos_alimentacao_de:
            typeof substituicao.cei.tipos_alimentacao_de === "string"
              ? [substituicao.cei.tipos_alimentacao_de]
              : substituicao.cei.tipos_alimentacao_de,
          tipos_alimentacao_para:
            typeof substituicao.cei.tipos_alimentacao_para === "string"
              ? [substituicao.cei.tipos_alimentacao_para]
              : substituicao.cei.tipos_alimentacao_para,
          faixas_etarias: substituicao.cei.faixas_etarias
            .filter((faixa) => faixa !== null)
            .map((faixa) => {
              return {
                faixa_etaria: faixa.faixa_uuid,
                quantidade: faixa.quantidade_alunos,
                matriculados_quando_criado: faixa.matriculados_quando_criado,
              };
            })
            .filter((faixa) => faixa.faixa_etaria !== undefined),
        });
      }
      if (substituicao.emei) {
        substituicoes_cemei_emei_periodo_escolar.push({
          qtd_alunos: substituicao.emei.quantidade_alunos,
          matriculados_quando_criado:
            substituicao.emei.matriculados_quando_criado,
          periodo_escolar: substituicao.periodo_uuid,
          tipos_alimentacao_de: substituicao.emei.tipos_alimentacao_de,
          tipos_alimentacao_para: substituicao.emei.tipos_alimentacao_para,
        });
      }
    }
  });

  let payload = {
    escola: meusDados.vinculo_atual.instituicao.uuid,
    motivo: values.motivo,
    alunos_cei_e_ou_emei: values.alunos_cei_e_ou_emei,
    alterar_dia: values.alterar_dia,
    data_inicial: values.data_inicial,
    data_final: values.data_final,
    substituicoes_cemei_cei_periodo_escolar:
      substituicoes_cemei_cei_periodo_escolar,
    substituicoes_cemei_emei_periodo_escolar:
      substituicoes_cemei_emei_periodo_escolar,
    observacao: values.observacao,
  };
  return payload;
};

export const validarSubmit = (values) => {
  let erro = false;
  let substituicoes = values.substituicoes.filter(
    (substituicao) => substituicao && substituicao.checked === true
  );

  if (substituicoes.length === 0) {
    erro = "Necessário preencher ao menos um período";
    return erro;
  }
};
