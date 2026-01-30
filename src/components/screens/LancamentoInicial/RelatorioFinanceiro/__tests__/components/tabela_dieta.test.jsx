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

    expect(screen.getAllByText("% 20,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("% 10,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("% 5,00").length).toBeGreaterThan(0);

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
