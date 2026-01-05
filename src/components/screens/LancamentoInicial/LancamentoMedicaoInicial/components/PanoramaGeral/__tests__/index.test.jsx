import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PanoramaGeralEscola from "../index.jsx";

describe("Testes de exibição - PanoramaGeralEscola", () => {
  const panoramaMock = [
    {
      periodo: "MANHÃ",
      horas_atendimento: 4,
      qtde_alunos: 100,
      qtde_tipo_a: 10,
      qtde_enteral: 5,
      qtde_tipo_b: 3,
    },
    {
      periodo: "INTEGRAL",
      horas_atendimento: 5,
      qtde_alunos: 80,
      qtde_tipo_a: 8,
      qtde_enteral: 4,
      qtde_tipo_b: 2,
    },
  ];

  it("deve renderizar o título do panorama geral", () => {
    render(<PanoramaGeralEscola panoramaGeral={panoramaMock} />);

    expect(screen.getByText("Panorama geral escola")).toBeInTheDocument();
  });

  it("deve renderizar os períodos e valores corretamente", () => {
    render(<PanoramaGeralEscola panoramaGeral={panoramaMock} />);

    expect(screen.getByText("MANHÃ")).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    expect(screen.getByText("4h")).toBeInTheDocument();
    expect(screen.getByText("5h")).toBeInTheDocument();

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("deve calcular e exibir os totais corretamente no rodapé", () => {
    const { container } = render(
      <PanoramaGeralEscola panoramaGeral={panoramaMock} />,
    );

    const rodape = container.querySelector(".rodape-tabela");

    expect(rodape).toBeInTheDocument();

    expect(rodape).toHaveTextContent("Total");
    expect(rodape).toHaveTextContent("180");
    expect(rodape).toHaveTextContent("18");
    expect(rodape).toHaveTextContent("9");
    expect(rodape).toHaveTextContent("5");
  });

  it("deve exibir o texto informativo no rodapé", () => {
    render(<PanoramaGeralEscola panoramaGeral={panoramaMock} />);

    expect(
      screen.getByText(/os números dessa tabela são para a data de hoje/i),
    ).toBeInTheDocument();
  });
});
