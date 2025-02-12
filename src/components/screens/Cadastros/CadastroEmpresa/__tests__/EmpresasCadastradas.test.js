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
import EmpresasCadastradas from "../EmpresasCadastradas";
import { PERFIL } from "constants/shared";

import { getTerceirizada } from "services/terceirizada.service";
import { mockGetTerceirizada } from "mocks/services/terceirizada.service/mockGetTerceirizada";

jest.mock("services/terceirizada.service");

beforeEach(() => {
  getTerceirizada.mockResolvedValue({
    data: mockGetTerceirizada,
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
        <EmpresasCadastradas />
      </MemoryRouter>,
      {}
    );
  });
};

describe("Carrega página de Empresas Cadastradas - Administrador DICAE", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_DICAE);
  });

  it("Verifica se empresas foram carregadas e renderizadas corretamente", async () => {
    await setup();
    await waitFor(() => expect(getTerceirizada).toHaveBeenCalled());

    expect(screen.getByText("Razão Social")).toBeInTheDocument();

    const empresa = screen.getByText("Carol Food LTDA");
    expect(empresa).toBeInTheDocument();

    const botaoExpandir = empresa
      .closest("tr")
      .querySelector(".fas.fa-chevron-down");
    fireEvent.click(botaoExpandir);
  });

  it("Verifica a funcionalidade de pesquisa", async () => {
    await setup();
    await waitFor(() => expect(getTerceirizada).toHaveBeenCalled());

    const barraPesquisa = screen.getByPlaceholderText("Pesquisar");
    fireEvent.change(barraPesquisa, {
      target: { value: "Agro" },
    });

    await waitFor(() => expect(getTerceirizada).toHaveBeenCalled());
  });
});

describe("Carrega página de Empresas Cadastradas - CODAE", () => {
  beforeAll(() => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
  });

  it("Verifica se empresas foram carregadas e renderizadas corretamente", async () => {
    await setup();
    await waitFor(() => expect(getTerceirizada).toHaveBeenCalled());

    expect(screen.getByText("Razão Social")).toBeInTheDocument();
  });
});
