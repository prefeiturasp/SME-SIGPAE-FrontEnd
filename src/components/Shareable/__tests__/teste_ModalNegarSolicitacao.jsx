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
import ModalNegarSolicitacao from "../ModalNegarSolicitacao";

import { codaeNegarSolicitacaoDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";

import { mockCODAENegarSolicitacao } from "mocks/services/inclusaoDeAlimentacao/codae.service/mockCODAENegarSolicitacao";
import { mockInclusaoCEMEI } from "mocks/InclusaoAlimentacao/mockInclusaoCEMEI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => <textarea data-testid="ckeditor-mock" name="justificativa" />,
}));

jest.mock("services/inclusaoDeAlimentacao");

describe("Teste <ModalNegarSolicitacao>", () => {
  beforeEach(async () => {
    let showModalCodaeNegar = true;

    codaeNegarSolicitacaoDeInclusaoDeAlimentacao.mockResolvedValue({
      data: mockCODAENegarSolicitacao,
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
          <ModalNegarSolicitacao
            showModal={showModalCodaeNegar}
            loadSolicitacao={() => {}}
            closeModal={() => {
              showModalCodaeNegar = false;
            }}
            endpoint={codaeNegarSolicitacaoDeInclusaoDeAlimentacao}
            solicitacao={mockInclusaoCEMEI}
            tipoSolicitacao="solicitacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Enviar' ", async () => {
    expect(screen.getByText("Deseja negar a solicitação?")).toBeInTheDocument();

    const ckEditor = screen.getByTestId("ckeditor-mock");

    fireEvent.change(ckEditor, {
      target: { value: "Motivo para negar a solicitação." },
    });

    const botaoConfirmar = screen.getByText("Sim").closest("button");
    await waitFor(() => expect(botaoConfirmar).not.toBeDisabled());
    fireEvent.click(botaoConfirmar);

    expect(botaoConfirmar).toBeDisabled();

    await waitFor(() =>
      expect(codaeNegarSolicitacaoDeInclusaoDeAlimentacao).toHaveBeenCalled()
    );
    expect(codaeNegarSolicitacaoDeInclusaoDeAlimentacao).toHaveReturnedWith(
      Promise.resolve(mockCODAENegarSolicitacao)
    );
  });

  it("Testa o fechamento do modal", async () => {
    const botaoFechar = screen.getByText("Não").closest("button");
    fireEvent.click(botaoFechar);
  });
});
