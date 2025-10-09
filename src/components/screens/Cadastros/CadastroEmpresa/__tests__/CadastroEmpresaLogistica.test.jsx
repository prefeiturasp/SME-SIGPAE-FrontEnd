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

import preview from "jest-preview";

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

describe("Carrega página de Empresas visão Fornecedor (Logistica)", () => {
  beforeAll(() => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.GESTAO_PRODUTO);
  });

  it("Verifica Dados da Empresa", async () => {
    await setup();
    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Razão social/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de Cadastro/i)).toBeInTheDocument();
    expect(screen.getByText(/Nome Usual/i)).toBeInTheDocument();
    expect(screen.getByText(/CNPJ/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de Serviço/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de Alimento/i)).toBeInTheDocument();
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
  });

  it("Verifica Dados do Representante do Contrato", async () => {
    await setup();
    expect(screen.getAllByText(/Nome/i)).toHaveLength(3);
    expect(screen.getByText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Telefone/i)).toHaveLength(2);
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(2);
  });

  it("Verifica Contatos", async () => {
    await setup();
    preview.debug();
    expect(screen.getAllByText(/Nome/i)).toHaveLength(3);
    expect(screen.getAllByText(/Telefone/i)).toHaveLength(2);
    expect(screen.getAllByText(/E-mail/i)).toHaveLength(2);
  });

  it("Verifica Contratos", async () => {
    await setup();
    expect(
      screen.getByText("Nº do Processo Administrativo (SEI)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nº do Contrato")).toBeInTheDocument();
    expect(screen.getByText(/Vigência do Contrato/i)).toBeInTheDocument();
    expect(screen.getByText(/Modalidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Situação/i)).toBeInTheDocument();
  });

  it("Verifica se botão salvar está desabilbitado", async () => {
    await setup();
    const botao = screen.getByRole("button", { name: /Salvar/i });
    expect(botao).toBeDisabled();
  });

  it("Verifica se os campos 'Tipo de Serviço', 'Tipo de Empresa' e 'Tipo de Alimento' são obrigatórios", async () => {
    await setup();

    const selectTipoServico = screen
      .getByTestId("tipo-servico-select")
      .querySelector("select");
    expect(selectTipoServico).toBeRequired();

    const selectTipoEmpresa = screen
      .getByTestId("tipo-empresa-select")
      .querySelector("select");
    expect(selectTipoEmpresa).toBeRequired();

    const selectTipoalimento = screen
      .getByTestId("tipo-alimento-select")
      .querySelector("select");
    expect(selectTipoalimento).toBeRequired();
  });
});
