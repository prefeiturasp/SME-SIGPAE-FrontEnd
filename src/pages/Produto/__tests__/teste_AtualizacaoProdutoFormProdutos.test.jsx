import "@testing-library/jest-dom";
import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { change, reducer as formReducer } from "redux-form";
import { MemoryRouter, useNavigate } from "react-router-dom";

import AtualizacaoProdutoFormPage from "src/pages/Produto/AtualizacaoProdutoFormPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockGetMarcasProdutos } from "src/mocks/services/produto.service/mockGetMarcasProdutos";
import { mockGetFabricantesProdutos } from "src/mocks/services/produto.service/mockGetFabricantesProdutos";
import { mockGetInformacoesGrupo } from "src/mocks/services/produto.service/mockGetInformacoesGrupo";
import { mockGetTiposItens } from "src/mocks/services/produto.service/mockGetTiposItens";
import { mockGetNomeDeProdutosEdital } from "src/mocks/services/produto.service/mockGetNomeDeProdutosEdital";
import { mockGetHomologacao } from "src/mocks/services/produto.service/mockGetHomologacao";
import { mockGetUnidadesDeMedidaProduto } from "src/mocks/services/produto.service/mockGetUnidadesDeMedidaProduto";
import { mockGetEmbalagensProduto } from "src/mocks/services/produto.service/mockGetEmbalagensProduto";
import mock from "src/services/_mock";

const UUID_PRODUTO_A = mockGetHomologacao.uuid;
const UUID_PRODUTO_B = "b6f7f6f7-0000-4000-8000-000000000002";

const grupoCarboidratos = mockGetInformacoesGrupo.results.find(
  (grupo) => grupo.nome === "CARBOIDRATOS",
);
const informacaoCarboidratos = grupoCarboidratos.informacoes_nutricionais.find(
  (informacao) => informacao.nome === "CARBOIDRATOS",
);
const informacaoLactose = grupoCarboidratos.informacoes_nutricionais.find(
  (informacao) => informacao.nome === "LACTOSE",
);
const informacaoAcucaresTotais =
  grupoCarboidratos.informacoes_nutricionais.find(
    (informacao) => informacao.nome === "AÇÚCARES TOTAIS",
  );

const criaInformacaoNutricionalDoProduto = (
  informacaoDoCatalogo,
  nomeTipoNutricional,
  quantidadePorcao,
  valorDiario,
) => ({
  informacao_nutricional: {
    ...informacaoDoCatalogo,
    tipo_nutricional: {
      nome: nomeTipoNutricional,
      uuid: `tipo-${nomeTipoNutricional}`,
    },
    eh_fixo: true,
    eh_dependente: false,
  },
  uuid: `relacao-${informacaoDoCatalogo.uuid}`,
  quantidade_porcao: quantidadePorcao,
  valor_diario: valorDiario,
});

const criaHomologacao = ({
  uuid,
  nome,
  porcao,
  unidadeCaseira,
  informacoesNutricionais,
}) => ({
  ...mockGetHomologacao,
  uuid,
  produto: {
    ...mockGetHomologacao.produto,
    uuid: `produto-${uuid}`,
    nome,
    porcao,
    unidade_caseira: unidadeCaseira,
    informacoes_nutricionais: informacoesNutricionais,
    homologacao: {
      ...mockGetHomologacao.produto.homologacao,
      uuid,
    },
  },
  logs: [],
});

const homologacaoA = criaHomologacao({
  uuid: UUID_PRODUTO_A,
  nome: "SUCO UVA PRODUTO A",
  porcao: "200 ML",
  unidadeCaseira: "1 COPO",
  informacoesNutricionais: [
    criaInformacaoNutricionalDoProduto(
      informacaoCarboidratos,
      "CARBOIDRATOS",
      "10",
      "5",
    ),
    criaInformacaoNutricionalDoProduto(
      informacaoLactose,
      "CARBOIDRATOS",
      "7",
      "3",
    ),
  ],
});

const homologacaoB = criaHomologacao({
  uuid: UUID_PRODUTO_B,
  nome: "SUCO UVA PRODUTO B",
  porcao: "50 G",
  unidadeCaseira: "2 COLHERES",
  informacoesNutricionais: [
    criaInformacaoNutricionalDoProduto(
      informacaoAcucaresTotais,
      "CARBOIDRATOS",
      "20",
      "10",
    ),
  ],
});

const TelaComTrocaDeProduto = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          navigate(`/gestao-produto/editar?uuid=${UUID_PRODUTO_B}`)
        }
      >
        trocar-produto
      </button>
      <AtualizacaoProdutoFormPage />
    </>
  );
};

const renderTela = (store, initialEntries) =>
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={initialEntries}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosTerceirizada,
            setMeusDados: jest.fn(),
          }}
        >
          <TelaComTrocaDeProduto />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    </Provider>,
  );

const criarStore = (initialState = {}) =>
  createStore(combineReducers({ form: formReducer }), initialState);

const inputsDaLinha = (nome) =>
  screen.getByText(nome).parentElement.querySelectorAll("input");

const avancarParaInformacoesNutricionais = async () => {
  await waitFor(() => {
    expect(screen.getByText("Identificação do Produto")).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText("Próximo").closest("button"));
  await waitFor(() => {
    expect(screen.getByText("Informações Nutricionais")).toBeInTheDocument();
  });
};

describe("AtualizacaoProdutoFormPage - isolamento entre produtos", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

    mock.reset();
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock.onGet("/marcas/").reply(200, mockGetMarcasProdutos);
    mock.onGet("/fabricantes/").reply(200, mockGetFabricantesProdutos);
    mock
      .onGet(`/homologacoes-produtos/${UUID_PRODUTO_A}/`)
      .reply(200, homologacaoA);
    mock
      .onGet(`/homologacoes-produtos/${UUID_PRODUTO_B}/`)
      .reply(200, homologacaoB);
    mock
      .onGet("/informacoes-nutricionais/agrupadas/")
      .reply(200, mockGetInformacoesGrupo);
    mock
      .onGet("/nome-de-produtos-edital/")
      .reply(200, mockGetNomeDeProdutosEdital);
    mock.onGet("/itens-cadastros/tipos/").reply(200, mockGetTiposItens);
    mock.onGet("/unidades-medida/").reply(200, mockGetUnidadesDeMedidaProduto);
    mock.onGet("/embalagens-produto/").reply(200, mockGetEmbalagensProduto);
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it("não reaproveita informações nutricionais ao trocar de produto na mesma sessão", async () => {
    const store = criarStore();

    await act(async () => {
      renderTela(store, [`/gestao-produto/editar?uuid=${UUID_PRODUTO_A}`]);
    });

    await avancarParaInformacoesNutricionais();

    expect(screen.getByDisplayValue("200 ML")).toBeInTheDocument();

    const [quantidadeLactoseA] = inputsDaLinha("LACTOSE");
    expect(quantidadeLactoseA.value).toBe("7");
    fireEvent.change(quantidadeLactoseA, { target: { value: "99" } });
    expect(quantidadeLactoseA.value).toBe("99");

    fireEvent.click(screen.getByText("trocar-produto"));

    await avancarParaInformacoesNutricionais();

    expect(screen.getByDisplayValue("50 G")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2 COLHERES")).toBeInTheDocument();

    const [quantidadeAcucaresB] = inputsDaLinha("AÇÚCARES TOTAIS");
    const [quantidadeLactoseB] = inputsDaLinha("LACTOSE");

    expect(quantidadeAcucaresB.value).toBe("20");
    expect(quantidadeLactoseB.value).toBe("");

    const valoresDoFormulario = store.getState().form.atualizacaoProduto.values;
    expect(
      valoresDoFormulario[`informacao=${informacaoLactose.uuid}`],
    ).toBeUndefined();
  });

  it("descarta valores residuais de outro produto ao entrar na tela", async () => {
    const store = criarStore();
    store.dispatch(
      change(
        "atualizacaoProduto",
        `informacao=${informacaoLactose.uuid}.porcao`,
        "99",
      ),
    );
    store.dispatch(
      change(
        "atualizacaoProduto",
        `informacao=${informacaoLactose.uuid}.valor_diario`,
        "50",
      ),
    );

    await act(async () => {
      renderTela(store, [`/gestao-produto/editar?uuid=${UUID_PRODUTO_B}`]);
    });

    await avancarParaInformacoesNutricionais();

    expect(screen.getByDisplayValue("50 G")).toBeInTheDocument();

    const [quantidadeLactose] = inputsDaLinha("LACTOSE");
    expect(quantidadeLactose.value).toBe("");
  });

  it("descarta campos nutricionais órfãos ao montar o passo 2", async () => {
    const store = criarStore();

    await act(async () => {
      renderTela(store, [`/gestao-produto/editar?uuid=${UUID_PRODUTO_B}`]);
    });

    await waitFor(() => {
      expect(screen.getByText("Identificação do Produto")).toBeInTheDocument();
    });

    const chaveLactose = `informacao=${informacaoLactose.uuid}`;
    act(() => {
      store.dispatch(
        change("atualizacaoProduto", `${chaveLactose}.porcao`, "99"),
      );
    });
    expect(
      store.getState().form.atualizacaoProduto.values[chaveLactose],
    ).toEqual({ porcao: "99" });

    await avancarParaInformacoesNutricionais();

    const [quantidadeLactose] = inputsDaLinha("LACTOSE");
    expect(quantidadeLactose.value).toBe("");
    expect(
      store.getState().form.atualizacaoProduto.values[chaveLactose],
    ).toBeUndefined();
  });

  it("limpa o formulário global ao sair da tela", async () => {
    const store = criarStore();

    let utilitarios;
    await act(async () => {
      utilitarios = renderTela(store, [
        `/gestao-produto/editar?uuid=${UUID_PRODUTO_A}`,
      ]);
    });

    await waitFor(() => {
      expect(screen.getByText("Identificação do Produto")).toBeInTheDocument();
    });
    expect(store.getState().form.atualizacaoProduto).toBeDefined();

    utilitarios.unmount();

    expect(store.getState().form.atualizacaoProduto?.values).toBeUndefined();
  });
});
