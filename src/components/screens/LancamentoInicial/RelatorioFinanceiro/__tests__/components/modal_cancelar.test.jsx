import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalCancelar from "../../components/ModalCancelar";

describe("Testes de comportamentos do componente - ModalCancelar", () => {
  const setShowModal = jest.fn();
  const onCancelar = jest.fn();

  const renderComponent = (showModal = true) =>
    render(
      <MemoryRouter>
        <ModalCancelar
          showModal={showModal}
          setShowModal={setShowModal}
          onCancelar={onCancelar}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto do modal quando showModal = true", () => {
    renderComponent(true);

    expect(
      screen.getByText("Cancelar Aplicação de descontos"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Deseja cancelar a aplicação de desconto nas Unidades/i),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal = false", () => {
    renderComponent(false);

    expect(
      screen.queryByText("Cancelar Aplicação de descontos"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    renderComponent(true);

    const botaoFechar = screen.getByRole("button", {
      name: /close/i,
    });

    fireEvent.click(botaoFechar);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve fechar o modal ao clicar no botão 'Não'", () => {
    renderComponent(true);

    const botaoNao = screen.getByRole("button", {
      name: "Não",
    });

    fireEvent.click(botaoNao);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve chamar onCancelar ao clicar no botão 'Sim'", () => {
    renderComponent(true);

    const botaoSim = screen.getByRole("button", {
      name: "Sim",
    });

    fireEvent.click(botaoSim);

    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});
