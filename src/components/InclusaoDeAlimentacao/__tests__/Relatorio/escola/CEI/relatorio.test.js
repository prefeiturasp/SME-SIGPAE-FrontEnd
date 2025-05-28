import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { mockInclusaoAlimentacaoCEIAValidar } from "mocks/InclusaoAlimentacao/CEI/inclusaoAlimentacaoAValidar";
import { mockInclusaoAlimentacaoCEICancelada } from "mocks/InclusaoAlimentacao/CEI/inclusaoAlimentacaoCancelada";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde } from "mocks/services/cadastroTipoAlimentacao.service/CEI/vinculosTipoAlimentacaoPeriodoEscolarComManhaTarde";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "pages/InclusaoDeAlimentacao/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Relatório Inclusão de Alimentação - Visão Escola - CEI", () => {
  const escolaUuid =
    mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEIcomMANHAeTARDE);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/inclusoes-alimentacao-da-cei/${mockInclusaoAlimentacaoCEIAValidar.uuid}/`
      )
      .replyOnce(200, mockInclusaoAlimentacaoCEIAValidar);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarCEIComManhaTarde);
    mock
      .onPatch(
        `/inclusoes-alimentacao-da-cei/${mockInclusaoAlimentacaoCEIAValidar.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockInclusaoAlimentacaoCEICancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEI DIRET NEIDE KETELHUT"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cei", "true");

    const search = `?uuid=${mockInclusaoAlimentacaoCEIAValidar.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cei&card=undefined`;
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

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # A38E6`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # A38E6")
    ).toBeInTheDocument();
  });

  it("renderiza label `Solicitação próxima ao prazo de vencimento`", async () => {
    expect(
      screen.getByText("Solicitação próxima ao prazo de vencimento")
    ).toBeInTheDocument();
  });

  it("renderiza motivo e data", async () => {
    expect(screen.getByText("Motivo")).toBeInTheDocument();
    expect(screen.getByText("Reposição de aula")).toBeInTheDocument();

    expect(screen.getByText("Dia(s) de inclusão")).toBeInTheDocument();
    expect(screen.getByText("30/05/2025")).toBeInTheDocument();
  });

  it("renderiza tabelas com período, tipos de alimentação, faixas etárias e nº de alunos", async () => {
    expect(screen.getAllByText("INTEGRAL")).toHaveLength(2);

    expect(
      screen.getByText("Tipos de alimentação no período integral:")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Lanche, Desjejum, Almoço, Colação, Refeição da tarde")
    ).toBeInTheDocument();

    expect(screen.getByText("07 a 11 meses")).toBeInTheDocument();

    expect(
      screen.getByText("Tipos de alimentação no período manha:")
    ).toBeInTheDocument();
    expect(screen.getByText("Desjejum, Almoço, Colação")).toBeInTheDocument();

    expect(screen.getByText("04 anos a 06 anos")).toBeInTheDocument();
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

    const inputDia30_05_2025 = screen.getByTestId(
      "data_Reposição de aula_30/05/2025"
    );
    fireEvent.click(inputDia30_05_2025);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/inclusoes-alimentacao-da-cei/${mockInclusaoAlimentacaoCEIAValidar.uuid}/`
      )
      .replyOnce(200, mockInclusaoAlimentacaoCEICancelada);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("30/05/2025 - justificativa: teste")
    ).toBeInTheDocument();
  });
});
