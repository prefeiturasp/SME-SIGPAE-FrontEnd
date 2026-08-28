import React from "react";
import { render, screen } from "@testing-library/react";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";
import { CadastrarDuvidasFrequentes } from "../DuvidasFrequentes/CadastroDuvidasFrequentesPage";

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
      <span data-testid="ajuda-href">{anteriores[0].href}</span>
      <span data-testid="ajuda-titulo">{anteriores[0].titulo}</span>
      <span data-testid="listagem-href">{anteriores[1].href}</span>
      <span data-testid="listagem-titulo">{anteriores[1].titulo}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Faq/DuvidasFrequentes/Cadastro", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cadastro-duvidas-frequentes">
      Cadastro de Dúvidas Frequentes
    </div>
  ),
}));

describe("CadastroDuvidasFrequentesPage", () => {
  it("deve renderizar a página de cadastro de dúvidas frequentes corretamente", () => {
    render(<CadastrarDuvidasFrequentes />);

    const caminhoListagem = `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`;
    const caminhoCadastro = `${caminhoListagem}/${CADASTRO_DUVIDAS_FREQUENTES}`;

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Cadastrar Dúvidas Frequentes",
    );
    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");
    expect(screen.getByTestId("voltar-para")).toHaveTextContent(
      caminhoListagem,
    );
    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);
    expect(screen.getByTestId("ajuda-href")).toHaveTextContent(`/${AJUDA}`);
    expect(screen.getByTestId("ajuda-titulo")).toHaveTextContent("Ajuda");
    expect(screen.getByTestId("listagem-href")).toHaveTextContent(
      caminhoListagem,
    );
    expect(screen.getByTestId("listagem-titulo")).toHaveTextContent(
      "Cadastro Dúvidas Frequentes",
    );
    expect(screen.getByTestId("atual-href")).toHaveTextContent(caminhoCadastro);
    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Cadastrar Dúvidas Frequentes",
    );
    expect(
      screen.getByTestId("cadastro-duvidas-frequentes"),
    ).toBeInTheDocument();
  });
});
