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
import { mockInclusaoMotivoEspecificoNegadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoNegada";
import { mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoValidadaSolicitacoesSimilares";
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

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão CODAE - Solicitações Similares", () => {
  process.env.IS_TEST = true;

  const escolaUuid =
    mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.uuid}/`
      )
      .replyOnce(
        200,
        mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI
      );
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
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.uuid}/codae-cancela-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoNegadaCEMEI);

    const search = `?uuid=${mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
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

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # E80EE`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # E80EE")
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
    expect(screen.getByText("Dia da família")).toBeInTheDocument();

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();
  });

  it("exibe solicitações similiares", async () => {
    expect(screen.queryAllByText("#E335E")).toHaveLength(2);
  });

  it("download pdf", async () => {
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.uuid}/relatorio/`
      )
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    const botaoImprimir = screen.getByTestId("botao-imprimir");
    fireEvent.click(botaoImprimir);

    await waitFor(() => {
      expect(
        screen.queryByText("Houve um erro ao imprimir o relatório")
      ).not.toBeInTheDocument();
    });
  });

  it("erro download pdf", async () => {
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaSolicitacoesSimilaresCEMEI.uuid}/relatorio/`
      )
      .reply(400, { detail: "Erro ao baixar PDF" });

    const botaoImprimir = screen.getByTestId("botao-imprimir");
    fireEvent.click(botaoImprimir);

    await waitFor(() => {
      expect(
        screen.getByText("Houve um erro ao imprimir o relatório")
      ).toBeInTheDocument();
    });
  });

  it("expande collapse solicitações similares", async () => {
    const spanToggleExpandirSolicitacaoSimilar =
      screen.getByTestId("toggle-expandir-0");
    fireEvent.click(spanToggleExpandirSolicitacaoSimilar);
    const icon = spanToggleExpandirSolicitacaoSimilar.querySelector("i");
    expect(icon).toHaveClass("fa-chevron-up");
  });
});
