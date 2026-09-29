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
import StatusTermoPendentesAssinatura from "src/pages/PosRecebimento/CardsAssinaturaTermos/StatusTermoPendentesAssinatura";
import StatusTermoAssinados from "src/pages/PosRecebimento/CardsAssinaturaTermos/StatusTermoAssinados";
import {
  mockTermosPendentesAssinatura,
  mockTermosAssinados,
} from "src/mocks/services/posRecebimento.service/mockPainelAssinaturaTermos";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { PAINEL_ASSINATURA_TERMOS_RECEBIMENTO } from "src/configs/constants";

jest.mock("src/services/notificacoes.service");

const URL_PENDENTES = "/pos-recebimento/termos/pendentes-assinatura/";
const URL_ASSINADOS = "/pos-recebimento/termos/assinados/";

const setup = async (PageComponent: React.FC) => {
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
          <PageComponent />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const chamadas = (url: string) => mock.history.get.filter((c) => c.url === url);

describe("Ver Mais - Cards do Painel de Assinaturas", () => {
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

  describe("StatusTermoPendentesAssinatura", () => {
    it("carrega e lista os termos pendentes com o texto no padrão", async () => {
      mock
        .onGet(URL_PENDENTES)
        .reply(200, { ...mockTermosPendentesAssinatura, count: 2 });

      await setup(StatusTermoPendentesAssinatura);

      expect(
        await screen.findByText("22222/23 - BOM GUSTO ALIMENTAR - ARROZ"),
      ).toBeInTheDocument();
    });

    it("apresenta os três campos de busca", async () => {
      mock.onGet(URL_PENDENTES).reply(200, mockTermosPendentesAssinatura);

      await setup(StatusTermoPendentesAssinatura);

      expect(
        await screen.findByPlaceholderText("Pesquisar por Nº do Contrato"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Pesquisar por Nome do Produto"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Pesquisar por Nome do Fornecedor"),
      ).toBeInTheDocument();
    });

    it("aplica o filtro de produto enviando o parâmetro", async () => {
      mock.onGet(URL_PENDENTES).reply(200, mockTermosPendentesAssinatura);

      await setup(StatusTermoPendentesAssinatura);
      await screen.findByText("22222/23 - BOM GUSTO ALIMENTAR - ARROZ");

      fireEvent.change(
        screen.getByPlaceholderText("Pesquisar por Nome do Produto"),
        { target: { value: "ARR" } },
      );

      await waitFor(() =>
        expect(
          chamadas(URL_PENDENTES).some(
            (c) => (c.params as URLSearchParams)?.get("nome_produto") === "ARR",
          ),
        ).toBe(true),
      );
    });
  });

  describe("StatusTermoAssinados", () => {
    it("carrega e lista os termos assinados com o texto no padrão", async () => {
      mock
        .onGet(URL_ASSINADOS)
        .reply(200, { ...mockTermosAssinados, count: 1 });

      await setup(StatusTermoAssinados);

      expect(
        await screen.findByText(
          "33333/23 - ALIMENTE-SE - ALIMENTAÇÃO LTDA - FEIJÃO",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Permissões das rotas do Painel de Assinaturas", () => {
    const getRotas = () => {
      let rotas;
      jest.isolateModules(() => {
        rotas = require("src/configs/rotas/posRecebimento").rotasPosRecebimento;
      });
      return rotas;
    };

    const rotasDoPainel = () => {
      const rotas = getRotas();
      return [
        rotas.find((r: { path: string }) =>
          r.path.endsWith(`/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`),
        ),
        rotas.find((r: { path: string }) =>
          r.path.endsWith("/pendentes-de-assinatura/"),
        ),
        rotas.find((r: { path: string }) => r.path.endsWith("/assinados/")),
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
    ];

    const perfisSemAcesso = [
      { nome: "ADMINISTRADOR_EMPRESA", perfil: PERFIL.ADMINISTRADOR_EMPRESA },
      { nome: "USUARIO_EMPRESA", perfil: PERFIL.USUARIO_EMPRESA },
    ];

    it.each(perfisComAcesso)(
      "libera painel e Ver Mais para $nome",
      ({ perfil }) => {
        localStorage.setItem("perfil", perfil);
        rotasDoPainel().forEach((rota) => expect(rota.tipoUsuario).toBe(true));
      },
    );

    it.each(perfisSemAcesso)(
      "bloqueia painel e Ver Mais para $nome (Fornecedor)",
      ({ perfil }) => {
        localStorage.setItem("perfil", perfil);
        rotasDoPainel().forEach((rota) => expect(rota.tipoUsuario).toBe(false));
      },
    );
  });
});
