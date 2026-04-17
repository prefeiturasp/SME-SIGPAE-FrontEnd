import { act, render, screen, waitFor } from "@testing-library/react";
import { RelatorioFinanceiroConsolidado } from "../RelatorioFinanceiroConsolidado";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockRelatoriosFinanceiro } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatoriosFinanceiro";
import { mockDadosLiquidacao } from "src/mocks/services/relatorioFinanceiro.service/mockGetDadosLiquidacao";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockTotaisAtendimentoFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetTotaisConsumoAtendimento";
import { mockRelatorioFinanceiroFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MemoryRouter } from "react-router-dom";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import mock from "src/services/_mock";

describe("Testes da interface em caso de Visualização do Relatório Financeiro - Relatorio Financeiro", () => {
  const gruposUnidadeEscolar = mockGetGrupoUnidadeEscolar.results;
  const grupoCEI = gruposUnidadeEscolar.find((grupo) =>
    grupo.nome.includes("Grupo 1"),
  )?.uuid;

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
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dados-liquidacao/")
      .reply(200, mockDadosLiquidacao);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);
    mock
      .onPost(`/medicao-inicial/relatorio-financeiro/exportar-pdf/123/`)
      .reply(200, {});

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
                grupo_unidade_escolar: [grupoCEI],
                status: ["EM_ANALISE"],
                visualizar: true,
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

  it("deve renderizar corretamente os campos do cabeçalho", async () => {
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);

    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Mês de Referência")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("deve verificar botão exportar PDF e excutar ação", async () => {
    const botaoPDF = screen.getByTestId("botao-pdf");
    expect(botaoPDF).toBeInTheDocument();
    expect(botaoPDF).toBeVisible();

    botaoPDF.click();

    await waitFor(() => {
      expect(
        screen.getByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
    });
  });

  it("deve ocultar ações de edição no modo visualização", async () => {
    expect(screen.queryByText("Editar Empenhos")).not.toBeInTheDocument();
    expect(screen.queryByText("Aplicar Descontos")).not.toBeInTheDocument();
    expect(screen.queryByText("Finalizar Análise")).not.toBeInTheDocument();
    expect(screen.getByTestId("botao-pdf")).toBeInTheDocument();
    expect(screen.queryByText("Reabrir Lançamentos")).not.toBeInTheDocument();
  });
});
