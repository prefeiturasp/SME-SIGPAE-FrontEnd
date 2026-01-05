import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ModalCancelarSuspensaoAlimentacao from "../index.jsx";
import mock from "src/services/_mock";
import { ToastContainer } from "react-toastify";

describe("ModalCancelarSuspensaoAlimentacao", () => {
  const closeModal = jest.fn();
  const setSolicitacaoSuspensao = jest.fn();
  const uuidMock = "3f8c9e2a-7b6f-4e7a-9c3a-1d5b6f4a9e21";

  const setup = async (showModal = true) => {
    await act(async () => {
      render(
        <>
          <ModalCancelarSuspensaoAlimentacao
            showModal={showModal}
            closeModal={closeModal}
            setSolicitacaoSuspensao={setSolicitacaoSuspensao}
            uuid={uuidMock}
          />
          <ToastContainer />
        </>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("deve renderizar título e mensagem quando showModal = true", async () => {
    await setup(true);

    expect(
      screen.getByText("Cancelamento de Suspensão de Alimentação"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Deseja seguir em frente com o cancelamento/i),
    ).toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar em Não", async () => {
    await setup(true);

    fireEvent.click(screen.getByText("Não"));

    expect(closeModal).toHaveBeenCalled();
  });

  it("deve cancelar a suspensão com sucesso", async () => {
    mock
      .onPatch(
        `/suspensao-alimentacao-de-cei/${uuidMock}/cancela-suspensao-cei/`,
      )
      .reply(200, { id: 1 });

    await setup(true);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Justificativa válida" },
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(setSolicitacaoSuspensao).toHaveBeenCalledWith({ id: 1 });
      expect(closeModal).toHaveBeenCalled();
    });

    expect(
      screen.getByText(
        "A solicitação de Suspensão de Alimentação foi cancelada com sucesso!",
      ),
    ).toBeInTheDocument();
  });

  it("deve exibir erro quando a API retornar status diferente de OK", async () => {
    mock
      .onPatch(
        `/suspensao-alimentacao-de-cei/${uuidMock}/cancela-suspensao-cei/`,
      )
      .reply(400, { erro: "Sem permissão" });

    await setup(true);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Justificativa válida" },
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });

    expect(screen.getByText("Sem permissão")).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal = false", async () => {
    mock
      .onPatch(
        `/suspensao-alimentacao-de-cei/${uuidMock}/cancela-suspensao-cei/`,
      )
      .reply(200, {});

    await setup(false);

    expect(
      screen.queryByText("Cancelamento de Suspensão de Alimentação"),
    ).not.toBeInTheDocument();
  });
});
