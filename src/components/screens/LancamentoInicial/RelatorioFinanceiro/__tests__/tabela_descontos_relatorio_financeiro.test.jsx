import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
  mockRelatorioFinanceiroCEMEI,
  mockRelatorioFinanceiroFaixaEtaria,
  mockRelatorioFinanceiroTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";

const URL_RELATORIO =
  "/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/";
const URL_TOTAIS =
  "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/";
const URL_DESCONTOS = "/medicao-inicial/desconto-financeiro/";

const [FAIXA_00_MESES, FAIXA_01_A_03_MESES] = mockFaixasEtarias.results;

const CLAUSULA = {
  uuid: "uuid-clausula",
  numero_clausula: "7.2.2",
  item_clausula: "item a",
  porcentagem_desconto: "50.00",
};

const desconto = (dados) => ({
  uuid: "uuid-desconto",
  unidades_educacionais: [{ uuid: "uuid-escola", nome: "CEI DIRET TESTE" }],
  tipo_lancamento: "ALIMENTACOES",
  tipo_alimentacao: null,
  faixa_etaria: null,
  periodo_escolar: null,
  cei_ou_emei: "N/A",
  infantil_ou_fundamental: "N/A",
  clausula_desconto: CLAUSULA,
  quantidade: 3,
  ...dados,
});

const DESCONTO_CEI = desconto({
  faixa_etaria: FAIXA_01_A_03_MESES,
  periodo_escolar: "INTEGRAL",
});

const grupoPorNome = (nome) =>
  mockGetGrupoUnidadeEscolar.results.find((grupo) => grupo.nome.includes(nome));

const cartaoConsolidado = (titulo) =>
  screen.getByText(titulo).closest(".consolidado-total");

describe("Tabela de Desconto e Faturamento Final - Relatório Financeiro", () => {
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
      .onGet("/medicao-inicial/clausulas-de-descontos/")
      .reply(200, mockClausulasDeDesconto);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  afterEach(() => {
    mock.reset();
  });

  const mockarRelatorioCEI = (descontos) => {
    mock.onGet(URL_RELATORIO).reply(200, mockRelatorioFinanceiroFaixaEtaria);
    mock.onGet(URL_TOTAIS).reply(200, mockTotaisAtendimentoFaixaEtaria);
    mock.onGet(URL_DESCONTOS).reply(200, { results: descontos });
  };

  const setup = async ({ grupo = "Grupo 1", visualizar = true } = {}) => {
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
                grupo_unidade_escolar: [grupoPorNome(grupo).uuid],
                status: ["EM_ANALISE"],
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

  it("exibe a tabela entre as tabelas do grupo e o consolidado, com o faturamento final", async () => {
    mockarRelatorioCEI([DESCONTO_CEI]);
    await setup();

    const tabelaDescontos = await screen.findByTestId("tabela-descontos");
    const ultimaTabela = screen.getByText("TOTAL (C)");
    const consolidado = cartaoConsolidado("CONSOLIDADO TOTAL (A + B + C)");

    expect(
      ultimaTabela.compareDocumentPosition(tabelaDescontos) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      tabelaDescontos.compareDocumentPosition(consolidado) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const tabela = within(tabelaDescontos);
    expect(tabela.getByText("FAIXA ETÁRIA")).toBeInTheDocument();
    expect(tabela.getByText("CEI DIRET TESTE")).toBeInTheDocument();
    expect(tabela.getByText("Integral - 01 a 03 meses")).toBeInTheDocument();
    expect(tabela.getByText("7.2.2. item a - (50%)")).toBeInTheDocument();
    expect(tabela.getByText("R$ 2.000,00")).toBeInTheDocument();
    expect(tabela.getAllByText("R$ 3.000,00")).toHaveLength(2);

    const cartao = within(consolidado);
    expect(cartao.getByText("R$ 154.888,20")).toBeInTheDocument();
    expect(cartao.getByText("DESCONTOS TOTAIS (D)")).toBeInTheDocument();
    expect(cartao.getByText("R$ 3.000,00")).toBeInTheDocument();
    expect(
      cartao.getByText("VALOR DO FATURAMENTO FINAL (A + B + C - D):"),
    ).toBeInTheDocument();
    expect(cartao.getByText("R$ 151.888,20")).toBeInTheDocument();
  });

  it("não exibe a tabela nem o bloco de descontos sem descontos aplicados", async () => {
    mockarRelatorioCEI([]);
    await setup();

    expect(
      await screen.findByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();
    expect(screen.queryByText("TABELA DE DESCONTO")).not.toBeInTheDocument();
    expect(screen.queryByText("DESCONTOS TOTAIS (D)")).not.toBeInTheDocument();
  });

  it("CEMEI: exibe o bloco de descontos apenas no consolidado total", async () => {
    mock.onGet(URL_RELATORIO).reply(200, mockRelatorioFinanceiroCEMEI);
    mock.onGet(URL_TOTAIS).reply(200, {
      TIPO: mockTotaisAtendimentoTipoAlimentacao,
      FAIXA: mockTotaisAtendimentoFaixaEtaria,
    });
    mock.onGet(URL_DESCONTOS).reply(200, {
      results: [
        desconto({
          cei_ou_emei: "CEI",
          faixa_etaria: FAIXA_00_MESES,
          periodo_escolar: "INTEGRAL",
        }),
      ],
    });
    await setup({ grupo: "Grupo 2" });

    const tabela = within(await screen.findByTestId("tabela-descontos"));
    expect(tabela.getByText("ALIMENTAÇÃO - CEI")).toBeInTheDocument();
    expect(tabela.getByText("FAIXA ETÁRIA OU ALIMENTAÇÃO")).toBeInTheDocument();

    expect(screen.getAllByText("DESCONTOS TOTAIS (D)")).toHaveLength(1);
    for (const parcial of [
      "CONSOLIDADO CEI (A + B + C)",
      "CONSOLIDADO INFANTIL - EMEI (INF. A + INF. B + INF. C)",
    ]) {
      expect(
        within(cartaoConsolidado(parcial)).queryByText("DESCONTOS TOTAIS (D)"),
      ).not.toBeInTheDocument();
    }

    const total = within(
      cartaoConsolidado(
        "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
      ),
    );
    expect(total.getByText("R$ 12,00")).toBeInTheDocument();
    expect(
      total.getByText(
        "VALOR DO FATURAMENTO FINAL (A + B + C + INF. A + INF. B + INF. C - D):",
      ),
    ).toBeInTheDocument();
  });

  it("EMEBS: exibe o bloco de descontos apenas no consolidado total", async () => {
    const grupoEMEBS = grupoPorNome("Grupo 5");
    const renomearTabelas = (sufixo) =>
      mockRelatorioFinanceiroTipoAlimentacao.tabelas.map((tabela) => ({
        ...tabela,
        nome: `${tabela.nome} - EMEBS ${sufixo}`,
      }));

    mock.onGet(URL_RELATORIO).reply(200, {
      ...mockRelatorioFinanceiroTipoAlimentacao,
      grupo_unidade_escolar: grupoEMEBS,
      tabelas: [
        ...renomearTabelas("INFANTIL"),
        ...renomearTabelas("FUNDAMENTAL"),
      ],
    });
    mock.onGet(URL_TOTAIS).reply(200, {
      INFANTIL: mockTotaisAtendimentoTipoAlimentacao,
      FUNDAMENTAL: mockTotaisAtendimentoTipoAlimentacao,
    });
    mock.onGet(URL_DESCONTOS).reply(200, {
      results: [
        desconto({ infantil_ou_fundamental: "INFANTIL", quantidade: 10 }),
      ],
    });
    await setup({ grupo: "Grupo 5" });

    const tabela = within(await screen.findByTestId("tabela-descontos"));
    expect(tabela.getByText("ALIMENTAÇÃO - INFANTIL")).toBeInTheDocument();
    expect(tabela.getByText("KIT LANCHE")).toBeInTheDocument();

    expect(screen.getAllByText("DESCONTOS TOTAIS (D)")).toHaveLength(1);
    for (const parcial of [
      "CONSOLIDADO INFANTIL (INF. A + INF. B + INF. C)",
      "CONSOLIDADO FUNDAMENTAL (FUND. A + FUND. B + FUND. C)",
    ]) {
      expect(
        within(cartaoConsolidado(parcial)).queryByText("DESCONTOS TOTAIS (D)"),
      ).not.toBeInTheDocument();
    }

    const total = within(
      cartaoConsolidado(
        "CONSOLIDADO TOTAL (INF. A + INF. B + INF. C + FUND. A + FUND. B + FUND. C)",
      ),
    );
    expect(total.getByText("R$ 980,16")).toBeInTheDocument();
    expect(total.getByText("R$ 30,00")).toBeInTheDocument();
    expect(total.getByText("R$ 950,16")).toBeInTheDocument();
  });

  it("atualiza a tabela após salvar no modal Aplicar Descontos", async () => {
    mockarRelatorioCEI([DESCONTO_CEI]);
    mock
      .onPut(`${URL_DESCONTOS}aplicar-descontos/123/`)
      .reply(200, [{ ...DESCONTO_CEI, quantidade: 5 }]);
    await setup({ visualizar: false });

    const tabelaDescontos = await screen.findByTestId("tabela-descontos");
    expect(within(tabelaDescontos).getAllByText("R$ 3.000,00")).toHaveLength(2);

    fireEvent.click(screen.getByText("Aplicar Descontos"));
    const botaoSalvar = await screen.findByTestId("botao-salvar");
    await act(async () => {
      fireEvent.submit(botaoSalvar.closest("form"));
    });

    await waitFor(() => {
      expect(
        within(screen.getByTestId("tabela-descontos")).getAllByText(
          "R$ 5.000,00",
        ),
      ).toHaveLength(2);
    });
    expect(
      within(cartaoConsolidado("CONSOLIDADO TOTAL (A + B + C)")).getByText(
        "R$ 149.888,20",
      ),
    ).toBeInTheDocument();
  });
});
