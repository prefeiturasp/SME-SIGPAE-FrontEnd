import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PrevisaoCadastro from "src/components/screens/Produto/AvaliarSolicitacaoCadastroProduto/components/FormPrevisaoCadastro";
import * as produtoService from "src/services/produto.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";

jest.mock("src/services/produto.service");
jest.mock("src/components/Shareable/Toast/dialogs");

jest.mock("src/components/Shareable/CKEditorField", () => {
  return ({ input, label }) => (
    <div>
      <label>{label}</label>
      <textarea {...input} data-testid="ckeditor-mock" />
    </div>
  );
});

jest.mock("src/components/Shareable/DatePicker", () => {
  return {
    InputComData: ({ input, label }) => (
      <div>
        <label>{label}</label>
        <input {...input} data-testid="datepicker-mock" />
      </div>
    ),
  };
});

jest.mock("src/helpers/utilities", () => ({
  converterDDMMYYYYparaYYYYMMDD: jest.fn((d) => d),
}));

const mockOnUpdate = jest.fn();
const uuidSolicitacao = "37fb92ec-05a5-4db6-9d41-3a84380d7734";

const renderComponent = () => {
  return render(
    <PrevisaoCadastro
      onUpdate={mockOnUpdate}
      uuidSolicitacao={uuidSolicitacao}
    />,
  );
};

describe("Componente PrevisaoCadastro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar os campos iniciais corretamente", () => {
    renderComponent();

    expect(screen.getByText(/Data prevista/i)).toBeInTheDocument();
    expect(screen.getByText(/Justificativa/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirmar/i }),
    ).toBeInTheDocument();
  });

  it("deve chamar a API com sucesso e disparar onUpdate", async () => {
    produtoService.updateSolicitacaoCadastroProdutoDieta.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    renderComponent();

    fireEvent.change(screen.getByTestId("datepicker-mock"), {
      target: { value: "2026-05-20" },
    });
    fireEvent.change(screen.getByTestId("ckeditor-mock"), {
      target: { value: "Justificativa de teste" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    await waitFor(() => {
      expect(
        produtoService.updateSolicitacaoCadastroProdutoDieta,
      ).toHaveBeenCalledWith(
        uuidSolicitacao,
        expect.objectContaining({
          data_previsao_cadastro: "2026-05-20",
          justificativa_previsao_cadastro: "Justificativa de teste",
        }),
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Solicitação de cadastro de produto confirmada com sucesso",
      );
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("deve exibir erro quando a API falhar", async () => {
    produtoService.updateSolicitacaoCadastroProdutoDieta.mockResolvedValue({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });

    renderComponent();

    fireEvent.change(screen.getByTestId("datepicker-mock"), {
      target: { value: "2026-05-20" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao confirmar a solicitação de cadastro",
      );
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  it("não deve submeter se o campo obrigatório (data) estiver vazio", async () => {
    renderComponent();

    const btn = screen.getByRole("button", { name: /Confirmar/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(
        produtoService.updateSolicitacaoCadastroProdutoDieta,
      ).not.toHaveBeenCalled();
    });
  });

  it("deve desabilitar o botão durante a submissão", async () => {
    produtoService.updateSolicitacaoCadastroProdutoDieta.mockReturnValue(
      new Promise((resolve) =>
        setTimeout(() => resolve({ status: HTTP_STATUS.OK }), 100),
      ),
    );

    renderComponent();
    fireEvent.change(screen.getByTestId("datepicker-mock"), {
      target: { value: "2026-05-20" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    const btn = screen.getByRole("button", { name: /Confirmar/i });
    expect(btn).toBeDisabled();

    await waitFor(() => {
      expect(btn).not.toBeDisabled();
    });
  });
});
