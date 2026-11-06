import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelatorioFinanceiroConsolidado } from "../RelatorioFinanceiroConsolidado";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockTotaisAtendimentoFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetTotaisConsumoAtendimento";
import { mockRelatorioFinanceiroFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import mock from "src/services/_mock";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Finalizar Análise - Relatório Financeiro", () => {
  const grupoCEI = mockGetGrupoUnidadeEscolar.results.find((grupo) =>
    grupo.nome.includes("Grupo 1"),
  )?.uuid;

  const renderizar = async ({ status, visualizar = false }) => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          initialEntries={[
            {
              search: "?uuid=123",
              state: {
                uuid: "a718592e-3ef8-43c7-923b-4f086aa9cefa",
                mes_ano: "04_2023",
                lote: ["1f06b334-cbd1-40c5-85c4-6a3d1926805b"],
                grupo_unidade_escolar: [grupoCEI],
                status: [status],
                visualizar,
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
  };

  beforeEach(() => {
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);
    mock
      .onGet("/tipos-unidade-escolar-agrupados/")
      .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);
    mock.onGet("/medicao-inicial/desconto-financeiro/").reply(200, []);
    mock
      .onGet("/medicao-inicial/clausulas-de-descontos/")
      .reply(200, mockClausulasDeDesconto);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/123/dados-medicao-final/")
      .reply(200, {});

    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
    localStorage.clear();
  });

  it("o botão Finalizar Análise abre o modal Gerar Medição Final", async () => {
    await renderizar({ status: "EM_ANALISE" });

    expect(screen.queryByText("Gerar Medição Final")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Finalizar Análise"));
    });

    expect(screen.getByText("Gerar Medição Final")).toBeInTheDocument();
    expect(
      mock.history.get.some((req) => req.url.includes("dados-medicao-final")),
    ).toBe(true);
  });

  it("não exibe o botão quando o relatório já está Gerada Medição Final", async () => {
    await renderizar({ status: "GERADA_MEDICAO_FINAL", visualizar: true });

    expect(screen.queryByText("Finalizar Análise")).not.toBeInTheDocument();
  });

  it("não exibe o botão para perfil diferente de Administrador Medição", async () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    await renderizar({ status: "EM_ANALISE" });

    expect(screen.queryByText("Finalizar Análise")).not.toBeInTheDocument();
  });

  it("após gerar com sucesso redireciona para a listagem do Relatório Financeiro", async () => {
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/buscar-responsavel/")
      .reply(200, { rf: "1234567", nome: "FULANO DE TAL" });
    mock
      .onPost("/medicao-inicial/relatorio-financeiro/123/gerar-medicao-final/")
      .reply(200, {});
    await renderizar({ status: "EM_ANALISE" });
    await act(async () => {
      fireEvent.click(screen.getByText("Finalizar Análise"));
    });

    const rf = screen.getByTestId("rf");
    fireEvent.change(rf, { target: { value: "1234567" } });
    await act(async () => {
      fireEvent.blur(rf);
    });
    fireEvent.change(screen.getByTestId("numero_processo_pagamento"), {
      target: { value: "2025/001" },
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-salvar"));
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/medicao-inicial/relatorio-financeiro/",
    );
  });
});
