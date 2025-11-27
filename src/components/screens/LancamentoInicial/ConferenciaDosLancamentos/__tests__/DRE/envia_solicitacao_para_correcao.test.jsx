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
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockPeriodosGruposMedicaoSolicitarCorrecaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicaoSolicitarCorrecao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockSolicitacaoMedicaoInicialDREPediuCorrecaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicialDREPediuCorrecao";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

describe("Teste Conferência de Lançamentos - Usuário DRE - Envia para correção", () => {
  const escolaUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.escola_uuid;
  const solicitacaoUuid = mockSolicitacaoMedicaoInicialCMCTSetembro2025.uuid;

  beforeEach(async () => {
    process.env.IS_TEST = true;

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoSolicitarCorrecaoCMCTSetembro2025);
    mock
      .onGet(`/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/`)
      .reply(200, mockSolicitacaoMedicaoInicialCMCTSetembro2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [{ dia: "07", feriado: "Dia da Independência do Brasil" }],
      });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, ["2025-09-02"]);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);

    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    const search = `?uuid=${solicitacaoUuid}`;
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
              state: {
                ano: "2025",
                escolaUuid: "f206b315-fa30-4768-9fa6-07b952800284",
                mes: "09",
              },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ToastContainer />
          <ConferenciaDosLancamentosPage />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Conferência dos Lançamentos`", () => {
    expect(screen.getAllByText("Conferência dos Lançamentos").length).toBe(2);
  });

  it("renderiza valor `Setembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Setembro / 2025");
  });

  it("Renderiza label `Mês do Lançamento`", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("Renderiza status de progresso `Recebido para análise`", () => {
    expect(screen.getByText("Recebido para análise")).toBeInTheDocument();
  });

  it("Renderiza medições da solicitação", () => {
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("NOITE")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });

  it("Solicita correção para a escola e clica 'não'", async () => {
    const botaoSolicitarCorrecao = screen
      .getByText("Solicitar Correção")
      .closest("button");
    fireEvent.click(botaoSolicitarCorrecao);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deseja enviar as solicitações de correção para a UE?",
        ),
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Deseja enviar as solicitações de correção para a UE?",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("Solicita correção para a escola e clica 'sim'", async () => {
    const botaoSolicitarCorrecao = screen
      .getByText("Solicitar Correção")
      .closest("button");
    fireEvent.click(botaoSolicitarCorrecao);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deseja enviar as solicitações de correção para a UE?",
        ),
      ).toBeInTheDocument();
    });

    const botaoSim = screen.getByText("Sim").closest("button");

    mock
      .onPatch(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoUuid}/dre-solicita-correcao-medicao/`,
      )
      .reply(
        200,
        mockSolicitacaoMedicaoInicialDREPediuCorrecaoCMCTSetembro2025,
      );

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Solicitação de correção enviada para a unidade com sucesso",
        ),
      ).toBeInTheDocument();
    });
  });
});
