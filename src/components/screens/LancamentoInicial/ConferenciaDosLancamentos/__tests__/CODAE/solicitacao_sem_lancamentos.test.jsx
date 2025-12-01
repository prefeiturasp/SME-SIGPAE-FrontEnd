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
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockStateConferenciaLancamentosSemLancamentosEMEFJunho2025 } from "src/mocks/medicaoInicial/ConferenciaDeLancamentos/states/stateConferenciaLancamentosSemLancamentosEMEFJunho2025";
import { mockDiasCalendarioEMEFMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Maio2025/diasCalendario";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockPeriodosGruposMedicaoSemLancamentoEMEFJunho2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Junho2025/periodosGruposMedicaoSemLancamento";
import { mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Junho2025/solicitacaoMedicaoInicialSemLancamento";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea
      data-testid="ckeditor-mock"
      name="justificativa"
      required={false}
    />
  ),
}));

describe("Teste Conferência de Lançamentos - Usuário Medição - Solicitação sem lançamentos", () => {
  const escolaUuid =
    mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025.escola_uuid;

  beforeEach(async () => {
    process.env.IS_TEST = true;
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoSemLancamentoEMEFJunho2025);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025.uuid}/`,
      )
      .reply(200, mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [
          {
            dia: "19",
            feriado: "Corpus Christi",
          },
        ],
      });
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onPatch(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025.uuid}/codae-solicita-correcao-sem-lancamentos/`,
      )
      .reply(200, []);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);

    const search = `?uuid=${mockSolicitacaoMedicaoInicialSemLancamentoEMEFJunho2025.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateConferenciaLancamentosSemLancamentosEMEFJunho2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ConferenciaDosLancamentosPage />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Conferência dos Lançamentos`", () => {
    expect(screen.getAllByText("Conferência dos Lançamentos").length).toBe(2);
  });

  it("Renderiza label `Mês do Lançamento`", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("Renderiza bloco da justificativa sem lançamentos", () => {
    expect(
      screen.getByText("Unidade sem lançamentos no mês"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa do envio da medição sem lançamentos:"),
    ).toBeInTheDocument();
    expect(screen.getByText("teste")).toBeInTheDocument();
  });

  it("Renderiza períodos sem lançamentos", () => {
    expect(
      screen.getByText("Acompanhamento do lançamento"),
    ).toBeInTheDocument();

    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();

    expect(screen.getAllByText("Sem Lançamentos")).toHaveLength(3);
  });

  it("Solicita Correção da Solicitação sem Lançamentos", async () => {
    expect(screen.getByText("Solicitar Correção")).toBeInTheDocument();

    const botaoSolicitarCorrecao = screen
      .getByText("Solicitar Correção")
      .closest("button");
    fireEvent.click(botaoSolicitarCorrecao);

    expect(
      screen.getByText("Solicitação de Correção de Medição Inicial"),
    ).toBeInTheDocument();

    const textarea = screen.getByTestId("ckeditor-mock");
    fireEvent.change(textarea, {
      target: { value: "justificativa de correção" },
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(async () => {
      expect(
        screen.getByText(
          "Solicitação de correção enviada para a Unidade com sucesso!",
        ),
      ).toBeInTheDocument();
    });
  });
});
