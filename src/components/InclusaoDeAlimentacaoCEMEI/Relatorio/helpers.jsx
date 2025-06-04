export const periodosDaInclusao = (inclusao) => {
  return [
    ...new Set(
      inclusao.quantidade_alunos_cei_da_inclusao_cemei
        .map((q) => q.periodo_escolar.nome)
        .concat(
          inclusao.quantidade_alunos_emei_da_inclusao_cemei.map(
            (q) => q.periodo_escolar.nome
          )
        )
    ),
  ];
};

export const inclusaoPossuiCEInestePeriodo = (inclusao, periodo) => {
  return inclusao.quantidade_alunos_cei_da_inclusao_cemei.find(
    (q) => q.periodo_escolar.nome === periodo
  );
};

export const inclusaoPossuiEMEInestePeriodo = (inclusao, periodo) => {
  return inclusao.quantidade_alunos_emei_da_inclusao_cemei.find(
    (q) => q.periodo_escolar.nome === periodo
  );
};
