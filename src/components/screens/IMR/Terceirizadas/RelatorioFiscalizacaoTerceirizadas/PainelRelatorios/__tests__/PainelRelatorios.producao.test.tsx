import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import {
  getDashboardPainelGerencialSupervisao,
  getListRelatoriosVisitaSupervisao,
} from "src/services/imr/painelGerencial";
import { FiltrosIniciais } from "../components/FiltrosIniciais";
import { PainelRelatorios } from "../index";

jest.mock("src/constants/config", () => ({
  ENVIRONMENT: "production",
}));

jest.mock("antd", () => ({
  Spin: ({ children }) => children,
}));

jest.mock("../components/FiltrosIniciais", () => ({
  FiltrosIniciais: jest.fn(() => null),
}));

jest.mock("../components/Filtros", () => {
  const React = require("react");

  return {
    Filtros: ({ filtros, buscarResultados }) =>
      React.createElement(
        "button",
        { type: "button", onClick: () => buscarResultados(filtros, 1) },
        "Executar busca",
      ),
  };
});

jest.mock("../components/Listagem", () => {
  const React = require("react");

  return {
    Listagem: ({ objetos, exibirNovoPainel }) =>
      React.createElement(
        "div",
        {
          "data-testid": "listagem",
          "data-novo-painel": String(exibirNovoPainel),
        },
        objetos.map((objeto) =>
          React.createElement("span", { key: objeto.uuid }, objeto.uuid),
        ),
      ),
  };
});

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: () => null,
}));

jest.mock("../components/CardPorStatus", () => {
  const React = require("react");

  return {
    CardPorStatus: ({
      cardStatus,
      exibirNovoPainel,
      setStatusSelecionado,
      setFiltros,
    }) =>
      React.createElement(
        "button",
        {
          type: "button",
          "data-novo-painel": String(exibirNovoPainel),
          onClick: () => {
            setStatusSelecionado(cardStatus.status);
            setFiltros({
              status:
                cardStatus.status === "TODOS_OS_RELATORIOS"
                  ? ""
                  : cardStatus.status,
            });
          },
        },
        cardStatus.label,
      ),
  };
});

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn(
    (parametros) => new URLSearchParams(parametros),
  ),
  usuarioPodeVisualizarRelatorioIMR: jest.fn(() => true),
}));

jest.mock("src/services/imr/painelGerencial", () => ({
  getDashboardPainelGerencialSupervisao: jest.fn(),
  getListRelatoriosVisitaSupervisao: jest.fn(),
}));

describe("Painel de relatórios em produção", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("consulta o painel anterior ao abrir sem apresentar os filtros iniciais novos", async () => {
    jest.mocked(getDashboardPainelGerencialSupervisao).mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: [
          { status: "EM_PREENCHIMENTO", label: "Em Preenchimento", total: 2 },
          {
            status: "NUTRIMANIFESTACAO_A_VALIDAR",
            label: "Enviado para CODAE",
            total: 2,
          },
          {
            status: "COM_COMENTARIOS_DE_CODAE",
            label: "Com comentários de CODAE",
            total: 2,
          },
          {
            status: "VALIDADO_POR_CODAE",
            label: "Validado pela CODAE",
            total: 2,
          },
          { status: "APROVADO", label: "Aprovados", total: 2 },
          {
            status: "TODOS_OS_RELATORIOS",
            label: "Todos os Relatórios",
            total: 10,
          },
        ],
      },
    });

    render(<PainelRelatorios />);

    expect(await screen.findByText("Todos os Relatórios")).toBeInTheDocument();
    for (const card of screen.getAllByRole("button")) {
      expect(card).toHaveAttribute("data-novo-painel", "false");
    }
    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(screen.getByText("Enviados pela Supervisão")).toBeInTheDocument();
    expect(FiltrosIniciais).not.toHaveBeenCalled();
    expect(getDashboardPainelGerencialSupervisao).toHaveBeenCalledTimes(1);
    expect(getDashboardPainelGerencialSupervisao).toHaveBeenCalledWith({});
  });

  it("passa a feature flag desativada para a listagem em produção", async () => {
    const uuidRelatorio = "91c14677-0bef-4906-bbd6-77b64f6ebde7";
    jest.mocked(getDashboardPainelGerencialSupervisao).mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        results: [
          {
            status: "NUTRIMANIFESTACAO_A_VALIDAR",
            label: "Enviado para CODAE",
            total: 1,
          },
        ],
      },
    });
    jest.mocked(getListRelatoriosVisitaSupervisao).mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            uuid: uuidRelatorio,
            diretoria_regional: "DRE Butantã",
            unidade_educacional: "EMEI ALUISIO DE ALMEIDA",
            codigo_eol: "000054",
            tipo_unidade: "EMEI",
            data: "02/09/2026",
            status: "Enviado para CODAE",
          },
        ],
      },
    });

    render(<PainelRelatorios />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Enviados pela Supervisão" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    const listagem = await screen.findByTestId("listagem");

    expect(listagem).toHaveAttribute("data-novo-painel", "false");
    expect(listagem).toHaveTextContent(uuidRelatorio);
  });
});
