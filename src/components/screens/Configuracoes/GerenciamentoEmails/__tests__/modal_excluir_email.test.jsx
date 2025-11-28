import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { ModalExcluirEmail } from "../ModalExcluirEmail";
import { deleteEmailsTerceirizadasPorModulo } from "src/services/terceirizada.service";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HTTP_STATUS from "http-status-codes";
import mock from "src/services/_mock";

describe("Testes de comportamentos - Modal Excluir Email", () => {
  const closeModal = jest.fn();
  const buscarTerceirizadas = jest.fn();
  const email = {
    uuid: "3c15538d-9f03-48d6-9446-fa5f95a9557e",
    email: "teste@gmail.com",
    modulo: "Gestão de Alimentação",
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => {
      render(
        <MemoryRouter>
          <ModalExcluirEmail
            endpoint={deleteEmailsTerceirizadasPorModulo}
            buscarTerceirizadas={buscarTerceirizadas}
            modulo="Gestão de Alimentação"
            showModal={true}
            closeModal={closeModal}
            emailDict={email}
          />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("verifica se o componente foi renderizado", () => {
    expect(screen.getByText("Excluir e-mail")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Deseja excluir este e-mail do módulo de Gestão de Alimentação?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Sim").closest("button")).toBeInTheDocument();
    expect(screen.getByText("Não").closest("button")).toBeInTheDocument();
  });

  it("deve selecionar botão confirmar e verificar se funções foram chamadas", async () => {
    mock
      .onDelete(`/emails-terceirizadas-modulos/${email.uuid}/`)
      .reply(204, { status: HTTP_STATUS.NO_CONTENT });

    const botaoConfirmar = screen.getByTestId("botao-confirmar");
    fireEvent.click(botaoConfirmar);

    await waitFor(() => {
      expect(buscarTerceirizadas).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve selecionar botão cancelar e verificar se closeModal foi chamado", async () => {
    const botaoCancelar = screen.getByTestId("botao-cancelar");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve exibir mensagem de erro apos confirmar", async () => {
    mock
      .onDelete(`/emails-terceirizadas-modulos/${email.uuid}/`)
      .reply(400, {});

    const botaoConfirmar = screen.getByTestId("botao-confirmar");
    fireEvent.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText("Houve um erro ao excluir e-mail!"),
      ).toBeInTheDocument();
    });
  });
});
