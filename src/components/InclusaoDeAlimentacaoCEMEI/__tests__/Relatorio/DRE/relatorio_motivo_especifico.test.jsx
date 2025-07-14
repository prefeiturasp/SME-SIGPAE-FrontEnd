import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockInclusaoMotivoEspecificoAValidarCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/InclusaoMotivoEspecificoAValidar";
import { mockInclusaoMotivoEspecificoNaoValidadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoNaoValidada";
import { mockInclusaoMotivoEspecificoValidadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoValidada";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import * as InclusaoDeAlimentacaoCEMEIRelatorios from "src/pages/InclusaoDeAlimentacaoCEMEIRelatorios";
import mock from "src/services/_mock";

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão Escola - Motivo Específico", () => {
  const escolaUuid = mockInclusaoMotivoEspecificoAValidarCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoAValidarCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/"
      )
      .reply(200, mockGetVinculosMotivoEspecificoCEMEI);

    const search = `?uuid=${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    await act(async () => {
      ({ container } = render(
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
            <InclusaoDeAlimentacaoCEMEIRelatorios.RelatorioDRE />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      ));
    });
  });

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # 5A120`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # 5A120")
    ).toBeInTheDocument();
  });

  it("renderiza dados da solicitação", async () => {
    expect(
      screen.getByText("Solicitação no prazo regular")
    ).toBeInTheDocument();

    const span = container.querySelector(".dre-name");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("CEMEI SUZANA CAMPOS TAUIL");

    expect(
      screen.getByText("Solicitação de Inclusão de Alimentação")
    ).toBeInTheDocument();
    expect(screen.getByText("Evento Específico")).toBeInTheDocument();

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();
  });

  it("valida solicitação", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/diretoria-regional-valida-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoValidadaCEMEI);

    const botaoValidar = screen.getByText("Validar").closest("button");
    fireEvent.click(botaoValidar);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoValidadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Inclusão de Alimentação validada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
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
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoNaoValidadaCEMEI);

    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/diretoria-regional-nao-valida-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoNaoValidadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação não validada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
    expect(screen.queryByText("Validar")).not.toBeInTheDocument();
  });
});
