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

jest.mock("src/constants/config", () => ({
  ENVIRONMENT: "development",
}));

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
      exibirNovoPainel,
      filtrosIniciais,
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
          "data-testid": `card-${cardStatus.status}`,
          "data-novo-painel": String(exibirNovoPainel),
          "data-total": String(cardStatus.total),
          disabled: !cardStatus.total,
          onClick: () => {
            setPage(1);
            setRelatoriosVisita([]);
            setConsultaRealizada(false);
            setStatusSelecionado(cardStatus.status);
            setFiltros({ ...filtrosIniciais, status: cardStatus.status });
          },
        },
        cardStatus.label,
      ),
  };
});

jest.mock("../components/FiltrosIniciais", () => {
  const React = require("react");

  return {
    FiltrosIniciais: ({ filtros, aoAlterarFiltros }) =>
      React.createElement(
        "div",
        { "data-testid": "filtros-iniciais" },
        [
          { texto: "Selecionar DRE e mês", parametros: mockFiltrosIniciais },
          {
            texto: "Selecionar apenas DRE",
            parametros: {
              diretoria_regional: mockFiltrosIniciais.diretoria_regional,
            },
          },
          {
            texto: "Selecionar apenas mês",
            parametros: {
              mes: mockFiltrosIniciais.mes,
              ano: mockFiltrosIniciais.ano,
            },
          },
          {
            texto: "Alterar DRE",
            parametros: { ...filtros, diretoria_regional: mockOutraDre },
          },
          { texto: "Alterar mês", parametros: { ...filtros, mes: 8 } },
          {
            texto: "Limpar mês",
            parametros: { diretoria_regional: filtros.diretoria_regional },
          },
        ].map(({ texto, parametros }) =>
          React.createElement(
            "button",
            {
              key: texto,
              type: "button",
              onClick: () => aoAlterarFiltros({ ...parametros }),
            },
            texto,
          ),
        ),
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
      exibirNovoPainel,
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
          "data-novo-painel": String(exibirNovoPainel),
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
const mockOutraDre = "9db1e5d8-dba3-4245-b937-a94c4ea44411";

const mockFiltrosIniciais = {
  diretoria_regional: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
  mes: 9,
  ano: 2026,
};

const dashboard = [
  {
    label: "Em preenchimento pela Supervisão",
    status: "EM_PREENCHIMENTO",
    total: 1,
  },
  {
    label: "Enviados para CODAE",
    status: "NUTRIMANIFESTACAO_A_VALIDAR",
    total: 2,
  },
  {
    label: "Devolvidos com comentários",
    status: "COM_COMENTARIOS_DE_CODAE",
    total: 1,
  },
  {
    label: "Corrigidos pela Supervisão",
    status: "CORRIGIDO_PELA_SUPERVISAO",
    total: 0,
  },
  {
    label: "Validados pela CODAE",
    status: "VALIDADO_POR_CODAE",
    total: 3,
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

const renderizarPainel = () => {
  render(<PainelRelatorios />);
  fireEvent.click(screen.getByRole("button", { name: "Selecionar DRE e mês" }));
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
    jest.resetAllMocks();
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

  it("aguarda selecionar os filtros iniciais para consultar o dashboard", () => {
    render(<PainelRelatorios />);

    expect(
      screen.getByRole("button", { name: "Selecionar DRE e mês" }),
    ).toBeInTheDocument();
    expect(mockGetDashboardPainelGerencialSupervisao).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("filtros")).not.toBeInTheDocument();
  });

  it.each(["Selecionar apenas DRE", "Selecionar apenas mês"])(
    "não consulta os cards ao %s",
    (acao) => {
      render(<PainelRelatorios />);

      fireEvent.click(screen.getByRole("button", { name: acao }));

      expect(mockGetDashboardPainelGerencialSupervisao).not.toHaveBeenCalled();
      expect(screen.queryAllByTestId(/^card-/)).toHaveLength(0);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    },
  );

  it("apresenta os cinco cards retornados e orienta a seleção do status", async () => {
    renderizarPainel();

    await screen.findByRole("button", { name: "Validados pela CODAE" });

    expect(
      screen.getAllByTestId(/^card-/).map((card) => card.dataset.testid),
    ).toEqual([
      "card-EM_PREENCHIMENTO",
      "card-NUTRIMANIFESTACAO_A_VALIDAR",
      "card-COM_COMENTARIOS_DE_CODAE",
      "card-CORRIGIDO_PELA_SUPERVISAO",
      "card-VALIDADO_POR_CODAE",
    ]);
    for (const card of screen.getAllByTestId(/^card-/)) {
      expect(card).toHaveAttribute("data-novo-painel", "true");
    }
    expect(screen.getByTestId("card-VALIDADO_POR_CODAE")).toHaveAttribute(
      "data-total",
      "3",
    );
    expect(
      screen.getByText(
        /Selecione um dos status acima para visualizar a listagem de relatórios/,
      ),
    ).toBeInTheDocument();

    await selecionarPrimeiroStatus();

    expect(
      screen.queryByText(
        /Selecione um dos status acima para visualizar a listagem de relatórios/,
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("filtros")).toBeInTheDocument();
  });

  it("exibe o carregamento enquanto busca o dashboard", async () => {
    const requisicao = criarPromessaControlada();
    mockGetDashboardPainelGerencialSupervisao.mockReturnValue(
      requisicao.promise,
    );

    renderizarPainel();

    expect(screen.getByRole("status")).toHaveTextContent("Carregando...");
    expect(
      screen.queryByText("Em preenchimento pela Supervisão"),
    ).not.toBeInTheDocument();

    await act(async () => {
      requisicao.resolver({
        status: HTTP_STATUS.OK,
        data: { results: dashboard },
      });
    });

    expect(
      await screen.findByRole("button", {
        name: "Em preenchimento pela Supervisão",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenCalledWith(
      mockFiltrosIniciais,
    );
  });

  it("encerra o carregamento quando a consulta do dashboard não retorna sucesso", async () => {
    mockGetDashboardPainelGerencialSupervisao.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { results: dashboard },
    });

    renderizarPainel();

    await waitFor(() => {
      expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenCalledTimes(
        1,
      );
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText("Em preenchimento pela Supervisão"),
    ).not.toBeInTheDocument();
  });

  it("adapta o card enviado para CODAE para usuários fora da supervisão", async () => {
    renderizarPainel();

    expect(
      await screen.findByRole("button", {
        name: "Enviados pela Supervisão",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Em preenchimento pela Supervisão" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("filtros")).not.toBeInTheDocument();
  });

  it("exibe Enviados pela Supervisão também para o coordenador de supervisão", async () => {
    localStorage.setItem(
      "perfil",
      JSON.stringify("COORDENADOR_SUPERVISAO_NUTRICAO"),
    );

    renderizarPainel();

    expect(
      await screen.findByRole("button", { name: "Enviados pela Supervisão" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enviados para CODAE" }),
    ).not.toBeInTheDocument();
  });

  it("exibe os filtros após selecionar um status", async () => {
    renderizarPainel();

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
    renderizarPainel();
    await selecionarPrimeiroStatus();

    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    expect(mockGerarParametrosConsulta).toHaveBeenCalledWith({
      page: 1,
      ...mockFiltrosIniciais,
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
      "data-novo-painel",
      "true",
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
    renderizarPainel();
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
    renderizarPainel();
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
    renderizarPainel();
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
    renderizarPainel();
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByText(UUID_RELATORIO_UM);

    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {
      expect(mockGerarParametrosConsulta).toHaveBeenLastCalledWith({
        page: 2,
        ...mockFiltrosIniciais,
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

  it("atualiza o dashboard mantendo os filtros iniciais sem restringir por status", async () => {
    renderizarPainel();
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByTestId("listagem");

    fireEvent.click(
      screen.getByRole("button", { name: "Atualizar dashboard" }),
    );

    await waitFor(() => {
      expect(
        mockGetDashboardPainelGerencialSupervisao,
      ).toHaveBeenLastCalledWith(mockFiltrosIniciais);
    });
  });

  it.each([
    {
      acao: "Alterar DRE",
      filtrosEsperados: {
        ...mockFiltrosIniciais,
        diretoria_regional: mockOutraDre,
      },
    },
    {
      acao: "Alterar mês",
      filtrosEsperados: { ...mockFiltrosIniciais, mes: 8 },
    },
  ])(
    "limpa a seleção e reinicia a paginação ao $acao",
    async ({ acao, filtrosEsperados }) => {
      mockGetListRelatoriosVisitaSupervisao.mockResolvedValue({
        status: HTTP_STATUS.OK,
        data: { results: relatorios, count: 12 },
      });
      renderizarPainel();
      await selecionarPrimeiroStatus();
      fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
      await screen.findByTestId("listagem");
      fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
      await waitFor(() => {
        expect(screen.getByTestId("paginacao")).toHaveTextContent(
          "Página 2 de 12",
        );
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: acao }));
      await screen.findByRole("button", { name: "Validados pela CODAE" });

      expect(
        mockGetDashboardPainelGerencialSupervisao,
      ).toHaveBeenLastCalledWith(filtrosEsperados);
      expect(screen.queryByTestId("filtros")).not.toBeInTheDocument();
      expect(screen.queryByTestId("listagem")).not.toBeInTheDocument();
      expect(screen.queryByTestId("paginacao")).not.toBeInTheDocument();

      await selecionarPrimeiroStatus();
      fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
      await screen.findByTestId("listagem");

      expect(mockGerarParametrosConsulta).toHaveBeenLastCalledWith({
        ...filtrosEsperados,
        status: "NUTRIMANIFESTACAO_A_VALIDAR",
        page: 1,
      });
      expect(screen.getByTestId("paginacao")).toHaveTextContent(
        "Página 1 de 12",
      );
    },
  );

  it("oculta os cards e os resultados ao limpar o mês sem consultar novamente", async () => {
    renderizarPainel();
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByTestId("listagem");

    fireEvent.click(screen.getByRole("button", { name: "Limpar mês" }));

    expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByTestId(/^card-/)).toHaveLength(0);
    expect(screen.queryByTestId("filtros")).not.toBeInTheDocument();
    expect(screen.queryByTestId("listagem")).not.toBeInTheDocument();
    expect(screen.queryByTestId("paginacao")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("ignora a resposta antiga dos cards após alterar o mês", async () => {
    const requisicaoAntiga = criarPromessaControlada();
    mockGetDashboardPainelGerencialSupervisao
      .mockReturnValueOnce(requisicaoAntiga.promise)
      .mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: { results: dashboard.map((card) => ({ ...card, total: 7 })) },
      });
    renderizarPainel();

    fireEvent.click(screen.getByRole("button", { name: "Alterar mês" }));
    await screen.findByRole("button", { name: "Validados pela CODAE" });
    expect(screen.getByTestId("card-VALIDADO_POR_CODAE")).toHaveAttribute(
      "data-total",
      "7",
    );

    await act(async () => {
      requisicaoAntiga.resolver({
        status: HTTP_STATUS.OK,
        data: { results: dashboard.map((card) => ({ ...card, total: 99 })) },
      });
    });

    expect(screen.getByTestId("card-VALIDADO_POR_CODAE")).toHaveAttribute(
      "data-total",
      "7",
    );
    expect(mockGetDashboardPainelGerencialSupervisao).toHaveBeenLastCalledWith({
      ...mockFiltrosIniciais,
      mes: 8,
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("ignora relatórios de uma consulta anterior após alterar o mês", async () => {
    const requisicaoAntiga = criarPromessaControlada();
    mockGetListRelatoriosVisitaSupervisao
      .mockReturnValueOnce(requisicaoAntiga.promise)
      .mockResolvedValueOnce({
        status: HTTP_STATUS.OK,
        data: {
          results: [
            { ...relatorios[0], uuid: UUID_RELATORIO_DOIS, data: "10/08/2026" },
          ],
          count: 1,
        },
      });
    renderizarPainel();
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));

    fireEvent.click(screen.getByRole("button", { name: "Alterar mês" }));
    await selecionarPrimeiroStatus();
    fireEvent.click(screen.getByRole("button", { name: "Executar busca" }));
    await screen.findByText(UUID_RELATORIO_DOIS);

    await act(async () => {
      requisicaoAntiga.resolver({
        status: HTTP_STATUS.OK,
        data: { results: relatorios, count: 1 },
      });
    });

    expect(screen.getByTestId("listagem")).toHaveTextContent(
      UUID_RELATORIO_DOIS,
    );
    expect(screen.queryByText(UUID_RELATORIO_UM)).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
