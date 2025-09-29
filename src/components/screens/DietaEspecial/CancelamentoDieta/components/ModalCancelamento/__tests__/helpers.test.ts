import { getStatusSolicitacaoFrontend } from "../helpers";

describe("getStatusSolicitacaoFrontend", () => {
  const cases: Array<[string, string | undefined]> = [
    ["CODAE_A_AUTORIZAR", "Aguardando Autorização"],
    ["CODAE_NEGOU_PEDIDO", "Negada"],
    ["CODAE_AUTORIZADO", "Autorizada"],
    ["ESCOLA_CANCELOU", "Cancelada"],
    ["STATUS_DESCONHECIDO", undefined],
    ["", undefined],
    [null as any, undefined],
  ];

  it.each(cases)("retorna '%s' → '%s'", (input, expected) => {
    expect(getStatusSolicitacaoFrontend(input)).toBe(expected);
  });
});
