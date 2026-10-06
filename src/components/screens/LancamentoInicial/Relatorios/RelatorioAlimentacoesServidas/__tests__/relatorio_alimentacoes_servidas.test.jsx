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
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockMesesAnosRelatorioAdesao } from "src/mocks/services/medicaoInicial/dashboard.service/mesesAnosRelatorioAdesao";
import {
  DRE_BUTANTA,
  DRE_IPIRANGA,
  DRE_PENHA,
  ESCOLA_CEI_BUTANTA,
  LOTE_BUTANTA,
  LOTE_IPIRANGA,
  mockDiretoriasRegionais,
  mockEscolas,
  mockLotes,
  mockSubprefeituras,
  SUBPREFEITURA_BUTANTA,
  TIPO_UNIDADE_CEU_EMEI,
  TIPO_UNIDADE_EMEI,
} from "src/mocks/services/medicaoInicial/relatorioAlimentacoesServidas/mockFiltros";
import { RelatorioAlimentacoesServidasPage } from "src/pages/LancamentoMedicaoInicial/Relatorios/RelatorioAlimentacoesServidasPage";
import mock from "src/services/_mock";

const URL_MESES_ANOS =
  "/medicao-inicial/solicitacao-medicao-inicial/meses-anos/";

const incluiAlgum = (lista, valores) =>
  !lista?.length || valores.some((valor) => lista.includes(valor));

const respondeSubprefeituras = (config) => {
  const dres = config.params?.diretoria_regional__uuid || [];
  return [
    200,
    {
      results: mockSubprefeituras.filter((subprefeitura) =>
        dres.includes(subprefeitura.diretoria_regional_uuid),
      ),
    },
  ];
};

const respondeEscolas = (config) => {
  const params = config.params || {};
  return [
    200,
    mockEscolas.filter(
      (escola) =>
        incluiAlgum(params.diretoria_regional__uuid, [
          escola.diretoria_regional.uuid,
        ]) &&
        incluiAlgum(params.lote__uuid, [escola.lote.uuid]) &&
        incluiAlgum(params.subprefeitura__uuid, [escola.subprefeitura_uuid]) &&
        incluiAlgum(params.tipo_unidade__uuid, [escola.tipo_unidade.uuid]),
    ),
  ];
};

const configuraMocks = () => {
  mock.resetHistory();
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
  mock.onGet(URL_MESES_ANOS).reply(200, mockMesesAnosRelatorioAdesao);
  mock
    .onGet("/diretorias-regionais-simplissima/")
    .reply(200, mockDiretoriasRegionais);
  mock.onGet("/lotes-simples/").reply(200, mockLotes);
  mock.onGet("/grupos-unidade-escolar/").reply(200, mockGetGrupoUnidadeEscolar);
  mock.onGet("/tipos-alimentacao/").reply(200, mockTiposAlimentacao);
  mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
  mock.onGet("/subprefeituras/").reply(respondeSubprefeituras);
  mock.onGet("/escolas-para-filtros/").reply(respondeEscolas);
};

const configuraPerfil = ({ tipoPerfil, perfil, tipoServico, instituicao }) => {
  localStorage.setItem("tipo_perfil", tipoPerfil);
  localStorage.setItem("perfil", perfil);
  localStorage.setItem("tipo_servico", tipoServico || "");
  localStorage.setItem("uuid_instituicao", `"${instituicao}"`);
};

const renderizaTela = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosCODAEGA, setMeusDados: jest.fn() }}
        >
          <RelatorioAlimentacoesServidasPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
  await waitFor(() => {
    expect(screen.getByTestId("select-mes-referencia")).toBeInTheDocument();
  });
};

const getInput = (testId) => screen.getByTestId(testId).querySelector("input");

const getSelectMes = () =>
  screen.getByTestId("select-mes-referencia").querySelector("select");

const selecionaMes = (valor = "12_2023") => {
  fireEvent.change(getSelectMes(), { target: { value: valor } });
};

const getMenu = (testId) => document.querySelector(`.${testId}__menu`);

const selecionaOpcao = (testId, texto) => {
  if (!getMenu(testId)) {
    fireEvent.mouseDown(
      within(screen.getByTestId(testId)).getByRole("combobox"),
    );
  }
  fireEvent.click(within(getMenu(testId)).getByText(texto));
};

const getOpcoesMenu = (testId) => {
  if (!getMenu(testId)) {
    fireEvent.mouseDown(
      within(screen.getByTestId(testId)).getByRole("combobox"),
    );
  }
  return Array.from(getMenu(testId).querySelectorAll("label")).map(
    (label) => label.textContent,
  );
};

const getUltimaRequisicao = (url) => {
  const requisicoes = mock.history.get.filter((r) => r.url.includes(url));
  return requisicoes[requisicoes.length - 1];
};

const abreTiposUnidades = async () => {
  const input = screen
    .getByTestId("select-tipos-unidades")
    .querySelector(".ant-select-selection-search-input");
  await act(async () => {
    fireEvent.mouseDown(input);
  });
  await waitFor(() => {
    expect(document.querySelector(".ant-select-dropdown")).toBeInTheDocument();
  });
};

const getCheckboxTree = (titulo) =>
  screen
    .getByText(titulo)
    .closest(".ant-select-tree-treenode")
    .querySelector(".ant-select-tree-checkbox");

const selecionaGrupo = async (titulo) => {
  await abreTiposUnidades();
  fireEvent.click(getCheckboxTree(titulo));
};

const GRUPO_1 = "Grupo 1 (CCI, CEI, CEI CEU)";
const GRUPO_2 = "Grupo 2 (CEMEI, CEU CEMEI)";
const GRUPO_3 = "Grupo 3 (CEU EMEI, EMEI)";
const GRUPO_4 = "Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)";

const preparaMesEDre = async (dre = DRE_BUTANTA.nome) => {
  selecionaMes();
  selecionaOpcao("select-dres", dre);
  await waitFor(() => {
    expect(getInput("select-lotes")).toBeEnabled();
  });
};

describe("Relatório de Alimentações Servidas - Filtros (Visão CODAE)", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    configuraMocks();
    configuraPerfil({
      tipoPerfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
      instituicao: mockMeusDadosCODAEGA.vinculo_atual.instituicao.uuid,
    });
    await renderizaTela();
  });

  it("renderiza título, campos, placeholders e botões no estado inicial", () => {
    expect(
      screen.getAllByText("Relatório de Alimentações Servidas").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();

    [
      "Mês de Referência",
      "DRE",
      "Lote",
      "Subprefeitura",
      "Tipo de Unidade",
      "Unidades Educacionais",
      "Tipo de Alimentação",
      "Faixa Etária",
      "Período",
    ].forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());

    expect(
      screen.getByText("Selecione o Mês de Referência"),
    ).toBeInTheDocument();
    expect(screen.getByText("Selecione a DRE")).toBeInTheDocument();
    expect(screen.getByText("Selecione o Lote")).toBeInTheDocument();
    expect(screen.getByText("Selecione a Subprefeitura")).toBeInTheDocument();
    expect(screen.getByText("Selecione um grupo")).toBeInTheDocument();
    expect(screen.getByText("Selecione a Unidade")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione o Tipo de Alimentação"),
    ).toBeInTheDocument();
    expect(screen.getByText("Selecione a Faixa Etária")).toBeInTheDocument();

    expect(screen.getByTestId("botao-limpar-filtros")).toBeEnabled();
    expect(screen.getByTestId("botao-exportar-excel")).toBeDisabled();
    expect(screen.queryByText("Filtrar")).not.toBeInTheDocument();
  });

  it("mantém os filtros desabilitados até selecionar Mês de Referência e DRE", async () => {
    expect(getSelectMes()).toBeEnabled();
    [
      "select-dres",
      "select-lotes",
      "select-subprefeituras",
      "select-unidades-educacionais",
      "select-tipos-alimentacao",
      "select-faixas-etarias",
      "div-periodo-lancamento-de",
      "div-periodo-lancamento-ate",
    ].forEach((testId) => expect(getInput(testId)).toBeDisabled());
    expect(getInput("select-tipos-unidades")).toBeDisabled();

    selecionaMes();

    expect(getInput("select-dres")).toBeEnabled();
    expect(getInput("div-periodo-lancamento-de")).toBeEnabled();
    expect(getInput("div-periodo-lancamento-ate")).toBeEnabled();
    expect(getInput("select-lotes")).toBeDisabled();
    expect(screen.getByTestId("botao-exportar-excel")).toBeDisabled();

    selecionaOpcao("select-dres", DRE_BUTANTA.nome);

    await waitFor(() => {
      expect(getInput("select-lotes")).toBeEnabled();
    });
    expect(getInput("select-subprefeituras")).toBeEnabled();
    expect(getInput("select-tipos-unidades")).toBeEnabled();
    expect(getInput("select-unidades-educacionais")).toBeEnabled();
    expect(getInput("select-tipos-alimentacao")).toBeEnabled();
    expect(getInput("select-faixas-etarias")).toBeDisabled();
    expect(screen.getByTestId("botao-exportar-excel")).toBeEnabled();
  });

  it("lista os meses de referência retornados pelo back-end", () => {
    const opcoes = Array.from(getSelectMes().querySelectorAll("option")).map(
      (option) => option.textContent,
    );
    expect(opcoes[0]).toBe("Selecione o Mês de Referência");
    expect(opcoes).toContain("Dezembro - 2023");
    expect(opcoes).toHaveLength(
      mockMesesAnosRelatorioAdesao.results.length + 1,
    );
  });

  it("permite selecionar múltiplas DREs e lista somente os lotes das DREs selecionadas", async () => {
    selecionaMes();

    expect(getOpcoesMenu("select-dres")).toEqual(
      expect.arrayContaining([
        DRE_BUTANTA.nome,
        DRE_IPIRANGA.nome,
        DRE_PENHA.nome,
      ]),
    );

    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());

    expect(getOpcoesMenu("select-lotes")).toEqual(["Todos", "BT - LOTE 01"]);

    selecionaOpcao("select-dres", DRE_IPIRANGA.nome);

    await waitFor(() => {
      expect(getOpcoesMenu("select-lotes")).toEqual([
        "Todos",
        "BT - LOTE 01",
        "IP - LOTE 02",
      ]);
    });
  });

  it("remove o lote selecionado quando a DRE correspondente é desmarcada", async () => {
    selecionaMes();
    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    selecionaOpcao("select-dres", DRE_IPIRANGA.nome);
    await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());

    selecionaOpcao("select-lotes", "IP - LOTE 02");
    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.lote__uuid,
      ).toEqual([LOTE_IPIRANGA.uuid]);
    });

    selecionaOpcao("select-dres", DRE_IPIRANGA.nome);

    await waitFor(() => {
      const params = getUltimaRequisicao("/escolas-para-filtros/").params;
      expect(params.diretoria_regional__uuid).toEqual([DRE_BUTANTA.uuid]);
      expect(params.lote__uuid).toBeUndefined();
    });
    expect(screen.queryByText("IP - LOTE 02")).not.toBeInTheDocument();
  });

  it("busca as subprefeituras das DREs selecionadas", async () => {
    await preparaMesEDre();

    await waitFor(() => {
      expect(
        getUltimaRequisicao("/subprefeituras/").params.diretoria_regional__uuid,
      ).toEqual([DRE_BUTANTA.uuid]);
    });
    await waitFor(() => {
      expect(getOpcoesMenu("select-subprefeituras")).toEqual([
        "Todos",
        "BUTANTA",
      ]);
    });
  });

  it("desabilita e limpa Subprefeitura ao selecionar um Lote e reabilita ao limpar o Lote", async () => {
    await preparaMesEDre();
    await waitFor(() =>
      expect(getInput("select-subprefeituras")).toBeEnabled(),
    );

    selecionaOpcao("select-subprefeituras", "BUTANTA");
    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params
          .subprefeitura__uuid,
      ).toEqual([SUBPREFEITURA_BUTANTA.uuid]);
    });

    selecionaOpcao("select-lotes", "BT - LOTE 01");

    await waitFor(() => {
      expect(getInput("select-subprefeituras")).toBeDisabled();
    });
    await waitFor(() => {
      const params = getUltimaRequisicao("/escolas-para-filtros/").params;
      expect(params.lote__uuid).toEqual([LOTE_BUTANTA.uuid]);
      expect(params.subprefeitura__uuid).toBeUndefined();
    });

    selecionaOpcao("select-lotes", "BT - LOTE 01");

    await waitFor(() => {
      expect(getInput("select-subprefeituras")).toBeEnabled();
    });
  });

  it("seleciona automaticamente os tipos do grupo e bloqueia os demais grupos", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_3);

    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.tipo_unidade__uuid,
      ).toEqual([TIPO_UNIDADE_CEU_EMEI, TIPO_UNIDADE_EMEI]);
    });

    [GRUPO_1, GRUPO_2, GRUPO_4].forEach((grupo) =>
      expect(getCheckboxTree(grupo)).toHaveClass(
        "ant-select-tree-checkbox-disabled",
      ),
    );
    expect(getCheckboxTree(GRUPO_3)).not.toHaveClass(
      "ant-select-tree-checkbox-disabled",
    );
  });

  it("permite desmarcar individualmente um tipo de unidade do grupo selecionado", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_3);

    const switcher = screen
      .getByText(GRUPO_3)
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-switcher");
    fireEvent.click(switcher);

    await waitFor(() => {
      expect(screen.getAllByText("CEU EMEI").length).toBeGreaterThan(0);
    });
    const tituloCeuEmei = Array.from(
      document.querySelectorAll(".ant-select-tree-title"),
    ).find((el) => el.textContent === "CEU EMEI");
    fireEvent.click(
      tituloCeuEmei
        .closest(".ant-select-tree-treenode")
        .querySelector(".ant-select-tree-checkbox"),
    );

    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.tipo_unidade__uuid,
      ).toEqual([TIPO_UNIDADE_EMEI]);
    });
    expect(getCheckboxTree(GRUPO_4)).toHaveClass(
      "ant-select-tree-checkbox-disabled",
    );
  });

  it("desbloqueia todos os grupos ao limpar o grupo selecionado", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_3);
    expect(getCheckboxTree(GRUPO_4)).toHaveClass(
      "ant-select-tree-checkbox-disabled",
    );

    fireEvent.click(getCheckboxTree(GRUPO_3));

    await waitFor(() => {
      expect(getCheckboxTree(GRUPO_4)).not.toHaveClass(
        "ant-select-tree-checkbox-disabled",
      );
    });
    expect(getCheckboxTree(GRUPO_1)).not.toHaveClass(
      "ant-select-tree-checkbox-disabled",
    );
    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.tipo_unidade__uuid,
      ).toBeUndefined();
    });
  });

  it("bloqueia Tipo de Alimentação e habilita Faixa Etária ao selecionar o Grupo 1", async () => {
    await preparaMesEDre();
    selecionaOpcao("select-tipos-alimentacao", "Lanche");

    await selecionaGrupo(GRUPO_1);

    await waitFor(() => {
      expect(getInput("select-tipos-alimentacao")).toBeDisabled();
    });
    expect(
      within(screen.getByTestId("select-tipos-alimentacao")).queryByText(
        "Lanche",
      ),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getInput("select-faixas-etarias")).toBeEnabled();
    });
    await waitFor(() => {
      expect(getOpcoesMenu("select-faixas-etarias")).toContain("00 meses");
    });
  });

  it("habilita Faixa Etária e mantém Tipo de Alimentação habilitado ao selecionar o Grupo 2", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_2);

    await waitFor(() => {
      expect(getInput("select-faixas-etarias")).toBeEnabled();
    });
    expect(getInput("select-tipos-alimentacao")).toBeEnabled();
  });

  it("desabilita e limpa Faixa Etária quando o grupo deixa de ser Grupo 1 ou 2", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_2);
    await waitFor(() =>
      expect(getInput("select-faixas-etarias")).toBeEnabled(),
    );
    await waitFor(() =>
      expect(getOpcoesMenu("select-faixas-etarias")).toContain("00 meses"),
    );
    selecionaOpcao("select-faixas-etarias", "00 meses");

    await abreTiposUnidades();
    fireEvent.click(getCheckboxTree(GRUPO_2));
    fireEvent.click(getCheckboxTree(GRUPO_3));

    await waitFor(() => {
      expect(getInput("select-faixas-etarias")).toBeDisabled();
    });
    expect(
      within(screen.getByTestId("select-faixas-etarias")).queryByText(
        "00 meses",
      ),
    ).not.toBeInTheDocument();
  });

  it("remove a unidade educacional selecionada que deixou de ser compatível com os filtros", async () => {
    await preparaMesEDre();
    await waitFor(() => {
      expect(getOpcoesMenu("select-unidades-educacionais")).toContain(
        "000002 - CEI BUTANTA - LOTE 01",
      );
    });
    selecionaOpcao(
      "select-unidades-educacionais",
      "000002 - CEI BUTANTA - LOTE 01",
    );

    await selecionaGrupo(GRUPO_3);

    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.tipo_unidade__uuid,
      ).toEqual([TIPO_UNIDADE_CEU_EMEI, TIPO_UNIDADE_EMEI]);
    });
    await waitFor(() => {
      expect(
        within(screen.getByTestId("select-unidades-educacionais")).queryByText(
          `${ESCOLA_CEI_BUTANTA.codigo_eol} - ${ESCOLA_CEI_BUTANTA.nome} - LOTE 01`,
        ),
      ).not.toBeInTheDocument();
    });
    expect(getOpcoesMenu("select-unidades-educacionais")).toEqual([
      "Todos",
      "000001 - EMEI BUTANTA - LOTE 01",
    ]);
  });

  it("limpa o período que ficar fora do novo Mês de Referência", () => {
    selecionaMes("12_2023");
    fireEvent.change(getInput("div-periodo-lancamento-de"), {
      target: { value: "10/12/2023" },
    });
    expect(getInput("div-periodo-lancamento-de")).toHaveValue("10/12/2023");

    selecionaMes("11_2023");

    expect(getInput("div-periodo-lancamento-de")).toHaveValue("");
  });

  it("limpa todas as seleções e restaura o estado inicial ao clicar em Limpar Filtros", async () => {
    await preparaMesEDre();
    selecionaOpcao("select-lotes", "BT - LOTE 01");
    await selecionaGrupo(GRUPO_1);
    fireEvent.change(getInput("div-periodo-lancamento-de"), {
      target: { value: "10/12/2023" },
    });
    await waitFor(() =>
      expect(getInput("select-faixas-etarias")).toBeEnabled(),
    );

    fireEvent.click(screen.getByTestId("botao-limpar-filtros"));

    await waitFor(() => {
      expect(getSelectMes()).toHaveValue("");
    });
    expect(getInput("div-periodo-lancamento-de")).toHaveValue("");
    [
      "select-dres",
      "select-lotes",
      "select-subprefeituras",
      "select-unidades-educacionais",
      "select-tipos-alimentacao",
      "select-faixas-etarias",
    ].forEach((testId) => expect(getInput(testId)).toBeDisabled());
    expect(screen.getByText("Selecione a DRE")).toBeInTheDocument();
    expect(screen.getByText("Selecione o Lote")).toBeInTheDocument();
    expect(screen.getByText("Selecione um grupo")).toBeInTheDocument();
    expect(screen.getByTestId("botao-exportar-excel")).toBeDisabled();
  });
});

describe("Relatório de Alimentações Servidas - Visão DRE", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    configuraMocks();
    configuraPerfil({
      tipoPerfil: TIPO_PERFIL.DIRETORIA_REGIONAL,
      perfil: PERFIL.COGESTOR_DRE,
      instituicao: DRE_BUTANTA.uuid,
    });
    await renderizaTela();
  });

  it("lista somente a DRE do usuário e busca os lotes da DRE", async () => {
    expect(getUltimaRequisicao("/lotes-simples/").params).toEqual({
      diretoria_regional__uuid: DRE_BUTANTA.uuid,
    });

    selecionaMes();
    expect(getOpcoesMenu("select-dres")).toEqual(["Todos", DRE_BUTANTA.nome]);
  });
});

describe("Relatório de Alimentações Servidas - Visão Terceirizada", () => {
  const TERCEIRIZADA_UUID = "50403e20-402c-49af-b047-1f66173eea91";

  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    configuraMocks();
    mock
      .onGet("/lotes-simples/")
      .reply(200, { count: 1, results: [LOTE_BUTANTA] });
    configuraPerfil({
      tipoPerfil: TIPO_PERFIL.TERCEIRIZADA,
      perfil: PERFIL.ADMINISTRADOR_EMPRESA,
      tipoServico: TIPO_SERVICO.TERCEIRIZADA,
      instituicao: TERCEIRIZADA_UUID,
    });
    await renderizaTela();
  });

  it("lista somente as DREs dos lotes da terceirizada e restringe as unidades aos seus lotes", async () => {
    expect(getUltimaRequisicao("/lotes-simples/").params).toEqual({
      terceirizada__uuid: TERCEIRIZADA_UUID,
    });

    selecionaMes();
    expect(getOpcoesMenu("select-dres")).toEqual(["Todos", DRE_BUTANTA.nome]);

    selecionaOpcao("select-dres", DRE_BUTANTA.nome);

    await waitFor(() => {
      expect(
        getUltimaRequisicao("/escolas-para-filtros/").params.lote__uuid,
      ).toEqual([LOTE_BUTANTA.uuid]);
    });
  });
});

describe("Relatório de Alimentações Servidas - Loading e erros", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    configuraMocks();
    configuraPerfil({
      tipoPerfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
      instituicao: mockMeusDadosCODAEGA.vinculo_atual.instituicao.uuid,
    });
  });

  it("exibe loading enquanto carrega as opções iniciais", async () => {
    let resolveMeses;
    mock.onGet(URL_MESES_ANOS).reply(
      () =>
        new Promise((resolve) => {
          resolveMeses = resolve;
        }),
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MeusDadosContext.Provider
            value={{ meusDados: mockMeusDadosCODAEGA, setMeusDados: jest.fn() }}
          >
            <RelatorioAlimentacoesServidasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(document.querySelectorAll(".ant-skeleton").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.queryByTestId("select-mes-referencia"),
    ).not.toBeInTheDocument();

    await act(async () => {
      resolveMeses([200, mockMesesAnosRelatorioAdesao]);
    });

    await waitFor(() => {
      expect(screen.getByTestId("select-mes-referencia")).toBeInTheDocument();
    });
    expect(document.querySelectorAll(".ant-skeleton")).toHaveLength(0);
  });

  it("exibe erro quando falha ao carregar as opções iniciais", async () => {
    mock.onGet(URL_MESES_ANOS).reply(500, {});
    mock.onGet("/diretorias-regionais-simplissima/").reply(500, {});

    await renderizaTela();

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao carregar os meses de referência."),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Erro ao carregar as DREs.")).toBeInTheDocument();
  });

  it("exibe erro quando falha ao carregar as subprefeituras e as unidades educacionais", async () => {
    mock.onGet("/subprefeituras/").reply(500, {});
    mock.onGet("/escolas-para-filtros/").reply(500, {});

    await renderizaTela();
    await preparaMesEDre();

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao carregar as subprefeituras."),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("Erro ao carregar as unidades educacionais."),
    ).toBeInTheDocument();
  });

  it("não exibe opções quando o back-end retorna lista vazia", async () => {
    mock.onGet("/subprefeituras/").reply(200, { results: [] });
    mock.onGet("/escolas-para-filtros/").reply(200, []);

    await renderizaTela();
    await preparaMesEDre();

    await waitFor(() => {
      expect(getOpcoesMenu("select-subprefeituras")).toEqual(["Todos"]);
    });
    expect(getOpcoesMenu("select-unidades-educacionais")).toEqual(["Todos"]);
  });
});
