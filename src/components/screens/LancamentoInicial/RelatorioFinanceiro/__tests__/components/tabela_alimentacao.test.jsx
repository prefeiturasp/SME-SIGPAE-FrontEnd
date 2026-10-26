import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TabelaAlimentacao } from "../../components/Tabelas/TabelaAlimentacao";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";

describe("Teste de comportamentos componente - Tabela Alimentação", () => {
  const tiposAlimentacaoMock =
    mockGetTiposUnidadeEscolarTiposAlimentacao.results.find(
      (e) => e.iniciais === "EMEI",
    ).periodos_escolares[0].tipos_alimentacao;

  const tabelasMock = [
    {
      nome: "Preço das Alimentações",
      valores: [
        {
          tipo_alimentacao: { uuid: "83fefd96-e476-42a0-81fc-75b9853b726c" },
          tipo_valor: "UNITARIO",
          valor: "5",
        },
        {
          tipo_alimentacao: { uuid: "83fefd96-e476-42a0-81fc-75b9853b726c" },
          tipo_valor: "REAJUSTE",
          valor: "1",
        },
        {
          tipo_alimentacao: { uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" },
          tipo_valor: "UNITARIO",
          valor: "4",
        },
        {
          tipo_alimentacao: { uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5" },
          tipo_valor: "REAJUSTE",
          valor: "1",
        },
        {
          tipo_alimentacao: { uuid: "65f11f11-630b-4629-bb17-07c875c548f1" },
          tipo_valor: "UNITARIO",
          valor: "10",
        },
        {
          tipo_alimentacao: { uuid: "65f11f11-630b-4629-bb17-07c875c548f1" },
          tipo_valor: "REAJUSTE",
          valor: "2",
        },
        {
          tipo_alimentacao: { uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4" },
          tipo_valor: "UNITARIO",
          valor: "3",
        },
        {
          tipo_alimentacao: { uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4" },
          tipo_valor: "REAJUSTE",
          valor: "1",
        },
        {
          tipo_alimentacao: { uuid: "c4255a14-85fd-412f-b35f-30828215e4d5" },
          tipo_valor: "UNITARIO",
          valor: "7",
        },
        {
          tipo_alimentacao: { uuid: "c4255a14-85fd-412f-b35f-30828215e4d5" },
          tipo_valor: "REAJUSTE",
          valor: "3",
        },
      ],
    },
  ];

  const totaisConsumoMock = {
    ALIMENTAÇÃO: {
      total_lanche_4h: 300,
      total_lanche: 410,
      total_refeicao: 410,
      total_sobremesa: 320,
      total_lanche_emergencial: 10,
    },
  };

  it("renderiza tipos de alimentação e totais corretamente", () => {
    render(
      <TabelaAlimentacao
        tabelas={tabelasMock}
        tiposAlimentacao={tiposAlimentacaoMock}
        totaisConsumo={totaisConsumoMock}
        ordem="A"
      />,
    );

    expect(
      screen.getByText("TIPOS DE ALIMENTAÇÕES - SEM DIETAS"),
    ).toBeInTheDocument();

    expect(screen.getByText("LANCHE 4H")).toBeInTheDocument();
    expect(screen.getByText("LANCHE")).toBeInTheDocument();
    expect(screen.getByText("REFEIÇÃO")).toBeInTheDocument();
    expect(screen.getByText("SOBREMESA")).toBeInTheDocument();
    expect(screen.getByText("LANCHE EMERGENCIAL")).toBeInTheDocument();

    expect(screen.getAllByText("R$ 5,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 4,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 10,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 3,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 7,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 6,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 12,00").length).toBeGreaterThan(0);

    expect(screen.getByText("TOTAL (A)")).toBeInTheDocument();
    expect(screen.getByText("1.450")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.150,00")).toBeInTheDocument();
  });
});

describe("Tabela Alimentação - detalhamento da composição dos valores", () => {
  const tiposAlimentacao = [
    { uuid: "uuid-refeicao", nome: "Refeição" },
    { uuid: "uuid-sobremesa", nome: "Sobremesa" },
    { uuid: "uuid-lanche", nome: "Lanche" },
  ];

  const valoresDe = (uuid) => [
    {
      nome_campo: "campo",
      tipo_alimentacao: { uuid },
      tipo_valor: "UNITARIO",
      valor: "9,54",
    },
    {
      nome_campo: "campo",
      tipo_alimentacao: { uuid },
      tipo_valor: "REAJUSTE",
      valor: "0,16",
    },
  ];

  const tabelas = [
    {
      nome: "Preço das Alimentações",
      periodo_escolar: null,
      valores: tiposAlimentacao.flatMap(({ uuid }) => valoresDe(uuid)),
    },
  ];

  const totaisConsumo = {
    ALIMENTAÇÃO: {
      total_refeicao: 5,
      total_sobremesa: 119,
      total_lanche: 1288,
    },
  };

  const renderizar = (ref) =>
    render(
      <TabelaAlimentacao
        ref={ref}
        tabelas={tabelas}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="INF. A"
      />,
    );

  const textosDaLinha = (texto) =>
    Array.from(screen.getByText(texto).closest("tr").cells).map(
      (celula) => celula.textContent,
    );

  it("exibe as oito colunas na ordem definida na história", () => {
    renderizar();

    expect(
      screen.getAllByRole("columnheader").map((th) => th.textContent),
    ).toEqual([
      "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
      "NÚMERO DE ATEND.",
      "VALOR UNITÁRIO",
      "VALOR TOTAL UNITÁRIO",
      "VALOR DO REAJUSTE",
      "VALOR TOTAL DO REAJUSTE",
      "VALOR UNITÁRIO REAJUSTADO",
      "VALOR TOTAL",
    ]);
  });

  it("detalha quantitativo, valores unitários, reajuste e totais de cada tipo", () => {
    renderizar();

    expect(textosDaLinha("REFEIÇÃO")).toEqual([
      "REFEIÇÃO",
      "5",
      "R$ 9,54",
      "R$ 47,70",
      "R$ 0,16",
      "R$ 0,80",
      "R$ 9,70",
      "R$ 48,50",
    ]);
    expect(textosDaLinha("SOBREMESA")).toEqual([
      "SOBREMESA",
      "119",
      "R$ 9,54",
      "R$ 1.135,26",
      "R$ 0,16",
      "R$ 19,04",
      "R$ 9,70",
      "R$ 1.154,30",
    ]);
  });

  it("formata quantitativos com separador de milhar e valores no padrão brasileiro", () => {
    renderizar();

    expect(textosDaLinha("LANCHE")).toEqual([
      "LANCHE",
      "1.288",
      "R$ 9,54",
      "R$ 12.287,52",
      "R$ 0,16",
      "R$ 206,08",
      "R$ 9,70",
      "R$ 12.493,60",
    ]);
  });

  it("mantém a ordem dos tipos de alimentação", () => {
    renderizar();

    const descricoes = screen
      .getAllByRole("row")
      .slice(1, -1)
      .map((linha) => linha.cells[0].textContent);

    expect(descricoes).toEqual(["REFEIÇÃO", "LANCHE", "SOBREMESA"]);
  });

  it("mantém a linha de totalização com quantitativo e valor total", () => {
    renderizar();

    expect(textosDaLinha("TOTAL (INF. A)")).toEqual([
      "TOTAL (INF. A)",
      "1.412",
      "",
      "",
      "",
      "",
      "",
      "R$ 13.696,40",
    ]);
  });

  it("não exibe valores artificiais quando não há parametrização", () => {
    render(
      <TabelaAlimentacao
        tabelas={[]}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />,
    );

    expect(textosDaLinha("REFEIÇÃO")).toEqual([
      "REFEIÇÃO",
      "5",
      "R$ 0,00",
      "R$ 0,00",
      "R$ 0,00",
      "R$ 0,00",
      "R$ 0,00",
      "R$ 0,00",
    ]);
  });

  it("mantém inalterado o contrato de totais consumido pelo Consolidado", () => {
    const ref = createRef();
    renderizar(ref);

    const { totalAtendimentosGeral, valorTotalGeral } = ref.current.getTotais();

    expect(totalAtendimentosGeral).toBe(1412);
    expect(valorTotalGeral).toBeCloseTo(13696.4, 2);
  });
});

describe("Tabela Alimentação - apresentação conforme possui_reajuste", () => {
  const tiposAlimentacao = [{ uuid: "uuid-refeicao", nome: "Refeição" }];

  const tabelas = [
    {
      nome: "Preço das Alimentações",
      periodo_escolar: null,
      valores: [
        {
          tipo_alimentacao: { uuid: "uuid-refeicao" },
          tipo_valor: "UNITARIO",
          valor: "9,54",
        },
        {
          tipo_alimentacao: { uuid: "uuid-refeicao" },
          tipo_valor: "REAJUSTE",
          valor: "0,16",
        },
      ],
    },
  ];

  const totaisConsumo = { ALIMENTAÇÃO: { total_refeicao: 5 } };

  const COLUNAS_COM_REAJUSTE = [
    "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
    "NÚMERO DE ATEND.",
    "VALOR UNITÁRIO",
    "VALOR TOTAL UNITÁRIO",
    "VALOR DO REAJUSTE",
    "VALOR TOTAL DO REAJUSTE",
    "VALOR UNITÁRIO REAJUSTADO",
    "VALOR TOTAL",
  ];

  const COLUNAS_SEM_REAJUSTE = [
    "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
    "NÚMERO DE ATEND.",
    "VALOR UNITÁRIO",
    "VALOR TOTAL UNITÁRIO",
    "VALOR TOTAL",
  ];

  const cabecalhos = () =>
    screen.getAllByRole("columnheader").map((th) => th.textContent);

  const textosDaLinha = (texto) =>
    Array.from(screen.getByText(texto).closest("tr").cells).map(
      (celula) => celula.textContent,
    );

  const tabela = (possuiReajuste) => (
    <TabelaAlimentacao
      tabelas={tabelas}
      tiposAlimentacao={tiposAlimentacao}
      totaisConsumo={totaisConsumo}
      ordem="A"
      possuiReajuste={possuiReajuste}
    />
  );

  it("exibe as oito colunas quando possui_reajuste é true", () => {
    render(tabela(true));

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);
    expect(textosDaLinha("REFEIÇÃO")).toEqual([
      "REFEIÇÃO",
      "5",
      "R$ 9,54",
      "R$ 47,70",
      "R$ 0,16",
      "R$ 0,80",
      "R$ 9,70",
      "R$ 48,50",
    ]);
  });

  it("exibe somente as cinco colunas quando possui_reajuste é false", () => {
    render(tabela(false));

    expect(cabecalhos()).toEqual(COLUNAS_SEM_REAJUSTE);
    expect(
      screen.queryByRole("columnheader", { name: "VALOR DO REAJUSTE" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "VALOR TOTAL DO REAJUSTE" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", {
        name: "VALOR UNITÁRIO REAJUSTADO",
      }),
    ).not.toBeInTheDocument();
  });

  it("calcula valor total unitário e valor total sem o reajuste", () => {
    const ref = createRef();

    render(
      <TabelaAlimentacao
        ref={ref}
        tabelas={tabelas}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="A"
        possuiReajuste={false}
      />,
    );

    expect(textosDaLinha("REFEIÇÃO")).toEqual([
      "REFEIÇÃO",
      "5",
      "R$ 9,54",
      "R$ 47,70",
      "R$ 47,70",
    ]);
    expect(textosDaLinha("TOTAL (A)")).toEqual([
      "TOTAL (A)",
      "5",
      "",
      "",
      "R$ 47,70",
    ]);
    expect(ref.current.getTotais().valorTotalGeral).toBeCloseTo(47.7, 2);
  });

  it("mantém as oito colunas quando a flag ainda não foi recebida", () => {
    render(
      <TabelaAlimentacao
        tabelas={tabelas}
        tiposAlimentacao={tiposAlimentacao}
        totaisConsumo={totaisConsumo}
        ordem="A"
      />,
    );

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);
  });

  it("atualiza as colunas quando uma nova consulta traz outra flag", () => {
    const { rerender } = render(tabela(true));

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);

    rerender(tabela(false));

    expect(cabecalhos()).toEqual(COLUNAS_SEM_REAJUSTE);
    expect(textosDaLinha("REFEIÇÃO")[4]).toBe("R$ 47,70");

    rerender(tabela(true));

    expect(cabecalhos()).toEqual(COLUNAS_COM_REAJUSTE);
    expect(textosDaLinha("REFEIÇÃO")[7]).toBe("R$ 48,50");
  });
});
