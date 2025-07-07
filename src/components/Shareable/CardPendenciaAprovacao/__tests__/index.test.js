import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CardPendenteAcao } from "../index";

describe("CardPendenteAcao", () => {
  const mockPedidos = [
    {
      uuid: "123",
      id_externo: "456",
      escola: {
        nome: "Escola Teste 1",
        codigo_eol: "123456",
      },
      data_inicial: "2023-01-01",
      inclusoes: [{ data: "2023-01-02" }],
    },
    {
      uuid: "124",
      id_externo: "457",
      escola: {
        nome: "Escola Teste 2",
        codigo_eol: "654321",
      },
      inclusoes: [{ data: "2023-01-03" }],
    },
  ];

  const props = {
    pedidos: mockPedidos,
    titulo: "Pendências de Aprovação",
    tipoDeCard: "tipo-teste",
    ultimaColunaLabel: "Data Inicial",
  };

  it("deve renderizar corretamente com props", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} />
      </Router>
    );

    expect(screen.getByText("Pendências de Aprovação")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("pedido")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("escola solicitante")).toBeInTheDocument();
  });

  it("deve renderizar corretamente sem pedidos", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} pedidos={[]} />
      </Router>
    );

    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("pedido")).not.toBeInTheDocument();
  });

  it("deve filtrar pedidos ao digitar no campo de pesquisa", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} />
      </Router>
    );

    const toggle = document.querySelector(".toggle-expandir");
    fireEvent.click(toggle);

    const input = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(input, { target: { value: "Teste 1" } });

    expect(screen.getByText("Escola Teste 1")).toBeInTheDocument();
    expect(screen.queryByText("Escola Teste 2")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "654" } });
    expect(screen.getByText("Escola Teste 2")).toBeInTheDocument();
    expect(screen.queryByText("Escola Teste 1")).not.toBeInTheDocument();
  });

  it("deve renderizar a tabela com os dados corretos", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} />
      </Router>
    );

    const toggle = document.querySelector(".toggle-expandir");
    fireEvent.click(toggle);

    expect(screen.getByText("Código do Pedido")).toBeInTheDocument();
    expect(screen.getByText("Código EOL")).toBeInTheDocument();
    expect(screen.getByText("Nome da Escola")).toBeInTheDocument();
    expect(screen.getByText("Data Inicial")).toBeInTheDocument();

    expect(screen.getByText("456")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("Escola Teste 1")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();

    expect(screen.getByText("457")).toBeInTheDocument();
    expect(screen.getByText("654321")).toBeInTheDocument();
    expect(screen.getByText("Escola Teste 2")).toBeInTheDocument();
    expect(screen.getByText("2023-01-03")).toBeInTheDocument();
  });

  it("deve usar data de inclusão quando data_inicial não existe", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} />
      </Router>
    );

    const toggle = document.querySelector(".toggle-expandir");
    fireEvent.click(toggle);

    expect(screen.getByText("2023-01-03")).toBeInTheDocument();
  });

  it("deve renderizar links corretamente", () => {
    render(
      <Router>
        <CardPendenteAcao {...props} />
      </Router>
    );

    const toggle = document.querySelector(".toggle-expandir");
    fireEvent.click(toggle);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining("uuid=123")
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining("uuid=124")
    );
  });
});
