import React from "react";
import { render, screen } from "@testing-library/react";
import { AJUDA, CADASTRO_CATEGORIA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import ListagemCategoriasPage from "../ListagemCategoriasPage";

jest.mock("src/components/Shareable/Page/PageNoSidebar", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, voltarPara, breadcrumb, children }) => (
    <main>
      <span data-testid="titulo">{titulo}</span>
      <span data-testid="botao-voltar">{String(botaoVoltar)}</span>
      <span data-testid="voltar-para">{voltarPara}</span>
      {breadcrumb}
      {children}
    </main>
  ),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <div data-testid="breadcrumb">
      <span data-testid="breadcrumb-home">{home}</span>
      <span data-testid="anterior-href">{anteriores[0].href}</span>
      <span data-testid="anterior-titulo">{anteriores[0].titulo}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>
    </div>
  ),
}));

jest.mock(
  "src/components/screens/Faq/CadastroCategoria/components/BotaoCadastrarCategoria",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="botao-cadastrar-categoria">Cadastrar Categoria</div>
    ),
  }),
);

jest.mock("src/components/screens/Faq/CadastroCategoria/Listagem", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="pagina-listagem-categorias">Listagem de Categorias</div>
  ),
}));

describe("ListagemCategoriasPage", () => {
  it("deve renderizar a página de listagem de categorias corretamente", () => {
    render(<ListagemCategoriasPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Cadastrar Categoria",
    );

    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");

    expect(screen.getByTestId("voltar-para")).toHaveTextContent(`/${AJUDA}`);

    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);

    expect(screen.getByTestId("anterior-href")).toHaveTextContent(`/${AJUDA}`);

    expect(screen.getByTestId("anterior-titulo")).toHaveTextContent("Ajuda");

    expect(screen.getByTestId("atual-href")).toHaveTextContent(
      `/${AJUDA}/${CADASTRO_CATEGORIA}`,
    );

    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Cadastro de Categoria",
    );

    expect(screen.getByTestId("botao-cadastrar-categoria")).toBeInTheDocument();

    expect(
      screen.getByTestId("pagina-listagem-categorias"),
    ).toBeInTheDocument();
  });
});
