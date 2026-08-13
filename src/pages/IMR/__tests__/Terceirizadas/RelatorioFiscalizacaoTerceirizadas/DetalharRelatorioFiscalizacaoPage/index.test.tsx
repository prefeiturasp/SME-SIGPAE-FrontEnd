import React from "react";
import { render, screen } from "@testing-library/react";
import { HOME } from "src/constants/config";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  DETALHAR_RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  PAINEL_RELATORIOS_FISCALIZACAO,
} from "src/configs/constants";
import { DetalharRelatorioFiscalizacaoPage } from "src/pages/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/DetalharRelatorioFiscalizacaoPage";

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ botaoVoltar, titulo, children }) => (
    <main>
      <span data-testid="titulo">{titulo}</span>
      <span data-testid="botao-voltar">{String(botaoVoltar)}</span>
      {children}
    </main>
  ),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual, anteriores }) => (
    <div data-testid="breadcrumb">
      <span data-testid="breadcrumb-home">{home}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>

      {anteriores.map((anterior, indice) => (
        <div key={indice}>
          <span data-testid={`anterior-${indice}-href`}>{anterior.href}</span>
          <span data-testid={`anterior-${indice}-titulo`}>
            {anterior.titulo}
          </span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock(
  "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas",
  () => ({
    NovoRelatorioVisitas: ({ somenteLeitura }) => (
      <div
        data-testid="novo-relatorio-visitas"
        data-somente-leitura={String(somenteLeitura)}
      />
    ),
  }),
);

describe("DetalharRelatorioFiscalizacaoPage", () => {
  it("deve renderizar a página de detalhamento do relatório corretamente", () => {
    render(<DetalharRelatorioFiscalizacaoPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent(
      "Detalhar Relatório de Fiscalização Terceirizadas",
    );

    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");

    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);

    expect(screen.getByTestId("atual-href")).toHaveTextContent(
      `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${DETALHAR_RELATORIO_FISCALIZACAO}`,
    );

    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Detalhar Relatório de Fiscalização Terceirizadas",
    );

    expect(screen.getByTestId("anterior-0-href")).toHaveTextContent("/");
    expect(screen.getByTestId("anterior-0-titulo")).toHaveTextContent(
      "Supervisão",
    );

    expect(screen.getByTestId("anterior-1-href")).toHaveTextContent("/");
    expect(screen.getByTestId("anterior-1-titulo")).toHaveTextContent(
      "Terceirizadas",
    );

    expect(screen.getByTestId("anterior-2-href")).toHaveTextContent(
      `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
    );

    expect(screen.getByTestId("anterior-2-titulo")).toHaveTextContent(
      "Painel de Acompanhamento dos Relatórios",
    );

    expect(screen.getByTestId("novo-relatorio-visitas")).toHaveAttribute(
      "data-somente-leitura",
      "true",
    );
  });
});
