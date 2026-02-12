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
import {
  mockTotaisAtendimentoFaixaEtaria,
  mockTotaisAtendimentoTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetTotaisConsumoAtendimento";
import {
  mockRelatorioFinanceiroFaixaEtaria,
  mockRelatorioFinanceiroTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";

describe("Testes da interface de Análise do Relatório Financeiro - RelatorioFinanceiroConsolidado", () => {
  const gruposUnidadeEscolar = mockGetGrupoUnidadeEscolar.results;
  const grupoCEI = gruposUnidadeEscolar.find((grupo) =>
    grupo.nome.includes("Grupo 1"),
  )?.uuid;

  beforeEach(() => {
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

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  const setup = async (grupo = grupoCEI) => {
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
                grupo_unidade_escolar: [grupo],
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
  };

  it("deve renderizar corretamente os campos do cabeçalho", async () => {
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);

    await setup();

    expect(screen.getByText("Lote e DRE")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Mês de Referência")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Reabrir Lançamentos")).toBeInTheDocument();
  });

  it("deve exibir tabelas e valores do grupo 1 - CEI", async () => {
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);

    await setup();

    for (const titulo of [
      "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
      "DIETA ESPECIAL - TIPO A",
      "DIETA ESPECIAL - TIPO B",
      "TOTAL (A)",
    ]) {
      expect(await screen.findByText(titulo)).toBeInTheDocument();
    }

    for (const valor of ["R$ 2.000,00", "R$ 4.002,00", "R$ 5.115,11"]) {
      expect(
        (
          await screen.findAllByText((_, el) =>
            el?.textContent?.includes(valor),
          )
        ).length,
      ).toBeGreaterThan(0);
    }

    expect(
      await screen.findByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();
    expect(await screen.findByText("98")).toBeInTheDocument();
    expect(await screen.findByText("R$ 154.888,20")).toBeInTheDocument();
  });

  const verificaTabelaDietas = async () => {
    const headers = await screen.findAllByRole("columnheader", {
      name: /DIETA ESPECIAL/i,
    });

    expect(headers).toHaveLength(2);
    expect(
      headers.some((h) =>
        h.textContent?.includes(
          "DIETA ESPECIAL - TIPO A, A ENTERAL E RESTRIÇÃO DE AMINOÁCIDOS",
        ),
      ),
    ).toBe(true);
    expect(
      headers.some((h) => h.textContent?.includes("DIETA ESPECIAL - TIPO B")),
    ).toBe(true);
  };

  it("deve exibir tabelas e valores do grupo 3 - EMEI", async () => {
    const grupoEMEI = gruposUnidadeEscolar.find((grupo) =>
      grupo.nome.includes("Grupo 3"),
    );

    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoEMEI,
      });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoTipoAlimentacao);

    await setup(grupoEMEI.uuid);

    for (const titulo of [
      "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
      "VALOR UNITÁRIO",
    ]) {
      expect(
        (
          await screen.findAllByRole("columnheader", {
            name: titulo,
          })
        ).length,
      ).toBeGreaterThan(0);
    }
    expect(screen.getByText("TOTAL (B)")).toBeInTheDocument();

    await verificaTabelaDietas();

    expect(
      await screen.findByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();
    expect(await screen.findByText("9.196")).toBeInTheDocument();
    expect(await screen.findByText("R$ 101.226,08")).toBeInTheDocument();
  });

  it("deve exibir tabelas e valores do grupo 4 - EMEF", async () => {
    const grupoEMEF = gruposUnidadeEscolar.find((grupo) =>
      grupo.nome.includes("Grupo 4"),
    );

    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoEMEF,
      });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoTipoAlimentacao);

    await setup(grupoEMEF.uuid);

    for (const titulo of [
      "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
      "VALOR DO REAJUSTE",
    ]) {
      expect(
        (
          await screen.findAllByRole("columnheader", {
            name: titulo,
          })
        ).length,
      ).toBeGreaterThan(0);
    }
    expect(screen.getByText("TOTAL (C)")).toBeInTheDocument();

    await verificaTabelaDietas();

    expect(
      await screen.findByText("QUANTIDADE SERVIDA (A + B + C):"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "(Cento e dois mil quatrocentos e sessenta e oito reais e cinquenta e seis centavos.)",
      ),
    ).toBeInTheDocument();
  });

  it("deve exibir tabelas e valores do grupo 6 - CIEJA", async () => {
    const grupoCIEJA = gruposUnidadeEscolar.find((grupo) =>
      grupo.nome.includes("Grupo 6"),
    );

    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoCIEJA,
      });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoTipoAlimentacao);

    await setup(grupoCIEJA.uuid);

    expect(await screen.findByText("(Zero centavos.)")).toBeInTheDocument();
  });
});
