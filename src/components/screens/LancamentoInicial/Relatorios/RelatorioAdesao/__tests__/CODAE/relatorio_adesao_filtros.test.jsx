import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockMesesAnosRelatorioAdesao } from "src/mocks/services/medicaoInicial/dashboard.service/mesesAnosRelatorioAdesao";
import { mockRelatorioAdesao10a20Dezenbro2023 } from "src/mocks/services/medicaoInicial/relatorio.service/Dezembro2023/relatorioAdesao10a20";
import { mockRelatorioAdesaoPaginadoPorPagina } from "src/mocks/services/medicaoInicial/relatorio.service/Dezembro2023/relatorioAdesaoPaginado";
import { RelatorioAdesaoPage } from "src/pages/LancamentoMedicaoInicial/Relatorios/RelatorioAdesaoPage";
import mock from "src/services/_mock";

const GRUPO_1_UUIDS = [
  "de8dab55-687f-46ce-8cf2-21381ccd6629",
  "1f43b785-006e-41ba-87db-8e44a5fc1ed0",
  "e16d9c35-767a-4e5b-928f-56b8a4d0dd52",
];

const LOTE_3567_3_UUID = "655a63ff-dd0b-4259-86a0-cdd43ac36030";

const getEscolasRequests = () =>
  mock.history.get.filter((r) => r.url.includes("/escolas-para-filtros/"));

const selecionaMesReferencia = () => {
  const selectMesReferencia = screen.getByTestId("select-mes-referencia");
  const selectElementMesReferencia =
    selectMesReferencia.querySelector("select");
  fireEvent.change(selectElementMesReferencia, {
    target: { value: "12_2023" },
  });
};

describe("Teste Relatório de Adesão - Filtros (Visão CODAE)", () => {
  beforeEach(async () => {
    mock.resetHistory();
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/escolas-para-filtros/").reply(200, mockEscolasParaFiltros);
    mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
    mock.onGet("/tipos-alimentacao/").reply(200, mockTiposAlimentacao);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockMesesAnosRelatorioAdesao);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "uuid_instituicao",
      mockMeusDadosCODAEGA.vinculo_atual.instituicao.uuid,
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
        </MemoryRouter>,
      );
    });
  });

  it("desabilita os demais filtros até selecionar o mês de referência", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("select-lotes")).toBeInTheDocument();
    });

    const selectMesReferencia = screen.getByTestId("select-mes-referencia");
    expect(selectMesReferencia.querySelector("select")).toBeEnabled();

    expect(
      screen.getByTestId("select-lotes").querySelector("input"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("select-unidade-educacional").querySelector("input"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("select-periodos-escolares").querySelector("input"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("select-tipos-alimentacao").querySelector("input"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("div-periodo-lancamento-de").querySelector("input"),
    ).toBeDisabled();
    expect(
      screen.getByTestId("div-periodo-lancamento-ate").querySelector("input"),
    ).toBeDisabled();

    selecionaMesReferencia();

    expect(
      screen.getByTestId("select-lotes").querySelector("input"),
    ).toBeEnabled();
    expect(
      screen.getByTestId("div-periodo-lancamento-de").querySelector("input"),
    ).toBeEnabled();
    expect(
      screen.getByTestId("div-periodo-lancamento-ate").querySelector("input"),
    ).toBeEnabled();
  });

  it("busca as unidades educacionais com excluir_tipo_unidade__uuid e tipo_gestao__nome", async () => {
    await waitFor(() => {
      expect(getEscolasRequests().length).toBeGreaterThan(0);
    });

    const params = getEscolasRequests()[0].params;
    expect(params.tipo_gestao__nome).toBe("TERC TOTAL");
    expect(params.excluir_tipo_unidade__uuid).toEqual(GRUPO_1_UUIDS);
    expect(params.lote__uuid).toBeUndefined();
    expect(params.tipo_unidade__uuid).toBeUndefined();
  });

  it("exibe os grupos de tipo de unidade com as iniciais e esconde o Grupo 1", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("select-lotes")).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectTiposUnidades = screen.getByTestId("select-tipos-unidades");
    const input = selectTiposUnidades.querySelector(
      ".ant-select-selection-search-input",
    );

    await act(async () => {
      fireEvent.mouseDown(input);
    });

    await waitFor(() => {
      expect(
        document.querySelector(".ant-select-dropdown"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Grupo 2 (CEMEI, CEU CEMEI)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 3 (CEU EMEI, EMEI)")).toBeInTheDocument();
    expect(
      screen.getByText("Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Grupo 6 (CIEJA, CMCT)")).toBeInTheDocument();

    expect(screen.queryByText(/Grupo 1/)).not.toBeInTheDocument();
  });

  it("refaz a busca de unidades educacionais com lote__uuid ao selecionar DRE/Lote", async () => {
    await waitFor(() => {
      expect(getEscolasRequests().length).toBeGreaterThan(0);
    });

    selecionaMesReferencia();

    const selectLotes = screen.getByTestId("select-lotes");
    const selectControlLotes = within(selectLotes).getByRole("combobox");
    fireEvent.mouseDown(selectControlLotes);
    fireEvent.click(screen.getByText("IP - 3567-3"));

    await waitFor(() => {
      const params =
        getEscolasRequests()[getEscolasRequests().length - 1].params;
      expect(params.lote__uuid).toEqual([LOTE_3567_3_UUID]);
    });
  });

  it("refaz a busca de unidades educacionais com tipo_unidade__uuid ao selecionar tipo de unidade", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("select-lotes")).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectTiposUnidades = screen.getByTestId("select-tipos-unidades");
    const input = selectTiposUnidades.querySelector(
      ".ant-select-selection-search-input",
    );

    await act(async () => {
      fireEvent.mouseDown(input);
    });

    await waitFor(() => {
      expect(
        document.querySelector(".ant-select-dropdown"),
      ).toBeInTheDocument();
    });

    const tituloGrupo2 = screen.getByText("Grupo 2 (CEMEI, CEU CEMEI)");
    const checkboxGrupo2 = tituloGrupo2
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-checkbox");
    fireEvent.click(checkboxGrupo2);

    await waitFor(() => {
      const params =
        getEscolasRequests()[getEscolasRequests().length - 1].params;
      expect(params.tipo_unidade__uuid).toEqual([
        "ef52e3bc-63de-4863-82e6-81601cfce74e",
        "03dede4d-fb61-4c90-b851-94a132832f42",
      ]);
    });

    const tituloGrupo4 = screen.getByText(
      "Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)",
    );
    const checkboxGrupo4 = tituloGrupo4
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-checkbox");
    expect(checkboxGrupo4).toHaveClass("ant-select-tree-checkbox-disabled");
  });

  it("exibe a label do grupo na filtragem quando o grupo inteiro é selecionado", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("select-lotes")).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectTiposUnidades = screen.getByTestId("select-tipos-unidades");
    const input = selectTiposUnidades.querySelector(
      ".ant-select-selection-search-input",
    );

    await act(async () => {
      fireEvent.mouseDown(input);
    });

    await waitFor(() => {
      expect(
        document.querySelector(".ant-select-dropdown"),
      ).toBeInTheDocument();
    });

    const tituloGrupo2 = screen.getByText("Grupo 2 (CEMEI, CEU CEMEI)");
    const checkboxGrupo2 = tituloGrupo2
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-checkbox");
    fireEvent.click(checkboxGrupo2);

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply(200, mockRelatorioAdesao10a20Dezenbro2023);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Adesão das Alimentações Servidas"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^\| Grupo 2 \(CEMEI, CEU CEMEI\)/),
      ).toBeInTheDocument();
    });
  });

  it("exibe as iniciais na filtragem quando apenas parte do grupo é selecionada", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("select-lotes")).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectTiposUnidades = screen.getByTestId("select-tipos-unidades");
    const input = selectTiposUnidades.querySelector(
      ".ant-select-selection-search-input",
    );

    await act(async () => {
      fireEvent.mouseDown(input);
    });

    await waitFor(() => {
      expect(
        document.querySelector(".ant-select-dropdown"),
      ).toBeInTheDocument();
    });

    const tituloGrupo2 = screen.getByText("Grupo 2 (CEMEI, CEU CEMEI)");
    const treenodeGrupo2 = tituloGrupo2.closest(".ant-select-tree-treenode");
    const switcherGrupo2 = treenodeGrupo2.querySelector(
      ".ant-select-tree-switcher",
    );
    fireEvent.click(switcherGrupo2);

    await waitFor(() => {
      expect(screen.getByText("CEMEI")).toBeInTheDocument();
    });

    const tituloCEMEI = screen.getByText("CEMEI");
    const checkboxCEMEI = tituloCEMEI
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-checkbox");
    fireEvent.click(checkboxCEMEI);

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply(200, mockRelatorioAdesao10a20Dezenbro2023);

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Adesão das Alimentações Servidas"),
      ).toBeInTheDocument();
      expect(screen.getByText(/^\| CEMEI/)).toBeInTheDocument();
      expect(screen.queryByText(/^\| Grupo 2/)).not.toBeInTheDocument();
    });
  });

  it("envia escola__uuid com as unidades educacionais selecionadas ao filtrar", async () => {
    await waitFor(() => {
      expect(
        screen.getByTestId("select-unidade-educacional"),
      ).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectUnidades = screen.getByTestId("select-unidade-educacional");
    const selectControlUnidades = within(selectUnidades).getByRole("combobox");
    fireEvent.mouseDown(selectControlUnidades);
    fireEvent.click(screen.getByText("015423 - EMEF PRESTES MAIA - LOTE 13"));

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply((config) => {
        const page = config.params?.page || 1;
        return [200, mockRelatorioAdesaoPaginadoPorPagina[page]];
      });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      const relatorioRequests = mock.history.get.filter((r) =>
        r.url.endsWith("/relatorio-adesao/"),
      );
      expect(relatorioRequests.length).toBeGreaterThan(0);
      expect(
        relatorioRequests[relatorioRequests.length - 1].params.escola__uuid,
      ).toEqual(["5cd1d36b-460e-46d6-b105-5138993aa4e8"]);
    });
  });

  it("exibe o nome e código EOL da escola retornada pelo backend e pagina os resultados por escola", async () => {
    await waitFor(() => {
      expect(
        screen.getByTestId("select-unidade-educacional"),
      ).toBeInTheDocument();
    });

    selecionaMesReferencia();

    const selectUnidades = screen.getByTestId("select-unidade-educacional");
    const selectControlUnidades = within(selectUnidades).getByRole("combobox");
    fireEvent.mouseDown(selectControlUnidades);
    fireEvent.click(screen.getByText("015423 - EMEF PRESTES MAIA - LOTE 13"));

    mock
      .onGet("/medicao-inicial/relatorios/relatorio-adesao/")
      .reply((config) => {
        const page = config.params?.page || 1;
        return [200, mockRelatorioAdesaoPaginadoPorPagina[page]];
      });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(
        screen.getByText("Adesão das Alimentações Servidas"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^\| 015423 - EMEF PRESTES MAIA/),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getAllByText("LANCHE").length).toBeGreaterThan(0);

    const itemPagina2 = document.querySelector(".ant-pagination-item-2");
    expect(itemPagina2).toBeInTheDocument();
    fireEvent.click(itemPagina2);

    await waitFor(() => {
      expect(
        screen.getByText(/^\| 017981 - EMEF PERICLES EUGENIO DA SILVA RAMOS/),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Nenhum resultado foi encontrado para esta busca."),
      ).toBeInTheDocument();
    });
  });
});
