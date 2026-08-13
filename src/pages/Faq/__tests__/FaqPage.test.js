import React from "react";
import { render, screen } from "@testing-library/react";
import { HOME } from "src/constants/config";
import { AJUDA } from "src/configs/constants";
import FaqPage from "../FaqPage";

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
  default: ({ home, atual }) => (
    <div data-testid="breadcrumb">
      <span data-testid="breadcrumb-home">{home}</span>
      <span data-testid="breadcrumb-href">{atual.href}</span>
      <span data-testid="breadcrumb-titulo">{atual.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Faq", () => ({
  __esModule: true,
  default: () => <div data-testid="faq">FAQ</div>,
}));

describe("FaqPage", () => {
  it("deve renderizar a página de dúvidas frequentes corretamente", () => {
    render(<FaqPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Dúvidas Frequentes",
    );

    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");

    expect(screen.getByTestId("voltar-para")).toHaveTextContent(HOME);

    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);

    expect(screen.getByTestId("breadcrumb-href")).toHaveTextContent(
      `/${AJUDA}`,
    );

    expect(screen.getByTestId("breadcrumb-titulo")).toHaveTextContent("Ajuda");

    expect(screen.getByTestId("faq")).toBeInTheDocument();
  });
});
