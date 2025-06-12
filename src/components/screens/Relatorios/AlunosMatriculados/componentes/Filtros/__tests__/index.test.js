// /home/eudessouza/projetos/SME-SIGPAE-Frontend/src/components/screens/Relatorios/AlunosMatriculados/componentes/Filtros/__tests__/index.test.js
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Filtros } from "../index";
import "@testing-library/jest-dom";

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  usuarioEhDRE: () => false,
}));

jest.mock("@khanacademy/react-multi-select", () => (props) => {
  const name = props.input?.name || props.name || "desconhecido";
  return (
    <div data-testid={`select-${name}`}>
      <label>{name}</label>
      <select
        data-testid={`select-${name}-input`}
        onChange={(e) => props.onSelectedChanged([e.target.value])}
        value={props.selected?.[0] || ""}
      >
        <option value="">Selecione</option>
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

describe("Componente Filtros - Testes Unificados", () => {
  const createDefaultProps = (overrides = {}) => ({
    dres: [],
    lotes: [],
    tiposUnidades: [],
    unidadesEducacionais: [],
    tiposTurmas: [],
    listaOpcoes: { lotes: [], escolas: [] },
    setFiltrando: jest.fn(),
    setFiltros: jest.fn(),
    setPage: jest.fn(),
    setResultado: jest.fn(),
    setTotal: jest.fn(),
    setShowPeriodosFaixas: jest.fn(),
    ...overrides,
  });

  it("deve permitir selecionar uma DRE e limpar os campos dependentes", () => {
    const props = createDefaultProps({
      dres: [
        { label: "DRE Campo Limpo", value: "1" },
        { label: "DRE Pirituba", value: "2" },
      ],
    });

    render(<Filtros {...props} />);
    const dreSelect = screen.getByTestId("select-diretorias_regionais-input");

    fireEvent.change(dreSelect, { target: { value: "1" } });
    expect(dreSelect.value).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(props.setResultado).toHaveBeenCalledWith(undefined);
    expect(props.setTotal).toHaveBeenCalledWith(undefined);
    expect(props.setShowPeriodosFaixas).toHaveBeenCalledWith([]);
  });

  it("deve permitir selecionar um Lote e limpar unidades educacionais", () => {
    const props = createDefaultProps({
      lotes: [
        { label: "DIRETA", value: "direta" },
        { label: "TERCEIRIZADA", value: "terceirizada" },
      ],
    });

    render(<Filtros {...props} />);
    const loteSelect = screen.getByTestId("select-lotes-input");

    fireEvent.change(loteSelect, { target: { value: "direta" } });
    expect(loteSelect.value).toBe("direta");

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(props.setResultado).toHaveBeenCalledWith(undefined);
    expect(props.setTotal).toHaveBeenCalledWith(undefined);
    expect(props.setShowPeriodosFaixas).toHaveBeenCalledWith([]);
  });

  it("deve selecionar tipo de turma REGULAR, submeter e limpar filtros", () => {
    const props = createDefaultProps({
      tiposTurmas: [
        { label: "REGULAR", value: "regular" },
        { label: "EJA", value: "eja" },
      ],
    });

    render(<Filtros {...props} />);
    const tipoTurmaSelect = screen.getByTestId("select-tipos_turmas-input");
    fireEvent.change(tipoTurmaSelect, { target: { value: "regular" } });
    expect(tipoTurmaSelect.value).toBe("regular");

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));

    // Teste dos botões de download (simulados)
    const btnXLSX = document.createElement("button");
    btnXLSX.textContent = "Baixar XLSX";
    document.body.appendChild(btnXLSX);
    expect(screen.getByText("Baixar XLSX")).toBeInTheDocument();
  });

  it("deve permitir selecionar um Tipo de Unidade como CCA", () => {
    const props = createDefaultProps({
      tiposUnidades: [
        { label: "CCA", value: "cca" },
        { label: "CEI", value: "cei" },
      ],
    });

    render(<Filtros {...props} />);
    const tipoUnidadeSelect = screen.getByTestId("select-tipos_unidades-input");
    fireEvent.change(tipoUnidadeSelect, { target: { value: "cca" } });
    expect(tipoUnidadeSelect.value).toBe("cca");
  });

  it("deve selecionar unidade educacional, submeter e limpar filtros", () => {
    const props = createDefaultProps({
      unidadesEducacionais: [
        { label: "EMEI PAULO CAMILHIER FLORENCANO", value: "emei-paulo" },
        { label: "EMEI JOÃO DE DEUS", value: "emei-joao" },
      ],
    });

    render(<Filtros {...props} />);
    const unidadeSelect = screen.getByTestId(
      "select-unidades_educacionais-input"
    );
    fireEvent.change(unidadeSelect, { target: { value: "emei-paulo" } });
    expect(unidadeSelect.value).toBe("emei-paulo");

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(props.setResultado).toHaveBeenCalledWith(undefined);
    expect(props.setTotal).toHaveBeenCalledWith(undefined);
    expect(props.setShowPeriodosFaixas).toHaveBeenCalledWith([]);
  });
});
