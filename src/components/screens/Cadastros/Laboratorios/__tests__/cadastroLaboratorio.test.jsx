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
            nome: "Laboratorio São Paulo",
            cnpj: "50708401000179",
          },
          {
            nome: "Laboratorio Rio de Janeiro",
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

    expect(screen.getByText("Laboratórios Credenciados")).toBeInTheDocument();
  });

  it("deve exibir os dados da secção Dados do Laboratório", async () => {
    expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();

    expect(screen.getByText("CNPJ do Laboratório")).toBeInTheDocument();

    expect(screen.getByText("Data de Cadastro")).toBeInTheDocument();
  });

  it("deve exibir os dados da secção Endereço do Laboratório", async () => {
    expect(screen.getByText("CEP")).toBeInTheDocument();

    expect(screen.getByText("Logradouro")).toBeInTheDocument();

    expect(screen.getByText("Número")).toBeInTheDocument();
    expect(screen.getByText("Complemento")).toBeInTheDocument();

    expect(screen.getByText("Bairro")).toBeInTheDocument();

    expect(screen.getByText("Cidade")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
  });

  it("deve exibir os dados da secção Contatos", async () => {
    expect(screen.getByText("Nome")).toBeInTheDocument();

    expect(screen.getByText("Telefone")).toBeInTheDocument();

    expect(screen.getByText("E-mail")).toBeInTheDocument();
  });

  it("deve exibir os dados da secção Laboratórios Credenciados", async () => {
    expect(
      screen.getByText("Esse Laboratório está Credenciado?"),
    ).toBeInTheDocument();
    expect(screen.getByText("SIM")).toBeInTheDocument();
    expect(screen.getByText("NÃO")).toBeInTheDocument();
  });
});
