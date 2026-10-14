import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import StatusDocumentoReprovados from "src/pages/PreRecebimento/CardsDocumentosRecebimento/StatusDocumentoReprovados";
import { mockDashboardDocsReprovadosPorStatus } from "src/mocks/services/documentosRecebimento.service/mockGetDashboardDocsPorStatusReprovados";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { PAINEL_DOCUMENTOS_RECEBIMENTO } from "src/configs/constants";

jest.mock("src/services/notificacoes.service");

const URL_DASHBOARD = "/documentos-de-recebimento/dashboard/";

const chamadas = (url: string) => mock.history.get.filter((c) => c.url === url);

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <StatusDocumentoReprovados />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Ver Mais - StatusDocumentoReprovados", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();

    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem(
      "meusDados",
      JSON.stringify(mockMeusDadosDilogQualidade),
    );

    (getNotificacoes as jest.Mock).mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });
    (getQtdNaoLidas as jest.Mock).mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carrega e lista os documentos reprovados", async () => {
    mock.onGet(URL_DASHBOARD).reply(200, mockDashboardDocsReprovadosPorStatus);

    await setup();

    expect(
      await screen.findByText("200/2024 - ARROZ - JP Alimentos"),
    ).toBeInTheDocument();
  });

  it("apresenta os três campos de busca", async () => {
    mock.onGet(URL_DASHBOARD).reply(200, mockDashboardDocsReprovadosPorStatus);

    await setup();

    expect(
      await screen.findByPlaceholderText("Filtrar por Nº do Cronograma"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Filtrar por Nome do Produto"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Filtrar por Nome do Fornecedor"),
    ).toBeInTheDocument();
  });

  it("aplica o filtro de produto enviando o parâmetro", async () => {
    mock.onGet(URL_DASHBOARD).reply(200, mockDashboardDocsReprovadosPorStatus);

    await setup();
    await screen.findByText("200/2024 - ARROZ - JP Alimentos");

    fireEvent.change(
      screen.getByPlaceholderText("Filtrar por Nome do Produto"),
      { target: { value: "ARR" } },
    );

    await waitFor(() =>
      expect(
        chamadas(URL_DASHBOARD).some(
          (c) => (c.params as URLSearchParams)?.get("nome_produto") === "ARR",
        ),
      ).toBe(true),
    );
  });

  describe("Permissões da rota", () => {
    const getRotas = () => {
      let rotas;
      jest.isolateModules(() => {
        rotas = require("src/configs/rotas/preRecebimento").rotasPreRecebimento;
      });
      return rotas;
    };

    const rotasDocumentos = () => {
      const rotas = getRotas();
      return [
        rotas.find((r: { path: string }) =>
          r.path.endsWith(`/${PAINEL_DOCUMENTOS_RECEBIMENTO}`),
        ),
        rotas.find((r: { path: string }) => r.path.endsWith("/reprovados/")),
      ];
    };

    const perfisComAcesso = [
      { nome: "DILOG_QUALIDADE", perfil: PERFIL.DILOG_QUALIDADE },
      { nome: "DILOG_DIRETORIA", perfil: PERFIL.DILOG_DIRETORIA },
      { nome: "DILOG_CRONOGRAMA", perfil: PERFIL.DILOG_CRONOGRAMA },
      {
        nome: "COORDENADOR_CODAE_DILOG_LOGISTICA",
        perfil: PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA,
      },
      {
        nome: "ADMINISTRADOR_CODAE_GABINETE",
        perfil: PERFIL.ADMINISTRADOR_CODAE_GABINETE,
      },
    ];

    const perfisSemAcesso = [
      { nome: "ADMINISTRADOR_EMPRESA", perfil: PERFIL.ADMINISTRADOR_EMPRESA },
      { nome: "USUARIO_EMPRESA", perfil: PERFIL.USUARIO_EMPRESA },
    ];

    it.each(perfisComAcesso)(
      "libera painel e Ver Mais (reprovados) para $nome",
      ({ perfil }) => {
        localStorage.setItem("perfil", perfil);
        rotasDocumentos().forEach((rota) =>
          expect(rota.tipoUsuario).toBe(true),
        );
      },
    );

    it.each(perfisSemAcesso)(
      "bloqueia painel e Ver Mais (reprovados) para $nome",
      ({ perfil }) => {
        localStorage.setItem("perfil", perfil);
        rotasDocumentos().forEach((rota) =>
          expect(rota.tipoUsuario).toBe(false),
        );
      },
    );
  });
});
