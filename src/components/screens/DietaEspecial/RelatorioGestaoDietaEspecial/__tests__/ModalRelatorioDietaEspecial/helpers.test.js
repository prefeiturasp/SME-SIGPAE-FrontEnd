import { getStatusSolicitacaoFrontend } from "../../components/ModalRelatorioDietaEspecial/helpers";

describe("Função helpers.jsx", () => {
  test("getStatusSolicitacaoFrontend - deve retornar 'Aguardando Autorização' para CODAE_A_AUTORIZAR", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_A_AUTORIZAR")).toBe(
      "Aguardando Autorização"
    );
  });

  test("getStatusSolicitacaoFrontend - deve retornar 'Negada' para CODAE_NEGOU_PEDIDO", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_NEGOU_PEDIDO")).toBe("Negada");
  });

  test("getStatusSolicitacaoFrontend - deve retornar 'Autorizada' para CODAE_AUTORIZADO", () => {
    expect(getStatusSolicitacaoFrontend("CODAE_AUTORIZADO")).toBe("Autorizada");
  });

  test("getStatusSolicitacaoFrontend - deve retornar 'Cancelada' para ESCOLA_CANCELOU", () => {
    expect(getStatusSolicitacaoFrontend("ESCOLA_CANCELOU")).toBe("Cancelada");
  });

  test("getStatusSolicitacaoFrontend - deve retornar 'Status não encontrado' para um status desconhecido", () => {
    expect(getStatusSolicitacaoFrontend("STATUS_INVALIDO")).toBe(
      "Status não encontrado"
    );
  });

  test("getStatusSolicitacaoFrontend - deve retornar 'Status não encontrado' quando o status for undefined", () => {
    expect(getStatusSolicitacaoFrontend(undefined)).toBe(
      "Status não encontrado"
    );
  });
});
