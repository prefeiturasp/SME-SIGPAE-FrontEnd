import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { SeletorTipoAlimentacao } from "../SeletorTipoAlimentacao";

const mockComponenteSelect = jest.fn();

jest.mock("react-final-form", () => {
  const React = require("react");

  return {
    Field: ({ component, ...props }) => React.createElement(component, props),
  };
});

jest.mock("src/components/Shareable/Select", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: (props) => {
      mockComponenteSelect(props);

      return React.createElement(
        "label",
        null,
        props.label,
        React.createElement(
          "select",
          {
            "aria-label": props.label,
            className: props.className,
            disabled: props.disabled,
            name: props.name,
          },
          props.options.map((opcao) =>
            React.createElement(
              "option",
              { key: opcao.uuid, value: opcao.uuid },
              opcao.nome,
            ),
          ),
        ),
      );
    },
  };
});

jest.mock("src/services/cadastroTipoAlimentacao.service", () => ({
  getVinculosTipoAlimentacaoPorEscola: jest.fn(),
}));

const UUID_ESCOLA = "19eeb479-a31c-4ad6-a692-364216143689";
const UUID_LANCHE = "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5";
const UUID_ALMOCO = "7990ca99-55b7-4fc7-b5cc-8a51b23d0102";
const UUID_LANCHE_ATUALIZADO = "8275c481-e3ea-4b42-8320-8de5e1c03a6e";
const NOME_CAMPO = "tipo_alimentacao";
const TITULO = "Tipo de alimentação";

const escolaSelecionada = {
  edital: "3e8a6924-aa00-4d0d-aadd-73989ac471a2",
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: UUID_ESCOLA,
  value: "123456 - EMEF Teste",
};

const vinculosTiposAlimentacao = [
  {
    uuid: "058d71fc-d5a1-42fa-a826-754b1fc47137",
    tipos_alimentacao: [
      { nome: "Lanche", uuid: UUID_LANCHE },
      { nome: "Almoço", uuid: UUID_ALMOCO },
    ],
  },
  {
    uuid: "47741560-1909-4d52-8bb6-64179bbec04b",
    tipos_alimentacao: [],
  },
  {
    uuid: "45d0f366-5016-4725-b19c-65e898cc77cf",
    tipos_alimentacao: [{ nome: "Lanche", uuid: UUID_LANCHE_ATUALIZADO }],
  },
];

const mockGetVinculosTipoAlimentacaoPorEscola = jest.mocked(
  getVinculosTipoAlimentacaoPorEscola,
);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorTipoAlimentacao {...props} />);
  return props;
};

describe("Seletor de tipo de alimentação do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: [] },
    });
  });

  it("consulta pela escola e consolida os tipos de alimentação", async () => {
    mockGetVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: vinculosTiposAlimentacao },
    });

    renderizarSeletor();

    expect(await screen.findByRole("option", { name: "Lanche" })).toHaveValue(
      UUID_LANCHE_ATUALIZADO,
    );
    expect(screen.getByRole("option", { name: "Almoço" })).toHaveValue(
      UUID_ALMOCO,
    );
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetVinculosTipoAlimentacaoPorEscola).toHaveBeenCalledWith(
      UUID_ESCOLA,
    );
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetVinculosTipoAlimentacaoPorEscola).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", {
        name: "Selecione um Tipo de Alimentação",
      }),
    ).toHaveValue("");
  });

  it("configura o campo obrigatório e mantém a primeira opção habilitada", () => {
    renderizarSeletor();

    const propriedades = mockComponenteSelect.mock.calls[0][0];

    expect(propriedades).toEqual(
      expect.objectContaining({
        className: "seletor-imr",
        disabled: false,
        label: TITULO,
        name: NOME_CAMPO,
        naoDesabilitarPrimeiraOpcao: true,
        required: true,
        validate: required,
      }),
    );
    expect(screen.getByRole("combobox", { name: TITULO })).toBeEnabled();
  });

  it("desabilita o seletor no modo somente leitura", () => {
    renderizarSeletor({ somenteLeitura: true });

    expect(screen.getByRole("combobox", { name: TITULO })).toBeDisabled();
    expect(mockComponenteSelect.mock.calls[0][0]).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
