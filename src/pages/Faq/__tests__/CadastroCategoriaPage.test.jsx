import React from "react";
import { render, screen } from "@testing-library/react";
import {
  AJUDA,
  CADASTRAR_CATEGORIA,
  CADASTRO_CATEGORIA,
} from "src/configs/constants";
import { HOME } from "src/constants/config";
import CadastroCategoriaPage from "../CadastroCategoriaPage";

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
      <span data-testid="ajuda-href">{anteriores[0].href}</span>
      <span data-testid="ajuda-titulo">{anteriores[0].titulo}</span>
      <span data-testid="listagem-href">{anteriores[1].href}</span>
      <span data-testid="listagem-titulo">{anteriores[1].titulo}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Faq/CadastroCategoria/Cadastro", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cadastro-categoria">Cadastro de Categoria</div>
  ),
}));

describe("CadastroCategoriaPage", () => {
  it("deve renderizar a página de cadastro de categoria corretamente", () => {
    render(<CadastroCategoriaPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Cadastrar Categoria",
    );

    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");

    expect(screen.getByTestId("voltar-para")).toHaveTextContent(
      `/${AJUDA}/${CADASTRO_CATEGORIA}`,
    );

    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);

    expect(screen.getByTestId("ajuda-href")).toHaveTextContent(`/${AJUDA}`);

    expect(screen.getByTestId("ajuda-titulo")).toHaveTextContent("Ajuda");

    expect(screen.getByTestId("listagem-href")).toHaveTextContent(
      `/${AJUDA}/${CADASTRO_CATEGORIA}`,
    );

    expect(screen.getByTestId("listagem-titulo")).toHaveTextContent(
      "Cadastro de Categoria",
    );

    expect(screen.getByTestId("atual-href")).toHaveTextContent(
      `/${AJUDA}/${CADASTRO_CATEGORIA}/${CADASTRAR_CATEGORIA}`,
    );

    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Cadastrar Categoria",
    );

    expect(screen.getByTestId("cadastro-categoria")).toBeInTheDocument();
  });
});
