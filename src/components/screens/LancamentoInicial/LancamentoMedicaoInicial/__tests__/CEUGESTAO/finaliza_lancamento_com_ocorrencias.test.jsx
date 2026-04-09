import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioCEUGESTAO_NOVEMBRO24 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/diasCalendarioCEUGESTAO_NOVEMBRO24";
import { mockMeusDadosEscolaCEUGESTAO } from "src/mocks/meusDados/escolaCeuGestao";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO } from "src/mocks/services/cadastroTipoAlimentacao.service/CEUGESTAO/mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO";
import { mockGetEscolaSimplesCEUGESTAO } from "src/mocks/services/escola.service/CEUGESTAO/mockGetEscolaSimplesCEUGESTAO";
import { mockgetEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCEUGESTAO";
import { mockGetPeriodosInclusaoContinuaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getPeriodosInclusaoContinuaCEUGESTAO";
import { mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEUGESTAO/getSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO";
import { mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEUGESTAO/getQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO";
import { mockGetSolicitacaoMedicaoInicialCEUGESTAO } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEUGESTAO/getSolicitacaoMedicaoInicialCEUGESTAO";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Finaliza Lançamento com Ocorrências", () => {
  beforeEach(async () => {
    // Mock da data atual para 01/01/2025
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T10:00:00.000Z"));

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEUGESTAO);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, []);
    mock
      .onGet("/escolas-simples/b11a2964-c9e0-488a-bb7f-6e11df2c903b/")
      .reply(200, mockGetEscolaSimplesCEUGESTAO);
    mock
      .onGet("/historico-escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/")
      .reply(200, {});
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/b11a2964-c9e0-488a-bb7f-6e11df2c903b/",
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEUGESTAO);
    mock.onGet("/medicao-inicial/recreio-nas-ferias/").reply(200, {
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockGetSolicitacaoMedicaoInicialCEUGESTAO);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioCEUGESTAO_NOVEMBRO24);
    mock
      .onGet("/periodos-escolares/inclusao-continua-por-mes/")
      .reply(200, mockGetPeriodosInclusaoContinuaCEUGESTAO);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, mockGetSolicitacoesKitLanchesAutorizadasEscolaCEUGESTAO);
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/",
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, mockGetQuantidadeAlimentacoesLancadasPeriodoGrupoCEUGESTAO);
    mock
      .onGet(
        "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/",
      )
      .reply(
        200,
        mockgetEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola,
      );
    mock
      .onGet(
        "/escola-solicitacoes/ultimo-dia-com-solicitacao-autorizada-no-mes/",
      )
      .reply(200, { ultima_data: "2024-11-29" });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/ceu-gestao-frequencias-dietas/",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/solicitacoes-lancadas/")
      .reply(200, { data: [] });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/ultimo-dia-com-solicitacao-autorizada-no-mes/",
      )
      .reply(200, { ultima_data: null });
    mock
      .onGet(
        "/escola-simples/b11a2964-c9e0-488a-bb7f-6e11df2c903b/historico-escola/",
      )
      .reply(200, mockGetEscolaSimplesCEUGESTAO);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/permissoes-lancamentos-especiais/periodos-mes-ano/",
      )
      .reply(200, { results: [] });
    mock.onGet("/medicao-inicial/lanches-emergenciais/").reply(200, []);
    mock
      .onGet("/medicao-inicial/periodos-grupo/cemei-com-alunos-emei/")
      .reply(200, { results: [] });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("nome_instituicao", `"CEU GESTAO INACIO MONTEIRO"`);
  });

  afterEach(() => {
    jest.useRealTimers();
    mock.reset();
  });

  it("Deve finalizar lançamento com ocorrências", async () => {
    await waitFor(() => {
      const selectPeriodo = screen.getByTestId("select-periodo-lancamento");
      expect(selectPeriodo).toBeInTheDocument();
    });

    const selectPeriodo = screen.getByTestId("select-periodo-lancamento");
    fireEvent.click(selectPeriodo);

    const opcaoNovembro = screen.getByText("Novembro / 2024");
    fireEvent.click(opcaoNovembro);

    // Simula a atualização da URL após selecionar o período
    const search = `?mes=11&ano=2024`;
    window.history.pushState({}, "", search);

    await waitFor(() => {
      const botaoFinalizar = screen.queryByText("Finalizar");
      expect(botaoFinalizar).toBeInTheDocument();
    });

    const botaoFinalizar = screen.getByText("Finalizar").closest("button");
    expect(botaoFinalizar).not.toBeDisabled();
    fireEvent.click(botaoFinalizar);

    await waitFor(() => {
      expect(screen.getByText("Avaliação do Serviço")).toBeInTheDocument();
    });

    const radioNaoComOcorrencias = screen.getByLabelText(
      "Não, com ocorrências",
    );
    fireEvent.click(radioNaoComOcorrencias);

    await waitFor(() => {
      expect(screen.getByText("Anexar arquivos")).toBeInTheDocument();
    });

    const botaoAnexarArquivos = screen
      .getByText("Anexar arquivos")
      .closest("button");
    expect(botaoAnexarArquivos).not.toBeDisabled();
    fireEvent.click(botaoAnexarArquivos);

    const inputFile = screen.getByTestId("input-anexar-arquivos");

    const pdfFile = new File(["dummy pdf content"], "documento.pdf", {
      type: "application/pdf",
    });
    const xlsxFile = new File(["dummy excel content"], "planilha.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    fireEvent.change(inputFile, {
      target: { files: [pdfFile, xlsxFile] },
    });

    expect(inputFile.files).toHaveLength(2);
    expect(inputFile.files[0].name).toBe("documento.pdf");
    expect(inputFile.files[1].name).toBe("planilha.xlsx");

    await waitFor(() => {
      expect(screen.getByText("documento.pdf")).toBeInTheDocument();
      expect(screen.getByText("planilha.xlsx")).toBeInTheDocument();
    });

    const botaoFinalizarMedicao = screen
      .getByText("Finalizar Medição")
      .closest("button");
    expect(botaoFinalizarMedicao).not.toBeDisabled();

    mock
      .onPatch(
        "/medicao-inicial/solicitacao-medicao-inicial/546505cb-eef1-4080-a8e8-7538faccf969/",
      )
      .reply(200, {});

    fireEvent.click(botaoFinalizarMedicao);

    await waitFor(() => {
      expect(
        screen.getByText("Medição Inicial finalizada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Remove arquivo e exibe erro", async () => {
    await waitFor(() => {
      const selectPeriodo = screen.getByTestId("select-periodo-lancamento");
      expect(selectPeriodo).toBeInTheDocument();
    });

    const selectPeriodo = screen.getByTestId("select-periodo-lancamento");
    fireEvent.click(selectPeriodo);

    const opcaoNovembro = screen.getByText("Novembro / 2024");
    fireEvent.click(opcaoNovembro);

    // Simula a atualização da URL após selecionar o período
    const search = `?mes=11&ano=2024`;
    window.history.pushState({}, "", search);

    await waitFor(() => {
      const botaoFinalizar = screen.queryByText("Finalizar");
      expect(botaoFinalizar).toBeInTheDocument();
    });

    const botaoFinalizar = screen.getByText("Finalizar").closest("button");
    expect(botaoFinalizar).not.toBeDisabled();
    fireEvent.click(botaoFinalizar);

    await waitFor(() => {
      expect(screen.getByText("Avaliação do Serviço")).toBeInTheDocument();
    });

    const radioNaoComOcorrencias = screen.getByLabelText(
      "Não, com ocorrências",
    );
    fireEvent.click(radioNaoComOcorrencias);

    await waitFor(() => {
      expect(screen.getByText("Anexar arquivos")).toBeInTheDocument();
    });

    const botaoAnexarArquivos = screen
      .getByText("Anexar arquivos")
      .closest("button");
    expect(botaoAnexarArquivos).not.toBeDisabled();
    fireEvent.click(botaoAnexarArquivos);

    const inputFile = screen.getByTestId("input-anexar-arquivos");

    expect(screen.getByText("Finalizar").closest("button")).toBeDisabled();
  });

  it("Não abre modal de avaliação quando Finalizar está desabilitado", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-12-02T10:00:00Z"));
    await renderPage();

    const botaoFinalizar = screen.getByText("Finalizar").closest("button");
    expect(botaoFinalizar).toBeDisabled();

    fireEvent.click(botaoFinalizar);

    expect(screen.queryByText("Avaliação do Serviço")).not.toBeInTheDocument();
  });
});
