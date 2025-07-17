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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockInclusaoMotivoEspecificoAValidarCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/InclusaoMotivoEspecificoAValidar";
import { mockInclusaoMotivoEspecificoCanceladaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoCancelada";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import * as InclusaoDeAlimentacaoCEMEIRelatorios from "src/pages/InclusaoDeAlimentacaoCEMEIRelatorios";
import mock from "src/services/_mock";

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão Escola - Motivo Específico", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
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
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <InclusaoDeAlimentacaoCEMEIRelatorios.RelatorioEscola />
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

  it("cancela solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
    });

    const inputDia30_07_2025 = screen.getByTestId(
      "data_Evento Específico_30/07/2025"
    );
    fireEvent.click(inputDia30_07_2025);

    const inputDia31_07_2025 = screen.getByTestId(
      "data_Evento Específico_31/07/2025"
    );
    fireEvent.click(inputDia31_07_2025);

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "quero cancelar a solicitação." },
    });

    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockInclusaoMotivoEspecificoCanceladaCEMEI);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAValidarCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoCanceladaCEMEI);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de cancelamento")).toBeInTheDocument();
    expect(
      screen.getByText("30/07/2025 - justificativa: cancelada!")
    ).toBeInTheDocument();
    expect(
      screen.getByText("31/07/2025 - justificativa: cancelada!")
    ).toBeInTheDocument();
  });
});
