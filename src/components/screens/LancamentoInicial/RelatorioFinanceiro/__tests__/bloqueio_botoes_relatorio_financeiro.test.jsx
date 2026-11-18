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
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

const URL_RELATORIO =
  "/medicao-inicial/relatorio-financeiro/relatorio-consolidado/123/";
const MENSAGEM_SEM_PARAMETRIZACAO =
  "Não foi encontrada parametrização financeira para o tipo de unidade e lote do relatório financeiro.";

const BOTOES = [
  "Reabrir Lançamentos",
  "Aplicar Descontos",
  "Exportar PDF",
  "Finalizar Análise",
];

const getBotao = (texto) => screen.getByText(texto).closest("button");

describe("Bloqueio dos botões sem relatório consolidado - Relatório Financeiro", () => {
  const grupoCEI = mockGetGrupoUnidadeEscolar.results.find((grupo) =>
    grupo.nome.includes("Grupo 1"),
  )?.uuid;

  const renderizar = async () => {
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
                status: ["EM_ANALISE"],
                visualizar: false,
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
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/totais-atendimento-consumo/",
      )
      .reply(200, mockTotaisAtendimentoFaixaEtaria);
    mock.onGet("/medicao-inicial/desconto-financeiro/").reply(200, []);
    mock
      .onGet("/medicao-inicial/clausulas-de-descontos/")
      .reply(200, mockClausulasDeDesconto);

    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
    localStorage.clear();
  });

  it("bloqueia os botões quando não há parametrização financeira", async () => {
    mock.onGet(URL_RELATORIO).reply(404, {
      Erro: MENSAGEM_SEM_PARAMETRIZACAO,
    });

    await renderizar();

    expect(toastError).toHaveBeenCalledWith(
      `Erro ao carregar relatório consolidado. ${MENSAGEM_SEM_PARAMETRIZACAO}`,
    );
    BOTOES.forEach((texto) => expect(getBotao(texto)).toBeDisabled());
  });

  it("bloqueia os botões quando o relatório consolidado não é encontrado", async () => {
    mock.onGet(URL_RELATORIO).reply(400, {
      Erro: "RelatorioFinanceiro matching query does not exist.",
    });

    await renderizar();

    BOTOES.forEach((texto) => expect(getBotao(texto)).toBeDisabled());
  });

  it("não abre os modais ao clicar nos botões bloqueados", async () => {
    mock.onGet(URL_RELATORIO).reply(404, {
      Erro: MENSAGEM_SEM_PARAMETRIZACAO,
    });

    await renderizar();

    await act(async () => {
      fireEvent.click(getBotao("Aplicar Descontos"));
      fireEvent.click(getBotao("Finalizar Análise"));
      fireEvent.click(getBotao("Exportar PDF"));
    });

    expect(screen.queryByText("Gerar Medição Final")).not.toBeInTheDocument();
    expect(
      mock.history.post.some((req) => req.url.includes("exportar-pdf")),
    ).toBe(false);
  });

  it("habilita os botões quando o relatório consolidado é carregado", async () => {
    mock.onGet(URL_RELATORIO).reply(200, mockRelatorioFinanceiroFaixaEtaria);

    await renderizar();

    BOTOES.forEach((texto) => expect(getBotao(texto)).toBeEnabled());
  });
});
