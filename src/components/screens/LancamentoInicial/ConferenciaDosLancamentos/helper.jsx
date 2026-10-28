export const calcularDiasComApontamentoKitLanchePasseio = (
  valoresLancamentos,
  kitLanchesAutorizados,
  inclusoesAutorizadas,
) => {
  const diasComFrequencia = new Set(
    (valoresLancamentos || [])
      .filter(
        (valor) =>
          valor.nome_campo === "frequencia" &&
          valor.dia !== null &&
          valor.dia !== undefined &&
          Number(valor.valor) > 0,
      )
      .map((valor) => String(valor.dia)),
  );
  const diasComInclusao = new Set(
    (inclusoesAutorizadas || []).map((inclusao) => String(inclusao.dia)),
  );

  return new Set(
    (kitLanchesAutorizados || [])
      .map((kitLanche) => String(kitLanche.dia))
      .filter((dia) => diasComFrequencia.has(dia) && !diasComInclusao.has(dia)),
  );
};

export const formatarNomePeriodo = (nomePeriodo) => {
  switch (nomePeriodo) {
    case "MANHA":
      return "Manhã";
    case "TARDE":
      return "Tarde";
    case "NOITE":
      return "Noite";
    case "INTEGRAL":
      return "Integral";
    case "PARCIAL":
      return "Parcial";
    case "VESPERTINO":
      return "Vespertino";
    case "INTERMEDIARIO":
      return "Intermediário";
    case "Programas e Projetos - MANHA":
      return "Programas e Projetos - Manhã";
    case "Programas e Projetos - TARDE":
      return "Programas e Projetos - Tarde";
    case "Programas e Projetos - NOITE":
      return "Programas e Projetos - Noite";
    case "Programas e Projetos - INTEGRAL":
      return "Programas e Projetos - Integral";
    case "Programas e Projetos - PARCIAL":
      return "Programas e Projetos - Parcial";
    case "Programas e Projetos - VESPERTINO":
      return "Programas e Projetos - Vespertino";
    case "Programas e Projetos - INTERMEDIARIO":
      return "Programas e Projetos - Intermediário";
    default:
      return nomePeriodo;
  }
};
