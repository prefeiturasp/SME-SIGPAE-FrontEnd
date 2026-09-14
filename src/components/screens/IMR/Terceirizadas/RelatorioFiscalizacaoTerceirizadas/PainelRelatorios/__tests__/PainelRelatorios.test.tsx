import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import {
  gerarParametrosConsulta,
  usuarioPodeVisualizarRelatorioIMR,
} from "src/helpers/utilities";
import {
  getDashboardPainelGerencialSupervisao,
  getListRelatoriosVisitaSupervisao,
} from "src/services/imr/painelGerencial";
import { PainelRelatorios } from "../index";

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

jest.mock("../components/CardPorStatus", () => {
  const React = require("react");

  return {
    CardPorStatus: ({
      cardStatus,
      setConsultaRealizada,
      setFiltros,
      setPage,
      setRelatoriosVisita,
      setStatusSelecionado,
    }) =>
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () => {
            setPage(1);
            setRelatoriosVisita([]);
            setConsultaRealizada(false);
            setStatusSelecionado(cardStatus.status);
            setFiltros({ status: cardStatus.status });
          },
        },
        cardStatus.label,
      ),
  };
});

jest.mock("../components/Filtros", () => {
  const React = require("react");

  return {
    Filtros: ({ filtros, perfilNutriSupervisao, buscarResultados }) =>
      React.createElement(
        "div",
        {
          "data-testid": "filtros",
          "data-status": filtros.status,
          "data-perfil-nutri": String(perfilNutriSupervisao),
        },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => buscarResultados(filtros, 1).catch(() => undefined),
          },
          "Executar busca",
        ),
      ),
  };
});

jest.mock("../components/Listagem", () => {
  const React = require("react");

  return {
    Listagem: ({
      objetos,
      perfilNutriSupervisao,
      podeVisualizarRelatorio,
      filtros,
      pagina,
      getDashboardPainelGerencialSupervisaoAsync,
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "listagem",
          "data-perfil-nutri": String(perfilNutriSupervisao),
          "data-pode-visualizar": String(podeVisualizarRelatorio),
        },
        objetos.map((objeto) =>
          React.createElement("span", { key: objeto.uuid }, objeto.uuid),
        ),
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () =>
              getDashboardPainelGerencialSupervisaoAsync().catch(
                () => undefined,
              ),
            "data-status": filtros.status,
            "data-pagina": pagina,
          },
          "Atualizar dashboard",
        ),
      ),
  };
});

jest.mock("src/components/Shareable/Paginacao", () => {
  const React = require("react");

  return {
    Paginacao: ({ current, total, onChange }) =>
      React.createElement(
        "div",
        { "data-testid": "paginacao" },
        React.createElement("span", null, `Página ${current} de ${total}`),
        React.createElement(
          "button",
          { type: "button", onClick: () => onChange(2) },
          "Próxima página",
        ),
      ),
  };
});

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn(),
  usuarioPodeVisualizarRelatorioIMR: jest.fn(),
}));

jest.mock("src/services/imr/painelGerencial", () => ({
  getDashboardPainelGerencialSupervisao: jest.fn(),
  getListRelatoriosVisitaSupervisao: jest.fn(),
}));

const UUID_RELATORIO_UM = "91c14677-0bef-4906-bbd6-77b64f6ebde7";
const UUID_RELATORIO_DOIS = "d787deaf-e313-40f4-a1b6-5ecdc44a56bf";

const dashboard = [
  {
    label: "Enviados para CODAE",
    status: "NUTRIMANIFESTACAO_A_VALIDAR",
    total: 2,
  },
  {
    label: "Em preenchimento",
    status: "EM_PREENCHIMENTO",
    total: 1,
  },
];

const relatorios = [
  {
    uuid: UUID_RELATORIO_UM,
    diretoria_regional: "DRE Butantã",
    unidade_educacional: "EMEF Teste",
    data: "10/09/2026",
    status: "Enviado para CODAE",
  },
];

const mockGerarParametrosConsulta = jest.mocked(gerarParametrosConsulta);
const mockUsuarioPodeVisualizarRelatorioIMR = jest.mocked(
  usuarioPodeVisualizarRelatorioIMR,
);
const mockGetDashboardPainelGerencialSupervisao = jest.mocked(
  getDashboardPainelGerencialSupervisao,
);
const mockGetListRelatoriosVisitaSupervisao = jest.mocked(
  getListRelatoriosVisitaSupervisao,
);

const criarPromessaControlada = () => {
  let resolver;
  const promise = new Promise((resolve) => {
    resolver = resolve;
  });

  return { promise, resolver };
};

const selecionarPrimeiroStatus = async () => {
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Enviados pela Supervisão",
    }),
  );
};

describe("Painel de relatórios de fiscalização", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUsuarioPodeVisualizarRelatorioIMR.mockReturnValue(true);
    mockGerarParametrosConsulta.mockImplementation(
      (valores) =>
        new URLSearchParams(
          Object.entries(valores).map(([chave, valor]) => [
            chave,
            String(valor),
          ]),
        ),
    );
    mockGetDashboardPainelGerencialSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: dashboard },
    });
    mockGetListRelatoriosVisitaSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: relatorios, count: 1 },
    });
  });

  it("exibe o carregamento enquanto busca o dashboard", async () => {
    const requisicao = criarPromessaControlada();
    mockGetDashboardPainelGerencialSupervisao.mockReturnValue(
      requisicao.promise,
    );

    render(<PainelRelatorios />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando...");
    expect(screen.queryByText("Em preenchimento")).not.toBeInTheDocument();

    await act(async () => {
      requisicao.resolver({
        status: HTTP_STATUS.OK,
        data: { results: dashboard },
      });
    });

    expect(
      await screen.findByRole("button", { name: "Em preenchimento" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenCalledWith({});
  });

  it("mantém o carregamento quando a consulta do dashboard não retorna sucesso", async () => {
    mockGetDashboardPainelGerencialSupervisao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: dashboard },
    });

    render(<PainelRelatorios />);

    await waitFor(() => {
      expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenCalledTimes(
        1,
      );
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Em preenchimento")).not.toBeInTheDocument();
  });

  it("adapta o card enviado para CODAE para usuários fora da supervisão", async () => {
    render(<PainelRelatorios />);

    expect(
      await screen.findByRole("button", {
        name: "Enviados pela Supervisão",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Em preenchimento" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("filtros")).not.toBeInTheDocument();
  });

  it("mantém o rótulo original para coordenador de supervisão", async () => {
    localStorage.setItem(
      "perfil",
      JSON.stringify("COORDENADOR_SUPERVISAO_NUTRICAO"),
    );

    render(<PainelRelatorios />);

    expect(
      await screen.findByRole("button", { name: "Enviados para CODAE" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enviados pela Supervisão" }),
    ).not.toBeInTheDocument();
  });

  it("exibe os filtros após selecionar um status", async () => {
    render(<PainelRelatorios />);

    await selecionarPrimeiroStatus();

    expect(screen.getByTestId("filtros")).toHaveAttribute(
      "data-status",
      "NUTRIMANIFESTACAO_A_VALIDAR",
    );
    expect(screen.getByTestId("filtros")).toHaveAttribute(
      "data-perfil-nutri",
      "false",
    );
  });

  it("consulta e apresenta os relatórios encontrados", async () => {
    const requisicao = criarPromessaControlada();
    mockGetListRelatoriosVisitaSupervisao.mockReturnValue(requisicao.promise);
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();

    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    expect(mockGerarParametrosConsulta).toHaveBeenCalledWith({
      page: 1,
      status: "NUTRIMANIFESTACAO_A_VALIDAR",
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    await act(async () => {
      requisicao.resolver({
        status: HTTP_STATUS.OK,
        data: { results: relatorios, count: 1 },
      });
    });

    expect(await screen.findByTestId("listagem")).toHaveTextContent(
      UUID_RELATORIO_UM,
    );
    expect(screen.getByTestId("listagem")).toHaveAttribute(
      "data-pode-visualizar",
      "true",
    );
    expect(screen.getByTestId("paginacao")).toHaveTextContent("Página 1 de 1");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("informa quando a consulta não encontra relatórios", async () => {
    mockGetListRelatoriosVisitaSupervisao.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: [], count: 0 },
    });
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();

    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("listagem")).not.toBeInTheDocument();
    expect(screen.queryByTestId("paginacao")).not.toBeInTheDocument();
  });

  it("encerra o carregamento quando a consulta retorna erro", async () => {
    mockGetListRelatoriosVisitaSupervisao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: relatorios, count: 1 },
    });
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();

    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    await waitFor(() => {
      expect(mockGetListRelatoriosVisitaSupervisao).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId("listagem")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum resultado encontrado"),
    ).not.toBeInTheDocument();
  });

  it("encerra o carregamento quando o serviço lança uma exceção", async () => {
    mockGetListRelatoriosVisitaSupervisao.mockRejectedValue(
      new Error("Erro ao consultar relatórios"),
    );
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();

    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    await waitFor(() => {
      expect(mockGetListRelatoriosVisitaSupervisao).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("consulta a página selecionada e atualiza a paginação", async () => {
    mockGetListRelatoriosVisitaSupervisao
      .mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: { results: relatorios, count: 12 },
      })
      .mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: {
          results: [{ ...relatorios[0], uuid: UUID_RELATORIO_DOIS }],
          count: 12,
        },
      });
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByText(UUID_RELATORIO_UM);

    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {
      expect(mockGerarParametrosConsulta).toHaveBeenLastCalledWith({
        page: 2,
        status: "NUTRIMANIFESTACAO_A_VALIDAR",
      });
      expect(screen.getByTestId("listagem")).toHaveTextContent(
        UUID_RELATORIO_DOIS,
      );
      expect(screen.getByTestId("paginacao")).toHaveTextContent(
        "Página 2 de 12",
      );
    });
  });

  it("atualiza o dashboard utilizando os filtros selecionados", async () => {
    render(<PainelRelatorios />);
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByTestId("listagem");

    fireEvent.click(
      screen.getByRole("button", { name: "Atualizar dashboard" }),
    );

    await waitFor(() => {
      expect(
        mockGetDashboardPainelGerencialSupervisao,
      ).toHaveBeenLastCalledWith({ status: "NUTRIMANIFESTACAO_A_VALIDAR" });
    });
  });
});
