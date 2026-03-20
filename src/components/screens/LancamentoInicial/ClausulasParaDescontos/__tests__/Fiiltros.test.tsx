import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Filtros } from "src/components/screens/LancamentoInicial/ClausulasParaDescontos/components/Filtros";
import { Form } from "react-final-form";

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

describe("Componente Filtros", () => {
  const mockEditais = [
    { uuid: "1", numero: "Edital 01/2024" },
    { uuid: "2", numero: "Edital 02/2024" },
  ];

  const mockOnSubmit = jest.fn();
  const mockOnClear = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <Form
        onSubmit={mockOnSubmit}
        render={() => (
          <Filtros
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

  it("deve renderizar todos os campos de filtro corretamente", () => {
    renderComponent();

    expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    expect(screen.getByText("Cláusulas")).toBeInTheDocument();
    expect(screen.getByText("% de Desconto")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Digite uma cláusula"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite uma porcentagem"),
    ).toBeInTheDocument();
  });

  it("deve carregar as opções de editais no Select", async () => {
    renderComponent();
    const placeholder = screen.getByText("Selecione o edital");
    fireEvent.mouseDown(placeholder);
    expect(await screen.findByText("Edital 01/2024")).toBeInTheDocument();
    expect(await screen.findByText("Edital 02/2024")).toBeInTheDocument();
  });

  it("deve permitir digitar no campo de cláusulas e porcentagem", () => {
    renderComponent();

    const inputClausula = screen.getByPlaceholderText("Digite uma cláusula");
    fireEvent.change(inputClausula, { target: { value: "Cláusula 10" } });
    expect(inputClausula.value).toBe("Cláusula 10");

    const inputPorcentagem = screen.getByPlaceholderText(
      "Digite uma porcentagem",
    );
    fireEvent.change(inputPorcentagem, { target: { value: "15,50" } });
    expect(inputPorcentagem.value).toBe("15,5");
  });

  it("deve chamar onClear ao clicar no botão limpar", () => {
    renderComponent();

    const btnLimpar = screen.getByText("Limpar");
    fireEvent.click(btnLimpar);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it("deve chamar onSubmit com os valores preenchidos", async () => {
    renderComponent();

    const inputClausula = screen.getByPlaceholderText("Digite uma cláusula");
    fireEvent.change(inputClausula, { target: { value: "Artigo 5" } });

    const btnFiltrar = screen.getByText("Filtrar");
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
