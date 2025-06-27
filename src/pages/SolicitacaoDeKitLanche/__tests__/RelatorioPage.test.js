import React from "react";
import { render, screen } from "@testing-library/react";
import {
  RelatorioEscola,
  RelatorioDRE,
  RelatorioCODAE,
  RelatorioTerceirizada,
} from "../RelatorioPage";
import * as relatoriosService from "src/services/relatorios";
import { MemoryRouter } from "react-router-dom";

jest.mock("src/services/relatorios", () => ({
  getMotivosDREnaoValida: jest.fn(),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb" />
));
jest.mock("src/components/Shareable/Page/Page", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("src/components/SolicitacaoDeKitLanche/Relatorio", () => () => (
  <div data-testid="relatorio" />
));

jest.mock("src/components/Shareable/ModalCancelarSolicitacao_", () => () => (
  <div />
));
jest.mock(
  "src/components/Shareable/ModalNaoValidarSolicitacaoReduxForm",
  () => () => <div />
);
jest.mock("src/components/Shareable/ModalNegarSolicitacao", () => () => (
  <div />
));
jest.mock("src/components/Shareable/ModalCODAEQuestiona", () => ({
  ModalCODAEQuestiona: () => <div />,
}));
jest.mock(
  "src/components/Shareable/ModalTerceirizadaRespondeQuestionamento",
  () => ({
    ModalTerceirizadaRespondeQuestionamento: () => <div />,
  })
);

describe("RelatorioPage - Testes completos", () => {
  beforeEach(() => {
    relatoriosService.getMotivosDREnaoValida.mockResolvedValue({
      status: 200,
      data: { results: [{ id: 1, descricao: "Motivo A" }] },
    });
  });

  it("Renderiza corretamente para ESCOLA", async () => {
    render(
      <MemoryRouter>
        <RelatorioEscola />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("breadcrumb")).toBeInTheDocument();
    expect(await screen.findByTestId("relatorio")).toBeInTheDocument();
  });

  it("Renderiza corretamente para DRE", async () => {
    render(
      <MemoryRouter>
        <RelatorioDRE />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("breadcrumb")).toBeInTheDocument();
    expect(await screen.findByTestId("relatorio")).toBeInTheDocument();
  });

  it("Renderiza corretamente para CODAE", async () => {
    render(
      <MemoryRouter>
        <RelatorioCODAE />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("breadcrumb")).toBeInTheDocument();
    expect(await screen.findByTestId("relatorio")).toBeInTheDocument();
  });

  it("Renderiza corretamente para TERCEIRIZADA", async () => {
    render(
      <MemoryRouter>
        <RelatorioTerceirizada />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("breadcrumb")).toBeInTheDocument();
    expect(await screen.findByTestId("relatorio")).toBeInTheDocument();
  });
});
