import { render, screen } from "@testing-library/react";
import React from "react";
import ListagemDietas from "../index";

jest.mock("../../TabelaDieta", () => (props: any) => (
  <div data-testid="tabela-dieta-mock">{props.dieta.aluno.nome}</div>
));

describe("ListagemDietas", () => {
  const mockDietas = [
    {
      uuid: "1",
      aluno: { nome: "Maria" },
      id_externo: "REQ001",
      tipo: "Cancelamento",
    },
    {
      uuid: "2",
      aluno: { nome: "João" },
      id_externo: "REQ002",
      tipo: "Prorrogação",
    },
  ];

  const baseProps = {
    dietas: mockDietas,
    ativos: [],
    setAtivos: jest.fn(),
    filtros: {},
    setFiltros: jest.fn(),
  };

  it("renderiza título padrão 'busca' quando não há nome_aluno no filtro", () => {
    render(<ListagemDietas {...baseProps} />);
    expect(
      screen.getByText(/Veja os resultado\(s\) para busca/i)
    ).toBeInTheDocument();
  });

  it("renderiza título com nome quando filtro contém nome_aluno", () => {
    render(<ListagemDietas {...baseProps} filtros={{ nome_aluno: "Pedro" }} />);
    expect(
      screen.getByText(/Veja os resultado\(s\) para "Pedro"/i)
    ).toBeInTheDocument();
  });

  it("renderiza header da tabela", () => {
    render(<ListagemDietas {...baseProps} />);
    expect(screen.getByText("Número da Solicitação")).toBeInTheDocument();
    expect(screen.getByText("Nome do Aluno")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Solicitação")).toBeInTheDocument();
  });

  it("renderiza uma TabelaDieta para cada dieta", () => {
    render(<ListagemDietas {...baseProps} />);
    const itens = screen.getAllByTestId("tabela-dieta-mock");
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent("Maria");
    expect(itens[1]).toHaveTextContent("João");
  });
});
