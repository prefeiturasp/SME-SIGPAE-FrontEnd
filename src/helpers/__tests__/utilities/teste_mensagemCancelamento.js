import { mensagemCancelamento } from "../../utilities";
import { statusEnum } from "../../../constants/shared";

describe("Teste mensagemCancelamento", () => {
  it("retorna mensagem dre a validar", () => {
    expect(mensagemCancelamento(statusEnum.DRE_A_VALIDAR)).toEqual(
      "Esta solicitação está aguardando validação pela DRE. "
    );
  });
  it("retorna mensagem dre validou", () => {
    expect(mensagemCancelamento(statusEnum.DRE_VALIDADO)).toEqual(
      "Esta solicitação já foi validada pela DRE. "
    );
  });
  it("retorna mensagem codae a autorizar", () => {
    expect(mensagemCancelamento(statusEnum.CODAE_A_AUTORIZAR)).toEqual(
      "Esta solicitação está aguardando validação da CODAE. "
    );
  });
  it("retorna mensagem codae autorizou", () => {
    expect(mensagemCancelamento(statusEnum.TERCEIRIZADA_TOMOU_CIENCIA)).toEqual(
      "Esta solicitação já foi autorizada pela CODAE. "
    );
  });
  it("retorna mensagem codae autorizou", () => {
    expect(mensagemCancelamento(statusEnum.CODAE_AUTORIZADO)).toEqual(
      "Esta solicitação já foi autorizada pela CODAE. "
    );
  });
  it("retorna nada", () => {
    expect(mensagemCancelamento("nada")).toEqual("");
  });
});
