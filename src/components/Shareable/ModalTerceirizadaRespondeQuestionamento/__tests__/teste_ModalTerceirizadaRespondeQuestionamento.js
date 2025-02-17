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
import { ModalTerceirizadaRespondeQuestionamento } from "../index";

import { terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";

import { mockTerceirizadaRespondeQuestionamento } from "mocks/services/inclusaoDeAlimentacao/terceirizada.service/mockTerceirizadaRespondeQuestionamento";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/inclusaoDeAlimentacao");

describe("Teste <ModalTerceirizadaRespondeQuestionamento>", () => {
  beforeEach(async () => {
    let showQuestionamentoModal = true;

    terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao.mockResolvedValue(
      {
        data: mockTerceirizadaRespondeQuestionamento,
        status: 200,
      }
    );

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalTerceirizadaRespondeQuestionamento
            closeModal={() => {
              showQuestionamentoModal = false;
            }}
            showModal={showQuestionamentoModal}
            uuid="a8fe9f4e-1138-46d4-8140-b47ef5714b95"
            loadSolicitacao={() => {}}
            resposta_sim_nao="Sim"
            endpoint={
              terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
            }
            tipoSolicitacao="solicitacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Enviar' ", async () => {
    const justificativaInput = screen.getByPlaceholderText(
      "Qual a sua justificativa para a resposta acima?"
    );

    fireEvent.change(justificativaInput, {
      target: { value: "Esta é uma justificativa de teste." },
    });
    expect(justificativaInput.value).toBe("Esta é uma justificativa de teste.");

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    expect(botaoEnviar).toBeDisabled();

    await waitFor(() =>
      expect(
        terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
      ).toHaveBeenCalled()
    );
    expect(
      terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
    ).toHaveReturnedWith(
      Promise.resolve(mockTerceirizadaRespondeQuestionamento)
    );
  });
});
