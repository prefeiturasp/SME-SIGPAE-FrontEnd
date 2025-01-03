import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CadastroEmpresa } from "../CadastroEmpresa";
import {
  getTerceirizadaUUID,
  obterNumeroContratosCadastrados,
} from "../../../../../services/terceirizada.service";
import {
  mockContratosCadastrados,
  mockEmpresa,
  mockEmpresaSemNutri,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksCadastroEmpresa";
import { getLotesSimples } from "services/lote.service";
import { mockLotes } from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper";

jest.mock("services/terceirizada.service.js");
jest.mock("services/lote.service.js");

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
});

const setup = () => {
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
};

describe("Carrega página de Empresas", () => {
  it("carrega no modo Cadastro", async () => {
    setup();
    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
  });

  it("carrega no modo Edição", async () => {
    const search = `?uuid=${mockEmpresa.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    setup();

    await waitFor(() => expect(getTerceirizadaUUID).toHaveBeenCalled());

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
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

    setup();

    await waitFor(() => expect(getTerceirizadaUUID).toHaveBeenCalled());

    expect(screen.getByText(/Dados da Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
  });
});
