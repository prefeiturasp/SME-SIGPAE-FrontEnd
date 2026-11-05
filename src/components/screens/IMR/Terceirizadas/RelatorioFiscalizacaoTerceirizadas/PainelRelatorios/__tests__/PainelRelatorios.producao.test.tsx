import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import { getDashboardPainelGerencialSupervisao } from "src/services/imr/painelGerencial";
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

jest.mock("../components/Filtros", () => ({
  Filtros: () => null,
}));

jest.mock("../components/Listagem", () => ({
  Listagem: () => null,
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: () => null,
}));

jest.mock("../components/CardPorStatus", () => {
  const React = require("react");

  return {
    CardPorStatus: ({ cardStatus }) =>
      React.createElement("div", null, cardStatus.label),
  };
});

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn(),
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
    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(screen.getByText("Enviados pela Supervisão")).toBeInTheDocument();
    expect(FiltrosIniciais).not.toHaveBeenCalled();
    expect(getDashboardPainelGerencialSupervisao).toHaveBeenCalledTimes(1);
    expect(getDashboardPainelGerencialSupervisao).toHaveBeenCalledWith({});
  });
});
