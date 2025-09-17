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
import { ModalCODAEQuestiona } from "../index";

import { codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";

import { mockCODAEQuestionaSolicitacaoInclusaoAlimentacao } from "src/mocks/services/inclusaoDeAlimentacao/codae.service/mockCODAEQuestionaSolicitacaoInclusaoAlimentacao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));
jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));
jest.mock("src/services/inclusaoDeAlimentacao");

describe("Teste <ModalCODAEQuestiona>", () => {
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
          <ModalCODAEQuestiona
            showModal={showModalCodaeQuestionar}
            loadSolicitacao={() => {}}
            closeModal={() => {
              showModalCodaeQuestionar = false;
            }}
            endpoint={codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao}
            uuid="d3521c35-b522-4c41-ad3b-73ab6a6f76ea"
            tipoSolicitacao="solicitacao-continua"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Sim' ", async () => {
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
