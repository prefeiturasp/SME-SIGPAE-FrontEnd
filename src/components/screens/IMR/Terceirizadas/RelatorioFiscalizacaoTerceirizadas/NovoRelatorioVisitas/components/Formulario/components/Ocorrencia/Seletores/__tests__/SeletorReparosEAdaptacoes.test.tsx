import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getReparosEAdaptacoes } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SeletorReparosEAdaptacoes } from "../SeletorReparosEAdaptacoes";

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
  getReparosEAdaptacoes: jest.fn(),
}));

const UUID_EDITAL = "3e8a6924-aa00-4d0d-aadd-73989ac471a2";
const UUID_REPARO = "0d64ee4d-c5c2-4bf2-b7f2-531bb8934d5a";
const UUID_OUTRO_REPARO = "15522aa3-c894-42ec-a311-6f78c4862964";
const UUID_REPARO_ATUALIZADO = "a7717a72-bb3f-42d7-b9eb-fe47e62fb5c8";
const NOME_CAMPO = "reparo_adaptacao";
const TITULO = "Reparo e adaptação";

const escolaSelecionada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: "19eeb479-a31c-4ad6-a692-364216143689",
  value: "123456 - EMEF Teste",
};

const reparosEAdaptacoes = [
  {
    nome: "Reparo na rede elétrica",
    uuid: UUID_REPARO,
  },
  {
    nome: "Adaptação da bancada",
    uuid: UUID_OUTRO_REPARO,
  },
  {
    nome: "Reparo na rede elétrica",
    uuid: UUID_REPARO_ATUALIZADO,
  },
];

const mockGetReparosEAdaptacoes = jest.mocked(getReparosEAdaptacoes);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorReparosEAdaptacoes {...props} />);
  return props;
};

describe("Seletor de reparos e adaptações do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReparosEAdaptacoes.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
  });

  it("não consulta reparos enquanto não houver uma escola selecionada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

    expect(mockGetReparosEAdaptacoes).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", {
        name: "Selecione um Reparo e Adaptação",
      }),
    ).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("consulta pelo edital e apresenta reparos sem nomes duplicados", async () => {
    mockGetReparosEAdaptacoes.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: reparosEAdaptacoes },
    });

    renderizarSeletor();

    expect(
      await screen.findByRole("option", {
        name: "Reparo na rede elétrica",
      }),
    ).toHaveValue(UUID_REPARO_ATUALIZADO);
    expect(
      screen.getByRole("option", { name: "Adaptação da bancada" }),
    ).toHaveValue(UUID_OUTRO_REPARO);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetReparosEAdaptacoes).toHaveBeenCalledWith({
      edital_uuid: UUID_EDITAL,
    });
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    mockGetReparosEAdaptacoes.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: reparosEAdaptacoes },
    });

    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetReparosEAdaptacoes).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", {
        name: "Selecione um Reparo e Adaptação",
      }),
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
