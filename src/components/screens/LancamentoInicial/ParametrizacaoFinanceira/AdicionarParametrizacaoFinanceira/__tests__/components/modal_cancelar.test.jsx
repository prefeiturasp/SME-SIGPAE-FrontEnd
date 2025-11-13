import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalCancelar from "../../components/ModalCancelar";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Testes comportamento ModalCancelar - Parametrização Financeira", () => {
  const mockSetShowModal = jest.fn();

  const setup = async ({ showModal }) => {
    await act(async () => {
      render(
        <ModalCancelar setShowModal={mockSetShowModal} showModal={showModal} />,
      );
    });
  };

  it("deve renderizar título e mensagem quando showModal = true", async () => {
    await setup({ showModal: true });

    expect(
      screen.getByText("Cancelar Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Deseja cancelar o cadastro dessa parametrização?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it('deve chamar setShowModal(false) ao clicar em "Não"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Não"));
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
  });

  it('deve chamar navigate(-1) ao clicar em "Sim"', async () => {
    await setup({ showModal: true });

    fireEvent.click(screen.getByText("Sim"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("não deve renderizar nada se showModal = false", async () => {
    await setup({ showModal: false });

    expect(
      screen.queryByText("Cancelar Parametrização Financeira"),
    ).not.toBeInTheDocument();
  });
});
