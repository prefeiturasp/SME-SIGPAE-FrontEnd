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
import { ModalMarcarConferencia } from "../index";

import { terceirizadaMarcaConferencia } from "services/dietaEspecial.service";

import { mockTerceirizadaMarcaConferencia } from "mocks/services/dietaEspecial.service/mockTerceirizadaMarcaConferencia";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("services/dietaEspecial.service");

describe("Teste <ModalMarcarConferencia>", () => {
  beforeEach(async () => {
    let showModalMarcarConferencia = true;

    terceirizadaMarcaConferencia.mockResolvedValue({
      data: mockTerceirizadaMarcaConferencia,
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
          <ModalMarcarConferencia
            closeModal={() => {
              showModalMarcarConferencia = false;
            }}
            showModal={showModalMarcarConferencia}
            uuid="a8fe9f4e-1138-46d4-8140-b47ef5714b95"
            onMarcarConferencia={() => {
              () => {};
            }}
            endpoint="grupos-inclusao-alimentacao-normal"
          />
        </MemoryRouter>
      );
    });
  });

  it("Testa o comportamento após o clique do botão 'Confirmar' ", async () => {
    expect(
      screen.getByText(
        "Deseja marcar essa solicitação como conferida? A ação não poderá ser desfeita."
      )
    ).toBeInTheDocument();

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(botaoConfirmar);

    expect(botaoConfirmar).toBeDisabled();

    await waitFor(() =>
      expect(terceirizadaMarcaConferencia).toHaveBeenCalled()
    );
    expect(terceirizadaMarcaConferencia).toHaveReturnedWith(
      Promise.resolve(mockTerceirizadaMarcaConferencia)
    );
  });
});
