import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockAlteracaoCardapioAValidar } from "mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioAValidar";
import { mockAlteracaoCardapioCancelada } from "mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioCancelada";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacao from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Alteração do Tipo de Alimentação - Visão Escola - EMEF", () => {
  beforeEach(async () => {
    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .reply(200, mockAlteracaoCardapioAValidar);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockAlteracaoCardapioCancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?uuid=${mockAlteracaoCardapioAValidar.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
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
          <RelatoriosAlteracaoDoTipoDeAlimentacao.RelatorioEscola />
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Alteração do tipo de alimentação - Solicitação # EF99C`", async () => {
    expect(
      screen.getByText("Alteração do tipo de alimentação - Solicitação # EF99C")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação no prazo regular`", async () => {
    expect(
      screen.getByText("Solicitação no prazo regular")
    ).toBeInTheDocument();
  });

  it("renderiza tipo de alteração e data", async () => {
    expect(screen.getByText("Tipo de Alteração")).toBeInTheDocument();
    expect(screen.getByText("LPR - Lanche por Refeição")).toBeInTheDocument();

    expect(screen.getByText("Alterar dia")).toBeInTheDocument();
    expect(screen.getByText("22/05/2025")).toBeInTheDocument();
  });

  it("renderiza tabela com período, tipos de alimentação de e para, e nº de alunos", async () => {
    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();

    expect(screen.getByText("Alteração alimentação de:")).toBeInTheDocument();
    expect(screen.getByText("Lanche")).toBeInTheDocument();

    expect(screen.getByText("Alteração alimentação para:")).toBeInTheDocument();
    expect(screen.getByText("Sobremesa")).toBeInTheDocument();

    expect(screen.getByText("Número de alunos")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
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

    const inputDia22_05_2025 = screen.getByTestId("data_22/05/2025");
    fireEvent.click(inputDia22_05_2025);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .reply(200, mockAlteracaoCardapioCancelada);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("22/05/2025 - justificativa: teste")
    ).toBeInTheDocument();
  });
});
