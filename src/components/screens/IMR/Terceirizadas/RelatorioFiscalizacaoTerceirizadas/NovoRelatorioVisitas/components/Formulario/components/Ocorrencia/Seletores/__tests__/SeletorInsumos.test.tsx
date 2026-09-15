import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getInsumos } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SeletorInsumos } from "../SeletorInsumos";

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

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  getInsumos: jest.fn(),
}));

const UUID_EDITAL = "3e8a6924-aa00-4d0d-aadd-73989ac471a2";
const UUID_INSUMO = "f112f908-705c-44b1-802b-232452e41894";
const UUID_OUTRO_INSUMO = "e13a641f-a7e5-4c62-885f-0bce67bc4d04";
const UUID_INSUMO_ATUALIZADO = "84daf4ee-26d5-40d0-8d85-0a992e09bb46";
const NOME_CAMPO = "insumo_utilizado";
const TITULO = "Insumo";

const escolaSelecionada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: "19eeb479-a31c-4ad6-a692-364216143689",
  value: "123456 - EMEF Teste",
};

const insumos = [
  {
    nome: "Detergente neutro",
    uuid: UUID_INSUMO,
  },
  {
    nome: "Álcool sanitizante",
    uuid: UUID_OUTRO_INSUMO,
  },
  {
    nome: "Detergente neutro",
    uuid: UUID_INSUMO_ATUALIZADO,
  },
];

const mockGetInsumos = jest.mocked(getInsumos);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorInsumos {...props} />);
  return props;
};

describe("Seletor de insumos do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInsumos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
  });

  it("não consulta insumos enquanto não houver uma escola selecionada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

    expect(mockGetInsumos).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", { name: "Selecione um Insumo" }),
    ).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("consulta pelo edital e apresenta insumos sem nomes duplicados", async () => {
    mockGetInsumos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: insumos },
    });

    renderizarSeletor();

    expect(
      await screen.findByRole("option", { name: "Detergente neutro" }),
    ).toHaveValue(UUID_INSUMO_ATUALIZADO);
    expect(
      screen.getByRole("option", { name: "Álcool sanitizante" }),
    ).toHaveValue(UUID_OUTRO_INSUMO);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetInsumos).toHaveBeenCalledWith({
      edital_uuid: UUID_EDITAL,
    });
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    mockGetInsumos.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: insumos },
    });

    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetInsumos).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: "Selecione um Insumo" }),
    ).toBeInTheDocument();
  });

  it("configura o campo obrigatório e mantém a primeira opção habilitada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

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
    renderizarSeletor({
      escolaSelecionada: undefined,
      somenteLeitura: true,
    });

    expect(screen.getByRole("combobox", { name: TITULO })).toBeDisabled();
    expect(mockComponenteSelect.mock.calls[0][0]).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
