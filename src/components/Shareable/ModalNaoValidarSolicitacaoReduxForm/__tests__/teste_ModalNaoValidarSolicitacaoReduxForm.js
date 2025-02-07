import React from "react";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { ModalNaoValidarSolicitacao } from "../index";

import { dreReprovarSolicitacaoDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";

import { mockDRENaoValida } from "mocks/services/inclusaoDeAlimentacao/dre.service/mockDRENaoValida";
import { mockMotivosDRENaoValida } from "mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/inclusaoDeAlimentacao");

describe("Teste <ModalNaoValidarSolicitacao>", () => {
  beforeEach(async () => {
    let showModalNaoValidar = true;

    dreReprovarSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
      data: mockDRENaoValida,
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
          <ModalNaoValidarSolicitacao
            closeModal={() => {
              showModalNaoValidar = false;
            }}
            showModal={showModalNaoValidar}
            uuid="a8fe9f4e-1138-46d4-8140-b47ef5714b95"
            motivosDREnaoValida={mockMotivosDRENaoValida.results}
            endpoint={dreReprovarSolicitacaoDeInclusaoDeAlimentacao}
            loadSolicitacao={() => {}}
            tipoSolicitacao="solicitacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Confirmar' ", async () => {
    expect(
      screen.getByText("Deseja não validar solicitação?")
    ).toBeInTheDocument();

    const motivoLabel = screen.getByText("Motivo");
    const select = motivoLabel.closest("div").querySelector("select");
    const uuidMotivo = mockMotivosDRENaoValida.results.find(
      (motivo) => motivo.nome === "Preenchimento incorreto"
    ).uuid;
    fireEvent.change(select, {
      target: { value: uuidMotivo },
    });

    const justificativaInput = screen.getByPlaceholderText("Obrigatório");

    fireEvent.change(justificativaInput, {
      target: { value: "Esta é uma justificativa de teste." },
    });
    expect(justificativaInput.value).toBe("Esta é uma justificativa de teste.");

    const botaoConfirmar = screen.getByText("Sim").closest("button");
    expect(botaoConfirmar).not.toBeDisabled();
    fireEvent.click(botaoConfirmar);

    expect(botaoConfirmar).toBeDisabled();

    await waitFor(() =>
      expect(dreReprovarSolicitacaoDeInclusaoDeAlimentacao).toHaveBeenCalled()
    );
    expect(dreReprovarSolicitacaoDeInclusaoDeAlimentacao).toHaveReturnedWith(
      Promise.resolve(mockDRENaoValida)
    );
  });
});
