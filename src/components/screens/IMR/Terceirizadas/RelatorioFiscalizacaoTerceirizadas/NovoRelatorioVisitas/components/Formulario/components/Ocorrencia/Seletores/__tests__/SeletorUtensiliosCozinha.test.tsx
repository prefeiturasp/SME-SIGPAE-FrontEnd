import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { required } from "src/helpers/fieldValidators";
import { getUtensiliosCozinha } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { SeletorUtensiliosCozinha } from "../SeletorUtensiliosCozinha";

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
  getUtensiliosCozinha: jest.fn(),
}));

const UUID_EDITAL = "3e8a6924-aa00-4d0d-aadd-73989ac471a2";
const UUID_UTENSILIO = "1c1af3a4-8c39-40ae-9373-00e52652b5b1";
const UUID_OUTRO_UTENSILIO = "06112274-d11e-43a7-807b-457388b6752b";
const UUID_UTENSILIO_ATUALIZADO = "eb60f428-d942-4435-b02f-338561db3aef";
const NOME_CAMPO = "utensilio_cozinha";
const TITULO = "Utensílio de cozinha";

const escolaSelecionada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada Teste",
  uuid: "19eeb479-a31c-4ad6-a692-364216143689",
  value: "123456 - EMEF Teste",
};

const utensiliosCozinha = [
  {
    nome: "Panela de pressão",
    uuid: UUID_UTENSILIO,
  },
  {
    nome: "Assadeira de alumínio",
    uuid: UUID_OUTRO_UTENSILIO,
  },
  {
    nome: "Panela de pressão",
    uuid: UUID_UTENSILIO_ATUALIZADO,
  },
];

const mockGetUtensiliosCozinha = jest.mocked(getUtensiliosCozinha);

const criarProps = (sobrescritas = {}) => ({
  titulo: TITULO,
  name: NOME_CAMPO,
  escolaSelecionada,
  somenteLeitura: false,
  ...sobrescritas,
});

const renderizarSeletor = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);
  render(<SeletorUtensiliosCozinha {...props} />);
  return props;
};

describe("Seletor de utensílios de cozinha do relatório de visitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUtensiliosCozinha.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [] },
    });
  });

  it("não consulta utensílios enquanto não houver uma escola selecionada", () => {
    renderizarSeletor({ escolaSelecionada: undefined });

    expect(mockGetUtensiliosCozinha).not.toHaveBeenCalled();
    expect(
      screen.getByRole("option", {
        name: "Selecione um Utensílio de Cozinha",
      }),
    ).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("consulta pelo edital e apresenta utensílios sem nomes duplicados", async () => {
    mockGetUtensiliosCozinha.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: utensiliosCozinha },
    });

    renderizarSeletor();

    expect(
      await screen.findByRole("option", { name: "Panela de pressão" }),
    ).toHaveValue(UUID_UTENSILIO_ATUALIZADO);
    expect(
      screen.getByRole("option", { name: "Assadeira de alumínio" }),
    ).toHaveValue(UUID_OUTRO_UTENSILIO);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(mockGetUtensiliosCozinha).toHaveBeenCalledWith({
      edital_uuid: UUID_EDITAL,
    });
  });

  it("mantém somente o placeholder quando a consulta não retorna sucesso", async () => {
    mockGetUtensiliosCozinha.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: utensiliosCozinha },
    });

    renderizarSeletor();

    await waitFor(() => {
      expect(mockGetUtensiliosCozinha).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(
      screen.getByRole("option", {
        name: "Selecione um Utensílio de Cozinha",
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
