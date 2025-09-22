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
import {
  PERFIL,
  TIPO_PERFIL,
  TIPO_SERVICO,
} from "../../../../constants/shared";

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
      </MemoryRouter>
    );
  });
};

describe("Test <Sidebar> - Diferentes perfis", () => {
  const perfis = [
    {
      nome: "GESTAO_ALIMENTACAO_TERCEIRIZADA",
      nomeUsuario: "GESTAO ALIMENTACAO TERCEIRIZADA",
      localStorage: {
        tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      },
    },
    {
      nome: "TERCEIRIZADA",
      nomeUsuario: "USUÁRIO TERCEIRIZADA",
      localStorage: {
        tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
        perfil: PERFIL.USUARIO_EMPRESA,
        tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
      },
    },
    {
      nome: "SUPERVISAO_NUTRICAO",
      nomeUsuario: "SUPERVISÃO NUTRIÇÃO",
      localStorage: {
        perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
        tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
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
    "renderiza link `Medição Inicial` com seus submenus - Perfil $nome",
    async ({ localStorage: ls, nomeUsuario }) => {
      Object.entries(ls).forEach(([key, value]) =>
        localStorage.setItem(key, value)
      );

      await renderSidebarComponent(nomeUsuario);

      await awaitServices();
      expect(screen.getByText("Medição Inicial")).toBeInTheDocument();

      const linkMedicaoInicial = screen.getByTestId("medicao-inicial");
      fireEvent.click(linkMedicaoInicial);

      expect(linkMedicaoInicial).toHaveTextContent(
        "Acompanhamento de Lançamentos"
      );
      expect(linkMedicaoInicial).toHaveTextContent("Relatórios");

      const linkRelatoriosMe = screen.getByTestId("relatorios-me");
      fireEvent.click(linkRelatoriosMe);

      expect(linkMedicaoInicial).toHaveTextContent("Relatório de Adesão");
    }
  );

  it("não deve renderizar o link `Medição Inicial` caso use um Perfil não permitido", async () => {
    cleanup();
    localStorage.setItem("tipo_perfil", "PERFIL_SEM_PERMISSAO");
    localStorage.setItem("perfil", "PERFIL_SEM_PERMISSAO");
    localStorage.setItem("tipo_servico", "SERVICO_SEM_PERMISSAO");
    await renderSidebarComponent();

    await awaitServices();

    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});
