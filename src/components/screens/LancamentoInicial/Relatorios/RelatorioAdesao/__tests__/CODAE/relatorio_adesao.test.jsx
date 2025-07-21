import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockMesesAnosRelatorioAdesao } from "src/mocks/services/medicaoInicial/dashboard.service/mesesAnosRelatorioAdesao";
import { RelatorioAdesaoPage } from "src/pages/LancamentoMedicaoInicial/Relatorios/RelatorioAdesaoPage";
import mock from "src/services/_mock";

describe("Teste Relatório de Adesão - Visão CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/escolas-para-filtros/").reply(200, mockEscolasParaFiltros);
    mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
    mock.onGet("/tipos-alimentacao/").reply(200, mockTiposAlimentacao);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockMesesAnosRelatorioAdesao);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriaRegionalSimplissima);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "uuid_instituicao",
      mockMeusDadosCODAEGA.vinculo_atual.instituicao.uuid
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioAdesaoPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza titulo e breadcrumb `Relatório de Adesão`", () => {
    expect(screen.queryAllByText("Relatório de Adesão")).toHaveLength(2);
  });
});
