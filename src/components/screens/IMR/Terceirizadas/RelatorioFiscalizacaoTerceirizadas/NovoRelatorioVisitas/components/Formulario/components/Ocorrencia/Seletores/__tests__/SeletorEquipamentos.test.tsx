import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getEquipamentos } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SeletorEquipamentos } from "../SeletorEquipamentos";

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
  getEquipamentos: jest.fn(),
}));

const UUID_EDITAL = "3e8a6924-aa00-4d0d-aadd-73989ac471a2";
const UUID_EQUIPAMENTO = "47f410d0-e75f-43d7-9c79-3877d7dc5fb4";
const UUID_OUTRO_EQUIPAMENTO = "81df25df-8235-4d17-9dcc-718922b53f77";
const UUID_EQUIPAMENTO_ATUALIZADO = "75b3d4e2-75e8-4c9f-965d-44c514dc7385";
const NOME_CAMPO = "equipamento_utilizado";
const TITULO = "Equipamento";

const escolaSelecionada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: "19eeb479-a31c-4ad6-a692-364216143689",
  value: "123456 - EMEF Teste",
};

const equipamentos = [
  {
    nome: "Forno combinado",
    uuid: UUID_EQUIPAMENTO,
  },
  {
    nome: "Liquidificador industrial",
    uuid: UUID_OUTRO_EQUIPAMENTO,
  },
  {
    nome: "Forno combinado",
    uuid: UUID_EQUIPAMENTO_ATUALIZADO,
  },
];

const mockGetEquipamentos = jest.mocked(getEquipamentos);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorEquipamentos {...props} />);
  return props;
};

describe("Seletor de equipamentos do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEquipamentos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
  });

  it("não consulta equipamentos enquanto não houver uma escola selecionada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

    expect(mockGetEquipamentos).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", { name: "Selecione um Equipamento" }),
    ).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("consulta pelo edital e apresenta equipamentos sem nomes duplicados", async () => {
    mockGetEquipamentos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: equipamentos },
    });

    renderizarSeletor();

    expect(
      await screen.findByRole("option", { name: "Forno combinado" }),
    ).toHaveValue(UUID_EQUIPAMENTO_ATUALIZADO);
    expect(
      screen.getByRole("option", { name: "Liquidificador industrial" }),
    ).toHaveValue(UUID_OUTRO_EQUIPAMENTO);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetEquipamentos).toHaveBeenCalledWith({
      edital_uuid: UUID_EDITAL,
    });
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    mockGetEquipamentos.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: equipamentos },
    });

    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetEquipamentos).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", { name: "Selecione um Equipamento" }),
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
