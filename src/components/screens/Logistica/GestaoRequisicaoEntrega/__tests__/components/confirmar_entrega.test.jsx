import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Confirmar from "../../components/Confirmar";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

describe("Testes - Confirmar Envio (Distribuidor Confirma)", () => {
  const mockUpdatePage = jest.fn();

  const solicitacao = {
    uuid: "123-abc",
    numero_solicitacao: "456789",
    status: "Enviada",
  };

  const setup = async () => {
    await act(async () => {
      render(
        <>
          <Confirmar solicitacao={solicitacao} updatePage={mockUpdatePage} />
          <ToastContainer />
        </>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHandlers();
  });

  it("deve renderizar o botão Confirmar", async () => {
    await setup();

    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("deve abrir o modal ao clicar em Confirmar", async () => {
    await setup();

    fireEvent.click(screen.getByText("Confirmar"));

    expect(
      screen.getByText(/Você está confirmando que realizará a entrega/i),
    ).toBeInTheDocument();
  });

  it('deve fechar o modal ao clicar em "Não"', async () => {
    await setup();

    fireEvent.click(screen.getByText("Confirmar"));

    fireEvent.click(screen.getByText("Não"));

    await waitFor(() =>
      expect(
        screen.queryByText(/Você está confirmando que realizará a entrega/i),
      ).not.toBeInTheDocument(),
    );
  });

  it('deve confirmar ao clicar em "Sim" e status = 200', async () => {
    mock
      .onPatch(
        `/solicitacao-remessa/${solicitacao.uuid}/distribuidor-confirma/`,
      )
      .reply(200, {});

    await setup();

    fireEvent.click(screen.getByText("Confirmar"));

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(mockUpdatePage).toHaveBeenCalled();
      expect(
        screen.getByText("A Confirmação foi realizada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("deve exibir erro quando a API retornar erro", async () => {
    mock
      .onPatch(
        `/solicitacao-remessa/${solicitacao.uuid}/distribuidor-confirma/`,
      )
      .reply(400, {});

    await setup();

    fireEvent.click(screen.getByText("Confirmar"));

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(mockUpdatePage).toHaveBeenCalled();
      expect(
        screen.getByText("Erro: não foi possível confirmar a requisição."),
      ).toBeInTheDocument();
    });
  });
});
