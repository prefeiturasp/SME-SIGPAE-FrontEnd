import { getStatusSolicitacaoFrontend } from "../helpers";

describe("getStatusSolicitacaoFrontend", () => {
  it("retorna 'Aguardando Autorização' para 'CODAE_A_AUTORIZAR'", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_A_AUTORIZAR")).toBe(
      "Aguardando Autorização"
    );
  });

  it("retorna 'Negada' para 'CODAE_NEGOU_PEDIDO'", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_NEGOU_PEDIDO")).toBe("Negada");
  });

  it("retorna 'Autorizada' para 'CODAE_AUTORIZADO'", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_AUTORIZADO")).toBe("Autorizada");
  });

  it("retorna 'Cancelada' para 'ESCOLA_CANCELOU'", () => {
    expect(getStatusSolicitacaoFrontend("ESCOLA_CANCELOU")).toBe("Cancelada");
  });

  it("retorna undefined para um status desconhecido", () => {
    expect(getStatusSolicitacaoFrontend("STATUS_DESCONHECIDO")).toBeUndefined();
  });

  it("retorna undefined para um status nulo", () => {
    expect(getStatusSolicitacaoFrontend(null)).toBeUndefined();
  });

  it("retorna undefined para um status vazio", () => {
    expect(getStatusSolicitacaoFrontend("")).toBeUndefined();
  });
});
