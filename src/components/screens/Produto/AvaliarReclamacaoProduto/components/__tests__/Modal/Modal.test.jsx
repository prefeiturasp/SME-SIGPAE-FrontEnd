import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import React from "react";
import ModalProsseguirReclamacao from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Modal";
import { getMensagemSucesso } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Modal/helpers";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CODAEAceitaReclamacao,
  CODAEPedeAnaliseReclamacao,
  CODAERecusaReclamacao,
} from "src/services/produto.service";

jest.mock("src/services/produto.service", () => ({
  CODAEPedeAnaliseReclamacao: jest.fn(),
  CODAERecusaReclamacao: jest.fn(),
  CODAEAceitaReclamacao: jest.fn(),
}));

jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Modal/helpers",
  () => ({
    getMensagemSucesso: jest.fn((titulo) => `Sucesso: ${titulo}`),
  }),
);

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label, required: req }) => (
    <div>
      <label>
        {label}
        {req && " *"}
      </label>
      <textarea
        data-testid="ckeditor-field"
        value={input.value}
        onChange={(e) => input.onChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock("src/components/Shareable/Input/InputFile/ManagedField", () => ({
  __esModule: true,
  default: ({ texto }) => (
    <button type="button" data-testid="input-file-field">
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, type, onClick, disabled }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={`botao-${texto.toLowerCase()}`}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/helpers/fieldValidators", () => ({
  peloMenosUmCaractere: jest.fn((value) =>
    value && value.trim().length > 0 ? undefined : "Pelo menos um caractere",
  ),
  required: jest.fn((value) => (value ? undefined : "Campo obrigatório")),
}));

const mockProduto = {
  homologacoes: [
    {
      uuid: "uuid-homologacao-123",
      status: "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
    },
  ],
};

const defaultProps = {
  showModal: true,
  closeModal: jest.fn(),
  onAtualizarProduto: jest.fn(),
  produto: mockProduto,
  tituloModal: "Questionar terceirizada",
};

const renderComponent = (props = {}) =>
  render(<ModalProsseguirReclamacao {...defaultProps} {...props} />);

describe("ModalProsseguirReclamacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o modal quando showModal é true", () => {
      renderComponent();
      expect(screen.getByText("Questionar terceirizada")).toBeInTheDocument();
    });

    it("não deve exibir o modal quando showModal é false", () => {
      renderComponent({ showModal: false });
      expect(
        screen.queryByText("Questionar terceirizada"),
      ).not.toBeInTheDocument();
    });

    it("deve exibir o título correto passado via tituloModal", () => {
      renderComponent({ tituloModal: "Recusar reclamação" });
      expect(screen.getByText("Recusar reclamação")).toBeInTheDocument();
    });

    it("deve renderizar o campo de justificativa", () => {
      renderComponent();
      expect(screen.getByTestId("ckeditor-field")).toBeInTheDocument();
      expect(screen.getByText(/Justificativa/)).toBeInTheDocument();
    });

    it("deve renderizar o campo de anexo", () => {
      renderComponent();
      expect(screen.getByTestId("input-file-field")).toBeInTheDocument();
    });

    it("deve renderizar os botões Voltar e Enviar", () => {
      renderComponent();
      expect(screen.getByTestId("botao-voltar")).toBeInTheDocument();
      expect(screen.getByTestId("botao-enviar")).toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("deve chamar closeModal ao clicar no botão Voltar", () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("botao-voltar"));
      expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("onSubmit – seleção de endpoint", () => {
    it("deve chamar CODAEPedeAnaliseReclamacao quando tituloModal é 'Questionar terceirizada'", async () => {
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: {},
      });

      renderComponent({ tituloModal: "Questionar terceirizada" });

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(CODAEPedeAnaliseReclamacao).toHaveBeenCalledWith(
          "uuid-homologacao-123",
          expect.objectContaining({ justificativa: "Justificativa válida" }),
        );
      });
    });

    it("deve chamar CODAERecusaReclamacao quando tituloModal é 'Recusar reclamação'", async () => {
      CODAERecusaReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: {},
      });

      renderComponent({ tituloModal: "Recusar reclamação" });

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(CODAERecusaReclamacao).toHaveBeenCalledWith(
          "uuid-homologacao-123",
          expect.any(Object),
        );
      });
    });

    it("deve chamar CODAEAceitaReclamacao para qualquer outro tituloModal", async () => {
      CODAEAceitaReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: {},
      });

      renderComponent({ tituloModal: "Aceitar reclamação" });

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(CODAEAceitaReclamacao).toHaveBeenCalledWith(
          "uuid-homologacao-123",
          expect.any(Object),
        );
      });
    });
  });

  describe("onSubmit – resposta de sucesso (HTTP 200)", () => {
    it("deve chamar toastSuccess com a mensagem correta", async () => {
      const mockData = { id: 1 };
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: mockData,
      });

      renderComponent();

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(getMensagemSucesso).toHaveBeenCalledWith(
          "Questionar terceirizada",
        );
        expect(toastSuccess).toHaveBeenCalledWith(
          "Sucesso: Questionar terceirizada",
        );
      });
    });

    it("deve chamar closeModal após sucesso", async () => {
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: {},
      });

      renderComponent();

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
      });
    });

    it("deve chamar onAtualizarProduto com os dados da resposta após sucesso", async () => {
      const mockData = { nome: "Produto Atualizado" };
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: mockData,
      });

      renderComponent();

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(defaultProps.onAtualizarProduto).toHaveBeenCalledWith(mockData);
      });
    });
  });

  describe("onSubmit – resposta de erro (HTTP 400)", () => {
    it("deve chamar toastError com a mensagem de erro correta", async () => {
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.BAD_REQUEST,
        data: {},
      });

      renderComponent();

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          "Houve um erro ao registrar a reclamação de produto",
        );
      });
    });

    it("não deve chamar closeModal nem onAtualizarProduto em caso de erro 400", async () => {
      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.BAD_REQUEST,
        data: {},
      });

      renderComponent();

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(defaultProps.closeModal).not.toHaveBeenCalled();
        expect(defaultProps.onAtualizarProduto).not.toHaveBeenCalled();
      });
    });
  });

  describe("Seleção de homologação com status TERCEIRIZADA_RESPONDEU_RECLAMACAO", () => {
    it("deve usar a homologação com status TERCEIRIZADA_RESPONDEU_RECLAMACAO", async () => {
      const produtoComOutroStatus = {
        homologacoes: [
          { uuid: "uuid-outro", status: "OUTRO_STATUS" },
          {
            uuid: "uuid-terceirizada",
            status: "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
          },
        ],
      };

      CODAEPedeAnaliseReclamacao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: {},
      });

      renderComponent({ produto: produtoComOutroStatus });

      fireEvent.change(screen.getByTestId("ckeditor-field"), {
        target: { value: "Justificativa válida" },
      });
      fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));

      await waitFor(() => {
        expect(CODAEPedeAnaliseReclamacao).toHaveBeenCalledWith(
          "uuid-terceirizada",
          expect.any(Object),
        );
      });
    });
  });
});
