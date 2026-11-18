import { render, screen, within } from "@testing-library/react";
import { TabelaDescontos } from "../../components/Tabelas/TabelaDescontos";

const linha = (dados) => ({
  chave: "uuid-1",
  unidades: ["EMEI ANA"],
  tipoLancamento: "ALIMENTAÇÃO",
  faixaOuAlimentacao: "LANCHE",
  clausula: "7.2.2. item a - (50%)",
  quantidade: 1500,
  valorUnitario: 1234.5,
  total: 925875,
  ...dados,
});

const resumo = (dados) => ({
  tituloFaixaOuAlimentacao: "ALIMENTAÇÃO",
  linhas: [linha()],
  total: 925875,
  ...dados,
});

describe("Teste de comportamentos componente - TabelaDescontos", () => {
  it("renderiza o título, as colunas e o totalizador (D)", () => {
    render(<TabelaDescontos descontos={resumo()} />);

    expect(screen.getByText("TABELA DE DESCONTO")).toBeInTheDocument();

    const cabecalhos = screen
      .getAllByRole("columnheader")
      .map((th) => th.textContent);
    expect(cabecalhos).toEqual([
      "NOME DA UNIDADE",
      "TIPO DE LANÇAMENTO",
      "ALIMENTAÇÃO",
      "CLÁUSULA DO DESCONTO",
      "QUANTIDADE",
      "VALOR UNITÁRIO",
      "TOTAL DO DESCONTO",
    ]);

    const [, linhaDesconto, linhaTotal] = screen.getAllByRole("row");
    expect(
      within(linhaDesconto)
        .getAllByRole("cell")
        .map((td) => td.textContent),
    ).toEqual([
      "EMEI ANA",
      "ALIMENTAÇÃO",
      "LANCHE",
      "7.2.2. item a - (50%)",
      "1.500",
      "R$ 1.234,50",
      "R$ 925.875,00",
    ]);
    expect(
      within(linhaTotal)
        .getAllByRole("cell")
        .map((td) => td.textContent),
    ).toEqual([
      "TOTAL DE DESCONTOS DOS ITENS (D)",
      "",
      "",
      "",
      "",
      "",
      "R$ 925.875,00",
    ]);
  });

  it.each(["FAIXA ETÁRIA", "FAIXA ETÁRIA OU ALIMENTAÇÃO"])(
    "usa o título de coluna %s recebido",
    (titulo) => {
      render(
        <TabelaDescontos
          descontos={resumo({ tituloFaixaOuAlimentacao: titulo })}
        />,
      );

      expect(
        screen.getByRole("columnheader", { name: titulo }),
      ).toBeInTheDocument();
    },
  );

  it("exibe várias unidades na mesma célula, sem duplicar a linha", () => {
    render(
      <TabelaDescontos
        descontos={resumo({
          linhas: [linha({ unidades: ["EMEI ANA", "EMEI BRUNO"] })],
        })}
      />,
    );

    expect(screen.getAllByRole("row")).toHaveLength(3);
    const [celulaUnidades] = within(screen.getAllByRole("row")[1]).getAllByRole(
      "cell",
    );
    expect(within(celulaUnidades).getByText("EMEI ANA")).toBeInTheDocument();
    expect(within(celulaUnidades).getByText("EMEI BRUNO")).toBeInTheDocument();
  });

  it.each([
    ["sem linhas", resumo({ linhas: [], total: 0 })],
    ["sem descontos", undefined],
  ])("não renderiza nada %s", (_, descontos) => {
    const { container } = render(<TabelaDescontos descontos={descontos} />);

    expect(container).toBeEmptyDOMElement();
  });
});
