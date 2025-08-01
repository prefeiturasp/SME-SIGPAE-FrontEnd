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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockMesesAnosRelatorioAdesao } from "src/mocks/services/medicaoInicial/dashboard.service/mesesAnosRelatorioAdesao";
import { mockRelatorioAdesao10a20Dezenbro2023 } from "src/mocks/services/medicaoInicial/relatorio.service/Dezembro2023/relatorioAdesao10a20";
import { RelatorioAdesaoPage } from "src/pages/LancamentoMedicaoInicial/Relatorios/RelatorioAdesaoPage";
import mock from "src/services/_mock";

describe("Teste Relatório de Adesão - Visão Escola", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
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
    mock
      .onGet(`/escolas-para-filtros/${escolaUuid}/periodos-escolares/`)
      .reply(200, [
        {
          uuid: "5067e137-e5f3-4876-a63f-7f58cce93f33",
          nome: "MANHA",
        },
        {
          uuid: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
          nome: "TARDE",
        },
      ]);
    mock
      .onGet(`/escolas-para-filtros/${escolaUuid}/tipos-alimentacao/`)
      .reply(200, [
        {
          nome: "Lanche 4h",
          uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
          posicao: 1,
        },
        {
          nome: "Lanche",
          uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
          posicao: 2,
        },
        {
          nome: "Refeição",
          uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
          posicao: 2,
        },
        {
          nome: "Sobremesa",
          uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
          posicao: 4,
        },
        {
          nome: "Lanche Emergencial",
          uuid: "c4255a14-85fd-412f-b35f-30828215e4d5",
          posicao: null,
        },
      ]);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("uuid_instituicao", escolaUuid);

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
              meusDados: mockMeusDadosEscolaEMEFPericles,
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

    const selectDRE = screen.getByTestId("select-dre");
    const selectElementDRE = selectDRE.querySelector("select");
    expect(selectElementDRE).toHaveValue(
      mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao
        .diretoria_regional.uuid
    );

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
      expect(selectElementDRE).toHaveValue(
        mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao
          .diretoria_regional.uuid
      );
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
