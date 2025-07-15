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
import { mockInclusaoMotivoEspecificoQuestionadaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoQuestionada";
import { mockInclusaoMotivoEspecificoQuestionadaRespostaNaoCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoQuestionadaRespostaNao";
import { mockInclusaoMotivoEspecificoQuestionadaRespostaSimCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoQuestionadaRespostaSim";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
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

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão Terceirizada - Motivo Específico - Prazo Limite", () => {
  process.env.IS_TEST = true;

  const escolaUuid = mockInclusaoMotivoEspecificoQuestionadaCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoQuestionadaCEMEI);
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

    const search = `?uuid=${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

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
              meusDados: mockMeusDadosTerceirizada,
              setMeusDados: jest.fn(),
            }}
          >
            <InclusaoDeAlimentacaoCEMEIRelatorios.RelatorioTerceirizada />
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

  it("aceita a solicitação", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}/terceirizada-responde-questionamento/`
      )
      .reply(200, mockInclusaoMotivoEspecificoQuestionadaRespostaSimCEMEI);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(screen.getByText("Resposta: Sim")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    expect(botaoEnviar).toBeDisabled();

    const textarea = screen.getByTestId("textarea-observacao-questionamento");
    fireEvent.change(textarea, {
      target: { value: "Aceito." },
    });

    expect(botaoEnviar).not.toBeDisabled();

    fireEvent.click(botaoEnviar);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoQuestionadaRespostaSimCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento respondido com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não")).not.toBeInTheDocument();
    expect(screen.queryByText("Sim")).not.toBeInTheDocument();

    expect(
      screen.getByText("Observação da Terceirizada: Aceito.")
    ).toBeInTheDocument();
  });

  it("não aceita a solicitação", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}/terceirizada-responde-questionamento/`
      )
      .reply(200, mockInclusaoMotivoEspecificoQuestionadaRespostaNaoCEMEI);

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(screen.getByText("Resposta: Não")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    expect(botaoEnviar).toBeDisabled();

    const textarea = screen.getByTestId("textarea-observacao-questionamento");
    fireEvent.change(textarea, {
      target: { value: "Não aceito." },
    });

    expect(botaoEnviar).not.toBeDisabled();

    fireEvent.click(botaoEnviar);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoQuestionadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoQuestionadaRespostaNaoCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento respondido com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não")).not.toBeInTheDocument();
    expect(screen.queryByText("Sim")).not.toBeInTheDocument();

    expect(
      screen.getByText("Observação da Terceirizada: Não aceito.")
    ).toBeInTheDocument();
  });
});
