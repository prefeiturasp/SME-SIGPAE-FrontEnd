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
import { getAPIVersion } from "services/api.service";
import { Sidebar } from "..";

jest.mock("services/api.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getAPIVersion).toHaveBeenCalled();
  });
};

describe("Test <Sidebar> - Usuário ESCOLA", () => {
  const nome = "SUPER USUARIO ESCOLA EMEF";
  const nomeEscolaOuTerceirizada = "EMEF PERICLES EUGENIO DA SILVA RAMOS";

  const TestSidebarComponent = () => {
    const [toggled, setToggled] = useState(false);
    return (
      <Sidebar
        nome={nome}
        nomeEscolaOuTerceirizada={nomeEscolaOuTerceirizada}
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
    localStorage.setItem("perfil", `"DIRETOR_UE"`);
    localStorage.setItem("tipo_perfil", `"escola"`);

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

  it(`renderiza o nome da escola ${nomeEscolaOuTerceirizada}`, async () => {
    await awaitServices();
    expect(screen.getByText(nomeEscolaOuTerceirizada)).toBeInTheDocument();
  });

  it(`renderiza o icone fa-chevron-circle-right`, async () => {
    await awaitServices();
    const sidebarDividerP = screen.getByTestId("sidebar-divider-p");
    fireEvent.click(sidebarDividerP);

    const iconeChevronCircle = screen.getByTestId("icon-chevron-circle");
    expect(iconeChevronCircle).toHaveClass("fas fa-chevron-circle-right");
  });
});
