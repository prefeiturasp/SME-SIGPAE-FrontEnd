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
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockAlteracaoCardapioAValidar } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioAValidar";
import { mockAlteracaoCardapioNaoValidada } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioNaoValidada";
import { mockAlteracaoCardapioValidada } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioValidada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacao from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Alteração do Tipo de Alimentação - Visão DRE - EMEF", () => {
  beforeEach(async () => {
    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .reply(200, mockAlteracaoCardapioAValidar);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/diretoria-regional-nao-valida-pedido/`
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
          <RelatoriosAlteracaoDoTipoDeAlimentacao.RelatorioDRE />
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

  it("exibe modal não validar", async () => {
    const botaoNaoValidar = screen.getByText("Não Validar").closest("button");
    fireEvent.click(botaoNaoValidar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja não validar solicitação?")
      ).toBeInTheDocument();
    });
  });

  it("fecha modal não validar", async () => {
    const botaoNaoValidar = screen.getByText("Não Validar").closest("button");
    fireEvent.click(botaoNaoValidar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja não validar solicitação?")
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja não validar solicitação?")
      ).not.toBeInTheDocument();
    });
  });

  it("não valida solicitação", async () => {
    const botaoNaoValidar = screen.getByText("Não Validar").closest("button");
    fireEvent.click(botaoNaoValidar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja não validar solicitação?")
      ).toBeInTheDocument();
    });

    const uuidMotivoEmDesacordoComContrato =
      mockMotivosDRENaoValida.results.find(
        (motivo) => motivo.nome === "Em desacordo com o contrato"
      ).uuid;

    const selectMotivo = screen.getByTestId("select-motivo-cancelamento");
    const selectMotivoCancelamento = selectMotivo.querySelector("select");
    fireEvent.change(selectMotivoCancelamento, {
      target: { value: uuidMotivoEmDesacordoComContrato },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "não valido." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .reply(200, mockAlteracaoCardapioNaoValidada);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja não validar solicitação?")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
    expect(screen.queryByText("Validar")).not.toBeInTheDocument();

    expect(screen.getByText("DRE não validou")).toBeInTheDocument();
  });

  it("valida solicitação", async () => {
    const botaoValidar = screen.getByText("Validar").closest("button");
    fireEvent.click(botaoValidar);

    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .replyOnce(200, mockAlteracaoCardapioValidada);

    await waitFor(() => {
      expect(screen.queryByText("DRE validou")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
  });
});
