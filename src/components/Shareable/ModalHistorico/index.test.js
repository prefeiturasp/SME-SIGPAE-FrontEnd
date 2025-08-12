import React from "react";
import { act, fireEvent, screen, render } from "@testing-library/react";
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

  test("Exibe os detalhes do histórico para o status Solicitação Realizada", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[0];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa"
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe(
      "SUPER USUARIO ESCOLA EMEF"
    );
    expect(screen.getAllByText("26/06/2025")).toHaveLength(3);
    expect(screen.getAllByText("11:52:55")).toHaveLength(2);

    expect(screen.getByText("Solicitação Realizada")).toBeInTheDocument();
    expect(screen.getByText("RF: 8115257")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();
  });

  test("Exibe os detalhes do histórico para o status CODAE autorizou", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[1];
    fireEvent.click(solictacaoRealizada);

    preview.debug();
    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa"
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe("Dieta Especial");
    expect(screen.getAllByText("11/08/2025")).toHaveLength(10);
    expect(screen.getAllByText("14:27:16")).toHaveLength(2);

    expect(screen.getAllByText("CODAE autorizou")).toHaveLength(2);
    expect(screen.getByText("RF: 8107807")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();
  });
});
