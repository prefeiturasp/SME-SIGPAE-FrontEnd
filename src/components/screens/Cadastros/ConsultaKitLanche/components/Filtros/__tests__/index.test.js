import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Filtros from "../index";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/FinalFormToRedux", () => () => (
  <div data-testid="final-form-to-redux" />
));
jest.mock("src/components/Shareable/AutoCompleteField", () => ({ label }) => (
  <div>
    <label htmlFor="numero_edital">{label}</label>
    <input
      id="numero_edital"
      name="numero_edital"
      data-testid="auto-complete-edital"
    />
  </div>
));
jest.mock(
  "src/components/Shareable/FinalForm/MultiSelect",
  () =>
    ({ label, options, name: _name }) =>
      (
        <div>
          <label htmlFor="status">{label}</label>
          <select id="status" name="status" data-testid="status-select">
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )
);
jest.mock(
  "src/components/Shareable/Botao",
  () =>
    ({ texto, onClick, type, disabled, className }) =>
      (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={className}
        >
          {texto}
        </button>
      )
);

jest.mock("src/services/edital.service", () => ({
  getNumerosEditais: jest.fn(() =>
    Promise.resolve({
      data: { results: [{ numero: "123" }, { numero: "456" }] },
    })
  ),
}));

describe("Filtros - Página de Consulta de Kits", () => {
  it("renderiza campos e botões, e executa ações corretamente", async () => {
    const mockSetFiltros = jest.fn();
    const mockSetKits = jest.fn();

    render(<Filtros setFiltros={mockSetFiltros} setKits={mockSetKits} />, {
      wrapper: MemoryRouter,
    });

    const editalInput = screen.getByLabelText("Número do Edital");
    fireEvent.change(editalInput, { target: { value: "123" } });
    expect(editalInput.value).toBe("123");

    const statusSelect = screen.getByLabelText("Status do Kit");
    expect(statusSelect).toBeInTheDocument();
    expect(statusSelect.children).toHaveLength(2);
    expect(statusSelect.children[0].textContent).toBe("Ativo");
    expect(statusSelect.children[1].textContent).toBe("Inativo");

    const btnAdicionar = screen.getByRole("button", {
      name: /adicionar novo modelo de kit/i,
    });
    expect(btnAdicionar).toBeInTheDocument();
    fireEvent.click(btnAdicionar);
    expect(mockNavigate).toHaveBeenCalledWith("/codae/cadastros/kits");

    const btnConsultar = screen.getByRole("button", { name: /consultar/i });
    expect(btnConsultar).toBeInTheDocument();
    fireEvent.click(btnConsultar);
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith({});
    });

    const btnLimpar = screen.getByRole("button", { name: /limpar filtros/i });
    expect(btnLimpar).toBeInTheDocument();
    fireEvent.click(btnLimpar);
    expect(mockSetKits).toHaveBeenCalledWith(undefined);
  });
});
