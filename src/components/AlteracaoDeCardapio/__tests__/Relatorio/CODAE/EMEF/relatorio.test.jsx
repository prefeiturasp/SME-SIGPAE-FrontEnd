import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockAlteracaoCardapioValidada } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioValidada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacao from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

const solicitacaoAutorizarAposQuestionamento = {
  ...mockAlteracaoCardapioValidada,
  prioridade: "LIMITE",
  status: "TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO",
  logs: [
    ...mockAlteracaoCardapioValidada.logs,
    {
      status_evento_explicacao: "Terceirizada respondeu questionamento",
      resposta_sim_nao: true,
      criado_em: "27/05/2025 10:00:00",
      usuario: {},
      descricao: "",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Questionamento pela CODAE",
      resposta_sim_nao: false,
      criado_em: "27/05/2025 11:00:00",
      usuario: {},
      descricao: "",
      justificativa: "",
    },
  ],
};

describe("Relatório Alteração do Tipo de Alimentação - Visão CODAE - EMEF", () => {
  beforeEach(async () => {
    mock
      .onGet(
        `/alteracoes-cardapio/${solicitacaoAutorizarAposQuestionamento.uuid}/`,
      )
      .reply(200, solicitacaoAutorizarAposQuestionamento);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    const search = `?uuid=${solicitacaoAutorizarAposQuestionamento.uuid}&tipoSolicitacao=solicitacao-normal&card=undefined`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosAlteracaoDoTipoDeAlimentacao.RelatorioCODAE />
        </MemoryRouter>,
      );
    });
  });

  it("abre e fecha o modal de autorização após questionamento", async () => {
    await waitFor(() => {
      expect(screen.getByText("Autorizar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Autorizar").closest("button"));

    const botaoNao = screen.getAllByText("Não")[0].closest("button");
    fireEvent.click(botaoNao);
  });
});
