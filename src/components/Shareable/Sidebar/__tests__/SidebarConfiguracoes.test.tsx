import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { getAPIVersion } from "src/services/api.service";
import { Sidebar } from "..";
import { PERFIL } from "../../../../constants/shared";

jest.mock("src/services/api.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getAPIVersion).toHaveBeenCalled();
  });
};

const renderSidebarComponent = async (nome = "Usuario") => {
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

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TestSidebarComponent />
      </MemoryRouter>,
    );
  });
};

describe("Test <Sidebar> - Diferentes perfis", () => {
  const perfis = [
    {
      nome: "COGESTOR_DRE",
      nomeUsuario: "DIRETORIA REGIONAL",
      localStorage: {
        perfil: PERFIL.COGESTOR_DRE,
      },
    },
  ];

  beforeEach(() => {
    getAPIVersion.mockResolvedValue({
      data: APIMockVersion,
      status: 200,
    });
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
  });

  afterEach(() => {
    cleanup();
  });

  it.each(perfis)(
    "renderiza link `Configurações` com seus submenus - Perfil $nome",
    async ({ localStorage: ls, nomeUsuario }) => {
      Object.entries(ls).forEach(([key, value]) =>
        localStorage.setItem(key, value),
      );

      await renderSidebarComponent(nomeUsuario);

      await awaitServices();
      expect(screen.getByText("Configurações")).toBeInTheDocument();

      const linkConfiguracao = screen.getByTestId("menu-configuracoes");
      fireEvent.click(linkConfiguracao);

      const linkGestaoUsuario = screen.getByTestId("gestao-de-usuarios");
      fireEvent.click(linkGestaoUsuario);

      const linkAtualizaEmailTexto = "Atualização de E-mail do EOL";
      const linkAtualizaEmail = screen.getByText(linkAtualizaEmailTexto);

      expect(linkAtualizaEmail).toHaveTextContent(linkAtualizaEmailTexto);
    },
  );
});
