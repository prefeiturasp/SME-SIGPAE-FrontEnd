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
        localStorage.setItem(key, value),
      );

      render(
        <MemoryRouter>
          <PainelInicial />
        </MemoryRouter>,
      );

      const medicaoInicialCard = screen.getByText("Medição Inicial");
      expect(medicaoInicialCard).toBeInTheDocument();

      fireEvent.click(medicaoInicialCard);

      expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
    },
  );

  it("não deve exibir o card de Medição Inicial para perfis não permitidos", () => {
    localStorage.setItem("perfil", "PERFIL_NAO_PERMITIDO");
    localStorage.setItem("tipo_perfil", "TIPO_NAO_PERMITIDO");

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});

describe("PainelInicial - Perfil Fornecedor", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    mockNavigate.mockClear();
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );
  });

  it("exibe todos os cards do fornecedor", () => {
    expect(screen.getByText("Cronograma de Entrega")).toBeInTheDocument();
    expect(screen.getByText("Ficha Técnica")).toBeInTheDocument();
    expect(screen.getByText("Documentos de Recebimento")).toBeInTheDocument();
    expect(screen.getByText("Alterações de Cronograma")).toBeInTheDocument();
    expect(screen.getByText("Layout de Embalagem")).toBeInTheDocument();
  });

  it("navega para Cronograma de Entrega ao clicar no card", () => {
    fireEvent.click(screen.getByText("Cronograma de Entrega"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/cronograma-entrega",
    );
  });

  it("navega para Ficha Técnica ao clicar no card", () => {
    fireEvent.click(screen.getByText("Ficha Técnica"));
    expect(mockNavigate).toHaveBeenCalledWith("pre-recebimento/ficha-tecnica");
  });

  it("navega para Documentos de Recebimento ao clicar no card", () => {
    fireEvent.click(screen.getByText("Documentos de Recebimento"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/documentos-recebimento",
    );
  });

  it("navega para Alterações de Cronograma ao clicar no card", () => {
    fireEvent.click(screen.getByText("Alterações de Cronograma"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/solicitacao-alteracao-cronograma-fornecedor",
    );
  });

  it("navega para Layout de Embalagem ao clicar no card", () => {
    fireEvent.click(screen.getByText("Layout de Embalagem"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/layout-embalagem",
    );
  });

  it("não exibe cards de outros módulos", () => {
    expect(screen.queryByText("Gestão de Alimentação")).not.toBeInTheDocument();
    expect(screen.queryByText("Dieta Especial")).not.toBeInTheDocument();
    expect(screen.queryByText("Gestão de Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});
