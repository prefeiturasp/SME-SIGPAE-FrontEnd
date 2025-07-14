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
import { mockInclusaoMotivoEspecificoAutorizadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoAutorizada";
import { mockInclusaoMotivoEspecificoNegadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoNegada";
import { mockInclusaoMotivoEspecificoValidadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoValidada";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetVinculosMotivoEspecificoCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosMotivoEspecifico";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import * as InclusaoDeAlimentacaoCEMEIRelatorios from "src/pages/InclusaoDeAlimentacaoCEMEIRelatorios";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ data, onChange }) => (
    <textarea
      data-testid="mock-ckeditor"
      value={data}
      onChange={(e) => {
        onChange(null, {
          getData: () => e.target.value,
        });
      }}
    />
  ),
}));

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão CODAE - Motivo Específico", () => {
  process.env.IS_TEST = true;

  const escolaUuid = mockInclusaoMotivoEspecificoValidadaCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoValidadaCEMEI);
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
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}/codae-cancela-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoNegadaCEMEI);

    const search = `?uuid=${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <InclusaoDeAlimentacaoCEMEIRelatorios.RelatorioCODAE />
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

  it("autoriza a solicitação", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}/codae-autoriza-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoAutorizadaCEMEI);

    const botaoAutorizar = screen.getByText("Autorizar").closest("button");
    fireEvent.click(botaoAutorizar);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("mock-ckeditor");
    fireEvent.change(textarea, {
      target: { value: "autorizado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoAutorizadaCEMEI);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE autorizou")).toBeInTheDocument();
    expect(
      screen.getByText("14/07/2025 13:45:55 - Informações da CODAE")
    ).toBeInTheDocument();
    expect(screen.getByText("sim, eu autorizo")).toBeInTheDocument();
  });

  it("nega a solicitação", async () => {
    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("mock-ckeditor");
    fireEvent.change(textarea, {
      target: { value: "negado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    expect(botaoSim).not.toBeDisabled();
    fireEvent.click(botaoSim);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoNegadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação negada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE negou")).toBeInTheDocument();
  });
});
