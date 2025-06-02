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
import { ModalCODAEQuestionaFinalForm } from "../index";

import { codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";

import { mockCODAEQuestionaSolicitacaoInclusaoAlimentacao } from "mocks/services/inclusaoDeAlimentacao/codae.service/mockCODAEQuestionaSolicitacaoInclusaoAlimentacao";
import { mockInclusaoCEMEI } from "mocks/InclusaoAlimentacao/mockInclusaoCEMEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/inclusaoDeAlimentacao");

describe("Teste <ModalCODAEQuestionaFinalForm>", () => {
  beforeEach(async () => {
    let showModalCodaeQuestionar = true;

    codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
      data: mockCODAEQuestionaSolicitacaoInclusaoAlimentacao,
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
          <ModalCODAEQuestionaFinalForm
            showModal={showModalCodaeQuestionar}
            loadSolicitacao={() => {}}
            closeModal={() => {
              showModalCodaeQuestionar = false;
            }}
            endpoint={codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao}
            solicitacao={mockInclusaoCEMEI}
            tipoSolicitacao="solicitacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Enviar' ", async () => {
    expect(
      screen.getByText(
        "É possível atender a solicitação com todos os itens previstos no contrato?"
      )
    ).toBeInTheDocument();

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    expect(botaoEnviar).toBeDisabled();

    await waitFor(() =>
      expect(
        codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao
      ).toHaveBeenCalled()
    );
    expect(
      codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao
    ).toHaveReturnedWith(
      Promise.resolve(mockCODAEQuestionaSolicitacaoInclusaoAlimentacao)
    );
  });
});
