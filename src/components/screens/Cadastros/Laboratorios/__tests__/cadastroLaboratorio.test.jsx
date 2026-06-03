import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CadastroLaboratorio from "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";
import {
  cadastraLaboratorio,
  getListaLaboratorios,
} from "src/services/laboratorio.service";
import { getEnderecoPorCEP } from "src/services/cep.service";
import preview from "jest-preview";
jest.mock("src/services/laboratorio.service");
jest.mock("src/services/cep.service");

describe("Testa o componente CadastroLaboratorio", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    getListaLaboratorios.mockResolvedValue({
      data: {
        results: [
          {
            nome: "Laboratorio São Paulo",
            cnpj: "22345678000199",
          },
          {
            nome: "Laboratorio Rio de Janeiro",
            cnpj: "12345678000199",
          },
        ],
      },
      status: 200,
    });

    getEnderecoPorCEP.mockResolvedValue({
      status: 200,
      data: {
        cep: "20931-900",
        logradouro: "Rua General Gurjão",
        complemento: "2",
        unidade: "Ishikawagima do Brasil Estaleiros S/A",
        bairro: "Caju",
        localidade: "Rio de Janeiro",
        uf: "RJ",
        estado: "Rio de Janeiro",
        regiao: "Sudeste",
        ibge: "3304557",
        gia: "",
        ddd: "21",
        siafi: "6001",
      },
    });

    cadastraLaboratorio.mockResolvedValue({
      status: 201,
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

  it("deve exibir mensagem quando selecionar não credenciado", async () => {
    const radioNao = await screen.findByText("NÃO");

    fireEvent.click(radioNao);

    expect(
      screen.getByText(/não poderá ser utilizado no cadastro de Laudos/i),
    ).toBeInTheDocument();
  });

  it("deve abrir modal de cancelamento", async () => {
    const botaoCancelar = await screen.findByRole("button", {
      name: "Cancelar",
    });

    fireEvent.click(botaoCancelar);

    expect(
      screen.getByText(/Cancelar Cadastro do Laboratório/i),
    ).toBeInTheDocument();
  });

  it("deve preencher endereço automaticamente ao informar CEP válido", async () => {
    const campoCep = screen.getByPlaceholderText("Digite o CEP");

    fireEvent.change(campoCep, {
      target: { value: "20931-900" },
    });

    await waitFor(() => {
      expect(getEnderecoPorCEP).toHaveBeenCalledWith("20931-900");
    });
  });

  it("deve habilitar edição manual quando CEP não for encontrado", async () => {
    getEnderecoPorCEP.mockResolvedValueOnce({
      status: 200,
      data: {
        erro: true,
      },
    });

    const campoCep = screen.getByPlaceholderText("Digite o CEP");

    fireEvent.change(campoCep, {
      target: { value: "99999-999" },
    });

    await waitFor(() => {
      expect(getEnderecoPorCEP).toHaveBeenCalled();
    });

    const logradouro = screen.getByPlaceholderText("Nome do Logradouro");

    await waitFor(() => {
      expect(logradouro).not.toBeDisabled();
    });
  });

  it("deve remover contato adicional", async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "+",
      }),
    );

    expect(screen.getAllByPlaceholderText("Nome do Contato")).toHaveLength(2);

    const botoes = screen.getAllByRole("button");
    const botaoExcluir = botoes.find((btn) => btn.querySelector(".fa-trash"));

    expect(botaoExcluir).toBeTruthy();
    fireEvent.click(botaoExcluir);
    screen.debug();
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("Nome do Contato")).toHaveLength(1);
    });
  });

  it("deve fechar modal de cancelamento ao clicar em Não", async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(
      screen.getByText(/Cancelar Cadastro do Laboratório/i),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Não",
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Cancelar Cadastro do Laboratório/i),
      ).not.toBeInTheDocument();
    });

    preview.debug();
  });
});
