import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getListNomesNutricionistas } from "src/services/imr/painelGerencial";
import { Filtros } from "../index";

jest.mock("antd", () => {
  const React = require("react");

  return {
    Spin: ({ children, spinning, tip }) =>
      React.createElement(
        "div",
        { "data-testid": "spin", "data-spinning": String(spinning) },
        spinning && React.createElement("span", { role: "status" }, tip),
        children,
      ),
  };
});

jest.mock("src/components/Shareable/CollapseFiltros", () => {
  const React = require("react");
  const { Form } = require("react-final-form");

  return {
    __esModule: true,
    default: ({ children, onSubmit, onClear, titulo, desabilitarBotoes }) =>
      React.createElement(Form, {
        onSubmit,
        render: ({ form, handleSubmit, values }) =>
          React.createElement(
            "form",
            { onSubmit: handleSubmit },
            React.createElement("h2", null, titulo),
            children(values, form),
            React.createElement(
              "button",
              { type: "submit", disabled: desabilitarBotoes },
              "Filtrar",
            ),
            React.createElement(
              "button",
              {
                type: "button",
                disabled: desabilitarBotoes,
                onClick: () => {
                  form.reset({});
                  onClear();
                },
              },
              "Limpar Filtros",
            ),
          ),
      }),
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, label, options = [], disabled, onChangeEffect }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement(
          "select",
          {
            ...input,
            "aria-label": label,
            disabled,
            onChange: (evento) => {
              input.onChange(evento);
              onChangeEffect(evento);
            },
          },
          options.map((opcao) =>
            React.createElement(
              "option",
              { key: opcao.uuid, value: opcao.uuid },
              opcao.nome,
            ),
          ),
        ),
      ),
  };
});

jest.mock("src/components/Shareable/AutoCompleteSelectField", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ input, label, options = [], placeholder, disabled }) =>
      React.createElement(
        "div",
        null,
        React.createElement(
          "label",
          null,
          label,
          React.createElement("input", {
            ...input,
            "aria-label": label,
            disabled,
            placeholder,
            value: input.value || "",
            onChange: (evento) => input.onChange(evento.target.value),
          }),
        ),
        React.createElement(
          "div",
          { "data-testid": `opcoes-${input.name}` },
          options.map((opcao) =>
            React.createElement("span", { key: opcao.value }, opcao.value),
          ),
        ),
      ),
  };
});

jest.mock("src/components/Shareable/DatePicker", () => {
  const React = require("react");
  const formatarData = (data) =>
    data instanceof Date ? data.toISOString() : "";

  return {
    InputComData: ({ input, placeholder, minDate, maxDate }) =>
      React.createElement("input", {
        ...input,
        "aria-label": placeholder,
        placeholder,
        value: input.value || "",
        "data-min-date": formatarData(minDate),
        "data-max-date": formatarData(maxDate),
        onChange: (evento) => input.onChange(evento.target.value),
      }),
  };
});

jest.mock("src/components/Shareable/Label", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ content }) => React.createElement("span", null, content),
  };
});

jest.mock("src/helpers/utilities.jsx", () => ({
  dateDelta: jest.fn(() => new Date("2026-09-11T12:00:00.000Z")),
}));

jest.mock("src/services/diretoriaRegional.service", () => ({
  getDiretoriaregionalSimplissima: jest.fn(),
}));

jest.mock("src/services/escola.service", () => ({
  getEscolasTercTotal: jest.fn(),
}));

jest.mock("src/services/imr/painelGerencial", () => ({
  getListNomesNutricionistas: jest.fn(),
}));

const UUID_DRE = "1b7f3f52-7f27-4872-91e5-24b8e44fe092";
const UUID_ESCOLA = "24bb0c48-80a6-4b31-b04a-5155197f082d";

const diretoriasRegionais = [
  {
    uuid: UUID_DRE,
    nome: "DRE Butantã",
  },
];

const escolas = [
  {
    uuid: UUID_ESCOLA,
    codigo_eol: "123456",
    nome: "EMEF Teste",
  },
];

const mockGetDiretoriaregionalSimplissima = jest.mocked(
  getDiretoriaregionalSimplissima,
);
const mockGetEscolasTercTotal = jest.mocked(getEscolasTercTotal);
const mockGetListNomesNutricionistas = jest.mocked(getListNomesNutricionistas);

const criarProps = (sobrescritas = {}) => ({
  filtros: { status: "FINALIZADO" },
  setFiltros: jest.fn(),
  setRelatoriosVisita: jest.fn(),
  setConsultaRealizada: jest.fn(),
  perfilNutriSupervisao: false,
  buscarResultados: jest.fn(),
  form_: {} as any,
  setForm: jest.fn(),
  ...sobrescritas,
});

const renderizarFiltros = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<Filtros {...props} />);
  return props;
};

const aguardarCarregamentoInicial = async () => {
  await waitFor(() => {
    expect(mockGetDiretoriaregionalSimplissima).toHaveBeenCalledTimes(1);
    expect(mockGetListNomesNutricionistas).toHaveBeenCalledTimes(1);
  });
};

const selecionarDiretoriaRegional = async () => {
  await screen.findByRole("option", { name: "DRE Butantã" });
  fireEvent.change(
    screen.getByRole("combobox", {
      name: "Diretoria Regional de Educação",
    }),
    { target: { value: UUID_DRE } },
  );
};

describe("Filtros dos relatórios de fiscalização", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDiretoriaregionalSimplissima.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: diretoriasRegionais },
    });
    mockGetListNomesNutricionistas.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: ["Ana Silva", "João Souza"] },
    });
    mockGetEscolasTercTotal.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: escolas,
    });
  });

  it("carrega e formata as opções de DRE e nutricionista", async () => {
    const props = renderizarFiltros({ form_: undefined });
    await aguardarCarregamentoInicial();

    expect(
      await screen.findByRole("option", { name: "DRE Butantã" }),
    ).toHaveValue(UUID_DRE);
    expect(await screen.findByText("ANA SILVA")).toBeInTheDocument();
    expect(screen.getByTestId("opcoes-nome_nutricionista")).toHaveTextContent(
      "JOÃO SOUZA",
    );
    expect(props.setForm).toHaveBeenCalled();
    expect(
      screen.getByRole("textbox", { name: "Filtrar por Unidade Educacional" }),
    ).toBeDisabled();
  });

  it("oculta o campo de nutricionista para o perfil de supervisão", async () => {
    renderizarFiltros({ perfilNutriSupervisao: true });
    await aguardarCarregamentoInicial();

    expect(
      screen.queryByRole("textbox", { name: "Filtrar por Nutricionista" }),
    ).not.toBeInTheDocument();
  });

  it("carrega as escolas da DRE e limpa as opções ao remover a seleção", async () => {
    renderizarFiltros();
    await aguardarCarregamentoInicial();

    await selecionarDiretoriaRegional();

    expect(mockGetEscolasTercTotal).toHaveBeenCalledWith({ dre: UUID_DRE });
    expect(await screen.findByText("123456 - EMEF Teste")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: "Filtrar por Unidade Educacional",
      }),
    ).toBeEnabled();

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Diretoria Regional de Educação",
      }),
      { target: { value: "" } },
    );

    expect(screen.queryByText("123456 - EMEF Teste")).not.toBeInTheDocument();
    expect(mockGetEscolasTercTotal).toHaveBeenCalledTimes(1);
  });

  it("bloqueia os filtros enquanto carrega as escolas", async () => {
    let resolver;
    const requisicao = new Promise((resolve) => {
      resolver = resolve;
    });
    mockGetEscolasTercTotal.mockReturnValue(requisicao);
    renderizarFiltros();
    await aguardarCarregamentoInicial();

    await selecionarDiretoriaRegional();

    expect(screen.getByRole("button", { name: "Filtrar" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Limpar Filtros" }),
    ).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Carregando...");

    await act(async () => {
      resolver({ status: HTTP_STATUS.OK, data: escolas });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Filtrar" })).toBeEnabled();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("mantém as escolas vazias quando a consulta não retorna sucesso", async () => {
    mockGetEscolasTercTotal.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: escolas,
    });
    renderizarFiltros();
    await aguardarCarregamentoInicial();

    await selecionarDiretoriaRegional();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Filtrar" })).toBeEnabled();
    });
    expect(screen.queryByText("123456 - EMEF Teste")).not.toBeInTheDocument();
  });

  it("transforma os valores selecionados e preserva o status ao filtrar", async () => {
    const props = renderizarFiltros();
    await aguardarCarregamentoInicial();
    await selecionarDiretoriaRegional();
    await screen.findByText("123456 - EMEF Teste");

    fireEvent.change(
      screen.getByRole("textbox", {
        name: "Filtrar por Unidade Educacional",
      }),
      { target: { value: "123456 - EMEF Teste" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Filtrar por Nutricionista" }),
      { target: { value: "ANA SILVA" } },
    );
    fireEvent.change(screen.getByRole("textbox", { name: "DE" }), {
      target: { value: "01/09/2026" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "ATÉ" }), {
      target: { value: "10/09/2026" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    const filtrosEsperados = {
      diretoria_regional: UUID_DRE,
      unidade_educacional: UUID_ESCOLA,
      nome_nutricionista: "Ana Silva",
      data_inicial: "01/09/2026",
      data_final: "10/09/2026",
      status: "FINALIZADO",
    };
    await waitFor(() => {
      expect(props.setFiltros).toHaveBeenCalledWith(filtrosEsperados);
      expect(props.buscarResultados).toHaveBeenCalledWith(filtrosEsperados, 1);
    });
  });

  it("envia valores vazios quando os textos não correspondem às opções", async () => {
    const props = renderizarFiltros({ filtros: {} });
    await aguardarCarregamentoInicial();

    fireEvent.change(
      screen.getByRole("textbox", { name: "Filtrar por Nutricionista" }),
      { target: { value: "Nutricionista inexistente" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(props.setFiltros).toHaveBeenCalledWith({
        diretoria_regional: "",
        unidade_educacional: "",
        nome_nutricionista: "",
        data_inicial: "",
        data_final: "",
      });
    });
  });

  it("limpa os resultados e preserva somente o status", async () => {
    const props = renderizarFiltros();
    await aguardarCarregamentoInicial();

    fireEvent.click(screen.getByRole("button", { name: "Limpar Filtros" }));

    expect(props.setRelatoriosVisita).toHaveBeenCalledWith([]);
    expect(props.setFiltros).toHaveBeenCalledWith({ status: "FINALIZADO" });
    expect(props.setConsultaRealizada).toHaveBeenCalledWith(false);
  });

  it("ajusta os limites das datas informadas", async () => {
    renderizarFiltros();
    await aguardarCarregamentoInicial();

    const dataInicial = screen.getByRole("textbox", { name: "DE" });
    const dataFinal = screen.getByRole("textbox", { name: "ATÉ" });

    expect(dataInicial).toHaveAttribute(
      "data-max-date",
      "2026-09-11T12:00:00.000Z",
    );
    expect(dataFinal).toHaveAttribute("data-min-date", "");

    fireEvent.change(dataFinal, { target: { value: "10/09/2026" } });
    expect(dataInicial).toHaveAttribute(
      "data-max-date",
      new Date(2026, 8, 10).toISOString(),
    );

    fireEvent.change(dataInicial, { target: { value: "01/09/2026" } });
    expect(dataFinal).toHaveAttribute(
      "data-min-date",
      new Date(2026, 8, 1).toISOString(),
    );
  });

  it("não preenche as opções quando as consultas iniciais falham", async () => {
    mockGetDiretoriaregionalSimplissima.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: diretoriasRegionais },
    });
    mockGetListNomesNutricionistas.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: ["Ana Silva"] },
    });
    renderizarFiltros();
    await aguardarCarregamentoInicial();

    expect(
      screen.queryByRole("option", { name: "DRE Butantã" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("opcoes-nome_nutricionista"),
    ).toBeEmptyDOMElement();
  });
});
