import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { CardInversaoPendenciaAprovacao } from "../index";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <div>{children}</div> : null,
}));

const pedidos = [
  {
    uuid: "11111111-1111-4111-8111-111111111111",
    id_externo: "ABC12",
    data_de: "14/09/2026",
    data_para: "15/09/2026",
    escola: {
      uuid: "33333333-3333-4333-8333-333333333333",
      nome: "EMEF Escola Alfa",
      codigo_eol: "123456",
    },
  },
  {
    uuid: "22222222-2222-4222-8222-222222222222",
    id_externo: "DEF34",
    data_de: "04/09/2026",
    data_para: "08/09/2026",
    escola: {
      uuid: "44444444-4444-4444-8444-444444444444",
      nome: "EMEI Escola Beta",
      codigo_eol: "654321",
    },
  },
];

const propriedadesPadrao = {
  pedidos,
  titulo: "Pendentes de autorização",
  tipoDeCard: "warning",
  ultimaColunaLabel: "Data da inversão",
};

const renderizarComponente = (propriedades = {}, referencia = null) =>
  render(
    <MemoryRouter>
      <CardInversaoPendenciaAprovacao
        ref={referencia}
        {...propriedadesPadrao}
        {...propriedades}
      />
    </MemoryRouter>,
  );

const expandirCard = () => {
  fireEvent.click(document.querySelector("[data-cy='botao-expandir']"));
};

describe("CardInversaoPendenciaAprovacao", () => {
  it("deve expandir e recolher a lista de pedidos", () => {
    renderizarComponente({ dataTestId: "card-inversao" });

    expect(screen.queryByPlaceholderText("Pesquisar")).not.toBeInTheDocument();

    expandirCard();

    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();

    expandirCard();

    expect(screen.queryByPlaceholderText("Pesquisar")).not.toBeInTheDocument();
  });

  it.each([
    ["abc12", "ABC12", "DEF34"],
    ["escola alfa", "ABC12", "DEF34"],
    ["654321", "DEF34", "ABC12"],
  ])(
    "deve filtrar os pedidos pelo valor %s",
    (pesquisa, pedidoEsperado, pedidoOculto) => {
      renderizarComponente();
      expandirCard();

      fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
        target: { value: pesquisa },
      });

      expect(screen.getByText(pedidoEsperado)).toBeInTheDocument();
      expect(screen.queryByText(pedidoOculto)).not.toBeInTheDocument();
    },
  );

  it("deve ocultar todos os pedidos quando a pesquisa não encontrar resultados", () => {
    renderizarComponente();
    expandirCard();

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: { value: "pedido inexistente" },
    });

    expect(screen.queryByText("ABC12")).not.toBeInTheDocument();
    expect(screen.queryByText("DEF34")).not.toBeInTheDocument();
  });

  it("deve considerar todos os pedidos quando o evento não for informado", () => {
    const referencia = React.createRef();
    renderizarComponente({}, referencia);

    act(() => referencia.current.filtrarPedidos(undefined));

    expect(referencia.current.state.pedidosFiltrados).toEqual(pedidos);
    expect(referencia.current.state.filtrado).toBe(true);

    expandirCard();

    expect(screen.getByText("ABC12")).toBeInTheDocument();
    expect(screen.getByText("DEF34")).toBeInTheDocument();
  });
});
