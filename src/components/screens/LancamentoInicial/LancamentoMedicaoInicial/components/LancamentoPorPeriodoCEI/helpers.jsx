import {
  ehEscolaTipoCEMEI,
  recreioNasFeriasDaMedicao,
  recreioNasFeriasDaMedicaoEMEIdaCEMEI,
} from "src/helpers/utilities";

export const ehEmeiDaCemei = (
  escolaInstituicao,
  periodosEscolaCemeiComAlunosEmei,
  nomeGrupo,
) => {
  return (
    ehEscolaTipoCEMEI(escolaInstituicao) &&
    periodosEscolaCemeiComAlunosEmei.includes(nomeGrupo)
  );
};

export const textoCabecalhoFormatado = (textoCabecalho) => {
  switch (textoCabecalho) {
    case "MANHA":
      return "Infantil Manhã";
    case "TARDE":
      return "Infantil Tarde";
    case "PARCIAL":
      return "Período Parcial";
    case "INTEGRAL":
      return "Período Integral";
    case "Infantil INTEGRAL":
      return "Infantil Integral";
    case "Infantil MANHA":
      return "Infantil Manhã";
    case "Infantil TARDE":
      return "Infantil Tarde";
    case "Solicitações de Alimentação":
      return "Solicitações de Alimentação - Infantil";
    default:
      return textoCabecalho;
  }
};

export const numeroRefeicoesDiarias = (textoCabecalho) => {
  switch (textoCabecalho) {
    case "PARCIAL":
      return 3;
    case "INTEGRAL":
    case "Recreio nas Férias":
    case "Recreio nas Férias - de 0 a 3 anos e 11 meses":
      return 5;
    default:
      return 2;
  }
};

export const tiposAlimentacaoRecreio = (
  solicitacaoMedicaoInicial,
  escolaInstituicao,
  colaboradores = false,
) => {
  const recreio = recreioNasFeriasDaMedicao(solicitacaoMedicaoInicial);
  const tipos = recreio.unidades_participantes[0].tipos_alimentacao;
  const ordenacao = (a, b) => a.nome.localeCompare(b.nome);

  if (!ehEscolaTipoCEMEI(escolaInstituicao)) {
    return colaboradores ? tipos.colaboradores : tipos.inscritos;
  }

  if (colaboradores) return tipos.colaboradores.sort(ordenacao);

  const tipoUnidade = recreioNasFeriasDaMedicaoEMEIdaCEMEI(
    solicitacaoMedicaoInicial,
  )
    ? "EMEI"
    : "CEI";
  const tipos_alimentacao = recreio.unidades_participantes.find(
    (up) => up.cei_ou_emei === tipoUnidade,
  )?.tipos_alimentacao;

  return tipoUnidade === "CEI"
    ? tipos_alimentacao.inscritos
    : tipos_alimentacao.infantil.sort(ordenacao);
};
