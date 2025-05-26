import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosCogestor } from "mocks/meusDados/cogestor";
import { mockAlteracaoCardapioCEMEIAValidar } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIAValidar";
import { mockAlteracaoCardapioCEMEINaoValidada } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEINaoValidada";
import { mockAlteracaoCardapioCEMEIValidada } from "mocks/services/alteracaoCardapio.service/CEMEI/alteracaoCardapioCEMEIValidada";
import { mockQuantidadeAlunoCEMEIporCEIEMEI } from "mocks/services/aluno.service/CEMEI/quantidadeAlunoCEMEIporCEIEMEI";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI from "pages/AlteracaoDeCardapioCEMEIRelatorios";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "services/_mock";

describe("Teste Relatório Alteração de Cardápio CEMEI - Visão Escola", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/`
      )
      .reply(200, mockAlteracaoCardapioCEMEIAValidar);
    mock
      .onGet("/alunos/quantidade-cemei-por-cei-emei/")
      .reply(200, mockQuantidadeAlunoCEMEIporCEIEMEI);
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/diretoria-regional-nao-valida-pedido/`
      )
      .reply(200, mockAlteracaoCardapioCEMEINaoValidada);
    mock
      .onPatch(
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/diretoria-regional-valida-pedido/`
      )
      .reply(200, mockAlteracaoCardapioCEMEIValidada);

    const search = `?uuid=${mockAlteracaoCardapioCEMEIAValidar.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosAlteracaoDoTipoDeAlimentacaoCEMEI.RelatorioDRE />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página `Alteração do Tipo de Alimentação - Solicitação # 8AA0A`", async () => {
    expect(
      screen.getByText("Alteração do Tipo de Alimentação - Solicitação # 8AA0A")
    ).toBeInTheDocument();
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
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/`
      )
      .reply(200, mockAlteracaoCardapioCEMEINaoValidada);

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
        `/alteracoes-cardapio-cemei/${mockAlteracaoCardapioCEMEIAValidar.uuid}/`
      )
      .replyOnce(200, mockAlteracaoCardapioCEMEIValidada);

    await waitFor(() => {
      expect(screen.queryByText("DRE validou")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
  });
});
