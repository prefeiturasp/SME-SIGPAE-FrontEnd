import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { debug } from "jest-preview";
import { MemoryRouter } from "react-router-dom";
import ReclamacaoProduto from "src/components/screens/Produto/Reclamacao";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockProdutosReclamacoesQueryparams } from "src/mocks/services/produto.service/Escola/EMEF/produtosReclamacoesQueryparams";
import { mockGetNovaReclamacaoNomesFabricantes } from "src/mocks/services/produto.service/mockGetNovaReclamacaoNomesFabricantes";
import { mockGetNovaReclamacaoNomesMarcas } from "src/mocks/services/produto.service/mockGetNovaReclamacaoNomesMarcas";
import { mockGetNovaReclamacaoNomesProdutos } from "src/mocks/services/produto.service/mockGetNovaReclamacaoNomesProdutos";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste <FormBuscaProduto> - Perfil Escola", () => {
  beforeEach(async () => {
    mock.onGet("/meus-dados/").reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet("/produtos-editais/lista-nomes-unicos/")
      .reply(200, { results: ["EDITAL MODELO IMR"], count: 1 });
    mock
      .onGet(`/fabricantes/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesFabricantes);
    mock
      .onGet(`/marcas/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesMarcas);
    mock
      .onGet(`/produtos/lista-nomes-nova-reclamacao/`)
      .reply(200, mockGetNovaReclamacaoNomesProdutos);
    mock
      .onGet(`/produtos/filtro-homologados-por-parametros/`)
      .reply(200, mockProdutosReclamacoesQueryparams);
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?nome_produto=COXA%20DE%20FRANGO&marca_produto=BIOLAC&fabricante_produto=ALCA%20FOODS%20SA`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      renderWithProvider(
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
            <ReclamacaoProduto />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
        {
          reclamacaoProduto: {},
          finalForm: {},
        },
      );
    });
  });

  it("deve preencher os campos do formulário com os parâmetros da URL e realizar a busca automaticamente", async () => {
    debug();
    const inputEdital = screen.getByTestId("edital").querySelector("input");
    expect(inputEdital).toBeInTheDocument();
    expect(inputEdital).toBeDisabled();
    expect(inputEdital).toHaveValue("EDITAL MODELO IMR");

    const inputProduto = screen.getByTestId("produto").querySelector("input");
    expect(inputProduto).toHaveValue("COXA DE FRANGO");

    const inputMarca = screen.getByTestId("marca").querySelector("input");
    expect(inputMarca).toHaveValue("BIOLAC");

    const inputFabricante = screen
      .getByTestId("fabricante")
      .querySelector("input");
    expect(inputFabricante).toHaveValue("ALCA FOODS SA");

    expect(
      screen.getByText(`Veja os resultados para: "COXA DE FRANGO"`),
    ).toBeInTheDocument();
  });
});
