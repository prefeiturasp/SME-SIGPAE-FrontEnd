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
  PERIODO_LANCAMENTO,
} from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosEscolaCMCT } from "src/mocks/meusDados/escolaCMCT";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockEscolaSimplesCMCT } from "src/mocks/services/escola.service/CMCT/escolaSimples";
import { mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CMCT/periodosSolicitacoesAutorizadasEscola";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div>
      <span data-testid="loc-pathname">{location.pathname}</span>
      <span data-testid="loc-search">{location.search}</span>
      <span data-testid="loc-grupo">{location.state?.grupo}</span>
    </div>
  );
};

describe("Detalhamento do lançamento - card Solicitações de Alimentação Extraordinárias", () => {
  const escolaUuid = mockMeusDadosEscolaCMCT.vinculo_atual.instituicao.uuid;

  const solicitacao = {
    ...mockSolicitacaoMedicaoInicialCMCTSetembro2025[0],
    status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    lanche_emergencial_extraordinario: true,
  };

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCMCT);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCMCT);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/solicitacoes-lancadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, [solicitacao]);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6" },
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
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacao.uuid}/ceu-gestao-frequencias-dietas/`,
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
      .reply(
        200,
        mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT,
      );

    window.history.pushState({}, "", "?mes=11&ano=2024");
    Object.defineProperty(global, "localStorage", { value: localStorageMock });

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
              meusDados: mockMeusDadosEscolaCMCT,
              setMeusDados: jest.fn(),
            }}
          >
            <Routes>
              <Route path="/" element={<LancamentoMedicaoInicialPage />} />
              <Route
                path={`/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO}`}
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

  it("ao clicar em Corrigir, navega para o lançamento com o grupo e flag corretos", async () => {
    const card = screen
      .getByText(GRUPO_EXTRAORDINARIO)
      .closest(".lancamento-por-periodo-card");
    fireEvent.click(within(card).getByText("Corrigir").closest("button"));

    await waitFor(() =>
      expect(screen.getByTestId("loc-grupo")).toHaveTextContent(
        GRUPO_EXTRAORDINARIO,
      ),
    );
    expect(screen.getByTestId("loc-search")).toHaveTextContent(
      "ehGrupoSolicitacoesDeAlimentacao=true",
    );
    expect(screen.getByTestId("loc-pathname")).toHaveTextContent(
      `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO}`,
    );
  });
});
