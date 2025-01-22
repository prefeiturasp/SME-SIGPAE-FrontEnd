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
import { ESCOLA } from "configs/constants";

import { ModalCancelarKitLancheCEMEI } from "components/SolicitacaoKitLancheCEMEI/Relatorio/components/ModalCancelarKitLancheCEMEI";

import { cancelaFluxoSolicitacaoKitLancheCEMEI } from "services/kitLanche";
import { getRelatorioKitLancheCEMEI } from "services/relatorios";

import { mockGetSolicitacaoKitLancheCEMEI } from "mocks/SolicitacaoKitLancheCEMEI/mockGetSolicitacaoKitLancheCEMEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/kitLanche");
jest.mock("services/relatorios");

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
