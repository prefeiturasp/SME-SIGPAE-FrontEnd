import {
  CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO,
  CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE,
  CARD_SOLICITACOES_ALTERACOES_DILOG,
  CARD_SOLICITACOES_ALTERACOES_CODAE,
  CARD_SOLICITACOES_APROVADAS_ABASTECIMENTO,
  CARD_SOLICITACOES_REPROVADAS_ABASTECIMENTO,
  CARD_SOLICITACOES_APROVADAS_DILOG,
  CARD_SOLICITACOES_REPROVADAS_DILOG,
  cards_alteracao_abastecimento,
  cards_alteracao_dilog,
  cards_alteracao_visao_cronograma,
} from "../../PreRecebimento/PainelAprovacoes/constants";

describe("constants do Painel de Aprovações", () => {
  test("Deve configurar o card de solicitações de alterações do abastecimento", () => {
    expect(CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO).toEqual({
      id: "Solicitações de Alterações",
      titulo: "Solicitações de Alterações",
      icon: "fa-exclamation-triangle",
      style: "card-solicitacoes-alteracoes",
      incluir_status: ["CRONOGRAMA_CIENTE"],
      href: "/abastecimento/solicitacoes-alteracoes",
    });
  });

  test("Deve configurar o card de solicitações de alterações em análise na visão cronograma", () => {
    expect(CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE).toEqual({
      id: "Solicitações de Alterações",
      titulo: "Solicitações de Alterações",
      icon: "fa-exclamation-triangle",
      style: "card-solicitacoes-alteracoes",
      incluir_status: ["EM_ANALISE"],
      href: "/cronograma/solicitacoes-alteracoes",
    });
  });

  test("Deve configurar o card de solicitações de alterações da DILOG com status aprovados e reprovados pelo abastecimento", () => {
    expect(CARD_SOLICITACOES_ALTERACOES_DILOG.incluir_status).toEqual([
      "APROVADO_DILOG_ABASTECIMENTO",
      "REPROVADO_DILOG_ABASTECIMENTO",
    ]);

    expect(CARD_SOLICITACOES_ALTERACOES_DILOG.href).toBe(
      "/dilog/solicitacoes-alteracoes",
    );
  });

  test("Deve configurar o card de alterações CODAE", () => {
    expect(CARD_SOLICITACOES_ALTERACOES_CODAE).toEqual({
      id: "Alterações CODAE",
      titulo: "Alterações CODAE",
      icon: "fa-info-circle",
      style: "card-alteracoes-codae",
      incluir_status: ["ALTERACAO_ENVIADA_FORNECEDOR", "FORNECEDOR_CIENTE"],
      href: "/cronograma/alteracoes-codae",
    });
  });

  test("Deve montar os cards de alteração do abastecimento na ordem esperada", () => {
    expect(cards_alteracao_abastecimento).toEqual([
      CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO,
      CARD_SOLICITACOES_APROVADAS_ABASTECIMENTO,
      CARD_SOLICITACOES_REPROVADAS_ABASTECIMENTO,
      CARD_SOLICITACOES_ALTERACOES_CODAE,
    ]);
  });

  test("Deve montar os cards de alteração da DILOG na ordem esperada", () => {
    expect(cards_alteracao_dilog).toEqual([
      CARD_SOLICITACOES_ALTERACOES_DILOG,
      CARD_SOLICITACOES_APROVADAS_DILOG,
      CARD_SOLICITACOES_REPROVADAS_DILOG,
      CARD_SOLICITACOES_ALTERACOES_CODAE,
    ]);
  });

  test("Deve montar os cards de alteração da visão cronograma na ordem esperada", () => {
    expect(cards_alteracao_visao_cronograma).toEqual([
      CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE,
      CARD_SOLICITACOES_APROVADAS_DILOG,
      CARD_SOLICITACOES_REPROVADAS_DILOG,
      CARD_SOLICITACOES_ALTERACOES_CODAE,
    ]);
  });
});
