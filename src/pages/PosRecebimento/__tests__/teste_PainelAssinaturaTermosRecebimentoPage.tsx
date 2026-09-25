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
import PainelAssinaturaTermosRecebimentoPage from "src/pages/PosRecebimento/PainelAssinaturaTermosRecebimentoPage";
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
import {
  POS_RECEBIMENTO,
  DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
} from "src/configs/constants";

jest.mock("src/services/notificacoes.service");

const URL_PENDENTES = "/pos-recebimento/termos/pendentes-assinatura/";
const URL_ASSINADOS = "/pos-recebimento/termos/assinados/";

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
          <PainelAssinaturaTermosRecebimentoPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const chamadas = (url: string) => mock.history.get.filter((c) => c.url === url);

describe("PainelAssinaturaTermosRecebimentoPage", () => {
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

    mock.onGet(URL_PENDENTES).reply(200, mockTermosPendentesAssinatura);
    mock.onGet(URL_ASSINADOS).reply(200, mockTermosAssinados);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Listagem", () => {
    it("renderiza os dois cards (Pendentes de Assinatura e Assinados)", async () => {
      await setup();

      expect(
        await screen.findByText("Pendentes de Assinatura"),
      ).toBeInTheDocument();
      expect(screen.getByText("Assinados")).toBeInTheDocument();
    });

    it("busca pendentes e assinados uma única vez ao carregar", async () => {
      await setup();

      await waitFor(() => expect(chamadas(URL_PENDENTES)).toHaveLength(1));
      expect(chamadas(URL_ASSINADOS)).toHaveLength(1);
    });

    it("exibe o item com o texto combinado", async () => {
      await setup();

      expect(
        await screen.findByText("BOM GUSTO ALIMENTAR - ARROZ - 200/2024"),
      ).toBeInTheDocument();
      expect(screen.getByText(/ALIMENTE-SE/)).toBeInTheDocument();
    });

    it("aponta cada item para a tela de Detalhar do termo", async () => {
      await setup();

      const item = await screen.findByText(
        "BOM GUSTO ALIMENTAR - ARROZ - 200/2024",
      );
      const link = item.closest("a");
      expect(link).toHaveAttribute(
        "href",
        `/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}?uuid=${mockTermosPendentesAssinatura.results[1].uuid}`,
      );
    });
  });

  describe("Filtros", () => {
    it("apresenta os três campos de busca", async () => {
      await setup();
      await screen.findByText("Pendentes de Assinatura");

      expect(
        screen.getByPlaceholderText("Pesquisar por Nº do Contrato"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Pesquisar por Produto"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Pesquisar por Empresa"),
      ).toBeInTheDocument();
    });

    it("aplica o filtro de produto enviando o parâmetro nas requisições", async () => {
      await setup();
      await screen.findByText("Pendentes de Assinatura");

      fireEvent.change(screen.getByPlaceholderText("Pesquisar por Produto"), {
        target: { value: "ARR" },
      });

      await waitFor(() =>
        expect(
          chamadas(URL_PENDENTES).some(
            (c) => (c.params as URLSearchParams)?.get("nome_produto") === "ARR",
          ),
        ).toBe(true),
      );
      expect(
        chamadas(URL_ASSINADOS).some(
          (c) => (c.params as URLSearchParams)?.get("nome_produto") === "ARR",
        ),
      ).toBe(true);
    });
  });

  describe("Permissões da rota", () => {
    const getRotaPainel = () => {
      let rota;
      jest.isolateModules(() => {
        const {
          rotasPosRecebimento,
        } = require("src/configs/rotas/posRecebimento");
        rota = rotasPosRecebimento.find((r: { path: string }) =>
          r.path.endsWith(`/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`),
        );
      });
      return rota;
    };

    it("libera acesso para DILOG_QUALIDADE", () => {
      localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
      expect(getRotaPainel().tipoUsuario).toBe(true);
    });

    it("libera acesso para DILOG_CRONOGRAMA", () => {
      localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
      expect(getRotaPainel().tipoUsuario).toBe(true);
    });

    it("bloqueia acesso para um usuário sem permissão", () => {
      localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
      expect(getRotaPainel().tipoUsuario).toBe(false);
    });
  });
});
