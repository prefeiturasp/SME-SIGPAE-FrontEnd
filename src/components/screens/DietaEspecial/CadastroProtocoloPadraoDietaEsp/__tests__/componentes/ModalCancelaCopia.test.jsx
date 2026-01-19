import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
