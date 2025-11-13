import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalSalvar from "../../components/ModalSalvar";

describe("Testes comportamento ModalSalvar - Parametrização Financeira", () => {
  const mockSetShowModal = jest.fn();
  const onSubmit = jest.fn();

  const setup = async ({ showModal }) => {
    await act(async () => {
      render(
        <ModalSalvar
          setShowModal={mockSetShowModal}
          showModal={showModal}
          titulo="TESTE CONFIRMAÇÃO"
          onSubmit={onSubmit}
        />,
      );
    });
  };

  it("deve renderizar título e mensagem de confirmação quando showModal = true", async () => {
    await setup({ showModal: true });

    expect(screen.getByText(/TESTE CONFIRMAÇÃO/i)).toBeInTheDocument();
    expect(
      screen.getByText("Salvar Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it('deve chamar fechar o modal ao clicar em "Não"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Não"));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it('deve chamar onSubmit ao clicar em "Sim"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Sim"));
    expect(onSubmit).toHaveBeenCalledWith();
  });

  it("não deve renderizar nada se showModal = false", async () => {
    await setup({ showModal: false });

    expect(
      screen.queryByText("Salvar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });
});
