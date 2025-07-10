import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Filtros from "../index";
import { consultaItems } from "src/services/produto.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/produto.service");
jest.mock("src/components/Shareable/Toast/dialogs");

jest.mock("src/components/Shareable/ModalCadastrarItem", () => ({
  __esModule: true,
  default: ({ showModal }) =>
    showModal ? <div role="dialog" data-testid="modal-cadastrar" /> : null,
}));

jest.mock("src/components/Shareable/AutoCompleteField", () => ({
  __esModule: true,
  default: ({ name, placeholder }) => (
    <input
      data-testid={`input-${name || "nome_item"}`}
      placeholder={placeholder}
    />
  ),
}));

jest.mock("src/components/Shareable/MakeField", () => ({
  ASelect: ({ children, disabled }) => (
    <div data-testid="select-tipo" data-disabled={disabled}>
      {children}
    </div>
  ),
}));

describe("Componente Filtros", () => {
  const mockProps = {
    setResultado: jest.fn(),
    nomes: ["Arroz", "Feijão", "Macarrão", "Carne"],
    tipos: [
      { tipo: "tipo1", tipo_display: "Tipo 1" },
      { tipo: "tipo2", tipo_display: "Tipo 2" },
    ],
    setCarregando: jest.fn(),
    setTotal: jest.fn(),
    setFiltros: jest.fn(),
    setPage: jest.fn(),
    changePage: jest.fn(),
    tipoFixo: false,
    initialValues: {
      nome_item: "",
      tipo: undefined,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos", () => {
    render(<Filtros {...mockProps} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByTestId("input-nome_item")).toBeInTheDocument();
    expect(screen.getByTestId("select-tipo")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Item")).toBeInTheDocument();
    expect(screen.getByText("Pesquisar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("deve mostrar erro quando a consulta falhar", async () => {
    consultaItems.mockRejectedValue(new Error("Erro na API"));

    render(<Filtros {...mockProps} />);

    fireEvent.click(screen.getByText("Pesquisar"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao tentar filtrar os Itens"
      );
      expect(mockProps.setCarregando).toHaveBeenCalledTimes(2);
    });
  });

  it("deve abrir o modal quando clicar no botão Cadastrar Item", async () => {
    render(<Filtros {...mockProps} />);

    expect(screen.queryByTestId("modal-cadastrar")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Cadastrar Item"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-cadastrar")).toBeInTheDocument();
    });
  });

  it("deve desabilitar o campo Tipo quando tipoFixo for true", () => {
    const propsComTipoFixo = { ...mockProps, tipoFixo: true };
    render(<Filtros {...propsComTipoFixo} />);

    expect(screen.getByTestId("select-tipo")).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });
});
