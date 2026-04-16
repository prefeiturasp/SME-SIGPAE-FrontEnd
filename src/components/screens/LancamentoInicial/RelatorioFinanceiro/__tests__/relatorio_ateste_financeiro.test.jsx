import { act, render, screen } from "@testing-library/react";
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
import {
  mockTotaisAtendimentoFaixaEtaria,
  mockTotaisAtendimentoTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetTotaisConsumoAtendimento";
import {
  mockRelatorioFinanceiroCEMEI,
  mockRelatorioFinanceiroFaixaEtaria,
  mockRelatorioFinanceiroTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MemoryRouter } from "react-router-dom";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import mock from "src/services/_mock";

const TOTAIS_NORMAL = ["TOTAL (A)", "TOTAL (B)", "TOTAL (C)"];
const TOTAIS_INFANTIL = ["TOTAL (INF. A)", "TOTAL (INF. B)", "TOTAL (INF. C)"];
const TOTAIS_FUNDAMENTAL = [
  "TOTAL (FUND. A)",
  "TOTAL (FUND. B)",
  "TOTAL (FUND. C)",
];

describe("Testes da interface de Análise do Relatório Financeiro - Relatorio Financeiro", () => {
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
    mock
      .onGet("/medicao-inicial/dados-liquidacao/")
      .reply(200, mockDadosLiquidacao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  const setup = async (grupo = grupoCEI, visualizar = false) => {
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

  const verificaHeadersTabela = async (titulos) => {
    for (const titulo of titulos) {
      expect(
        (
          await screen.findAllByRole("columnheader", {
            name: titulo,
          })
        ).length,
      ).toBeGreaterThan(0);
    }
  };

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

    await verificaHeadersTabela([
      "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
      "VALOR UNITÁRIO",
    ]);

    for (const valor of ["R$ 2.000,00", "R$ 4.002,00", "R$ 5.115,11"]) {
      expect(
        (
          await screen.findAllByText((_, el) =>
            el?.textContent?.includes(valor),
          )
        ).length,
      ).toBeGreaterThan(0);
    }

    for (const total of TOTAIS_NORMAL) {
      expect(screen.getByText(total)).toBeInTheDocument();
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

    expect(headers.length).toBeGreaterThanOrEqual(2);
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

  it("deve exibir tabelas e valores do grupo 2 - CEMEI", async () => {
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, mockRelatorioFinanceiroCEMEI);

    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, {
        TIPO: mockTotaisAtendimentoTipoAlimentacao,
        FAIXA: mockTotaisAtendimentoFaixaEtaria,
      });

    const grupoCEMEI = gruposUnidadeEscolar.find((grupo) =>
      grupo.nome.includes("Grupo 2"),
    );

    await setup(grupoCEMEI.uuid);

    await verificaHeadersTabela([
      "ALIMENTAÇÕES FAIXAS ETÁRIAS - SEM DIETAS",
      "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
      "VALOR UNITÁRIO",
    ]);

    for (const total of [...TOTAIS_NORMAL, ...TOTAIS_INFANTIL]) {
      expect(screen.getByText(total)).toBeInTheDocument();
    }

    await verificaTabelaDietas();

    for (const card of [
      "CONSOLIDADO CEI (A + B + C)",
      "CONSOLIDADO INFANTIL - EMEI (INF. A + INF. B + INF. C)",
      "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
    ]) {
      expect(screen.getByText(card)).toBeInTheDocument();
    }
  });

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

    await verificaHeadersTabela(["TIPOS DE ALIMENTAÇÕES - SEM DIETAS"]);

    for (const total of TOTAIS_NORMAL) {
      expect(screen.getByText(total)).toBeInTheDocument();
    }

    await verificaTabelaDietas();

    expect(
      await screen.findByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();
    expect(await screen.findByText("9.236")).toBeInTheDocument();
    expect(await screen.findByText("R$ 101.706,08")).toBeInTheDocument();
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

    await verificaHeadersTabela([
      "TIPOS DE ALIMENTAÇÕES - SEM DIETAS",
      "VALOR DO REAJUSTE",
    ]);

    for (const total of TOTAIS_NORMAL) {
      expect(screen.getByText(total)).toBeInTheDocument();
    }

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

  it("deve exibir tabelas e valores do grupo 5 - EMEBS", async () => {
    const grupoEMEBS = gruposUnidadeEscolar.find((grupo) =>
      grupo.nome.includes("Grupo 5"),
    );

    const tabelaInfantil = mockRelatorioFinanceiroTipoAlimentacao.tabelas.map(
      (tabela) => ({ ...tabela, nome: `${tabela.nome} - EMEBS INFANTIL` }),
    );

    const tabelaFundamental =
      mockRelatorioFinanceiroTipoAlimentacao.tabelas.map((tabela) => ({
        ...tabela,
        nome: `${tabela.nome} - EMEBS FUNDAMENTAL`,
      }));

    mock
      .onGet("/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/")
      .reply(200, {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoEMEBS,
        tabelas: [...tabelaInfantil, ...tabelaFundamental],
      });
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, {
        INFANTIL: mockTotaisAtendimentoTipoAlimentacao,
        FUNDAMENTAL: mockTotaisAtendimentoTipoAlimentacao,
      });

    await setup(grupoEMEBS.uuid);

    await verificaHeadersTabela(["TIPOS DE ALIMENTAÇÕES - SEM DIETAS"]);

    for (const total of [...TOTAIS_INFANTIL, ...TOTAIS_FUNDAMENTAL]) {
      expect(screen.getByText(total)).toBeInTheDocument();
    }

    await verificaTabelaDietas();

    for (const card of [
      "CONSOLIDADO INFANTIL (INF. A + INF. B + INF. C)",
      "CONSOLIDADO FUNDAMENTAL (FUND. A + FUND. B + FUND. C)",
      "CONSOLIDADO TOTAL (INF. A + INF. B + INF. C + FUND. A + FUND. B + FUND. C)",
    ]) {
      expect(screen.getByText(card)).toBeInTheDocument();
    }

    expect(
      screen.getAllByText("(Quatrocentos e noventa reais e oito centavos.)"),
    ).toHaveLength(2);
    expect(
      screen.getByText("(Novecentos e oitenta reais e dezesseis centavos.)"),
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

    for (const total of TOTAIS_NORMAL) {
      expect(screen.getByText(total)).toBeInTheDocument();
    }

    await verificaTabelaDietas();

    expect(
      await screen.findByText(
        "(Cento e um mil quatrocentos e setenta e quatro reais e trinta e seis centavos.)",
      ),
    ).toBeInTheDocument();
  });
});
