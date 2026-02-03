import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalAnalisar from "../../components/ModalAnalisar";

describe("Testes de comportamentos - ModalAnalisar", () => {
  const setShowModal = jest.fn();
  const onAnalisar = jest.fn();

  const renderComponent = (showModal = true) =>
    render(
      <MemoryRouter>
        <ModalAnalisar
          showModal={showModal}
          setShowModal={setShowModal}
          uuidRelatorio="123e4567-e89b-12d3-a456-426614174000"
          onAnalisar={onAnalisar}
        />
      </MemoryRouter>,
    );

  it("deve renderizar o título e o texto do modal quando showModal = true", () => {
    renderComponent(true);

    expect(
      screen.getByText("Analisar ou Visualizar Medição"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Ao acessar o relatório financeiro você poderá apenas visualizar/i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal = false", () => {
    renderComponent(false);

    expect(
      screen.queryByText("Analisar ou Visualizar Medição"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    renderComponent(true);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve renderizar o botão 'Analisar Ateste Financeiro' e clicar chamando onAnalisar", () => {
    renderComponent(true);

    expect(screen.getByText("Analisar Ateste Financeiro")).toBeInTheDocument();
    const analisarButton = screen.getByRole("button", {
      name: /Analisar Ateste Financeiro/i,
    });
    fireEvent.click(analisarButton);

    expect(onAnalisar).toHaveBeenCalled();
  });
});
