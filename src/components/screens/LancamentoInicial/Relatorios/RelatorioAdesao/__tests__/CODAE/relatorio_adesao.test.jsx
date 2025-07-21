import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
import { mockRelatorioAdesao10a20Dezenbro2023 } from "src/mocks/services/medicaoInicial/relatorio.service/Dezembro2023/relatorioAdesao10a20";
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

  it("Filtra por mês de referência e período de lançamento", async () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();

    const selectMesReferencia = screen.getByTestId("select-mes-referencia");
    const selectElementMesReferencia =
      selectMesReferencia.querySelector("select");
    fireEvent.change(selectElementMesReferencia, {
      target: { value: "12_2023" },
    });
    expect(selectElementMesReferencia).toHaveValue("12_2023");

    const divInputPeriodoLancamentoDe = screen.getByTestId(
      "div-periodo-lancamento-de"
    );
    const inputElementPeriodoLancamentoDe =
      divInputPeriodoLancamentoDe.querySelector("input");
    fireEvent.change(inputElementPeriodoLancamentoDe, {
      target: { value: "10/12/2023" },
    });

    const divInputPeriodoLancamentoAte = screen.getByTestId(
      "div-periodo-lancamento-ate"
    );
    const inputElementPeriodoLancamentoAte =
      divInputPeriodoLancamentoAte.querySelector("input");
    fireEvent.change(inputElementPeriodoLancamentoAte, {
      target: { value: "20/12/2023" },
    });

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply(200, mockRelatorioAdesao10a20Dezenbro2023);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Adesão das Alimentações Servidas")
      ).toBeInTheDocument();
      expect(screen.getByText("DEZEMBRO 2023")).toBeInTheDocument();
    });

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    await waitFor(() => {
      expect(
        screen.queryByText("Adesão das Alimentações Servidas")
      ).not.toBeInTheDocument();
      expect(selectElementMesReferencia).toHaveValue("");
    });
  });

  it("Exibe erro quando `período lançamento de` é preenchido mas `periodo lançamento até` não", async () => {
    const selectMesReferencia = screen.getByTestId("select-mes-referencia");
    const selectElementMesReferencia =
      selectMesReferencia.querySelector("select");
    fireEvent.change(selectElementMesReferencia, {
      target: { value: "12_2023" },
    });
    expect(selectElementMesReferencia).toHaveValue("12_2023");

    const divInputPeriodoLancamentoDe = screen.getByTestId(
      "div-periodo-lancamento-de"
    );
    const inputElementPeriodoLancamentoDe =
      divInputPeriodoLancamentoDe.querySelector("input");
    fireEvent.change(inputElementPeriodoLancamentoDe, {
      target: { value: "10/12/2023" },
    });

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply(200, mockRelatorioAdesao10a20Dezenbro2023);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Se preencher o campo `De`, `Até` é obrigatório")
      ).toBeInTheDocument();
    });
  });

  it("Renderiza erro ao carregar resultados", async () => {
    const selectMesReferencia = screen.getByTestId("select-mes-referencia");
    const selectElementMesReferencia =
      selectMesReferencia.querySelector("select");
    fireEvent.change(selectElementMesReferencia, {
      target: { value: "12_2023" },
    });
    expect(selectElementMesReferencia).toHaveValue("12_2023");

    const divInputPeriodoLancamentoDe = screen.getByTestId(
      "div-periodo-lancamento-de"
    );
    const inputElementPeriodoLancamentoDe =
      divInputPeriodoLancamentoDe.querySelector("input");
    fireEvent.change(inputElementPeriodoLancamentoDe, {
      target: { value: "10/12/2023" },
    });

    const divInputPeriodoLancamentoAte = screen.getByTestId(
      "div-periodo-lancamento-ate"
    );
    const inputElementPeriodoLancamentoAte =
      divInputPeriodoLancamentoAte.querySelector("input");
    fireEvent.change(inputElementPeriodoLancamentoAte, {
      target: { value: "20/12/2023" },
    });

    mock.onGet("/medicao-inicial/relatorios/relatorio-adesao/").reply(500, {});

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não foi possível obter os resultados. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });
});
