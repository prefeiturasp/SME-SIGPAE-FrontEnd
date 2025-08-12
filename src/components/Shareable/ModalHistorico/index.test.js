import React from "react";
import { act, screen, render } from "@testing-library/react";
import ModalHistorico from "src/components/Shareable/ModalHistorico/index";
import { MemoryRouter } from "react-router-dom";
import { dietaComHistorico } from "src/mocks/DietaEspecial/Relatorio/mockDietaComLogDeHistorico.jsx";
import preview from "jest-preview";

describe("Testa componete <ModalHistorico>", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalHistorico
            visible={true}
            onOk={jest.fn()}
            onCancel={jest.fn()}
            logs={dietaComHistorico.logs}
            getHistorico={() => dietaComHistorico.logs}
          />
        </MemoryRouter>
      );
    });
  });

  it("Renderiza o modal corretamente", async () => {
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("Renderiza lista de históricos", async () => {
    preview.debug();
    const historicoItems = document.querySelectorAll(".grid-item-log");
    expect(historicoItems.length).toBe(dietaComHistorico.logs.length);
    expect(screen.getAllByText("Solicitação Realiza...")).toHaveLength(1);
    expect(screen.getAllByText("CODAE autorizou")).toHaveLength(1);
    expect(screen.getAllByText("CODAE Atualizou o p...")).toHaveLength(7);
    expect(screen.getAllByText("SUPER USUARIO ESCOLA EMEF")).toHaveLength(1);
    expect(screen.getAllByText("Dieta Especial")).toHaveLength(8);
    expect(screen.getAllByText("26/06/2025")).toHaveLength(1);
    expect(screen.getAllByText("11/08/2025")).toHaveLength(8);
  });
});
