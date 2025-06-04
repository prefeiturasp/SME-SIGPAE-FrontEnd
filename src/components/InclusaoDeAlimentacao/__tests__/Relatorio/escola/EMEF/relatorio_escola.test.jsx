import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoAlimentacaoRegular } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegular";
import { mockInclusaoAlimentacaoRegularCancelada } from "src/mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegularCancelada";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Inclusão de Alimentação - Visão Escola", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/grupos-inclusao-alimentacao-normal/${mockInclusaoAlimentacaoRegular.uuid}/`
      )
      .replyOnce(200, mockInclusaoAlimentacaoRegular);
    mock
      .onPatch(
        `/grupos-inclusao-alimentacao-normal/${mockInclusaoAlimentacaoRegular.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockInclusaoAlimentacaoRegularCancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?uuid=${mockInclusaoAlimentacaoRegular.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`;
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
          <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # D0F4F`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # D0F4F")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo regular`", async () => {
    expect(
      screen.getByText("Solicitação no prazo regular")
    ).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Reposição de aula")).toBeInTheDocument();

    expect(screen.getByText("Dia(s) de inclusão")).toBeInTheDocument();
    expect(screen.getByText("02/04/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação e nº de alunos", async () => {
    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Tipos de Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Nº de Alunos")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("exibe modal cancela solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Esta solicitação está aguardando validação pela DRE. Deseja seguir em frente com o cancelamento?"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Selecione a(s) data(s) para solicitar o cancelamento:"
        )
      ).toBeInTheDocument();
    });
  });

  it("fecha modal cancela solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });
  });

  it("cancela solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
    });

    const inputDia02_04_2025 = screen.getByTestId(
      "data_Reposição de aula_02/04/2025"
    );
    fireEvent.click(inputDia02_04_2025);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoRegularCancelada);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("02/04/2025 - justificativa: teste")
    ).toBeInTheDocument();
  });
});
