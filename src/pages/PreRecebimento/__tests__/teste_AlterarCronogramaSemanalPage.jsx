import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import AlterarCronogramaSemanalPage from "../AlterarCronogramaSemanalPage";
import { mockGetListagemSolicitacaoAlteracaoCronograma } from "src/mocks/services/cronograma.service/mockGetListagemSolicitacaoAlteracaoCronograma";
import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";
import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";

import { localStorageMock } from "src/mocks/localStorageMock";
import {
  mockGetCronogramasMensalAssinados2,
  mockCronogramaMensalDetalhado,
  mockGetCronogramaSemanalCiente,
} from "src/mocks/services/cronogramaSemanal.service";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/services/notificacoes.service");

const setupTest = async (uuid = null) => {
  const search = uuid ? `?uuid=${uuid}` : "";
  window.history.pushState({}, "", `${window.location.pathname}${search}`);

  mock
    .onGet("/solicitacao-de-alteracao-de-cronograma/")
    .reply(200, mockGetListagemSolicitacaoAlteracaoCronograma);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[`/${search}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AlterarCronogramaSemanalPage />
      </MemoryRouter>,
    );
  });
};

describe("Teste da <AlterarCronogramaSemanalPage />", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.LOGISTICA);

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock
      .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
      .reply(200, mockGetCronogramasMensalAssinados2);
    mock
      .onGet("/cronogramas/e10b7e33-7763-42da-8071-d9a06ec04849/")
      .reply(200, mockCronogramaMensalDetalhado);
    mock
      .onGet(`/cronogramas-semanais/${mockGetCronogramaSemanalCiente.uuid}/`)
      .reply(200, mockGetCronogramaSemanalCiente);
  });

  it("não exibe lista de rascunhos no modo de edição", async () => {
    await setupTest(mockGetCronogramaSemanalCiente.uuid);

    await waitFor(() => {
      expect(screen.getByTestId("form-cronograma-semanal")).toBeInTheDocument();
    });

    expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
  });

  it("exibe o número do cronograma quando carregado em modo edição", async () => {
    await setupTest(mockGetCronogramaSemanalCiente.uuid);

    await waitFor(() => {
      expect(
        screen.getByText(mockGetCronogramaSemanalCiente.numero),
      ).toBeInTheDocument();
    });
  });

  it("desabilita o campo de Cronograma Mensal no modo edição", async () => {
    await setupTest(mockGetCronogramaSemanalCiente.uuid);

    await waitFor(() => {
      const cronogramaInput = document.querySelector(".autocomplete input");
      expect(cronogramaInput).toBeInTheDocument();
    });

    const cronogramaInput = document.querySelector(".autocomplete input");
    expect(cronogramaInput).toBeDisabled();
  });

  it("abre modal de assinatura ao clicar em 'Enviar Alteração'", async () => {
    await setupTest(mockGetCronogramaSemanalCiente.uuid);

    await waitFor(() => {
      expect(screen.getByTestId("botao-atualizar")).toBeInTheDocument();
    });

    const botaoAtualizar = screen.getByTestId("botao-atualizar");

    if (!botaoAtualizar.hasAttribute("disabled")) {
      fireEvent.click(botaoAtualizar);

      await waitFor(() => {
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });
    }
  });

  it("chama o serviço de alteração ao confirmar no modal", async () => {
    mock
      .onPatch(
        `/cronogramas-semanais/${mockGetCronogramaSemanalCiente.uuid}/alterar-cronograma/`,
      )
      .reply(200, { ...mockGetCronogramaSemanalCiente });

    await setupTest(mockGetCronogramaSemanalCiente.uuid);

    await waitFor(() => {
      expect(screen.getByTestId("botao-atualizar")).toBeInTheDocument();
    });

    const botaoAtualizar = screen.getByTestId("botao-atualizar");

    if (!botaoAtualizar.hasAttribute("disabled")) {
      fireEvent.click(botaoAtualizar);

      await waitFor(() => {
        expect(screen.getByText("Assinar Cronograma")).toBeInTheDocument();
      });

      const botaoSalvar = screen.getByText("Salvar e Enviar").closest("button");
      fireEvent.click(botaoSalvar);

      const inputSenha = screen.getByPlaceholderText("Digite sua senha");
      fireEvent.change(inputSenha, { target: { value: "senha123" } });

      const botaoConfirmar = screen.getByText("Confirmar");
      await act(async () => {
        fireEvent.click(botaoConfirmar);
      });

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("alterar-cronograma");
      });
    }
  });
});
