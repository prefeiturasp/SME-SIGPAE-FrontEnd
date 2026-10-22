import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TabelaDietas } from "../../components/Tabelas/TabelaDietas";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";

describe("Teste de comportamentos componente - TabelaDietas", () => {
  const tiposAlimentacaoMock =
    mockGetTiposUnidadeEscolarTiposAlimentacao.results.find(
      (e) => e.iniciais === "EMEI",
    ).periodos_escolares[0].tipos_alimentacao;

  const tabelasMock = [
    {
      nome: "DIETA ESPECIAL - TIPO A",
      valores: [
        {
          tipo_alimentacao: { uuid: "65f11f11-630b-4629-bb17-07c875c548f1" },
          tipo_valor: "UNITARIO",
          valor: "10",
        },
        {
          tipo_alimentacao: { uuid: "65f11f11-630b-4629-bb17-07c875c548f1" },
          tipo_valor: "ACRESCIMO",
          valor: "20",
        },
        {
          tipo_alimentacao: { uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" },
          tipo_valor: "UNITARIO",
          valor: "5",
        },
        {
          tipo_alimentacao: { uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" },
          tipo_valor: "ACRESCIMO",
          valor: "10",
        },
        {
          tipo_alimentacao: { uuid: "83fefd96-e476-42a0-81fc-75b9853b726c" },
          tipo_valor: "UNITARIO",
          valor: "4",
        },
        {
          tipo_alimentacao: { uuid: "83fefd96-e476-42a0-81fc-75b9853b726c" },
          tipo_valor: "ACRESCIMO",
          valor: "5",
        },
      ],
    },
  ];

  const totaisConsumoMock = {
    "DIETA ESPECIAL - TIPO A": {
      lanche: 31,
      lanche_4h: 23,
      refeicao: 14,
    },
    "DIETA ESPECIAL - TIPO B": {
      lanche: 8,
      lanche_4h: 10,
    },
  };

  it("renderiza corretamente a tabela de dietas TIPO A", () => {
    render(
      <TabelaDietas
        tabelas={tabelasMock}
        tipoDieta="TIPO A"
        tiposAlimentacao={tiposAlimentacaoMock}
        totaisConsumo={totaisConsumoMock}
        ordem="1"
      />,
    );

    expect(
      screen.getByText(
        "DIETA ESPECIAL - TIPO A, A ENTERAL E RESTRIÇÃO DE AMINOÁCIDOS",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (_, element) => element?.textContent === "REFEIÇÃO - Dieta Enteral",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("LANCHE")).toBeInTheDocument();
    expect(screen.getByText("LANCHE 4H")).toBeInTheDocument();

    expect(screen.getAllByText("R$ 10,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 5,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 4,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("20%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5%").length).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 12,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 5,50").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 4,20").length).toBeGreaterThan(0);

    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();

    expect(screen.getByText("TOTAL (1)")).toBeInTheDocument();
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("R$ 435,10")).toBeInTheDocument();
  });
});

describe("Tabela Dietas - detalhamento da composição dos valores", () => {
  const tiposAlimentacao = [
    { uuid: "uuid-refeicao", nome: "Refeição" },
    { uuid: "uuid-lanche", nome: "Lanche" },
    { uuid: "uuid-lanche-4h", nome: "Lanche 4h" },
  ];

  const valores = (uuid, unitario, acrescimo) => [
    { tipo_alimentacao: { uuid }, tipo_valor: "UNITARIO", valor: unitario },
    { tipo_alimentacao: { uuid }, tipo_valor: "ACRESCIMO", valor: acrescimo },
  ];

  const tabelas = [
    {
      nome: "DIETA ESPECIAL - TIPO A",
      valores: [
        ...valores("uuid-refeicao", "10,00", "5"),
        ...valores("uuid-lanche", "10,00", "2,5"),
        ...valores("uuid-lanche-4h", "8,00", "0"),
      ],
    },
    {
      nome: "DIETA ESPECIAL - TIPO B",
      valores: [...valores("uuid-lanche", "20,00", "10")],
    },
  ];

  const totaisConsumo = {
    "DIETA ESPECIAL - TIPO A": { refeicao: 1200, lanche: 4, lanche_4h: 3 },
    "DIETA ESPECIAL - TIPO B": { lanche: 10, lanche_4h: 0 },
  };

  const renderizar = (tipoDieta, ordem, ref) =>
    render(
      <TabelaDietas
        ref={ref}
        tabelas={tabelas}
        tipoDieta={tipoDieta}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem={ordem}
      />,
    );

  const textosDaLinha = (texto) =>
    Array.from(screen.getByText(texto).closest("tr").cells).map((celula) =>
      celula.textContent.trim(),
    );

  it("exibe as seis colunas na ordem definida para Tipo A", () => {
    renderizar("TIPO A", "INF. B");

    expect(
      screen.getAllByRole("columnheader").map((th) => th.textContent),
    ).toEqual([
      "DIETA ESPECIAL - TIPO A, A ENTERAL E RESTRIÇÃO DE AMINOÁCIDOS",
      "NÚMERO DE ATEND. TIPO A",
      "VALOR UNITÁRIO",
      "% DE ACRÉSCIMO",
      "VALOR UNITÁRIO TOTAL",
      "VALOR TOTAL",
    ]);
  });

  it("exibe as seis colunas na ordem definida para Tipo B", () => {
    renderizar("TIPO B", "INF. C");

    expect(
      screen.getAllByRole("columnheader").map((th) => th.textContent),
    ).toEqual([
      "DIETA ESPECIAL - TIPO B",
      "NÚMERO DE ATEND. TIPO B",
      "VALOR UNITÁRIO",
      "% DE ACRÉSCIMO",
      "VALOR UNITÁRIO TOTAL",
      "VALOR TOTAL",
    ]);
  });

  it("exibe quantitativo, percentual de acréscimo, valor unitário total e valor total", () => {
    renderizar("TIPO A", "INF. B");

    expect(textosDaLinha("LANCHE")).toEqual([
      "LANCHE",
      "4",
      "R$ 10,00",
      "2,5%",
      "R$ 10,25",
      "R$ 41,00",
    ]);
    expect(textosDaLinha("LANCHE 4H")).toEqual([
      "LANCHE 4H",
      "3",
      "R$ 8,00",
      "0%",
      "R$ 8,00",
      "R$ 24,00",
    ]);
  });

  it("associa a linha da refeição à Dieta Enteral e formata milhar", () => {
    renderizar("TIPO A", "INF. B");

    const linha = screen
      .getByText((_, el) => el?.textContent === "REFEIÇÃO - Dieta Enteral")
      .closest("tr");

    expect(Array.from(linha.cells).map((c) => c.textContent)).toEqual([
      "REFEIÇÃO - Dieta Enteral",
      "1.200",
      "R$ 10,00",
      "5%",
      "R$ 10,50",
      "R$ 12.600,00",
    ]);
  });

  it("mantém a linha de totalização com quantitativo e valor total", () => {
    renderizar("TIPO A", "INF. B");

    expect(textosDaLinha("TOTAL (INF. B)")).toEqual([
      "TOTAL (INF. B)",
      "1.207",
      "",
      "",
      "",
      "R$ 12.665,00",
    ]);
  });

  it("mantém a separação entre as categorias de dieta (Tipo B sem refeição)", () => {
    renderizar("TIPO B", "INF. C");

    expect(screen.queryByText(/REFEIÇÃO/)).not.toBeInTheDocument();
    expect(textosDaLinha("LANCHE")).toEqual([
      "LANCHE",
      "10",
      "R$ 20,00",
      "10%",
      "R$ 22,00",
      "R$ 220,00",
    ]);
    expect(textosDaLinha("TOTAL (INF. C)")[5]).toBe("R$ 220,00");
  });

  it("mantém inalterado o contrato de totais consumido pelo Consolidado", () => {
    const ref = createRef();
    renderizar("TIPO A", "INF. B", ref);

    const { totalConsumoGeral, valorTotalGeral } = ref.current.getTotais();

    expect(totalConsumoGeral).toBe(1207);
    expect(valorTotalGeral).toBeCloseTo(12665, 2);
  });

  it("não gera chaves duplicadas para Refeição e Refeição EJA (mesmo uuid)", () => {
    const erro = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <TabelaDietas
        tabelas={[
          {
            nome: "DIETA ESPECIAL - TIPO A",
            valores: valores("uuid-refeicao", "10,00", "5"),
          },
        ]}
        tipoDieta="TIPO A"
        tiposAlimentacao={[
          { uuid: "uuid-refeicao", nome: "Refeição" },
          { uuid: "uuid-refeicao", nome: "Refeição EJA", tipo_refeicao: "eja" },
        ]}
        totaisConsumo={totaisConsumo}
        exibeNoturno
        ordem="B"
      />,
    );

    expect(screen.getAllByRole("row")).toHaveLength(4);
    const avisoDeChave = erro.mock.calls.some((chamada) =>
      String(chamada[0]).includes("same key"),
    );
    expect(avisoDeChave).toBe(false);

    erro.mockRestore();
  });
});
