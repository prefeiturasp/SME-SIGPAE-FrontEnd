import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { Form, useForm } from "react-final-form";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";
import mock from "src/services/_mock";
import useView from "../components/Filtros/view";

const edital = mockListaNumeros.results[0];
const lote = mockLotesSimples.results[0];
const grupoPorNome = (nome) =>
  mockGetGrupoUnidadeEscolar.results.find((grupo) => grupo.nome === nome);
const grupo1 = grupoPorNome("Grupo 1");
const grupo2 = grupoPorNome("Grupo 2");
const grupo5 = grupoPorNome("Grupo 5");
const nomeGrupo = (grupo) =>
  `${grupo.nome} (${grupo.tipos_unidades.map((tipo) => tipo.iniciais).join(", ")})`;
const nomeLote = `${lote.nome} - ${lote.diretoria_regional.nome}`;
const itemLista = mockParametrizacoesFinanceiras.results[0];

let lotesResults = mockLotesSimples.results.map((item) => ({ ...item }));
let dadosResposta = mockGetDadosParametrizacaoFinanceira;
let listaResposta = { count: 0, results: [] };
let listaStatus = 200;
let cloneStatus = 200;
let cloneResposta = {};
let patchStatus = 200;

const criarSetters = () => ({
  setGrupoSelecionado: jest.fn(),
  setEditalSelecionado: jest.fn(),
  setLoteSelecionado: jest.fn(),
  setFaixasEtarias: jest.fn(),
  setTiposAlimentacao: jest.fn(),
  setParametrizacao: jest.fn(),
});

const responderSucesso = () => {
  mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
  mock.onGet("/lotes-simples/").reply(() => [200, { results: lotesResults }]);
  mock.onGet("/grupos-unidade-escolar/").reply(200, mockGetGrupoUnidadeEscolar);
  mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
  mock
    .onGet("/tipos-unidade-escolar-agrupados/")
    .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
  mock
    .onGet(/dados-parametrizacao-financeira/)
    .reply(() => [200, dadosResposta]);
  mock
    .onGet("/medicao-inicial/parametrizacao-financeira/")
    .reply(() => [listaStatus, listaResposta]);
  mock.onPost(/clonar-encerrar/).reply(() => [cloneStatus, cloneResposta]);
  mock.onPatch(/parametrizacao-financeira\//).reply(() => [patchStatus, {}]);
};

const agendarLista = (results, status = 200) => {
  listaResposta = { count: results.length, results };
  listaStatus = status;
};

const vigente = (
  grupoNome,
  data_inicial,
  data_final,
  uuid = itemLista.uuid,
) => ({
  ...itemLista,
  uuid,
  data_inicial,
  data_final,
  grupo_unidade_escolar: {
    ...itemLista.grupo_unidade_escolar,
    nome: grupoNome,
  },
});

function Rota() {
  const location = useLocation();
  return (
    <div data-testid="rota">{`${location.pathname}${location.search}`}</div>
  );
}

function Captura({ apiRef, hookProps }) {
  const formInterno = useForm();
  const { semForm, form: formExterno, ...rest } = hookProps;
  const formEfetivo = semForm ? undefined : formExterno || formInterno;
  const view = useView({ ...rest, form: formEfetivo });
  apiRef.current = { view, form: formEfetivo || formInterno };
  return (
    <div data-testid="status">{view.carregando ? "loading" : "ready"}</div>
  );
}

const renderView = async ({
  hookProps = {},
  initialValues = {},
  route = "/formulario",
} = {}) => {
  const apiRef = { current: null };
  const utils = render(
    <MemoryRouter initialEntries={[route]}>
      <Rota />
      <Form
        onSubmit={jest.fn()}
        initialValues={initialValues}
        render={() => <Captura apiRef={apiRef} hookProps={hookProps} />}
      />
      <ToastContainer />
    </MemoryRouter>,
  );

  await waitFor(() =>
    expect(screen.getByTestId("status")).toHaveTextContent("ready"),
  );

  return { apiRef, ...utils };
};

const preencher = (form, values) => {
  Object.entries(values).forEach(([campo, valor]) => form.change(campo, valor));
};

describe("Testes do hook useView - Parametrização Financeira", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
    lotesResults = mockLotesSimples.results.map((item) => ({ ...item }));
    dadosResposta = mockGetDadosParametrizacaoFinanceira;
    listaResposta = { count: 0, results: [] };
    listaStatus = 200;
    cloneStatus = 200;
    cloneResposta = {};
    patchStatus = 200;
    responderSucesso();
  });

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it("carrega opções e executa callbacks quando os setters existem", async () => {
    const setters = criarSetters();
    const { apiRef } = await renderView({ hookProps: setters });
    const { view } = apiRef.current;

    expect(view.editais).toHaveLength(mockListaNumeros.results.length + 1);
    expect(view.lotes.length).toBeGreaterThan(1);
    expect(view.gruposUnidadesOpcoes).toHaveLength(
      mockGetGrupoUnidadeEscolar.results.length + 1,
    );
    expect(setters.setFaixasEtarias).toHaveBeenCalled();
    expect(setters.setTiposAlimentacao).not.toHaveBeenCalled();

    await act(async () => {
      view.onChangeEdital(edital.uuid);
    });
    expect(setters.setEditalSelecionado).toHaveBeenCalledWith(edital.numero);
    expect(setters.setLoteSelecionado).toHaveBeenCalledWith("");

    await act(async () => {
      view.onChangeEdital("");
    });
    expect(setters.setEditalSelecionado).toHaveBeenCalledWith("");

    await act(async () => {
      apiRef.current.view.onChangeLote(lote.uuid);
    });
    expect(setters.setLoteSelecionado).toHaveBeenCalledWith(nomeLote);

    await act(async () => {
      apiRef.current.view.onChangeTiposUnidades(grupo1.uuid);
      apiRef.current.view.onChangeTiposUnidades("");
    });
    expect(setters.setGrupoSelecionado).toHaveBeenCalledWith(nomeGrupo(grupo1));
    expect(setters.setGrupoSelecionado).toHaveBeenCalledWith(
      "Selecione os tipos de unidades",
    );
    expect(setters.setTiposAlimentacao).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ nome: "Lanche" })]),
    );
    expect(setters.setTiposAlimentacao).toHaveBeenCalledWith([]);
  });

  it("executa callbacks sem form e sem setters", async () => {
    const { apiRef } = await renderView({ hookProps: { semForm: true } });

    await act(async () => {
      apiRef.current.view.onChangeEdital(edital.uuid);
      apiRef.current.view.onChangeEdital("");
      apiRef.current.view.onChangeLote(lote.uuid);
      apiRef.current.view.onChangeTiposUnidades(grupo1.uuid);
    });

    expect(apiRef.current.view.editais.length).toBeGreaterThan(1);
  });

  it("trata falhas de carregamento das requisições iniciais", async () => {
    mock.reset();
    mock.onGet("/editais/lista-numeros/").reply(200, {});
    mock.onGet("/lotes-simples/").reply(200, {});
    mock.onGet("/grupos-unidade-escolar/").reply(500, {});
    mock.onGet("/faixas-etarias/").reply(200, null);
    mock.onGet("/tipos-unidade-escolar-agrupados/").reply(200, null);
    mock.onGet(/dados-parametrizacao-financeira/).reply(500, {});

    await renderView({
      hookProps: {
        ...criarSetters(),
        setParametrizacao: undefined,
        uuidParametrizacao: mockGetDadosParametrizacaoFinanceira.uuid,
      },
    });

    expect(
      await screen.findByText(
        "Erro ao carregar grupos de unidade escolar. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("carrega parametrização e inicializa o formulário somente uma vez", async () => {
    const setters = criarSetters();
    const inicial = {
      grupo_unidade_escolar: grupo1.uuid,
      edital: edital.uuid,
      lote: lote.uuid,
    };
    const arvore = (uuid) => (
      <MemoryRouter initialEntries={["/formulario"]}>
        <Rota />
        <Form
          onSubmit={jest.fn()}
          initialValues={inicial}
          render={() => (
            <Captura
              apiRef={apiRef}
              hookProps={{ ...setters, uuidParametrizacao: uuid }}
            />
          )}
        />
      </MemoryRouter>
    );
    const apiRef = { current: null };

    const { rerender } = render(
      arvore(mockGetDadosParametrizacaoFinanceira.uuid),
    );
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("ready"),
    );
    await waitFor(() => expect(setters.setParametrizacao).toHaveBeenCalled());
    expect(setters.setGrupoSelecionado).toHaveBeenCalled();
    expect(setters.setEditalSelecionado).toHaveBeenCalled();
    expect(setters.setLoteSelecionado).toHaveBeenCalled();

    rerender(arvore(mockParametrizacoesFinanceiras.results[1].uuid));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("ready"),
    );
    expect(apiRef.current.view).toBeDefined();
  });

  it("interrompe a inicialização quando não há grupo ou valores", async () => {
    await renderView({
      hookProps: {
        uuidParametrizacao: mockGetDadosParametrizacaoFinanceira.uuid,
      },
    });

    cleanup();
    mock.reset();
    responderSucesso();

    const formCustomizado = {
      getState: () => ({ values: undefined }),
      change: jest.fn(),
    };
    await renderView({
      hookProps: {
        uuidParametrizacao: mockGetDadosParametrizacaoFinanceira.uuid,
        form: formCustomizado,
        semForm: false,
      },
    });
  });

  it("não inicializa edição e lote quando esses campos estão vazios", async () => {
    const setters = criarSetters();
    await renderView({
      hookProps: {
        ...setters,
        uuidParametrizacao: mockGetDadosParametrizacaoFinanceira.uuid,
      },
      initialValues: { grupo_unidade_escolar: grupo1.uuid },
    });

    expect(setters.setGrupoSelecionado).toHaveBeenCalled();
    expect(setters.setEditalSelecionado).not.toHaveBeenCalled();
  });

  it("identifica conflitos de vigência em todas as combinações de datas", async () => {
    const { apiRef } = await renderView({ hookProps: criarSetters() });
    const consultar = async (results, values) => {
      agendarLista(results);
      preencher(apiRef.current.form, {
        edital: edital.uuid,
        lote: lote.uuid,
        grupo_unidade_escolar: grupo2.uuid,
        tabelas: {},
        ...values,
      });
      let retorno;
      await act(async () => {
        retorno = await apiRef.current.view.getGruposPendentes(false);
      });
      return retorno;
    };

    expect(
      await consultar([vigente("Grupo 1", "01/01/2026", null)], {
        data_inicial: "01/02/2026",
        data_final: null,
      }),
    ).toBe(false);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2026", null)], {
        data_inicial: "01/02/2026",
        data_final: null,
      }),
    ).toBe(true);

    expect(
      await consultar([vigente("Grupo 2", "01/06/2026", null)], {
        data_inicial: "01/01/2026",
        data_final: "01/02/2026",
      }),
    ).toBe(false);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2026", null)], {
        data_inicial: "01/01/2026",
        data_final: "01/06/2026",
      }),
    ).toBe(true);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2026", "01/02/2026")], {
        data_inicial: "01/06/2026",
        data_final: null,
      }),
    ).toBe(false);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2026", "31/12/2026")], {
        data_inicial: "01/06/2026",
        data_final: null,
      }),
    ).toBe(true);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2020", "01/01/2021")], {
        data_inicial: "01/01/2022",
        data_final: "01/01/2023",
      }),
    ).toBe(false);

    expect(
      await consultar([vigente("Grupo 2", "01/06/2024", "31/12/2024")], {
        data_inicial: "01/01/2024",
        data_final: "01/03/2024",
      }),
    ).toBe(false);

    expect(
      await consultar([vigente("Grupo 2", "01/01/2024", "31/12/2024")], {
        data_inicial: "01/06/2024",
        data_final: "01/06/2025",
      }),
    ).toBe(true);
  });

  it("copia valores de grupos pendentes e ignora grupos sem número", async () => {
    const { apiRef } = await renderView({ hookProps: criarSetters() });

    agendarLista([
      vigente(
        "Grupo 1",
        "01/01/2020",
        "01/01/2021",
        mockParametrizacoesFinanceiras.results[1].uuid,
      ),
    ]);
    preencher(apiRef.current.form, {
      edital: edital.uuid,
      lote: lote.uuid,
      grupo_unidade_escolar: grupo2.uuid,
      data_inicial: "01/01/2026",
      data_final: "01/02/2026",
      tabelas: { existente: { item: { valor_unitario: "1" } } },
    });
    let comPendencia;
    await act(async () => {
      comPendencia = await apiRef.current.view.getGruposPendentes(true);
    });
    expect(comPendencia).toBe(false);
    expect(
      apiRef.current.form.getState().values.tabelas[
        "Preço das Alimentações - CEI - Período Integral"
      ],
    ).toBeDefined();

    agendarLista([
      vigente(
        "Grupo 3",
        "01/01/2020",
        "01/01/2021",
        mockParametrizacoesFinanceiras.results[0].uuid,
      ),
      vigente(
        "Grupo 4",
        "01/01/2020",
        "01/01/2021",
        mockParametrizacoesFinanceiras.results[1].uuid,
      ),
    ]);
    preencher(apiRef.current.form, {
      grupo_unidade_escolar: grupo5.uuid,
      tabelas: {},
    });
    await act(async () => {
      await apiRef.current.view.getGruposPendentes(true);
    });
    expect(
      apiRef.current.form.getState().values.tabelas[
        "Preço das Alimentações - Período Integral"
      ],
    ).toBeDefined();

    agendarLista([]);
    preencher(apiRef.current.form, {
      grupo_unidade_escolar: "",
      tabelas: {},
    });
    let semNumero;
    await act(async () => {
      semNumero = await apiRef.current.view.getGruposPendentes(true);
    });
    expect(semNumero).toBe(false);

    agendarLista([], 500);
    preencher(apiRef.current.form, { grupo_unidade_escolar: grupo2.uuid });
    await act(async () => {
      await apiRef.current.view.getGruposPendentes(true);
    });
    expect(
      await screen.findByText("Erro ao carregar valores do grupo selecionado."),
    ).toBeInTheDocument();
  });

  it("resolve o conflito mantendo, copiando, criando nova e tratando erro", async () => {
    const { apiRef } = await renderView({ hookProps: criarSetters() });
    const definirConflito = async () => {
      await act(async () => {
        apiRef.current.view.setParametrizacaoConflito(itemLista.uuid);
      });
      await waitFor(() =>
        expect(apiRef.current.view.parametrizacaoConflito).toBe(itemLista.uuid),
      );
    };

    await definirConflito();
    preencher(apiRef.current.form, {
      data_inicial: "01/01/2027",
      data_final: "31/12/2027",
      tabelas: {
        Cat: { Item: { tipo_alimentacao: "id", valor_unitario: "1" } },
      },
    });
    await act(async () => {
      await apiRef.current.view.onChangeConflito("manter", apiRef.current.form);
    });
    expect(
      await screen.findByText("Parametrização Financeira mantida com sucesso!"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("rota")).toHaveTextContent(
      "/medicao-inicial/parametrizacao-financeira/",
    );

    cleanup();
    const copia = await renderView({
      hookProps: criarSetters(),
      route: `/formulario?uuid_origem=${mockParametrizacoesFinanceiras.results[1].uuid}`,
    });
    await act(async () => {
      copia.apiRef.current.view.setParametrizacaoConflito(itemLista.uuid);
    });
    await waitFor(() =>
      expect(copia.apiRef.current.view.parametrizacaoConflito).toBe(
        itemLista.uuid,
      ),
    );
    preencher(copia.apiRef.current.form, {
      data_inicial: "01/01/2027",
      data_final: null,
      tabelas: {},
    });
    cloneStatus = 200;
    cloneResposta = mockGetDadosParametrizacaoFinanceira;
    await act(async () => {
      await copia.apiRef.current.view.onChangeConflito("encerrar_copiar");
    });
    expect(
      await screen.findByText(
        "Parametrização anterior encerrada. Revise as informações e clique em salvar para confirmar.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("rota").textContent).toContain(
      `nova_uuid=${mockGetDadosParametrizacaoFinanceira.uuid}`,
    );
    expect(screen.getByTestId("rota").textContent).toContain(
      "fluxo=encerrar_copiar",
    );
    expect(screen.getByTestId("rota").textContent).not.toContain("uuid_origem");

    cleanup();
    const semUuid = await renderView({ hookProps: criarSetters() });
    await act(async () => {
      semUuid.apiRef.current.view.setParametrizacaoConflito(itemLista.uuid);
    });
    await waitFor(() =>
      expect(semUuid.apiRef.current.view.parametrizacaoConflito).toBe(
        itemLista.uuid,
      ),
    );
    preencher(semUuid.apiRef.current.form, {
      data_inicial: "01/01/2027",
      tabelas: {},
    });
    cloneStatus = 200;
    cloneResposta = {};
    await act(async () => {
      await semUuid.apiRef.current.view.onChangeConflito("encerrar_copiar");
    });
    expect(
      await screen.findByText(
        "Erro ao encerrar e criar nova parametrização financeira.",
      ),
    ).toBeInTheDocument();

    cloneStatus = 200;
    cloneResposta = {
      ...mockGetDadosParametrizacaoFinanceira,
      uuid: mockParametrizacoesFinanceiras.results[1].uuid,
    };
    await act(async () => {
      semUuid.apiRef.current.view.setParametrizacaoConflito(
        mockParametrizacoesFinanceiras.results[1].uuid,
      );
    });
    await waitFor(() =>
      expect(semUuid.apiRef.current.view.parametrizacaoConflito).toBe(
        mockParametrizacoesFinanceiras.results[1].uuid,
      ),
    );
    await act(async () => {
      await semUuid.apiRef.current.view.onChangeConflito("encerrar_copiar");
    });
    expect(screen.getByTestId("rota").textContent).toContain(
      `nova_uuid=${mockParametrizacoesFinanceiras.results[1].uuid}`,
    );

    patchStatus = 200;
    await act(async () => {
      semUuid.apiRef.current.view.setParametrizacaoConflito(
        mockGetDadosParametrizacaoFinanceira.uuid,
      );
    });
    await waitFor(() =>
      expect(semUuid.apiRef.current.view.parametrizacaoConflito).toBe(
        mockGetDadosParametrizacaoFinanceira.uuid,
      ),
    );
    preencher(semUuid.apiRef.current.form, {
      tabelas: {
        Cat: { Item: { tipo_alimentacao: "id", valor_unitario: "2" } },
      },
    });
    await act(async () => {
      await semUuid.apiRef.current.view.onChangeConflito("encerrar_novo");
    });
    expect(screen.getByTestId("rota").textContent).toContain(
      "fluxo=encerrar_novo",
    );

    cloneStatus = 500;
    cloneResposta = { erro: true };
    await act(async () => {
      semUuid.apiRef.current.view.setParametrizacaoConflito(itemLista.uuid);
    });
    await waitFor(() =>
      expect(semUuid.apiRef.current.view.parametrizacaoConflito).toBe(
        itemLista.uuid,
      ),
    );
    await act(async () => {
      await semUuid.apiRef.current.view.onChangeConflito("encerrar_copiar");
    });
    expect(
      await screen.findByText("Ocorreu um erro inesperado"),
    ).toBeInTheDocument();

    await act(async () => {
      await semUuid.apiRef.current.view.onChangeConflito("outra");
    });
  });
});
