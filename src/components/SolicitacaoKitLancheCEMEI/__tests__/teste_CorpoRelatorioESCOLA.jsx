import "@testing-library/jest-dom";
import {
  render,
  act,
  waitFor,
  screen,
  fireEvent,
} from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CorpoRelatorio } from "../Relatorio/components/CorpoRelatorio";
import { ESCOLA } from "src/configs/constants";

import { ModalCancelarKitLancheCEMEI } from "src/components/SolicitacaoKitLancheCEMEI/Relatorio/components/ModalCancelarKitLancheCEMEI";

import { cancelaFluxoSolicitacaoKitLancheCEMEI } from "src/services/kitLanche";
import { getRelatorioKitLancheCEMEI } from "src/services/relatorios";

import { mockGetSolicitacaoKitLancheCEMEI } from "src/mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoKitLancheCEMEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));
jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));
jest.mock("src/services/kitLanche");
jest.mock("src/services/relatorios");

const propsESCOLA = {
  visao: { ESCOLA },
  ModalNaoAprova: ModalCancelarKitLancheCEMEI,
  toastNaoAprovaMensagem: "Kit Lanche Passeio cancelado com sucesso!",
  endpointNaoAprovaSolicitacao: { cancelaFluxoSolicitacaoKitLancheCEMEI },
  textoBotaoNaoAprova: "Cancelar",
  solicitacaoKitLancheCEMEI: mockGetSolicitacaoKitLancheCEMEI,
};

const mockPdfBlob = new Blob(["mocked PDF content"], {
  type: "application/pdf",
});

describe("Teste <CorpoRelatorio> - Visão ESCOLA", () => {
  beforeEach(async () => {
    getRelatorioKitLancheCEMEI.mockResolvedValue({
      data: mockPdfBlob,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio {...propsESCOLA} />
        </MemoryRouter>
      );
    });
  });

  it("Testa se elementos da tabela estão aparecendo corretamente.", async () => {
    expect(screen.getByText("MEL DONOLA VAZ")).toBeInTheDocument();
    expect(screen.getByText("ISABELLA TORRES SILVA")).toBeInTheDocument();
  });

  it("Testa a geração de relatório para impressão", async () => {
    const botaoImprimir = document
      .querySelector("button .fas.fa-print")
      .closest("button");
    expect(botaoImprimir).toBeInTheDocument();

    fireEvent.click(botaoImprimir);

    await waitFor(() => expect(getRelatorioKitLancheCEMEI).toHaveBeenCalled());
    expect(getRelatorioKitLancheCEMEI).toHaveReturnedWith(
      Promise.resolve(mockPdfBlob)
    );
  });
});
