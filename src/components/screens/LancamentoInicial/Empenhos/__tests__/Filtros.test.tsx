import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Form } from "react-final-form";
import { Filtros } from "src/components/screens/LancamentoInicial/Empenhos/components/Filtros"; // ajuste o caminho

jest.mock("src/components/Shareable/CollapseFiltros", () => ({
  __esModule: true,
  default: ({ onSubmit, onClear, children }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div data-testid="collapse-content">{children()}</div>
      <button type="submit">Filtrar</button>
      <button type="button" onClick={onClear}>
        Limpar
      </button>
    </form>
  ),
}));

describe("Componente Filtros - Empenho, Contratos e Editais", () => {
  const mockContratos = [{ uuid: "c1", numero: "Contrato 123" }];
  const mockEditais = [{ uuid: "e1", numero: "Edital 456" }];
  const mockOnSubmit = jest.fn();
  const mockOnClear = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <Form
        onSubmit={mockOnSubmit}
        render={() => (
          <Filtros
            contratos={mockContratos}
            editais={mockEditais}
            onSubmit={mockOnSubmit}
            onClear={mockOnClear}
            {...props}
          />
        )}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar todos os campos corretamente", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/Digite o Nº do empenho/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por Contratos/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por Editais/i)).toBeInTheDocument();
  });

  it("deve permitir a busca e filtrar opções no Select de Contratos (filtrarOpcoes)", async () => {
    renderComponent();

    const selectContrato = screen.getByText("Selecione um contrato");
    fireEvent.mouseDown(selectContrato);

    const searchInputs = document.querySelectorAll(
      ".ant-select-selection-search-input",
    );
    const inputBuscaContrato = searchInputs[0];

    fireEvent.change(inputBuscaContrato, { target: { value: "CONTRATO 123" } });

    await waitFor(() => {
      const opcoes = screen.getAllByText((content, element) => {
        return element.textContent === "Contrato 123";
      });

      expect(opcoes[opcoes.length - 1]).toBeInTheDocument();
    });
  });

  it("deve permitir a busca e filtrar opções no Select de Editais", async () => {
    renderComponent();

    const selectEdital = screen.getByText("Selecione um edital");
    fireEvent.mouseDown(selectEdital);

    const searchInputs = document.querySelectorAll(
      ".ant-select-selection-search-input",
    );
    const inputBuscaEdital = searchInputs[1];

    fireEvent.change(inputBuscaEdital, { target: { value: "456" } });

    await waitFor(() => {
      const opcoes = screen.getAllByText((content, element) => {
        return element.textContent === "Edital 456";
      });
      expect(opcoes.length).toBeGreaterThan(0);
      expect(opcoes[opcoes.length - 1]).toBeInTheDocument();
    });
  });

  it("deve chamar onClear ao clicar no botão limpar", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Limpar"));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it("deve chamar onSubmit ao clicar no botão filtrar", async () => {
    renderComponent();

    const inputEmpenho = screen.getByPlaceholderText(/Digite o Nº do empenho/i);
    fireEvent.change(inputEmpenho, { target: { value: "EMP123" } });

    fireEvent.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
