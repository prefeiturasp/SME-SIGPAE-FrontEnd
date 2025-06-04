export const formataInformacoesNutricionais = (produto) => {
  let informacoesFormatadas = [];
  produto.informacoes_nutricionais.forEach((informacao) => {
    if (
      informacoesFormatadas.length === 0 ||
      !informacoesFormatadas.find(
        (informacao_) =>
          informacao_.nome ===
          informacao.informacao_nutricional.tipo_nutricional.nome
      )
    ) {
      informacoesFormatadas.push({
        nome: informacao.informacao_nutricional.tipo_nutricional.nome,
        valores: [
          {
            nome: informacao.informacao_nutricional.nome,
            quantidade_porcao: informacao.quantidade_porcao,
            valor_diario: informacao.valor_diario,
            medida: informacao.informacao_nutricional.medida,
          },
        ],
        active: false,
      });
    } else {
      let index = informacoesFormatadas.findIndex(
        (informacao_) =>
          informacao_.nome ===
          informacao.informacao_nutricional.tipo_nutricional.nome
      );
      informacoesFormatadas[index].valores.push({
        nome: informacao.informacao_nutricional.nome,
        quantidade_porcao: informacao.quantidade_porcao,
        valor_diario: informacao.valor_diario,
        medida: informacao.informacao_nutricional.medida,
      });
    }
  });
  return informacoesFormatadas;
};

export const produtoEhReclamacao = (produto) => {
  const { logs } = produto.ultima_homologacao;
  const statusDoUltimoLog = logs[logs.length - 1].status_evento_explicacao;
  const statusReclamacao = "CODAE autorizou reclamação";
  return statusReclamacao === statusDoUltimoLog;
};

export const retornaData = ({ criado_em }) => {
  return criado_em.split(" ")[0];
};

export const deveExibirEditais = (logs) => {
  const resultado = logs.find(
    (log) => log.status_evento_explicacao === "CODAE homologou"
  );
  if (resultado) {
    return true;
  }
  return false;
};

export const formataEditais = (vinculos, card_suspensos) => {
  let vinculosFiltrados = vinculos.filter((vinculo) => !vinculo.suspenso);
  if (card_suspensos) {
    vinculosFiltrados = vinculos.filter((vinculo) => vinculo.suspenso);
  }
  const editais = vinculosFiltrados.map((vinculo) => vinculo.edital.numero);
  return editais.join(", ");
};

export const formataValoresBooleanos = (value) => {
  if (value) {
    return "SIM";
  } else {
    return "NÃO";
  }
};
