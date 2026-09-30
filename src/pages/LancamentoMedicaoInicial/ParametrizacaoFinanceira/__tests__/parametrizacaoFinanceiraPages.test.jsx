import "@testing-library/jest-dom";
import { act, render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockParametrizacoesFinanceiras } from "src/mocks/services/parametrizacao_financeira.service/mockGetParametrizacoesFinanceiras";
import { AdicionarParametrizacaoFinanceiraPage } from "../AdicionarParametrizacaoFinanceiraPage";
import { EditarParametrizacaoFinanceiraPage } from "../EditarParametrizacaoFinanceiraPage";
import { ParametrizacaoFinanceiraPage } from "../ParametrizacaoFinanceiraPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder, disabled }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      disabled={disabled}
      value={input.value || ""}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

const renderPagina = async (pagina, rota = "/") => {
  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[rota]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosSuperUsuarioMedicao,
            setMeusDados: jest.fn(),
          }}
        >
          {pagina}
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Páginas de Parametrização Financeira", () => {
  beforeEach(() => {
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/tipos-unidade-escolar-agrupados/")
      .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
    mock
      .onGet("/medicao-inicial/parametrizacao-financeira/")
      .reply(200, mockParametrizacoesFinanceiras);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
  });

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it("monta a listagem com o breadcrumb de cadastros", async () => {
    await renderPagina(<ParametrizacaoFinanceiraPage />);

    const breadcrumb = document.querySelector(".br-breadcrumb");
    expect(breadcrumb).toHaveTextContent("Medição Inicial");
    expect(breadcrumb).toHaveTextContent("Cadastros");
    expect(breadcrumb).toHaveTextContent("Parametrização Financeira");
    expect(document.querySelector(".texto-titulo")).toHaveTextContent(
      "Parametrização Financeira",
    );
    await waitFor(() => {
      expect(screen.getByText("Adicionar Parametrização")).toBeInTheDocument();
    });
  });

  it("monta o cadastro voltando para a listagem", async () => {
    await renderPagina(<AdicionarParametrizacaoFinanceiraPage />);

    expect(
      screen.getByText("Adicionar Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(screen.getByText("Adicionar Parametrização")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    });
  });

  it("monta a edição quando não há parametrização de origem", async () => {
    await renderPagina(<EditarParametrizacaoFinanceiraPage />);

    expect(
      screen.getByText("Editar Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(screen.getByText("Editar Parametrização")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    });
  });

  it("monta a cópia quando a url traz uuid_origem", async () => {
    await renderPagina(
      <EditarParametrizacaoFinanceiraPage />,
      "/editar?uuid_origem=param-1",
    );

    expect(
      screen.getByText("Cópia da Parametrização Financeira"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cópia da Parametrização")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Nº do Edital")).toBeInTheDocument();
    });
  });
});
