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
import { mockInclusaoMotivoEspecificoQuestionadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoQuestionada";
import { mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoValidadaPrazoLimite";
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

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão CODAE - Motivo Específico - Prazo Limite", () => {
  process.env.IS_TEST = true;

  const escolaUuid =
    mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI);
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
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.uuid}/codae-cancela-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoNegadaCEMEI);

    const search = `?uuid=${mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
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

  it("renderiza título da página `Inclusão de Alimentação - Solicitação # 512C3`", async () => {
    expect(
      screen.getByText("Inclusão de Alimentação - Solicitação # 512C3")
    ).toBeInTheDocument();
  });

  it("renderiza dados da solicitação", async () => {
    expect(screen.getByText("Solicitação no prazo limite")).toBeInTheDocument();

    const span = container.querySelector(".dre-name");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("CEMEI SUZANA CAMPOS TAUIL");

    expect(
      screen.getByText("Solicitação de Inclusão de Alimentação")
    ).toBeInTheDocument();
    expect(screen.getByText("Evento Específico")).toBeInTheDocument();

    expect(screen.getByText("Alunos EMEI")).toBeInTheDocument();
  });

  it("questiona a solicitação", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.uuid}/codae-questiona-pedido/`
      )
      .reply(200, mockInclusaoMotivoEspecificoQuestionadaCEMEI);

    const botaoQuestionar = screen.getByText("Questionar").closest("button");
    fireEvent.click(botaoQuestionar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "É possível atender a solicitação com todos os itens previstos no contrato?"
        )
      ).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoValidadaPrazoLimiteCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoQuestionadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento enviado com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Questionar")).not.toBeInTheDocument();

    expect(screen.getByText("Questionamento pela CODAE")).toBeInTheDocument();
    expect(screen.getByText("14/07/2025 14:52:58 - CODAE")).toBeInTheDocument();
    expect(screen.getByText("Observação da CODAE:")).toBeInTheDocument();
  });
});
