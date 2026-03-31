import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ModalCancelarCopia from "../../componentes/ModalCancelaCopia";

describe("Testes de comportamento componente - ModalCancelarCopia", () => {
  const closeModal = jest.fn();

  const setup = ({ showModal = true, closeModal }) => {
    return render(
      <MemoryRouter>
        <ModalCancelarCopia showModal={showModal} closeModal={closeModal} />
      </MemoryRouter>,
    );
  };

  it("deve renderizar o modal quando showModal for true", () => {
    setup({ closeModal: closeModal });

    expect(screen.getByText("Cancelar Cópia")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Deseja cancelar a cópia do protocolo padrão selecionado?",
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal for false", () => {
    setup({ showModal: false, closeModal: closeModal });

    expect(screen.queryByText("Cancelar Cópia")).not.toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar no botão 'Não'", () => {
    setup({ closeModal: closeModal });

    fireEvent.click(screen.getByText("Não"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("deve chamar closeModal ao clicar no botão de fechar (X)", () => {
    setup({ closeModal: closeModal });

    const closeButton = document.querySelector(".btn-close");
    fireEvent.click(closeButton);

    expect(closeModal).toHaveBeenCalled();
  });

  it("deve renderizar o botão 'Sim' com link correto", () => {
    setup({ closeModal: closeModal });

    const link = screen.getByText("Sim").closest("a");
    expect(link).toHaveAttribute(
      "href",
      "/dieta-especial/consultar-protocolo-padrao-dieta",
    );
  });
});

describe("Teste do componente ModalCancelaCopia", () => {
  const mockCloseModal = jest.fn();

  const renderComponent = (show = true) => {
    return render(
      <MemoryRouter initialEntries={["/pagina-atual"]}>
        <Routes>
          <Route
            path="/pagina-atual"
            element={
              <ModalCancelarCopia
                showModal={show}
                closeModal={mockCloseModal}
              />
            }
          />
          <Route
            path="/dieta-especial/consultar-protocolo-padrao-dieta"
            element={<div>Página de Consulta</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve renderizar o modal quando showModal for false", () => {
    renderComponent(false);
    expect(screen.queryByText("Cancelar Cópia")).not.toBeInTheDocument();
  });

  it("deve renderizar o título e a mensagem corretamente quando aberto", () => {
    renderComponent(true);
    expect(screen.getByText("Cancelar Cópia")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deseja cancelar a cópia do protocolo padrão selecionado/i,
      ),
    ).toBeInTheDocument();
  });

  it("deve chamar closeModal quando o botão 'Não' for clicado", () => {
    renderComponent(true);
    const botaoNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(botaoNao);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve navegar para a rota correta ao clicar no botão 'Sim'", () => {
    renderComponent(true);
    const botaoSim = screen.getByRole("button", { name: /sim/i });
    const link = botaoSim.closest("a");
    expect(link).toHaveAttribute(
      "href",
      "/dieta-especial/consultar-protocolo-padrao-dieta",
    );
    fireEvent.click(botaoSim);
    expect(screen.getByText("Página de Consulta")).toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar no botão de fechar do header (X)", () => {
    renderComponent(true);
    const botaoFecharHeader = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botaoFecharHeader);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
