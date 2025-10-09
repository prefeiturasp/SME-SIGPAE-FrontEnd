import React from "react";

import { act, render, screen } from "@testing-library/react";
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
  mockListaModalidades,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksCadastroEmpresa";
import { getLotesSimples } from "src/services/lote.service";
import {
  mockCEP,
  mockLotes,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper";
import { TIPO_PERFIL } from "../../../../../constants/shared";
import { getEnderecoPorCEP } from "src/services/cep.service";
import { mockEmpresa } from "../../../../../mocks/terceirizada.service/mockGetTerceirizadaUUID";

jest.mock("src/services/terceirizada.service.jsx");
jest.mock("src/services/lote.service.jsx");
jest.mock("src/services/cep.service.jsx");

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
      {},
    );
  });
};

describe("Carrega página de Empresas visão não Fornecedor (Alimentação)", () => {
  beforeAll(() => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
  });

  it("Verifica Dados da Empresa", async () => {
    await setup();

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Razão social/i)).toBeInTheDocument();
    expect(screen.queryByText(/Data de Cadastro/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Nome Usual/i)).toBeInTheDocument();
    expect(screen.getByText(/CNPJ/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tipo de Serviço/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tipo de Empresa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tipo de Alimento/i)).not.toBeInTheDocument();
  });

  it("Verifica Endereço da Empresa", async () => {
    await setup();
    expect(screen.getByText(/CEP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Endereço/i)).toHaveLength(2);
    expect(screen.getByText(/Número/i)).toBeInTheDocument();
    expect(screen.getByText(/Complemento/i)).toBeInTheDocument();
    expect(screen.getByText(/Bairro/i)).toBeInTheDocument();
    expect(screen.getByText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Estado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Telefone/i)).toHaveLength(4);
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(4);
  });

  it("Verifica Principal administrador do sistema", async () => {
    await setup();
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(4);
    expect(screen.getAllByText(/Nome/i)).toHaveLength(2);
    expect(screen.getByText(/CPF/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Telefone/i)).toHaveLength(4);
    expect(screen.getByText(/Cargo/i)).toBeInTheDocument();
  });

  it("Verifica Representante Legal", async () => {
    await setup();
    expect(screen.getAllByText(/Telefone/i)).toHaveLength(4);
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(4);
  });

  it("Verifica Nutricionista", async () => {
    await setup();
    expect(screen.getByText(/CRN/i)).toBeInTheDocument();
    expect(screen.getAllByText("Telefone/Celular Técnico")).toHaveLength(1);
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(4);
  });

  it("Verifica Lotes", async () => {
    await setup();
    expect(screen.getByText(/Lotes de atendimento/i)).toBeInTheDocument();
  });

  it("Verifica se botão salvar está desabilbitado", async () => {
    await setup();
    const botao = screen.getByRole("button", { name: /Salvar/i });
    expect(botao).toBeDisabled();
  });

  it("Verifica se os campos 'Tipo de Serviço', 'Tipo de Empresa' e 'Tipo de Alimento' não parecem", async () => {
    await setup();

    expect(screen.queryByTestId("tipo-servico-select")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tipo-empresa-select")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("tipo-alimento-select"),
    ).not.toBeInTheDocument();
  });
});
