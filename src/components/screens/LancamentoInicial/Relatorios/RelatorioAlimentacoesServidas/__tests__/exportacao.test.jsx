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
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockTiposAlimentacao } from "src/mocks/InclusaoAlimentacao/mockTiposAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockMesesAnosRelatorioAdesao } from "src/mocks/services/medicaoInicial/dashboard.service/mesesAnosRelatorioAdesao";
import {
  DRE_BUTANTA,
  DRE_IPIRANGA,
  ESCOLA_EMEI_BUTANTA,
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

import { montaParamsExportacao } from "../helpers";

const URL_EXPORTACAO =
  "/medicao-inicial/relatorios/relatorio-alimentacoes-servidas/exportar-xlsx/";
const UUID_LANCHE = "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5";
const UUID_FAIXA_00_MESES = "1b77202d-fd0b-46b7-b4ec-04eb262efece";
const UUID_RECREIO_DEZ_2023 = "8c1f3a52-7d4e-4b8a-9f61-2e5d0c7b9a14";
const GRUPO_1 = "Grupo 1 (CCI, CEI, CEI CEU)";
const GRUPO_3 = "Grupo 3 (CEU EMEI, EMEI)";

const incluiAlgum = (lista, valores) =>
  !lista?.length || valores.some((valor) => lista.includes(valor));

const getExportacoes = () =>
  mock.history.get.filter((requisicao) =>
    requisicao.url.includes("exportar-xlsx"),
  );

const getInput = (testId) => screen.getByTestId(testId).querySelector("input");

const getMenu = (testId) => document.querySelector(`.${testId}__menu`);

const selecionaOpcao = (testId, texto) => {
  if (!getMenu(testId)) {
    fireEvent.mouseDown(
      within(screen.getByTestId(testId)).getByRole("combobox"),
    );
  }
  fireEvent.click(within(getMenu(testId)).getByText(texto));
};

const selecionaMes = (texto = "Dezembro - 2023") =>
  selecionaOpcao("select-mes-referencia", texto);

const selecionaGrupo = async (titulo) => {
  const input = screen
    .getByTestId("select-tipos-unidades")
    .querySelector(".ant-select-selection-search-input");
  await act(async () => {
    fireEvent.mouseDown(input);
  });
  const checkbox = screen
    .getByText(titulo)
    .closest(".ant-select-tree-treenode")
    .querySelector(".ant-select-tree-checkbox");
  fireEvent.click(checkbox);
};

const preparaMesEDre = async () => {
  selecionaMes();
  selecionaOpcao("select-dres", DRE_BUTANTA.nome);
  await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());
};

const clicaExportar = () =>
  fireEvent.click(screen.getByTestId("botao-exportar-excel"));

describe("montaParamsExportacao", () => {
  it("envia somente os filtros preenchidos", () => {
    expect(
      montaParamsExportacao({
        meses: ["12_2023", "11_2023"],
        dres: [DRE_BUTANTA.uuid],
        lotes: [],
        tipos_unidades: [TIPO_UNIDADE_EMEI],
        faixas_etarias: undefined,
        periodo_lancamento_de: "10/12/2023",
      }),
    ).toEqual({
      meses: ["12_2023", "11_2023"],
      dres: [DRE_BUTANTA.uuid],
      tipos_unidades: [TIPO_UNIDADE_EMEI],
      periodo_lancamento_de: "10/12/2023",
    });
  });
});

describe("Exportação Excel do Relatório de Alimentações Servidas", () => {
  beforeEach(async () => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    mock.resetHistory();
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, {
        results: [
          ...mockMesesAnosRelatorioAdesao.results,
          {
            mes: "12",
            ano: "2023",
            status: ["MEDICAO_APROVADA_PELA_CODAE"],
            recreio_nas_ferias: {
              uuid: UUID_RECREIO_DEZ_2023,
              titulo: "Recreio nas Férias - DEZ 2023",
            },
          },
        ],
      });
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriasRegionais);
    mock.onGet("/lotes-simples/").reply(200, mockLotes);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/tipos-alimentacao/").reply(200, mockTiposAlimentacao);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock.onGet("/subprefeituras/").reply((config) => {
      const dres = config.params?.diretoria_regional__uuid || [];
      return [
        200,
        {
          results: mockSubprefeituras.filter((subprefeitura) =>
            dres.includes(subprefeitura.diretoria_regional_uuid),
          ),
        },
      ];
    });
    mock.onGet("/escolas-para-filtros/").reply((config) => {
      const params = config.params || {};
      return [
        200,
        mockEscolas.filter(
          (escola) =>
            incluiAlgum(params.diretoria_regional__uuid, [
              escola.diretoria_regional.uuid,
            ]) &&
            incluiAlgum(params.lote__uuid, [escola.lote.uuid]) &&
            incluiAlgum(params.subprefeitura__uuid, [
              escola.subprefeitura_uuid,
            ]) &&
            incluiAlgum(params.tipo_unidade__uuid, [escola.tipo_unidade.uuid]),
        ),
      ];
    });
    mock.onGet(URL_EXPORTACAO).reply(200, {
      detail: "Solicitação de geração de arquivo recebida com sucesso.",
    });

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
  });

  it("mantém o botão desabilitado sem Mês de Referência ou sem DRE", async () => {
    const botao = screen.getByTestId("botao-exportar-excel");
    expect(botao).toBeDisabled();

    selecionaMes();
    expect(botao).toBeDisabled();

    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    await waitFor(() => expect(botao).toBeEnabled());
  });

  it("solicita a exportação com Mês e DRE e abre a Central de Downloads", async () => {
    await preparaMesEDre();
    clicaExportar();

    await waitFor(() => {
      expect(getExportacoes()).toHaveLength(1);
    });
    expect(getExportacoes()[0].params).toEqual({
      meses: ["12_2023"],
      dres: [DRE_BUTANTA.uuid],
    });

    await waitFor(() => {
      expect(
        screen.getByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("Ir para a Central de Downloads").closest("a"),
    ).toHaveAttribute("href", "/central-downloads");
    expect(screen.getByTestId("botao-exportar-excel")).toBeEnabled();
  });

  it("envia múltiplos meses, DREs, lotes, tipos restantes, unidade, alimentação e período", async () => {
    selecionaMes("Novembro - 2023");
    selecionaMes("Dezembro - 2023");
    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    selecionaOpcao("select-dres", DRE_IPIRANGA.nome);
    await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());

    selecionaOpcao("select-lotes", "BT - LOTE 01");
    selecionaOpcao("select-lotes", "IP - LOTE 02");
    await selecionaGrupo(GRUPO_3);

    const switcher = screen
      .getByText(GRUPO_3)
      .closest(".ant-select-tree-treenode")
      .querySelector(".ant-select-tree-switcher");
    fireEvent.click(switcher);
    const tituloCeuEmei = Array.from(
      document.querySelectorAll(".ant-select-tree-title"),
    ).find((elemento) => elemento.textContent === "CEU EMEI");
    fireEvent.click(
      tituloCeuEmei
        .closest(".ant-select-tree-treenode")
        .querySelector(".ant-select-tree-checkbox"),
    );

    await waitFor(() => {
      expect(getInput("select-unidades-educacionais")).toBeEnabled();
    });
    selecionaOpcao(
      "select-unidades-educacionais",
      "000001 - EMEI BUTANTA - LOTE 01",
    );
    selecionaOpcao("select-tipos-alimentacao", "Lanche");
    fireEvent.change(getInput("div-periodo-lancamento-de"), {
      target: { value: "10/11/2023" },
    });
    fireEvent.change(getInput("div-periodo-lancamento-ate"), {
      target: { value: "20/12/2023" },
    });

    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    expect(getExportacoes()[0].params).toEqual({
      meses: ["11_2023", "12_2023"],
      dres: [DRE_BUTANTA.uuid, DRE_IPIRANGA.uuid],
      lotes: [LOTE_BUTANTA.uuid, LOTE_IPIRANGA.uuid],
      tipos_unidades: [TIPO_UNIDADE_EMEI],
      unidades_educacionais: [ESCOLA_EMEI_BUTANTA.uuid],
      tipos_alimentacao: [UUID_LANCHE],
      periodo_lancamento_de: "10/11/2023",
      periodo_lancamento_ate: "20/12/2023",
    });
    expect(getExportacoes()[0].params.tipos_unidades).not.toContain(
      TIPO_UNIDADE_CEU_EMEI,
    );
  });

  it("envia os recreios nas férias separados dos meses regulares", async () => {
    selecionaMes("Dezembro - 2023");
    selecionaMes("Recreio nas Férias - DEZ 2023");
    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());

    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    expect(getExportacoes()[0].params).toEqual({
      meses: ["12_2023"],
      recreios_nas_ferias: [UUID_RECREIO_DEZ_2023],
      dres: [DRE_BUTANTA.uuid],
    });
  });

  it("envia somente recreios_nas_ferias quando só o recreio foi selecionado", async () => {
    selecionaMes("Recreio nas Férias - DEZ 2023");
    selecionaOpcao("select-dres", DRE_BUTANTA.nome);
    await waitFor(() => expect(getInput("select-lotes")).toBeEnabled());

    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    expect(getExportacoes()[0].params).toEqual({
      recreios_nas_ferias: [UUID_RECREIO_DEZ_2023],
      dres: [DRE_BUTANTA.uuid],
    });
  });

  it("envia tipos de unidade de mais de um grupo", async () => {
    await preparaMesEDre();
    await selecionaGrupo(GRUPO_1);
    fireEvent.click(
      screen
        .getByText(GRUPO_3)
        .closest(".ant-select-tree-treenode")
        .querySelector(".ant-select-tree-checkbox"),
    );

    await waitFor(() =>
      expect(getInput("select-tipos-alimentacao")).toBeEnabled(),
    );
    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    const tipos = getExportacoes()[0].params.tipos_unidades;
    expect(tipos).toHaveLength(5);
    expect(tipos).toEqual(
      expect.arrayContaining([TIPO_UNIDADE_EMEI, TIPO_UNIDADE_CEU_EMEI]),
    );
  });

  it("envia a subprefeitura e a faixa etária selecionadas", async () => {
    await preparaMesEDre();
    await waitFor(() =>
      expect(getInput("select-subprefeituras")).toBeEnabled(),
    );
    selecionaOpcao("select-subprefeituras", "BUTANTA");
    await selecionaGrupo(GRUPO_1);
    await waitFor(() =>
      expect(getInput("select-faixas-etarias")).toBeEnabled(),
    );
    selecionaOpcao("select-faixas-etarias", "00 meses");

    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    expect(getExportacoes()[0].params.subprefeituras).toEqual([
      SUBPREFEITURA_BUTANTA.uuid,
    ]);
    expect(getExportacoes()[0].params.faixas_etarias).toEqual([
      UUID_FAIXA_00_MESES,
    ]);
    expect(getExportacoes()[0].params.lotes).toBeUndefined();
    expect(getExportacoes()[0].params.tipos_alimentacao).toBeUndefined();
  });

  it("não envia lote, faixa etária nem período depois que o usuário os remove", async () => {
    await preparaMesEDre();
    selecionaOpcao("select-lotes", "BT - LOTE 01");
    await selecionaGrupo(GRUPO_1);
    await waitFor(() =>
      expect(getInput("select-faixas-etarias")).toBeEnabled(),
    );
    selecionaOpcao("select-faixas-etarias", "00 meses");
    fireEvent.change(getInput("div-periodo-lancamento-de"), {
      target: { value: "10/12/2023" },
    });

    selecionaOpcao("select-lotes", "BT - LOTE 01");
    await selecionaGrupo(GRUPO_1);
    await waitFor(() =>
      expect(getInput("select-faixas-etarias")).toBeDisabled(),
    );
    fireEvent.click(
      screen
        .getByTestId("div-periodo-lancamento-de")
        .querySelector(".react-datepicker__close-icon"),
    );

    clicaExportar();

    await waitFor(() => expect(getExportacoes()).toHaveLength(1));
    const params = getExportacoes()[0].params;
    expect(params).toEqual({
      meses: ["12_2023"],
      dres: [DRE_BUTANTA.uuid],
    });
    expect(params.lotes).toBeUndefined();
    expect(params.faixas_etarias).toBeUndefined();
    expect(params.tipos_unidades).toBeUndefined();
    expect(params.periodo_lancamento_de).toBeUndefined();
  });

  it("desabilita o botão durante a solicitação e ignora o segundo clique", async () => {
    await preparaMesEDre();
    let liberar;
    mock.onGet(URL_EXPORTACAO).reply(
      () =>
        new Promise((resolve) => {
          liberar = () =>
            resolve([
              200,
              {
                detail:
                  "Solicitação de geração de arquivo recebida com sucesso.",
              },
            ]);
        }),
    );

    const botao = screen.getByTestId("botao-exportar-excel");
    clicaExportar();
    clicaExportar();

    await waitFor(() => expect(botao).toBeDisabled());
    expect(botao.querySelector(".fa-spinner")).toBeInTheDocument();
    expect(getExportacoes()).toHaveLength(1);

    await act(async () => {
      liberar();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Geração solicitada com sucesso."),
      ).toBeInTheDocument();
    });
    expect(getExportacoes()).toHaveLength(1);
    expect(botao).toBeEnabled();
  });

  it("exibe o erro de validação retornado pela API e não abre o modal", async () => {
    await preparaMesEDre();
    mock.onGet(URL_EXPORTACAO).reply(400, {
      meses: ["Mês de referência inválido."],
    });

    clicaExportar();

    await waitFor(() => {
      expect(
        screen.getByText("Mês de referência inválido."),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Geração solicitada com sucesso."),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("botao-exportar-excel")).toBeEnabled();
  });

  it("exibe erro genérico quando a solicitação falha", async () => {
    await preparaMesEDre();
    mock.onGet(URL_EXPORTACAO).reply(500, {});

    clicaExportar();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao exportar o relatório. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Geração solicitada com sucesso."),
    ).not.toBeInTheDocument();
  });
});
