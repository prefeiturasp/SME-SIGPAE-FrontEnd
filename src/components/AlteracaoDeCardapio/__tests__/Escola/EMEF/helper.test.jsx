import {
  REFEICAO_E_SOBREMESA,
  adicionarRefeicaoESobremesa,
  expandirTiposAlimentacao,
  formataValues,
  obterTipoAlimentacaoSelecionado,
} from "src/components/AlteracaoDeCardapio/Escola/helper";

const tiposAlimentacao = [
  { nome: "Refeição", uuid: "uuid-refeicao" },
  { nome: "Sobremesa", uuid: "uuid-sobremesa" },
  { nome: "Lanche", uuid: "uuid-lanche" },
];

describe("helper formataValues - Alteração de Cardápio Escola", () => {
  it("preenche datas_intervalo com intervalo quando há data_inicial e data_final", () => {
    const values = formataValues({
      data_inicial: "30/01/2025",
      data_final: "01/02/2025",
      substituicoes: [],
    });
    expect(values.datas_intervalo).toEqual([
      { data: "2025-01-30" },
      { data: "2025-01-31" },
      { data: "2025-02-01" },
    ]);
  });

  it("preenche datas_intervalo com um único dia quando há alterar_dia", () => {
    const values = formataValues({
      alterar_dia: "30/01/2025",
      substituicoes: [],
    });
    expect(values.datas_intervalo).toEqual([{ data: "2025-01-30" }]);
  });

  it("não preenche datas_intervalo quando não há datas", () => {
    const values = formataValues({ substituicoes: [] });
    expect(values.datas_intervalo).toBeUndefined();
  });

  it("converte o tipo de alimentação selecionado em array para o backend", () => {
    const values = formataValues({
      alterar_dia: "30/01/2025",
      substituicoes: [
        {
          tipos_alimentacao_de: "uuid-lanche",
          tipos_alimentacao_para: "uuid-refeicao",
          tipos_alimentacao: tiposAlimentacao,
        },
      ],
    });
    expect(values.substituicoes[0].tipos_alimentacao_de).toEqual([
      "uuid-lanche",
    ]);
    expect(values.substituicoes[0].tipos_alimentacao_para).toEqual([
      "uuid-refeicao",
    ]);
  });

  it("expande Refeição e Sobremesa para os uuids de Refeição e Sobremesa", () => {
    const values = formataValues({
      alterar_dia: "30/01/2025",
      substituicoes: [
        {
          tipos_alimentacao_de: REFEICAO_E_SOBREMESA,
          tipos_alimentacao_para: "uuid-lanche",
          tipos_alimentacao: tiposAlimentacao,
        },
      ],
    });
    expect(values.substituicoes[0].tipos_alimentacao_de).toEqual([
      "uuid-refeicao",
      "uuid-sobremesa",
    ]);
  });

  it("não quebra ao formatar values sem substituições", () => {
    const values = formataValues({ alterar_dia: "30/01/2025" });
    expect(values.datas_intervalo).toEqual([{ data: "2025-01-30" }]);
  });
});

describe("helper adicionarRefeicaoESobremesa - Alteração de Cardápio Escola", () => {
  it("adiciona a opção Refeição e Sobremesa ao final da lista", () => {
    const opcoes = adicionarRefeicaoESobremesa([
      { nome: "Refeição", uuid: "uuid-refeicao" },
    ]);
    expect(opcoes[opcoes.length - 1]).toEqual({
      nome: "Refeição e Sobremesa",
      uuid: REFEICAO_E_SOBREMESA,
    });
  });
});

describe("helper expandirTiposAlimentacao - Alteração de Cardápio Escola", () => {
  it("retorna array vazio quando não há seleção", () => {
    expect(expandirTiposAlimentacao(undefined, tiposAlimentacao)).toEqual([]);
    expect(expandirTiposAlimentacao("", tiposAlimentacao)).toEqual([]);
  });

  it("retorna array com o uuid quando a seleção é simples", () => {
    expect(expandirTiposAlimentacao("uuid-lanche", tiposAlimentacao)).toEqual([
      "uuid-lanche",
    ]);
  });

  it("expande Refeição e Sobremesa nos uuids correspondentes", () => {
    expect(
      expandirTiposAlimentacao(REFEICAO_E_SOBREMESA, tiposAlimentacao),
    ).toEqual(["uuid-refeicao", "uuid-sobremesa"]);
  });
});

describe("helper obterTipoAlimentacaoSelecionado - Alteração de Cardápio Escola", () => {
  it("retorna o uuid quando há apenas um tipo selecionado", () => {
    expect(
      obterTipoAlimentacaoSelecionado(
        [{ nome: "Refeição", uuid: "uuid-refeicao" }],
        tiposAlimentacao,
      ),
    ).toBe("uuid-refeicao");
  });

  it("retorna Refeição e Sobremesa quando ambos foram selecionados", () => {
    expect(
      obterTipoAlimentacaoSelecionado(
        [
          { nome: "Refeição", uuid: "uuid-refeicao" },
          { nome: "Sobremesa", uuid: "uuid-sobremesa" },
        ],
        tiposAlimentacao,
      ),
    ).toBe(REFEICAO_E_SOBREMESA);
  });

  it("retorna undefined quando não há tipos selecionados", () => {
    expect(
      obterTipoAlimentacaoSelecionado([], tiposAlimentacao),
    ).toBeUndefined();
  });
});
