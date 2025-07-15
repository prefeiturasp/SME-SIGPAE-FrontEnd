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
import { mockInclusaoMotivoEspecificoConferidaCEMEI } from "src/mocks/InclusaoAlimentacao/CEMEI/MotivoEspecifico/inclusaoMotivoEspecificoConferida";
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

describe("Teste Relatório Inclusão de Alimentação CEMEI - Visão Terceirizada - Motivo Específico - Prazo Limite - Marcar Conferência", () => {
  process.env.IS_TEST = true;

  const escolaUuid = mockInclusaoMotivoEspecificoAutorizadaCEMEI.escola.uuid;

  let container;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAutorizadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoAutorizadaCEMEI);
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

    const search = `?uuid=${mockInclusaoMotivoEspecificoAutorizadaCEMEI.uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
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

  it("marca conferência", async () => {
    mock
      .onPatch(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAutorizadaCEMEI.uuid}/marcar-conferida/`
      )
      .reply(200, mockInclusaoMotivoEspecificoConferidaCEMEI);

    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deseja marcar essa solicitação como conferida? A ação não poderá ser desfeita."
        )
      ).toBeInTheDocument();
    });

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(botaoConfirmar);

    mock
      .onGet(
        `/inclusao-alimentacao-cemei/${mockInclusaoMotivoEspecificoAutorizadaCEMEI.uuid}/`
      )
      .replyOnce(200, mockInclusaoMotivoEspecificoConferidaCEMEI);

    await waitFor(() => {
      expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
    });

    expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
  });
});
