import { fireEvent, render, screen } from "@testing-library/react";
import ModalCopiar from "../../components/ModalCopiar";

describe("Testes comportamento ModalCopiar - Parametrização Financeira", () => {
  const setShowModal = jest.fn();
  const onCopiar = jest.fn();

  const setup = (props = {}) => {
    render(
      <ModalCopiar
        showModal={true}
        setShowModal={setShowModal}
        onCopiar={onCopiar}
        {...props}
      />,
    );
  };

  it("renderiza o modal corretamente", () => {
    setup();

    expect(
      screen.getByText("Copiar Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ao criar uma cópia dessa parametrização/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deseja prosseguir e criar uma cópia dessa parametrização\?/i,
      ),
    ).toBeInTheDocument();
  });

  it('botão "Não" deve fechar o modal', () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "Não" }));

    expect(setShowModal).toHaveBeenCalled();
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it('botão "Sim" deve chamar onCopiar e fechar o modal', () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    expect(onCopiar).toHaveBeenCalled();
    expect(setShowModal).toHaveBeenCalled();
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("não deve renderizar quando showModal=false", () => {
    setup({ showModal: false });

    expect(
      screen.queryByText("Copiar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });

  it("não quebra se onCopiar não for passado", () => {
    setup({ onCopiar: undefined });

    fireEvent.click(screen.getByRole("button", { name: "Sim" }));

    expect(setShowModal).toHaveBeenCalledWith(false);
  });
});
