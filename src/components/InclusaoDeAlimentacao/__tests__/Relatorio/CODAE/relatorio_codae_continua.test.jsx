import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoContinuaQuestionada } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaQuestionada";
import { mockInclusaoContinuaValidada } from "src/mocks/InclusaoAlimentacao/mockInclusaoContinuaValidada";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="justificativa" />,
}));

describe("Relatório Inclusão de Alimentação Contínua - Visão CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/"
      )
      .replyOnce(200, mockInclusaoContinuaValidada);
    mock
      .onPatch(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/codae-questiona-pedido/"
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    const search = `?uuid=a64f5054-873c-46bc-aefa-43966029a1a4&ehInclusaoContinua=true&tipoSolicitacao=solicitacao-continua`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioCODAE />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # A64F5`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # A64F5")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo limite`", async () => {
    expect(screen.getByText("Solicitação no prazo limite")).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(
      screen.getByText("Programas/Projetos Contínuos")
    ).toBeInTheDocument();

    expect(screen.getByText("De")).toBeInTheDocument();
    expect(screen.getByText("05/03/2025")).toBeInTheDocument();

    expect(screen.getByText("Até")).toBeInTheDocument();
    expect(screen.getByText("12/03/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação e nº de alunos", async () => {
    expect(screen.getByText("Repetir")).toBeInTheDocument();

    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Tipos de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Nº de Alunos")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("Observações:")).toBeInTheDocument();
    expect(screen.getByText("observação da inclusão")).toBeInTheDocument();
  });

  it("questiona a solicitação", async () => {
    const botaoQuestionar = screen.getByText("Questionar").closest("button");
    fireEvent.click(botaoQuestionar);

    await waitFor(() => {
      expect(screen.queryByText("Questionamento")).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "da pra atender?" },
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    mock
      .onGet(
        "/inclusoes-alimentacao-continua/a64f5054-873c-46bc-aefa-43966029a1a4/"
      )
      .replyOnce(200, mockInclusaoContinuaQuestionada);

    await waitFor(() => {
      expect(screen.queryByText("Questionamento")).not.toBeInTheDocument();
      expect(screen.getByText("Questionamento pela CODAE")).toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Questionar")).not.toBeInTheDocument();

    expect(screen.getByText("Histórico de questionamento")).toBeInTheDocument();
    expect(screen.getByText("27/02/2025 16:42:03 - CODAE")).toBeInTheDocument();
    expect(
      screen.getByText(
        "É possível atender a solicitação com todos os itens previstos no contrato?"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Observação da CODAE:")).toBeInTheDocument();
    expect(screen.getByText("da pra atender?")).toBeInTheDocument();
  });
});
