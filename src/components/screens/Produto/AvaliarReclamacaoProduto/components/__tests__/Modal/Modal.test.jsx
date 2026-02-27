import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import React from "react";
import ModalProsseguirReclamacao from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Modal";
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

const submitForm = (justificativa = "Justificativa válida") => {
  fireEvent.change(screen.getByTestId("ckeditor-field"), {
    target: { value: justificativa },
  });
  fireEvent.submit(screen.getByTestId("ckeditor-field").closest("form"));
};

describe("ModalProsseguirReclamacao", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve chamar closeModal ao clicar no botão Voltar", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("botao-voltar"));
    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve chamar CODAEPedeAnaliseReclamacao e tratar sucesso ao questionar terceirizada", async () => {
    const mockData = { id: 1 };
    CODAEPedeAnaliseReclamacao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: mockData,
    });

    renderComponent({ tituloModal: "Questionar terceirizada" });
    submitForm();

    await waitFor(() => {
      expect(CODAEPedeAnaliseReclamacao).toHaveBeenCalledWith(
        "uuid-homologacao-123",
        expect.objectContaining({ justificativa: "Justificativa válida" }),
      );
      expect(toastSuccess).toHaveBeenCalled();
      expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
      expect(defaultProps.onAtualizarProduto).toHaveBeenCalledWith(mockData);
    });
  });

  it("deve chamar CODAERecusaReclamacao quando tituloModal é 'Recusar reclamação'", async () => {
    CODAERecusaReclamacao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {},
    });

    renderComponent({ tituloModal: "Recusar reclamação" });
    submitForm();

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
    submitForm();

    await waitFor(() => {
      expect(CODAEAceitaReclamacao).toHaveBeenCalledWith(
        "uuid-homologacao-123",
        expect.any(Object),
      );
    });
  });

  it("deve chamar toastError e não fechar o modal em caso de HTTP 400", async () => {
    CODAEPedeAnaliseReclamacao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: {},
    });

    renderComponent();
    submitForm();

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao registrar a reclamação de produto",
      );
      expect(defaultProps.closeModal).not.toHaveBeenCalled();
    });
  });

  it("deve usar a homologação com status TERCEIRIZADA_RESPONDEU_RECLAMACAO", async () => {
    CODAEPedeAnaliseReclamacao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {},
    });

    renderComponent({
      produto: {
        homologacoes: [
          { uuid: "uuid-outro", status: "OUTRO_STATUS" },
          {
            uuid: "uuid-terceirizada",
            status: "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
          },
        ],
      },
    });
    submitForm();

    await waitFor(() => {
      expect(CODAEPedeAnaliseReclamacao).toHaveBeenCalledWith(
        "uuid-terceirizada",
        expect.any(Object),
      );
    });
  });
});
