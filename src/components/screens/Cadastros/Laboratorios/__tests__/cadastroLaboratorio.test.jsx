import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CadastroLaboratorio from "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";
import { getListaLaboratorios } from "src/services/laboratorio.service";

jest.mock("src/services/laboratorio.service");

describe("Testa o componente CadastroLaboratorio", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    getListaLaboratorios.mockResolvedValue({
      data: {
        results: [
          {
            nome: "TESTE 2",
            cnpj: "50708401000179",
          },
          {
            nome: "TESTE CADASTRO 123",
            cnpj: "50708401000179",
          },
        ],
      },
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <CadastroLaboratorio />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar os títulos principais", async () => {
    expect(await screen.findByText("Dados do Laboratório")).toBeInTheDocument();

    expect(screen.getByText("Endereço do Laboratório")).toBeInTheDocument();

    expect(screen.getByText("Contatos")).toBeInTheDocument();
  });
});
