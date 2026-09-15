import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { SeletorDeDatas } from "../SeletorDeDatas";

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Field: ({ component, name, ...props }) =>
      React.createElement(component, {
        ...props,
        input: {
          name,
          onChange: jest.fn(),
          value: "",
        },
        meta: {},
        name,
      }),
  };
});

jest.mock("src/components/Shareable/DatePicker", () => {
  const React = require("react");

  return {
    InputComData: ({
      disabled,
      form,
      indexTrash,
      inputOnChange,
      label,
      labelClassName,
      minDate,
      onClickTrash,
      required,
      showMonthDropdown,
      showYearDropdown,
    }) =>
      React.createElement(
        "div",
        { "data-testid": `campo-data-${indexTrash}` },
        React.createElement(
          "label",
          { className: labelClassName },
          label,
          React.createElement("input", {
            "aria-label": `${label} ${indexTrash + 1}`,
            "data-min-date": String(minDate),
            "data-required": String(required),
            "data-show-month-dropdown": String(showMonthDropdown),
            "data-show-year-dropdown": String(showYearDropdown),
            disabled,
            onChange: (evento) => inputOnChange(evento.target.value),
          }),
        ),
        indexTrash > 0 &&
          React.createElement(
            "button",
            {
              "aria-label": `Excluir data ${indexTrash + 1}`,
              onClick: () => onClickTrash(indexTrash, form),
              type: "button",
            },
            "Excluir",
          ),
      ),
  };
});

jest.mock("src/components/Shareable/Input/InputText", () => {
  const React = require("react");

  return {
    InputText: ({ name }) =>
      React.createElement("input", {
        "data-testid": "campo-datas-oculto",
        name,
        type: "hidden",
      }),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ onClick }) =>
      React.createElement(
        "button",
        { "aria-label": "Adicionar data", onClick, type: "button" },
        "Adicionar data",
      ),
  };
});

const UUID_OCORRENCIA = "39623502-eb01-4bb2-b8d5-0ced722f90cd";
const UUID_PARAMETRIZACAO = "88a4368e-3d2b-4592-b379-e2af14323b19";
const TITULO = "Data da ocorrência";
const NOME_DATAS_OCORRENCIA = "datas_ocorrencia";
const NOME_GRUPOS = `grupos_${UUID_OCORRENCIA}[0]`;
const CHAVE_GRUPOS = `grupos_${UUID_OCORRENCIA}`;
const CHAVE_DATA_PARAMETRIZADA = `tipoocorrencia_${UUID_OCORRENCIA}_parametrizacao_${UUID_PARAMETRIZACAO}`;
const NOME_DATA_PARAMETRIZADA = `${NOME_GRUPOS}.${CHAVE_DATA_PARAMETRIZADA}`;

const criarFormulario = ({ estadoCampo, valores = {} } = {}) => ({
  change: jest.fn(),
  getFieldState: jest.fn(() => estadoCampo),
  getState: jest.fn(() => ({ values: valores })),
});

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_DATAS_OCORRENCIA,
  name_grupos: NOME_GRUPOS,
  form: criarFormulario() as any,
  ehDataOcorrencia: true,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorDeDatas {...props} />);
  return props;
};

describe("Seletor de datas do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["campo inexistente", undefined],
    ["campo sem valor", { value: undefined }],
    ["lista vazia", { value: [] }],
  ])("inicia com uma data quando houver %s", (_cenario, estadoCampo) => {
    const form = criarFormulario({ estadoCampo });

    renderizarSeletor({ form });

    expect(screen.getAllByTestId(/^campo-data-/)).toHaveLength(1);
    expect(screen.getByLabelText(`${TITULO} 1`)).toHaveAttribute(
      "data-required",
      "true",
    );
    expect(screen.getByLabelText(`${TITULO} 1`)).toHaveAttribute(
      "data-min-date",
      "null",
    );
    expect(screen.getByLabelText(`${TITULO} 1`)).toHaveAttribute(
      "data-show-month-dropdown",
      "true",
    );
    expect(screen.getByLabelText(`${TITULO} 1`)).toHaveAttribute(
      "data-show-year-dropdown",
      "true",
    );
    expect(screen.getByTestId("campo-datas-oculto")).toHaveAttribute(
      "name",
      NOME_DATAS_OCORRENCIA,
    );
    expect(form.change).not.toHaveBeenCalled();
  });

  it("restaura todas as datas preenchidas no formulário", () => {
    const datasIniciais = ["10/09/2026", "11/09/2026", "12/09/2026"];
    const form = criarFormulario({ estadoCampo: { value: datasIniciais } });

    renderizarSeletor({ form });

    expect(screen.getAllByTestId(/^campo-data-/)).toHaveLength(3);
    expect(form.change).toHaveBeenNthCalledWith(
      1,
      `${NOME_DATAS_OCORRENCIA}_0_${TITULO}`,
      "10/09/2026",
    );
    expect(form.change).toHaveBeenNthCalledWith(
      2,
      `${NOME_DATAS_OCORRENCIA}_1_${TITULO}`,
      "11/09/2026",
    );
    expect(form.change).toHaveBeenNthCalledWith(
      3,
      `${NOME_DATAS_OCORRENCIA}_2_${TITULO}`,
      "12/09/2026",
    );
    expect(screen.getAllByText(TITULO)[0]).toHaveClass("pb-3");
    expect(screen.getAllByText(TITULO)[1]).not.toHaveClass("pb-3");
  });

  it("atualiza a lista quando uma data é alterada", () => {
    const datasIniciais = ["10/09/2026", "11/09/2026"];
    const form = criarFormulario({ estadoCampo: { value: datasIniciais } });
    renderizarSeletor({ form });
    form.change.mockClear();

    fireEvent.change(screen.getByLabelText(`${TITULO} 2`), {
      target: { value: "15/09/2026" },
    });

    expect(form.change).toHaveBeenCalledWith(NOME_DATAS_OCORRENCIA, [
      "10/09/2026",
      "15/09/2026",
    ]);
  });

  it("adiciona um novo campo de data", () => {
    const form = criarFormulario();
    renderizarSeletor({ form });

    fireEvent.click(screen.getByRole("button", { name: "Adicionar data" }));

    expect(screen.getAllByTestId(/^campo-data-/)).toHaveLength(2);
    expect(form.change).toHaveBeenCalledWith(NOME_DATAS_OCORRENCIA, ["", ""]);
  });

  it("oculta a inclusão e desabilita os campos no modo somente leitura", () => {
    const form = criarFormulario({
      estadoCampo: { value: ["10/09/2026", "11/09/2026"] },
    });

    renderizarSeletor({ form, somenteLeitura: true });

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    screen
      .getAllByRole("textbox")
      .forEach((campo) => expect(campo).toBeDisabled());
    expect(
      screen.queryByRole("button", { name: "Adicionar data" }),
    ).not.toBeInTheDocument();
  });

  it("remove e reorganiza uma data de ocorrência", () => {
    const datasIniciais = ["10/09/2026", "11/09/2026", "12/09/2026"];
    const valores = {
      [`${NOME_DATAS_OCORRENCIA}_2_${TITULO}`]: "12/09/2026",
    };
    const form = criarFormulario({
      estadoCampo: { value: datasIniciais },
      valores,
    });
    renderizarSeletor({ form });
    form.change.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Excluir data 2" }));

    expect(form.change).toHaveBeenNthCalledWith(
      1,
      `${NOME_DATAS_OCORRENCIA}_1_${TITULO}`,
      "12/09/2026",
    );
    expect(form.change).toHaveBeenNthCalledWith(
      2,
      `${NOME_DATAS_OCORRENCIA}_2_${TITULO}`,
      undefined,
    );
    expect(form.change).toHaveBeenNthCalledWith(3, NOME_DATAS_OCORRENCIA, [
      "10/09/2026",
      "12/09/2026",
    ]);
    expect(screen.getAllByTestId(/^campo-data-/)).toHaveLength(2);
  });

  it("remove e reorganiza uma data de um grupo parametrizado", () => {
    const datasIniciais = ["10/09/2026", "11/09/2026", "12/09/2026"];
    const valores = {
      [CHAVE_GRUPOS]: [
        {
          [`${CHAVE_DATA_PARAMETRIZADA}_2_${TITULO}`]: "12/09/2026",
          [`${CHAVE_DATA_PARAMETRIZADA}_3_${TITULO}`]: undefined,
        },
      ],
    };
    const form = criarFormulario({
      estadoCampo: { value: datasIniciais },
      valores,
    });
    renderizarSeletor({
      ehDataOcorrencia: false,
      form,
      name: NOME_DATA_PARAMETRIZADA,
    });
    form.change.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Excluir data 2" }));

    expect(form.change).toHaveBeenNthCalledWith(
      1,
      `${NOME_GRUPOS}.${CHAVE_DATA_PARAMETRIZADA}_1_${TITULO}`,
      "12/09/2026",
    );
    expect(form.change).toHaveBeenCalledWith(
      `${NOME_GRUPOS}.${CHAVE_DATA_PARAMETRIZADA}_2_${TITULO}`,
      undefined,
    );
    expect(form.change).toHaveBeenLastCalledWith(NOME_DATA_PARAMETRIZADA, [
      "10/09/2026",
      "12/09/2026",
    ]);
    expect(screen.getAllByTestId(/^campo-data-/)).toHaveLength(2);
  });
});
