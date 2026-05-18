import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ModalPadraoSimNao } from "../index";

describe("Testes de comportamentos do componente - ModalPadraoSimNao", () => {
  const closeModal = jest.fn();
  const funcaoSim = jest.fn();

  const setup = (props = {}) => {
    render(
      <MemoryRouter>
        <ModalPadraoSimNao
          showModal={true}
          closeModal={closeModal}
          tituloModal="Título do Modal"
          descricaoModal="Descrição do modal"
          funcaoSim={funcaoSim}
          desabilitaSim={false}
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

    expect(screen.getByText("Descrição do modal")).toBeInTheDocument();

    expect(screen.getByText("Sim").closest("button")).toBeInTheDocument();

    expect(screen.getByText("Não").closest("button")).toBeInTheDocument();
  });

  it("deve clicar no botão Não e verificar se closeModal foi chamado", async () => {
    setup();

    const botaoNao = screen.getByText("Não").closest("button");

    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve clicar no botão Sim e verificar se funcaoSim foi chamado", async () => {
    setup();

    const botaoSim = screen.getByText("Sim").closest("button");

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(funcaoSim).toHaveBeenCalled();
    });
  });

  it("deve renderizar loader quando desabilitaSim for true", () => {
    setup({
      desabilitaSim: true,
    });

    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();
  });
});
