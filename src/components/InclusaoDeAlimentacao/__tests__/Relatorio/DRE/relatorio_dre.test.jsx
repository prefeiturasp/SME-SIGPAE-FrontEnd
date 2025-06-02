import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockInclusaoalimentacaoNaoValidada } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoNaoValidada";
import { mockInclusaoAlimentacaoRegular } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegular";
import { mockInclusaoAlimentacaoValidada } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoValidada";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCogestor } from "mocks/meusDados/cogestor";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "src/pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Inclusão de Alimentação - Visão DRE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoRegular);
    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/diretoria-regional-nao-valida-pedido/"
      )
      .reply(200, {});
    mock
      .onPatch(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/diretoria-regional-valida-pedido/"
      )
      .reply(200, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    const search = `?uuid=d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`;
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
          <RelatoriosInclusaoDeAlimentacao.RelatorioDRE />
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
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoalimentacaoNaoValidada);

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
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .replyOnce(200, mockInclusaoAlimentacaoValidada);

    await waitFor(() => {
      expect(screen.queryByText("DRE validou")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
  });
});
