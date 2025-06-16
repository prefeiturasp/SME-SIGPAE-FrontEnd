export const formataSubmit = (values, faixasEtariasCEI) => {
  if (values.alunos_cei_e_ou_emei === "EMEI") {
    delete values.solicitacao_cei;
  } else if (values.alunos_cei_e_ou_emei === "CEI") {
    delete values.solicitacao_emei;
  }

  if (
    values.solicitacao_cei === null ||
    JSON.stringify(values.solicitacao_cei) === "{}" ||
    JSON.stringify(values.solicitacao_cei) === '{"faixas_quantidades":{}}'
  ) {
    delete values.solicitacao_cei;
  } else if (
    values.solicitacao_cei &&
    values.solicitacao_cei.faixas_quantidades &&
    values.solicitacao_cei.faixas_quantidades.length === 0
  ) {
    delete values.solicitacao_cei;
  } else if (values.solicitacao_cei) {
    delete values.solicitacao_cei.solicitacao_kit_lanche_cemei;
    const faixasQuantidades = [];
    Object.keys(values.solicitacao_cei.faixas_quantidades).forEach(
      (faixa_uuid) => {
        faixasQuantidades.push({
          faixa_etaria: faixa_uuid,
          quantidade_alunos:
            values.solicitacao_cei.faixas_quantidades[faixa_uuid],
          matriculados_quando_criado: faixasEtariasCEI.find(
            (faixa) => faixa.faixa_etaria.uuid === faixa_uuid
          ).count,
        });
      }
    );
    values.solicitacao_cei.faixas_quantidades = faixasQuantidades;
  }

  if (
    values.solicitacao_emei === null ||
    JSON.stringify(values.solicitacao_emei) === "{}"
  ) {
    delete values.solicitacao_emei;
  } else if (values.solicitacao_emei) {
    delete values.solicitacao_emei.solicitacao_kit_lanche_cemei;
  }
  return values;
};

export const getNumeroTotalKits = (values, ehRelatorio = false) => {
  let totalCEI = 0;
  let totalEMEI = 0;
  if (values.solicitacao_cei && values.solicitacao_cei.faixas_quantidades) {
    if (ehRelatorio) {
      Object.values(values.solicitacao_cei.faixas_quantidades).forEach(
        (faixa) => {
          totalCEI += parseInt(faixa.quantidade_alunos);
        }
      );
    } else {
      Object.values(values.solicitacao_cei.faixas_quantidades).forEach(
        (valor) => {
          totalCEI += parseInt(valor);
        }
      );
    }
    if (values.solicitacao_cei.kits && values.solicitacao_cei.kits.length > 0) {
      totalCEI *= values.solicitacao_cei.kits.length;
    }
  }
  if (values.solicitacao_emei && values.solicitacao_emei.quantidade_alunos) {
    totalEMEI = parseInt(values.solicitacao_emei.quantidade_alunos);
    if (
      values.solicitacao_emei.kits &&
      values.solicitacao_emei.kits.length > 0
    ) {
      totalEMEI *= values.solicitacao_emei.kits.length;
    }
  }
  return totalCEI + totalEMEI;
};

export const totalAlunosCEI = (solicitacao) => {
  let totalQuantidadeAlunos = 0;
  let totalMatriculados = 0;
  if (
    solicitacao.solicitacao_cei &&
    solicitacao.solicitacao_cei.faixas_quantidades
  ) {
    solicitacao.solicitacao_cei.faixas_quantidades.forEach((valor) => {
      totalQuantidadeAlunos += parseInt(valor.quantidade_alunos);
      totalMatriculados += parseInt(valor.matriculados_quando_criado);
    });
  }
  return {
    totalQuantidadeAlunos: totalQuantidadeAlunos,
    totalMatriculados: totalMatriculados,
  };
};

export const tempoPasseio = (solicitacao) => {
  const tempo = {
    0: "até 4 horas (1 Kit)",
    1: "de 5 a 7 horas (2 Kits)",
    2: "8 horas ou mais (3 Kits)",
  };
  return tempo[Number(solicitacao.tempo_passeio)];
};

export const checaPrazo = (prioridade) => {
  let texto = "Solicitação perto do prazo de vencimento";
  if (prioridade === "REGULAR") {
    texto = "Solicitação no prazo regular";
  } else if (prioridade === "LIMITE") {
    texto = "Solicitação no prazo limite";
  }
  return texto;
};

export const filtraAlunosCEIcomDietaEspecial = (
  solicitacaoKitLancheCEMEI,
  alunosComDietaEspecial
) => {
  let alunosCEIfiltrados = [];
  if (solicitacaoKitLancheCEMEI.solicitacao_cei) {
    alunosCEIfiltrados = alunosComDietaEspecial.filter((aluno) =>
      solicitacaoKitLancheCEMEI.solicitacao_cei.alunos_com_dieta_especial_participantes.includes(
        aluno.uuid
      )
    );
  }
  return alunosCEIfiltrados;
};

export const filtraAlunosEMEIcomDietaEspecial = (
  solicitacaoKitLancheCEMEI,
  alunosComDietaEspecial
) => {
  let alunosEMEIfiltrados = [];
  if (solicitacaoKitLancheCEMEI.solicitacao_emei) {
    alunosEMEIfiltrados = alunosComDietaEspecial.filter((aluno) =>
      solicitacaoKitLancheCEMEI.solicitacao_emei.alunos_com_dieta_especial_participantes.includes(
        aluno.uuid
      )
    );
  }
  return alunosEMEIfiltrados;
};
