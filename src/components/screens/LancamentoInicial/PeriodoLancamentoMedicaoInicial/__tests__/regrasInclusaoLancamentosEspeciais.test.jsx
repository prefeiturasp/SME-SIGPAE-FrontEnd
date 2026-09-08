import {
  ehDiaFimDeSemanaOuFeriado,
  getTiposAlimentacaoDaInclusaoNoDia,
  inclusaoDeFimDeSemanaRestringeAlimentacoes,
  lancamentoEspecialCompativelComInclusao,
} from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/regrasInclusaoLancamentosEspeciais";

describe("regrasInclusaoLancamentosEspeciais", () => {
  const mesAgosto2026 = new Date(2026, 7, 1);

  it("identifica sábado e feriado", () => {
    expect(ehDiaFimDeSemanaOuFeriado(29, mesAgosto2026, [])).toBe(true);
    expect(ehDiaFimDeSemanaOuFeriado(3, mesAgosto2026, [])).toBe(false);
    expect(ehDiaFimDeSemanaOuFeriado(3, mesAgosto2026, [3])).toBe(true);
  });

  it("extrai tipos de alimentação da inclusão do dia", () => {
    expect(
      getTiposAlimentacaoDaInclusaoNoDia(
        [{ dia: "29", alimentacoes: "lanche" }],
        29,
      ),
    ).toEqual(["lanche"]);
    expect(
      getTiposAlimentacaoDaInclusaoNoDia(
        [{ dia: 29, alimentacoes: "refeicao, sobremesa" }],
        "29",
      ),
    ).toEqual(["refeicao", "sobremesa"]);
  });

  it("restringe alimentações apenas quando há inclusão em fim de semana", () => {
    const inclusoes = [{ dia: 29, alimentacoes: "lanche" }];
    expect(
      inclusaoDeFimDeSemanaRestringeAlimentacoes(
        29,
        mesAgosto2026,
        [],
        inclusoes,
      ),
    ).toBe(true);
    expect(
      inclusaoDeFimDeSemanaRestringeAlimentacoes(29, mesAgosto2026, [], []),
    ).toBe(false);
    expect(
      inclusaoDeFimDeSemanaRestringeAlimentacoes(
        3,
        mesAgosto2026,
        [],
        [{ dia: 3, alimentacoes: "lanche" }],
      ),
    ).toBe(false);
  });

  it("só considera permissionamento especial compatível com a inclusão", () => {
    const inclusaoLanche = [{ dia: 29, alimentacoes: "lanche" }];
    const inclusaoRefeicaoSobremesa = [
      { dia: 29, alimentacoes: "refeicao, sobremesa" },
    ];

    expect(
      lancamentoEspecialCompativelComInclusao(
        "2_refeicao_1_oferta",
        inclusaoLanche,
        29,
      ),
    ).toBe(false);
    expect(
      lancamentoEspecialCompativelComInclusao(
        "2_refeicao_1_oferta",
        inclusaoRefeicaoSobremesa,
        29,
      ),
    ).toBe(true);
    expect(
      lancamentoEspecialCompativelComInclusao(
        "2_sobremesa_1_oferta",
        inclusaoRefeicaoSobremesa,
        29,
      ),
    ).toBe(true);
    expect(
      lancamentoEspecialCompativelComInclusao("frequencia", inclusaoLanche, 29),
    ).toBe(true);
  });
});
