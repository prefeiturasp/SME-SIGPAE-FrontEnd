import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { getAPIVersion } from "src/services/api.service";
import { Sidebar } from "..";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/services/api.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getAPIVersion).toHaveBeenCalled();
  });
};

describe("Test <Sidebar> - Usuário DILOG_QUALIDADE", () => {
  const nome = "DILOG QUALIDADE";

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
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

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
        </MemoryRouter>,
      );
    });
  });

  it(`renderiza o nome ${nome}`, async () => {
    await awaitServices();
    expect(screen.getByText(nome)).toBeInTheDocument();
  });

  it("renderiza link `Pré-recebimento` com submenu Verificar Alterações de Cronograma", async () => {
    await awaitServices();
    expect(screen.getByText("Pré-Recebimento")).toBeInTheDocument();

    const linkPreRecebimento = screen.getByTestId("pre-recebimento");
    fireEvent.click(linkPreRecebimento);

    // Cenário 1: DILOG_QUALIDADE deve ver "Verificar Alterações de Cronograma"
    expect(linkPreRecebimento).toHaveTextContent(
      "Verificar Alterações de Cronograma",
    );
    // Também deve ver outros submenus comuns do Pré-Recebimento
    expect(linkPreRecebimento).toHaveTextContent("Painel de Aprovações");
  });
});
