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
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioEMEFMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Maio2025/diasCalendario";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";
import { quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Maio2025/quantidadesAlimentacaoesLancadasPeriodoGrupo";
import { mockPanoramaEscolaEMEF } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/panoramaEscola";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025Enviada } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025Enviada";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Finaliza Medição Inicial Sem Lançamentos", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, mockPanoramaEscolaEMEF);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/"
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialEMEFMaio2025);
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/"
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEFMaio2025[0].uuid}/ceu-gestao-frequencias-dietas/`
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/"
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);

    const search = `?mes=05&ano=2025`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

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
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza períodos escolares de EMEF", () => {
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Finaliza sem lançamentos - erro programas e projetos", async () => {
    const botaoFinalizarSemLancamentos = screen
      .getByText("Finalizar sem lançamentos")
      .closest("button");
    expect(botaoFinalizarSemLancamentos).not.toBeDisabled();
    fireEvent.click(botaoFinalizarSemLancamentos);

    await waitFor(() => {
      expect(screen.getByText("Finalizar Medição Inicial sem Lançamentos"));
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "Não teve aula." },
    });

    const botaoFinalizarModal = screen.getByTestId("botao-finalizar-modal");

    mock
      .onPatch(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEFMaio2025[0].uuid}/`
      )
      .reply(400, [
        {
          periodo_escolar: "Programas e Projetos",
          erro: "Existem solicitações de alimentações no período, adicione ao menos uma justificativa para finalizar",
        },
      ]);

    fireEvent.click(botaoFinalizarModal);

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possível enviar a medição sem lançamentos!")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Existem solicitações de alimentações no período, adicione ao menos uma justificativa para finalizar"
        )
      ).toBeInTheDocument();
    });
  });

  it("Finaliza sem lançamentos com sucesso - programas e projetos possui justificativa", async () => {
    const botaoFinalizarSemLancamentos = screen
      .getByText("Finalizar sem lançamentos")
      .closest("button");
    expect(botaoFinalizarSemLancamentos).not.toBeDisabled();
    fireEvent.click(botaoFinalizarSemLancamentos);

    await waitFor(() => {
      expect(screen.getByText("Finalizar Medição Inicial sem Lançamentos"));
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "Não teve aula." },
    });

    const botaoFinalizarModal = screen.getByTestId("botao-finalizar-modal");

    mock
      .onPatch(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEFMaio2025[0].uuid}/`
      )
      .reply(200, mockSolicitacaoMedicaoInicialEMEFMaio2025Enviada);

    fireEvent.click(botaoFinalizarModal);

    await waitFor(() => {
      expect(
        screen.getByText("Medição Inicial finalizada com sucesso!")
      ).toBeInTheDocument();
    });
  });
});
