import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { ModalCancelaSuspensao } from "../components/ModalCancelaSuspensao";

import { mockSuspensaoAlimentacao } from "mocks/SuspensaoDeAlimentacao/mockSuspensaoAlimentacao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Teste <ModalCancelaSuspensao>", () => {
  let showModalEscolaCancela = true;

  beforeEach(async () => {
    const props = {
      showModal: showModalEscolaCancela,
      closeModal: () => {
        showModalEscolaCancela = false;
      },
      uuid: "cf2e2152-80fa-4b32-9c2c-56f12842cfae",
      solicitacao: mockSuspensaoAlimentacao,
      loadSolicitacao: jest.fn(),
    };

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalCancelaSuspensao {...props} />
        </MemoryRouter>
      );
    });
  });

  it("Deve validar que o modal está sendo inicializado com os textos corretamente", async () => {
    const tituloModal = screen.getByText(
      "Cancelamento de Suspensão de Alimentação"
    );
    expect(tituloModal).toBeInTheDocument();

    await waitFor(() => {
      const motivoSuspensao = screen.getByText((content) =>
        content.includes("Parada Pedagógica")
      );
      expect(motivoSuspensao).toBeInTheDocument();
    });
  });

  it("Deve testar o submit sem preencher a justificativa", async () => {
    const botaoSim = screen.getByText("Sim");
    expect(botaoSim).toBeInTheDocument();
    botaoSim.click();
    userEvent.click(botaoSim);
  });

  it("Deve testar o submit sem selecionar data nenhuma", async () => {
    const justificativaInput = screen.getByRole("textbox");
    expect(justificativaInput).toBeEnabled();
    expect(justificativaInput).toBeVisible();
    fireEvent.change(justificativaInput, {
      target: { value: "Teste de justificativa" },
    });

    const formulario = screen.getByTestId("form-cancelamento");
    fireEvent.submit(formulario);
  });

  it("Deve testar o submit selecionando algumas datas", async () => {
    const checkbox1 = screen.getByDisplayValue("11/01/2025");
    const checkbox2 = screen.getByDisplayValue("13/01/2025");

    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();

    const justificativaInput = screen.getByRole("textbox");
    expect(justificativaInput).toBeEnabled();
    expect(justificativaInput).toBeVisible();
    fireEvent.change(justificativaInput, {
      target: { value: "Teste de justificativa" },
    });

    const formulario = screen.getByTestId("form-cancelamento");
    fireEvent.submit(formulario);
  });
});
