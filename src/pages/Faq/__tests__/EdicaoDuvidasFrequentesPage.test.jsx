import React from "react";
import { render, screen } from "@testing-library/react";
import { AJUDA, CADASTRO_DUVIDAS_FREQUENTES } from "src/configs/constants";
import { HOME } from "src/constants/config";
import EdicaoDuvidasFrequentesPage from "../DuvidasFrequentes/EdicaoDuvidasFrequentesPage";

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
      {anteriores.map((item) => (
        <span key={item.href}>{item.titulo}</span>
      ))}
      <span>{atual.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Faq/DuvidasFrequentes/Edicao", () => ({
  __esModule: true,
  default: () => <div data-testid="edicao-duvidas-frequentes" />,
}));

describe("EdicaoDuvidasFrequentesPage", () => {
  it("renderiza título, navegação, breadcrumb e conteúdo da edição", () => {
    render(<EdicaoDuvidasFrequentesPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Editar Dúvida Frequente",
    );
    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");
    expect(screen.getByTestId("voltar-para")).toHaveTextContent(
      `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`,
    );
    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);
    expect(screen.getByTestId("breadcrumb")).toHaveTextContent(
      "AjudaCadastro Dúvidas FrequentesEditar Dúvidas Frequentes",
    );
    expect(screen.getByTestId("edicao-duvidas-frequentes")).toBeInTheDocument();
  });
});
