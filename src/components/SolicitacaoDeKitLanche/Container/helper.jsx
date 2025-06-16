const montaObjetoFaixasEtarias = (faixas_etarias, alunosPorFaixaEtaria) => {
  if ([faixas_etarias, alunosPorFaixaEtaria].includes(undefined)) return [];
  const lista = [];
  Object.entries(faixas_etarias).forEach((dadosFaixa) => {
    const [faixa_etaria, quantidade] = dadosFaixa;
    const matriculados_quando_criado = alunosPorFaixaEtaria.find(
      (f) => f.faixa_etaria.uuid === faixa_etaria
    );
    lista.push({
      faixa_etaria: faixa_etaria,
      quantidade: quantidade,
      matriculados_quando_criado: parseInt(matriculados_quando_criado.count),
    });
  });
  return lista;
};

export const montaObjetoRequisicao = (values, alunosPorFaixaEtaria) => {
  let kit_lanche_avulso = {
    solicitacao_kit_lanche: {
      kits: values.kit_lanche,
      descricao: values.observacao,
      data: values.evento_data,
      tempo_passeio: values.tempo_passeio,
    },
    faixas_etarias: montaObjetoFaixasEtarias(
      values.faixas_etarias,
      alunosPorFaixaEtaria
    ),
    escola: values.escola,
    local: values.local,
    evento: values.evento,
    quantidade_alunos: values.quantidade_alunos,
    alunos_com_dieta_especial_participantes:
      values.alunos_com_dieta_especial_participantes
        ? Object.keys(values.alunos_com_dieta_especial_participantes)
        : [],
  };
  return kit_lanche_avulso;
};

export const filtraPrioritarios = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.prioridade === "PRIORITARIO";
  });
};

export const filtraNoLimite = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.prioridade === "LIMITE";
  });
};

export const filtraRegular = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.prioridade === "REGULAR";
  });
};
