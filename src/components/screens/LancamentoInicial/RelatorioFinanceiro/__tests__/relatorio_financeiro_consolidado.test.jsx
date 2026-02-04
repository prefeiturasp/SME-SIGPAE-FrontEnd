import { act, render, screen } from "@testing-library/react";
import { RelatorioFinanceiroConsolidado } from "../RelatorioFinanceiroConsolidado";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockRelatoriosFinanceiro } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatoriosFinanceiro";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockTotaisAtendimentoFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetTotaisConsumoAtendimento";
import { mockRelatorioFinanceiroConsolidado } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";

describe("Testes da interface de Análise do Relatório Financeiro - RelatorioFinanceiroConsolidado", () => {
  beforeEach(async () => {
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/")
      .reply(200, mockRelatoriosFinanceiro);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);
    mock
      .onGet("/tipos-unidade-escolar-agrupados/")
      .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);
    mock
      .onGet(`/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/`)
      .reply(200, mockRelatorioFinanceiroConsolidado);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
          initialEntries={[
            {
              search: "?uuid=123",
              state: {
                uuid: "a718592e-3ef8-43c7-923b-4f086aa9cefa",
                mes_ano: "04_2023",
                lote: ["1f06b334-cbd1-40c5-85c4-6a3d1926805b"],
                grupo_unidade_escolar: ["550e8400-e29b-41d4-a716-446655440000"],
                status: ["RELATORIO_FINANCEIRO_GERADO"],
              },
            },
          ]}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioFinanceiroConsolidado />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar corretamente os campos do cabeçalho", () => {
    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Mês de Referência")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Reabrir Lançamentos")).toBeInTheDocument();
  });

  it("deve exibir tabelas e respectivos valores relacionados ao grupo 1 - CEI", () => {
    [
      "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
      "DIETA ESPECIAL - TIPO A",
      "DIETA ESPECIAL - TIPO B",
      "TOTAL (A)",
    ].forEach((tituloTabela) => {
      expect(screen.getByText(tituloTabela)).toBeInTheDocument();
    });

    ["R$ 2.000,00", "R$ 4.002,00", "R$ 5.115,11"].forEach((valor) => {
      expect(
        screen.getAllByText((_, el) => el?.textContent?.includes(valor)).length,
      ).toBeGreaterThan(0);
    });
  });

  it("deve exibir o componente de consolidado total", () => {
    expect(
      screen.getByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
    expect(screen.getByText("R$ 154.888,20")).toBeInTheDocument();
  });
});
