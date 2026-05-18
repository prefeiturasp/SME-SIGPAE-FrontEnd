import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalGenerico from "../index";

describe("Testes de comportamentos componente - ModalGenerico", () => {
  const handleClose = jest.fn();
  const handleSim = jest.fn();

  const setup = (props = {}) => {
    render(
      <MemoryRouter>
        <ModalGenerico
          show={true}
          titulo="Título do Modal"
          texto="Texto do modal"
          handleClose={handleClose}
          handleSim={handleSim}
          {...props}
        />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifica se o componente foi renderizado", () => {
    setup();

    expect(screen.getByText("Título do Modal")).toBeInTheDocument();
    expect(screen.getByText("Texto do modal")).toBeInTheDocument();
    expect(screen.getByText("Sim").closest("button")).toBeInTheDocument();
    expect(screen.getByText("Não").closest("button")).toBeInTheDocument();
  });

  it("deve clicar no botão confirmar e verificar se handleSim foi chamado", async () => {
    setup();

    const botaoConfirmar = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoConfirmar);

    await waitFor(() => {
      expect(handleSim).toHaveBeenCalled();
    });
  });

  it("deve clicar no botão cancelar e verificar se handleClose foi chamado", async () => {
    setup();

    const botaoCancelar = screen.getByText("Não").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("deve renderizar somente um botão quando unicoBotao for true", () => {
    setup({
      unicoBotao: true,
      textoBotaoSim: "OK",
    });

    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.queryByText("Não")).not.toBeInTheDocument();
  });

  it("deve exibir loading quando loading for true", () => {
    setup({
      loading: true,
    });

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar textos customizados dos botões", () => {
    setup({
      textoBotaoClose: "Cancelar",
      textoBotaoSim: "Confirmar",
    });

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });
});
