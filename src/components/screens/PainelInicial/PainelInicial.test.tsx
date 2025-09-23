import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ACOMPANHAMENTO_DE_LANCAMENTOS } from "src/configs/constants";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import PainelInicial from "../PainelInicial";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("PainelInicial - Navegação por perfil", () => {
  const perfis = [
    {
      nome: "CODAE_GESTAO_ALIMENTACAO",
      localStorage: {
        perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
        tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
    {
      nome: "EMPRESA_TERCEIRIZADA",
      localStorage: {
        perfil: PERFIL.USUARIO_EMPRESA,
        tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
        tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
    {
      nome: "SUPERVISAO_NUTRICAO",
      localStorage: {
        perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
        tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
  ];

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    mockNavigate.mockClear();
  });

  it.each(perfis)(
    "deve navegar para a rota correta ao clicar em Medição Inicial - Perfil $nome",
    async ({ localStorage: ls, expectedRoute }) => {
      Object.entries(ls).forEach(([key, value]) =>
        localStorage.setItem(key, value)
      );

      render(
        <MemoryRouter>
          <PainelInicial />
        </MemoryRouter>
      );

      const medicaoInicialCard = screen.getByText("Medição Inicial");
      expect(medicaoInicialCard).toBeInTheDocument();

      fireEvent.click(medicaoInicialCard);

      expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
    }
  );

  it("não deve exibir o card de Medição Inicial para perfis não permitidos", () => {
    localStorage.setItem("perfil", "PERFIL_NAO_PERMITIDO");
    localStorage.setItem("tipo_perfil", "TIPO_NAO_PERMITIDO");

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>
    );

    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});
