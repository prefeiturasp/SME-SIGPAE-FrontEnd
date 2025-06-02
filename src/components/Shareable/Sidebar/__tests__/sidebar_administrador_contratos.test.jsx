import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { APIMockVersion } from "mocks/apiVersionMock";
import { localStorageMock } from "mocks/localStorageMock";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { getAPIVersion } from "src/services/api.service";
import { Sidebar } from "..";

jest.mock("services/api.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getAPIVersion).toHaveBeenCalled();
  });
};

describe("Test <Sidebar> - Usuário ADMINISTRADOR CONTRATOS", () => {
  const nome = "ADMINISTRADOR CONTRATOS";

  const TestSidebarComponent = () => {
    const [toggled, setToggled] = useState(false);
    return (
      <Sidebar
        nome={nome}
        toggle={() => setToggled(!toggled)}
        toggled={toggled}
      />
    );
  };

  beforeEach(async () => {
    getAPIVersion.mockResolvedValue({
      data: APIMockVersion,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", `"ADMINISTRADOR_CONTRATOS"`);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <TestSidebarComponent />
        </MemoryRouter>
      );
    });
  });

  it(`renderiza o nome ${nome}`, async () => {
    await awaitServices();
    expect(screen.getByText(nome)).toBeInTheDocument();
  });

  it(`renderiza o link Perfil`, async () => {
    await awaitServices();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("renderiza licença", async () => {
    await awaitServices();
    expect(
      screen.getByText("Licença AGPL V3 (API: 0.1.16)")
    ).toBeInTheDocument();
  });

  it("renderiza link `Painel Inicial`", async () => {
    await awaitServices();
    expect(screen.getByText("Painel Inicial")).toBeInTheDocument();
  });

  it("renderiza link `Cadastros` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();

    const linkCadastros = screen.getByTestId("menu-cadastros");
    fireEvent.click(linkCadastros);

    expect(linkCadastros).toHaveTextContent("Empresas");
  });

  it("renderiza link `Configurações` com seus submenus", async () => {
    await awaitServices();
    expect(screen.getByText("Configurações")).toBeInTheDocument();

    const linkConfiguracoes = screen.getByTestId("menu-configuracoes");
    fireEvent.click(linkConfiguracoes);

    expect(linkConfiguracoes).toHaveTextContent("Gestão de Usuários");

    const linkUsuarios = screen.getByTestId("submenu-gst-usuarios");
    fireEvent.click(linkUsuarios);

    expect(linkConfiguracoes).toHaveTextContent("Gestão de Acesso");
  });
});
