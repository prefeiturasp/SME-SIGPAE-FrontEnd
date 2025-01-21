import React from "react";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CadastroEmpresa } from "../CadastroEmpresa";
import {
  getListaModalidades,
  getTerceirizadaUUID,
  obterNumeroContratosCadastrados,
} from "../../../../../services/terceirizada.service";
import {
  mockContratosCadastrados,
  mockEmpresa,
  mockEmpresaSemNutri,
  mockListaModalidades,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksCadastroEmpresa";
import { getLotesSimples } from "services/lote.service";
import {
  mockCEP,
  mockLotes,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper";
import { TIPO_PERFIL } from "../../../../../constants/shared";
import { getEnderecoPorCEP } from "services/cep.service";

jest.mock("services/terceirizada.service.js");
jest.mock("services/lote.service.js");
jest.mock("services/cep.service.js");

beforeEach(() => {
  getTerceirizadaUUID.mockResolvedValue({
    data: mockEmpresa,
    status: 200,
  });

  obterNumeroContratosCadastrados.mockResolvedValue({
    data: mockContratosCadastrados,
    status: 200,
  });

  getLotesSimples.mockResolvedValue({
    data: {
      results: mockLotes,
    },
    status: 200,
  });

  getEnderecoPorCEP.mockResolvedValue({
    data: mockCEP,
    status: 200,
  });

  getListaModalidades.mockResolvedValue({
    data: {
      results: mockListaModalidades,
    },
    status: 200,
  });
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CadastroEmpresa />
      </MemoryRouter>,
      {}
    );
  });
};

describe("Carrega página de Empresas visão Fornecedor", () => {
  beforeAll(() => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.GESTAO_PRODUTO);
  });

  it("carrega no modo Cadastro", async () => {
    await setup();
    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
  });

  it("adiciona e deleta Contatos", async () => {
    await setup();

    let inputNome = document.getElementById("nome_contato_0");
    let inputTelefone = document.getElementById("telefone_contato_0");
    let inputEmail = document.getElementById("email_contato_0");

    fireEvent.change(inputNome, { target: { value: "Nome 1" } });
    fireEvent.change(inputTelefone, { target: { value: "(12) 3123-12312" } });
    fireEvent.change(inputEmail, { target: { value: "aaaa@aaa.com" } });

    let botaoAdicionar = screen.getByTestId("btn-add-contato");
    fireEvent.click(botaoAdicionar);

    let inputNome2 = document.getElementById("nome_contato_1");
    expect(inputNome2).toBeVisible();

    let botaoRemover = screen.getByTestId("btn-delete-contato");
    fireEvent.click(botaoRemover);

    expect(inputNome2).not.toBeVisible();
  });

  it("preenche dados a partir do CEP", async () => {
    await setup();

    let inputCEP = document.getElementById("cep");

    fireEvent.change(inputCEP, { target: { value: "00000000" } });

    fireEvent.change(inputCEP, { target: { value: "" } });
  });

  it("carrega no modo Edição", async () => {
    const search = `?uuid=${mockEmpresa.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await setup();

    await waitFor(() => expect(getTerceirizadaUUID).toHaveBeenCalled());

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
  });
});

describe("Carrega página de Empresas visão não Fornecedor", () => {
  beforeAll(() => {
    localStorage.setItem("tipo_perfil", "");
  });

  it("carrega sem nutricionistas", async () => {
    getTerceirizadaUUID.mockResolvedValue({
      data: mockEmpresaSemNutri,
      status: 200,
    });

    const search = `?uuid=${mockEmpresa.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await setup();

    await waitFor(() => expect(getTerceirizadaUUID).toHaveBeenCalled());

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
  });
});
