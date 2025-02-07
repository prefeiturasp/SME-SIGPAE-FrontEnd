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
import { ModalCODAEAutoriza } from "../index";

import { codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";

import { mockCODAEAutoriza } from "mocks/services/inclusaoDeAlimentacao/codae.service/mockCODAEAutoriza";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/inclusaoDeAlimentacao");

describe("Teste <ModalCODAEAutoriza>", () => {
  beforeEach(async () => {
    let showModalCodaeAutorizar = true;

    codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
      data: mockCODAEAutoriza,
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
          <ModalCODAEAutoriza
            showModal={showModalCodaeAutorizar}
            loadSolicitacao={() => {}}
            closeModal={() => {
              showModalCodaeAutorizar = false;
            }}
            endpoint={codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao}
            uuid="de8cf644-cf63-4c1b-9996-53f0082529f2"
            ehInclusao={true}
            tipoSolicitacao="solicitacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Sim' ", async () => {
    expect(
      screen.getByText("Deseja autorizar a solicitação?")
    ).toBeInTheDocument();

    const botaoConfirmar = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoConfirmar);

    expect(botaoConfirmar).toBeDisabled();

    await waitFor(() =>
      expect(
        codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao
      ).toHaveBeenCalled()
    );
    expect(codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao).toHaveReturnedWith(
      Promise.resolve(mockCODAEAutoriza)
    );
  });
});
