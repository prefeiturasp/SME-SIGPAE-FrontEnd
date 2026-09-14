import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HTTP_STATUS from "http-status-codes";
import { Form } from "react-final-form";
import ModalAutorizarAposQuestionamento from "../../ModalAutorizarAposQuestionamento";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

const UUID_SOLICITACAO = "4ff3c23d-457b-4990-982b-c09d81317190";
const TIPO_SOLICITACAO = "INVERSAO_DIA_CARDAPIO";

describe("ModalAutorizarAposQuestionamento", () => {
  const closeModal = jest.fn();
  const endpoint = jest.fn();
  const loadSolicitacao = jest.fn();

  const renderizarModal = (sobrescritas = {}) =>
    render(
      <Form
        onSubmit={() => undefined}
        render={({ values }) => (
          <ModalAutorizarAposQuestionamento
            showModal
            closeModal={closeModal}
            justificativa={values.justificativa}
            uuid={UUID_SOLICITACAO}
            endpoint={endpoint}
            loadSolicitacao={loadSolicitacao}
            tipoSolicitacao={TIPO_SOLICITACAO}
            {...sobrescritas}
          />
        )}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe o conteúdo e as ações do modal", () => {
    renderizarModal();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Atenção")).toBeInTheDocument();
    expect(
      screen.getByText(/A empresa terceirizada respondeu que/),
    ).toHaveTextContent(
      "A empresa terceirizada respondeu que não poderá atender a solicitação com todos os itens do cardápio, deseja autorizar mesmo assim?",
    );
    expect(screen.getByText("Justificativa")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Qual a sua justificativa para essa decisão?",
      ),
    ).toBeRequired();
    expect(screen.getByRole("button", { name: "Não" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sim" })).toBeDisabled();
  });

  it("não exibe o modal quando showModal for falso", () => {
    renderizarModal({ showModal: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("fecha o modal pelo botão Não", async () => {
    const usuario = userEvent.setup();
    renderizarModal();

    await usuario.click(screen.getByRole("button", { name: "Não" }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("fecha o modal pelo botão do cabeçalho", async () => {
    const usuario = userEvent.setup();
    renderizarModal();

    await usuario.click(screen.getByLabelText(/close/i));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("autoriza a solicitação quando a API retorna sucesso", async () => {
    const usuario = userEvent.setup();
    endpoint.mockResolvedValue({ status: HTTP_STATUS.OK });
    renderizarModal();

    await usuario.type(
      screen.getByPlaceholderText(
        "Qual a sua justificativa para essa decisão?",
      ),
      "Cardápio autorizado após análise.",
    );
    await usuario.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(endpoint).toHaveBeenCalledWith(
        UUID_SOLICITACAO,
        { justificativa: "Cardápio autorizado após análise." },
        TIPO_SOLICITACAO,
      );
      expect(closeModal).toHaveBeenCalledTimes(1);
      expect(loadSolicitacao).toHaveBeenCalledWith(
        UUID_SOLICITACAO,
        TIPO_SOLICITACAO,
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Solicitação autorizada com sucesso!",
      );
    });
    expect(toastError).not.toHaveBeenCalled();
  });

  it("apresenta a mensagem da API quando a autorização falha", async () => {
    const usuario = userEvent.setup();
    endpoint.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      detail: "Não foi possível autorizar a solicitação.",
    });
    renderizarModal();

    await usuario.type(
      screen.getByPlaceholderText(
        "Qual a sua justificativa para essa decisão?",
      ),
      "Justificativa para autorização.",
    );
    await usuario.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível autorizar a solicitação.",
      );
    });
    expect(closeModal).not.toHaveBeenCalled();
    expect(loadSolicitacao).not.toHaveBeenCalled();
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
