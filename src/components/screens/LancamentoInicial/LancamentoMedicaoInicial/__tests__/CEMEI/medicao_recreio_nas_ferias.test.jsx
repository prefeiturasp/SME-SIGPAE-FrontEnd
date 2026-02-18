import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesCEMEI } from "src/mocks/services/escola.service/CEMEI/escolaSimples";
import { mockDiasCalendarioDezembro2025CEMEI } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEMEI/Dezembro2025/diasCalendario";
import { mockRecreioNasFeriasCEMEIDezembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEMEI/Dezembro2025/recreioNasFerias";
import { mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025CEMEI } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEMEI/Dezembro2025/solicitacaoRecreioNasFerias";
import { mockPanoramaEscolaCEMEIDezembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEMEI/Dezembro2025/panoramaEscola";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CEMEI - Renderiza Medição com Recreio nas Ferias", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, mockPanoramaEscolaCEMEIDezembro2025);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCEMEI);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioNasFeriasCEMEIDezembro2025);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-escola-cemei-com-alunos-emei/",
      )
      .reply(200, {
        results: ["Infantil INTEGRAL"],
      });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025CEMEI);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioDezembro2025CEMEI);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: null,
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, { results: [] });
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock.onGet(`/historico-escola/${escolaUuid}/`).reply(200, {
      nome: mockEscolaSimplesCEMEI.nome,
      tipo_unidade: mockEscolaSimplesCEMEI.tipo_unidade,
    });

    const search = `?mes=12&ano=2025&recreio_nas_ferias=cd27796f-9dbf-4e36-ac14-c44f23d41cd4`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
              meusDados: mockMeusDadosEscolaCEMEI,
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

  it("Renderiza períodos Recreio nas Férias e Colaboradores", () => {
    expect(
      screen.getByText("Recreio nas Férias - de 0 a 3 anos e 11 meses"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Recreio nas Férias - 4 a 14 anos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
  });
});
