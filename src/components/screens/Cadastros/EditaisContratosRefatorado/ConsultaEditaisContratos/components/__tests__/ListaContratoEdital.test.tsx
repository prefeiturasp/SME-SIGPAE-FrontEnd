import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { LinhaEditalContrato } from "../ListaContratoEdital";

const mockNavigate = jest.fn();
const mockDeepCopy = jest.fn();
const mockBotao = jest.fn();
const mockToggleExpandir = jest.fn();
const mockTooltip = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: (props: any) => mockBotao(props),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_ICON: {
    EDIT: "edit",
  },
  BUTTON_STYLE: {
    GREEN_OUTLINE: "green-outline",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
  },
}));

jest.mock("src/components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: (props: any) => mockToggleExpandir(props),
}));

jest.mock("antd", () => ({
  Tooltip: (props: any) => mockTooltip(props),
}));

jest.mock("src/helpers/utilities", () => ({
  deepCopy: (value: any) => mockDeepCopy(value),
}));

const EDITAL_UUID = "11111111-1111-4111-8111-111111111111";
const CONTRATO_UUID = "22222222-2222-4222-8222-222222222222";
const VIGENCIA_UUID = "33333333-3333-4333-8333-333333333333";

const criarContrato = (status = "ativo") => ({
  uuid: CONTRATO_UUID,
  numero: "CONTRATO-001",
  vigencias: [
    {
      uuid: VIGENCIA_UUID,
      data_inicial: "01/01/2026",
      data_final: "31/12/2026",
      status,
    },
  ],
});

const criarEditalContrato = (sobrescritas: Record<string, any> = {}) => ({
  uuid: EDITAL_UUID,
  tipo_contratacao: "PREGÃO ELETRÔNICO",
  numero: "EDITAL-001",
  processo: "PROCESSO-001",
  ativo: false,
  contratos: [criarContrato()],
  ...sobrescritas,
});

const renderizarComponente = ({
  editalContrato = criarEditalContrato(),
  editaisContratos = [editalContrato],
  index = 0,
}: {
  editalContrato?: any;
  editaisContratos?: any[];
  index?: number;
} = {}) => {
  const setEditaisContratos = jest.fn();

  render(
    <LinhaEditalContrato
      editalContrato={editalContrato}
      setEditaisContratos={setEditaisContratos}
      editaisContratos={editaisContratos}
      index={index}
    />,
  );

  return {
    editalContrato,
    editaisContratos,
    setEditaisContratos,
  };
};

describe("LinhaEditalContrato", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockDeepCopy.mockImplementation((value) =>
      JSON.parse(JSON.stringify(value)),
    );

    mockToggleExpandir.mockImplementation(({ onClick, ativo, className }) => (
      <button
        type="button"
        aria-label="Expandir edital"
        data-ativo={String(ativo)}
        className={className}
        onClick={onClick}
      >
        Expandir
      </button>
    ));

    mockBotao.mockImplementation(
      ({ onClick, tooltipExterno, icon, style, type }) => (
        <button
          type={type || "button"}
          aria-label={tooltipExterno}
          data-icon={icon}
          data-style={style}
          onClick={onClick}
        >
          {tooltipExterno}
        </button>
      ),
    );

    mockTooltip.mockImplementation(({ title, children }) => (
      <div role="tooltip" aria-label={title}>
        {children}
      </div>
    ));
  });

  it("prioriza o status vencido quando existem contratos com status diferentes", () => {
    const contratoProximoAoVencimento = criarContrato("proximo_ao_vencimento");

    const contratoVencido = {
      ...criarContrato("vencido"),
      uuid: "44444444-4444-4444-8444-444444444444",
      numero: "CONTRATO-002",
    };

    const editalContrato = criarEditalContrato({
      contratos: [contratoProximoAoVencimento, contratoVencido],
    });

    renderizarComponente({
      editalContrato,
    });

    expect(
      screen.getByRole("tooltip", {
        name: /vigência do contrato expirada/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("tooltip", {
        name: /próxima ao vencimento/i,
      }),
    ).not.toBeInTheDocument();

    const linha = screen.getByText("EDITAL-001").closest(".row");

    expect(linha).toHaveClass("vencido");
  });

  it("altera apenas o edital correspondente ao índice informado", () => {
    const primeiroEdital = criarEditalContrato({
      uuid: EDITAL_UUID,
      numero: "EDITAL-001",
      ativo: false,
    });

    const segundoEdital = criarEditalContrato({
      uuid: "55555555-5555-4555-8555-555555555555",
      numero: "EDITAL-002",
      ativo: false,
    });

    const editaisContratos = [primeiroEdital, segundoEdital];

    const { setEditaisContratos } = renderizarComponente({
      editalContrato: segundoEdital,
      editaisContratos,
      index: 1,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expandir edital",
      }),
    );

    expect(setEditaisContratos).toHaveBeenCalledWith([
      expect.objectContaining({
        numero: "EDITAL-001",
        ativo: false,
      }),
      expect.objectContaining({
        numero: "EDITAL-002",
        ativo: true,
      }),
    ]);
  });

  it("navega para a edição do edital selecionado", () => {
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Editar",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/configuracoes/cadastros/editais-contratos/editar",
      {
        state: {
          uuid: EDITAL_UUID,
        },
      },
    );
  });
});
