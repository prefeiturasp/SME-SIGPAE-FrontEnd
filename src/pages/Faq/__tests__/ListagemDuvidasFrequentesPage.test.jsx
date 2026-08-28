import React from "react";
import { render, screen } from "@testing-library/react";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";
import { ListagemDuvidasFrequentes } from "../DuvidasFrequentes/ListagemDuvidasFrequentesPage";

jest.mock("src/components/Shareable/Page/PageNoSidebar", () => ({
  __esModule: true,
  default: ({ botaoVoltar, breadcrumb, children, titulo, voltarPara }) => (
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
  default: ({ atual, anteriores, home }) => (
    <div data-testid="breadcrumb">
      <span data-testid="breadcrumb-home">{home}</span>
      <span data-testid="anterior-href">{anteriores[0].href}</span>
      <span data-testid="anterior-titulo">{anteriores[0].titulo}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Faq/DuvidasFrequentes/Listagem", () => ({
  __esModule: true,
  default: () => <div data-testid="listagem-duvidas-frequentes" />,
}));

describe("ListagemDuvidasFrequentesPage", () => {
  it("deve renderizar a página de listagem de dúvidas frequentes corretamente", () => {
    render(<ListagemDuvidasFrequentes />);

    const caminhoListagem = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`;

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Cadastro Dúvidas Frequentes",
    );
    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");
    expect(screen.getByTestId("voltar-para")).toHaveTextContent(`/${AJUDA}`);
    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);
    expect(screen.getByTestId("anterior-href")).toHaveTextContent(`/${AJUDA}`);
    expect(screen.getByTestId("anterior-titulo")).toHaveTextContent("Ajuda");
    expect(screen.getByTestId("atual-href")).toHaveTextContent(caminhoListagem);
    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Cadastro Dúvidas Frequentes",
    );
    expect(
      screen.getByTestId("listagem-duvidas-frequentes"),
    ).toBeInTheDocument();
  });
});
