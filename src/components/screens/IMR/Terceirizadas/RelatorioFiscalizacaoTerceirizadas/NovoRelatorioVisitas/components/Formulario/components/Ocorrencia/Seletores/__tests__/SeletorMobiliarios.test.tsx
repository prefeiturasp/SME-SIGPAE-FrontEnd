import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getMobiliarios } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SeletorMobiliarios } from "../SeletorMobiliarios";

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
  getMobiliarios: jest.fn(),
}));

const UUID_EDITAL = "3e8a6924-aa00-4d0d-aadd-73989ac471a2";
const UUID_MOBILIARIO = "8ab6a998-41db-4cb5-97d2-864110286dda";
const UUID_OUTRO_MOBILIARIO = "67959ec0-7d85-4ff2-8d13-fe30705eb83d";
const UUID_MOBILIARIO_ATUALIZADO = "d90dfa56-a799-4a45-ad61-878919d00bde";
const NOME_CAMPO = "mobiliario_utilizado";
const TITULO = "Mobiliário";

const escolaSelecionada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: "19eeb479-a31c-4ad6-a692-364216143689",
  value: "123456 - EMEF Teste",
};

const mobiliarios = [
  {
    nome: "Mesa de apoio",
    uuid: UUID_MOBILIARIO,
  },
  {
    nome: "Armário de cozinha",
    uuid: UUID_OUTRO_MOBILIARIO,
  },
  {
    nome: "Mesa de apoio",
    uuid: UUID_MOBILIARIO_ATUALIZADO,
  },
];

const mockGetMobiliarios = jest.mocked(getMobiliarios);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorMobiliarios {...props} />);
  return props;
};

describe("Seletor de mobiliários do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMobiliarios.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
  });

  it("não consulta mobiliários enquanto não houver uma escola selecionada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

    expect(mockGetMobiliarios).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", { name: "Selecione um Mobiliário" }),
    ).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("consulta pelo edital e apresenta mobiliários sem nomes duplicados", async () => {
    mockGetMobiliarios.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: mobiliarios },
    });

    renderizarSeletor();

    expect(
      await screen.findByRole("option", { name: "Mesa de apoio" }),
    ).toHaveValue(UUID_MOBILIARIO_ATUALIZADO);
    expect(
      screen.getByRole("option", { name: "Armário de cozinha" }),
    ).toHaveValue(UUID_OUTRO_MOBILIARIO);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetMobiliarios).toHaveBeenCalledWith({
      edital_uuid: UUID_EDITAL,
    });
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    mockGetMobiliarios.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: mobiliarios },
    });

    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetMobiliarios).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: "Selecione um Mobiliário" }),
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
