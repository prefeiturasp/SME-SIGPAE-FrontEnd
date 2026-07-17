import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { ToastContainer } from "react-toastify";

import ModalCancelarHomologacaoProduto from "../index";
import { cancelaHomologacao } from "src/services/produto.service";

jest.mock("src/services/produto.service", () => ({
  cancelaHomologacao: jest.fn(),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label }) => (
    <div>
      <label htmlFor={input.name}>{label}</label>
      <textarea
        id={input.name}
        data-testid={input.name}
        value={input.value || ""}
        onChange={(e) => input.onChange(e.target.value)}
      />
    </div>
  ),
}));

describe("Teste de comportamentos do componente - ModalCancelarHomologacaoProduto", () => {
  const mockCloseModal = jest.fn();
  const mockAtualizarHomologacao = jest.fn();

  const produto = {
    nome: "Arroz Integral",
    marca: {
      nome: "Tio João",
    },
    fabricante: {
      nome: "Josapar",
    },
  };

  const defaultProps = {
    showModal: true,
    closeModal: mockCloseModal,
    onAtualizarHomologacao: mockAtualizarHomologacao,
    produto,
    idHomologacao: "123",
  };

  const renderComponent = async (props = {}) => {
    await act(async () => {
      render(
        <>
          <ModalCancelarHomologacaoProduto {...defaultProps} {...props} />
          <ToastContainer />
        </>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal com os dados do produto", async () => {
    await renderComponent();

    expect(
      screen.getByText("Envio de Cancelamento da Solicitação de Homologação"),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("Arroz Integral")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tio João")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Josapar")).toBeInTheDocument();

    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar em Voltar", async () => {
    await renderComponent();

    fireEvent.click(screen.getByText("Voltar"));

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve enviar o cancelamento com sucesso", async () => {
    cancelaHomologacao.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    await renderComponent();

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: {
        value: "Justificativa para cancelamento.",
      },
    });

    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(cancelaHomologacao).toHaveBeenCalledWith("123", {
        justificativa: "Justificativa para cancelamento.",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento enviado com sucesso."),
      ).toBeInTheDocument();
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockAtualizarHomologacao).toHaveBeenCalledTimes(1);
  });

  it("deve exibir mensagem de erro quando a API retornar BAD_REQUEST", async () => {
    cancelaHomologacao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
    });

    await renderComponent();

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: {
        value: "Motivo do cancelamento",
      },
    });

    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(cancelaHomologacao).toHaveBeenCalledWith("123", {
        justificativa: "Motivo do cancelamento",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Houve um erro ao cancelar homologação."),
      ).toBeInTheDocument();
    });

    expect(mockCloseModal).not.toHaveBeenCalled();
    expect(mockAtualizarHomologacao).not.toHaveBeenCalled();
  });

  it("não deve renderizar o modal quando showModal for false", async () => {
    await renderComponent({
      showModal: false,
    });

    expect(
      screen.queryByText("Envio de Cancelamento da Solicitação de Homologação"),
    ).not.toBeInTheDocument();
  });

  it("deve renderizar sem dados quando produto não existir", async () => {
    await renderComponent({
      produto: null,
    });

    expect(
      screen.getByText("Envio de Cancelamento da Solicitação de Homologação"),
    ).toBeInTheDocument();
  });
});
