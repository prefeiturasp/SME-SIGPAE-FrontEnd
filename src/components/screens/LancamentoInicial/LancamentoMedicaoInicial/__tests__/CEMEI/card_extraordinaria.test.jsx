import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  PERIODO_LANCAMENTO_CEI,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioAgosto2024CEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/diasCalendarioAgosto2024";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesCEMEI } from "src/mocks/services/escola.service/CEMEI/escolaSimples";
import { mockSolicitacaoMedicaoInicialCEMEI } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEMEI/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="loc-periodo">{location.state?.periodo}</span>;
};

describe("Detalhamento CEMEI - card Solicitações de Alimentação Extraordinárias", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  const solicitacao = {
    ...mockSolicitacaoMedicaoInicialCEMEI[0],
    status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    lanche_emergencial_extraordinario: true,
  };

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCEMEI);
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
      .reply(200, { results: ["Infantil INTEGRAL"] });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, [solicitacao]);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioAgosto2024CEMEI);
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
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, {
        results: [
          {
            nome_periodo_grupo: GRUPO_EXTRAORDINARIO,
            status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
            valor_total: 0,
            valores: [{ nome_campo: "lanche_emergencial", valor: "0" }],
          },
        ],
      });
    mock
      .onGet(
        "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/",
      )
      .reply(200, { results: [] });
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock.onGet(`/historico-escola/${escolaUuid}/`).reply(200, {
      nome: mockEscolaSimplesCEMEI.nome,
      tipo_unidade: mockEscolaSimplesCEMEI.tipo_unidade,
    });

    window.history.pushState({}, "", "?mes=08&ano=2024");

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
            <Routes>
              <Route path="/" element={<LancamentoMedicaoInicialPage />} />
              <Route
                path={`/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO_CEI}`}
                element={<LocationProbe />}
              />
            </Routes>
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza o card Solicitações de Alimentação Extraordinárias", () => {
    expect(screen.getByText(GRUPO_EXTRAORDINARIO)).toBeInTheDocument();
  });

  it("ao clicar em Corrigir, navega para o lançamento do período extraordinário", async () => {
    const card = screen
      .getByText(GRUPO_EXTRAORDINARIO)
      .closest(".lancamento-por-periodo-card");
    fireEvent.click(within(card).getByText("Corrigir").closest("button"));

    await waitFor(() =>
      expect(screen.getByTestId("loc-periodo")).toHaveTextContent(
        GRUPO_EXTRAORDINARIO,
      ),
    );
  });
});
