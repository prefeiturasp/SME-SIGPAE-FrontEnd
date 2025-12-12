import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ConfirmarEnvio from "../../components/Alterar/ConfirmarEnvio";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";

describe("Testes - Confirmar Envio (Alteração Requisição)", () => {
  const mockSetShow = jest.fn();
  const mockHandleCloseAll = jest.fn();
  const mockUpdatePage = jest.fn();
  const mockForm = { submit: jest.fn() };

  const solicitacao = { uuid: "123-abc" };

  const setup = async ({ show = true, values = {} }) => {
    await act(async () => {
      render(
        <>
          <ConfirmarEnvio
            show={show}
            setShow={mockSetShow}
            form={mockForm}
            updatePage={mockUpdatePage}
            handleCloseAll={mockHandleCloseAll}
            solicitacao={solicitacao}
            values={values}
          />
          <ToastContainer />
        </>,
      );
    });
  };

  it("deve renderizar título e botões quando show = true", async () => {
    await setup({ show: true });

    expect(screen.getByText(/Confirmar Solicitação/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deseja confirmar o envio da solicitação de alteração para a CODAE/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it('deve fechar o modal ao clicar em "Não"', async () => {
    await setup({ show: true });

    fireEvent.click(screen.getByText("Não"));
    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  it('deve chamar enviarSolicitacao ao clicar em "Sim" (status 201)', async () => {
    mock.onPost("/solicitacao-de-alteracao-de-requisicao/").reply(201, {});

    await setup({ show: true, values: { campo: "x" } });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(mockSetShow).toHaveBeenCalledWith(false);
      expect(mockHandleCloseAll).toHaveBeenCalled();
      expect(mockUpdatePage).toHaveBeenCalled();
      expect(
        screen.getByText(
          "Sua solicitação foi enviada e será analisada pela CODAE",
        ),
      ).toBeInTheDocument();
    });
  });

  it("deve mostrar erro quando status != 201", async () => {
    mock.onPost("/solicitacao-de-alteracao-de-requisicao/").reply(400, {});

    await setup({ show: true });

    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao solicitar a alteração de requisição.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("não deve renderizar o modal quando show = false", async () => {
    await setup({ show: false });

    expect(
      screen.queryByText(/Confirmar Solicitação/i),
    ).not.toBeInTheDocument();
  });
});
