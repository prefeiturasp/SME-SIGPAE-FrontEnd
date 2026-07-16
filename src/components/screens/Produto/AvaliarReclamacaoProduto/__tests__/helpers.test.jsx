import { formatarValues } from "../helpers";

const todosOsStatus = [
  "CODAE_PEDIU_ANALISE_RECLAMACAO",
  "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
  "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
  "CODAE_AUTORIZOU_RECLAMACAO",
  "CODAE_PEDIU_ANALISE_SENSORIAL",
  "CODAE_QUESTIONOU_UE",
  "UE_RESPONDEU_QUESTIONAMENTO",
  "CODAE_QUESTIONOU_NUTRISUPERVISOR",
  "NUTRISUPERVISOR_RESPONDEU_QUESTIONAMENTO",
];

const statusReclamacao = [
  "AGUARDANDO_AVALIACAO",
  "RESPONDIDO_TERCEIRIZADA",
  "AGUARDANDO_ANALISE_SENSORIAL",
  "ANALISE_SENSORIAL_RESPONDIDA",
  "AGUARDANDO_RESPOSTA_TERCEIRIZADA",
  "AGUARDANDO_RESPOSTA_UE",
  "RESPONDIDO_UE",
  "AGUARDANDO_RESPOSTA_NUTRISUPERVISOR",
  "RESPONDIDO_NUTRISUPERVISOR",
];

describe("formatarValues", () => {
  it.each([
    ["Aguardando resposta terceirizada", "CODAE_PEDIU_ANALISE_RECLAMACAO"],
    ["Aguardando avaliação CODAE", "ESCOLA_OU_NUTRICIONISTA_RECLAMOU"],
    ["Respondido terceirizada", "TERCEIRIZADA_RESPONDEU_RECLAMACAO"],
  ])(
    "formata o status %s para o valor esperado pela API",
    (statusInformado, statusEsperado) => {
      const values = {
        nome_produto: "Arroz",
        status: statusInformado,
      };

      const resultado = formatarValues(values);

      expect(resultado).toEqual({
        nome_produto: "Arroz",
        status: [statusEsperado],
        status_reclamacao: statusReclamacao,
      });
    },
  );

  it("adiciona todos os status quando nenhum status é informado", () => {
    const values = {
      nome_produto: "Arroz",
    };

    const resultado = formatarValues(values);

    expect(resultado).toEqual({
      nome_produto: "Arroz",
      status: todosOsStatus,
      status_reclamacao: statusReclamacao,
    });
  });

  it("substitui o status de reclamação pelos valores permitidos", () => {
    const values = {
      status: "Respondido terceirizada",
      status_reclamacao: ["STATUS_ANTIGO"],
    };

    const resultado = formatarValues(values);

    expect(resultado.status_reclamacao).toEqual(statusReclamacao);
  });

  it("altera e retorna o mesmo objeto recebido", () => {
    const values = {
      status: "Aguardando avaliação CODAE",
    };

    const resultado = formatarValues(values);

    expect(resultado).toBe(values);
    expect(values.status).toEqual(["ESCOLA_OU_NUTRICIONISTA_RECLAMOU"]);
    expect(values.status_reclamacao).toEqual(statusReclamacao);
  });
});
