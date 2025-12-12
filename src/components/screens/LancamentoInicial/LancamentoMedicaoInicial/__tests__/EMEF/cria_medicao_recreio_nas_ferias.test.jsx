import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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
import { mockRecreioNasFeriasEMEFDezembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/recreioNasFerias";
import { mockSolicitacaoComRecreioNasFeriasCriadaDezembro2025EMEF } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/solicitacaoRecreioNasFeriasCriada";
import { mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/solicitacaoRecreioNasFerias";
import { quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Maio2025/quantidadesAlimentacaoesLancadasPeriodoGrupo";
import { mockPanoramaEscolaEMEF } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/panoramaEscola";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Cria Medição com Recreio nas Ferias", () => {
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
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioNasFeriasEMEFDezembro2025);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoInicialEMEFMaio2025);
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
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEFMaio2025[0].uuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);

    const search = `?mes=12&ano=2025`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
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
        </MemoryRouter>,
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
    expect(screen.getByText("Manhã")).toBeInTheDocument();
    expect(screen.getByText("Tarde")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Seleciona renderiza opção, seleciona `Recreio nas Férias - Dez 25` e cria a medição", async () => {
    await act(async () => {
      const select = screen.getByTestId("select-periodo-lancamento");
      fireEvent.click(select);

      mock
        .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
        .replyOnce(200, []);

      fireEvent.mouseDown(
        screen
          .getByTestId("select-periodo-lancamento")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("Recreio nas Férias - Dez 25"));
    await act(async () => {
      fireEvent.click(screen.getByText("Recreio nas Férias - Dez 25"));
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    expect(botaoSalvar).toBeDisabled();

    const botaoEditar = screen.getByText("Editar").closest("button");
    fireEvent.click(botaoEditar);

    await waitFor(() => {
      expect(botaoSalvar).toBeEnabled();
    });

    const multiselectContagemRefeicoes = screen.getByTestId(
      "multiselect-contagem-refeicoes",
    );
    const selectControl = within(multiselectContagemRefeicoes).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControl);

    const optionFichasColoridas = screen.getByText("Fichas Coloridas");
    fireEvent.click(optionFichasColoridas);

    const inputResponsavelNome = screen.getByTestId("input-responsavel-nome-0");
    fireEvent.change(inputResponsavelNome, {
      target: { value: "Fulano da Silva" },
    });

    const inputResponsavelRf = screen.getByTestId("input-responsavel-rf-0");
    fireEvent.change(inputResponsavelRf, {
      target: { value: "1234567" },
    });

    mock
      .onPost("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(201, mockSolicitacaoComRecreioNasFeriasCriadaDezembro2025EMEF);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF);

    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText("Medição Inicial criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });
});
