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

    expect(screen.getByText("Lanche 4h")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();
    expect(screen.getByText("Refeição")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa")).toBeInTheDocument();
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();

    expect(screen.getAllByText("R$ 5,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 4,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 10,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 3,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 7,00").length).toBeGreaterThan(0);

    expect(screen.getAllByText("R$ 6,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("R$ 12,00").length).toBeGreaterThan(0);

    expect(screen.getByText("TOTAL (A)")).toBeInTheDocument();
    expect(screen.getByText("1450")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.150,00")).toBeInTheDocument();
  });
});
