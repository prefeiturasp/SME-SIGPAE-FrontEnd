import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaRelatorio from "src/components/screens/DietaEspecial/RelatorioQuantitativoDiagDietaEsp/components/TabelaRelatorio";
import { TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

const mockDados = [
  {
    dre: "DRE PIRITUBA",
    escola: "EMEF PRUDENTE",
    diagnostico: "Intolerância à Lactose",
    ano_nasc_aluno: "2015",
    qtde_pendentes: 1,
    qtde_ativas: 4,
    qtde_inativas: 0,
  },
];

describe("TabelaRelatorio Diagnóstico Dieta - Testes por Perfil", () => {
  const renderComponent = (dadosRelatorio, filtros) => {
    return render(
      <TabelaRelatorio dadosRelatorio={dadosRelatorio} filtros={filtros} />,
    );
  };

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    jest.clearAllMocks();
  });

  it("deve retornar falso se não houver dados", () => {
    const { container } = renderComponent([], []);
    expect(container.firstChild).toBeNull();
  });

  describe("Perfil Nutricionista", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    });

    it("deve renderizar a grid simplificada ignorando colunas de DRE e Escola", () => {
      renderComponent(mockDados, { somente_dietas_ativas: true });

      expect(screen.getByText("Diagnóstico")).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.replace(/\s/g, "").includes("Dietasativas"),
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText("Diretoria Regional de Educação"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Unidade Escolar")).not.toBeInTheDocument();
      expect(screen.queryByText("Ano nasc. aluno")).not.toBeInTheDocument();
      const header = screen.getByText("Diagnóstico").parentElement;
      expect(header).toHaveClass("grid-somente-ativas");
    });

    it("deve renderizar colunas completas incluindo DRE e Escola", () => {
      renderComponent(mockDados, {});
      expect(
        screen.getByText("Diretoria Regional de Educação"),
      ).toBeInTheDocument();
      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();
      expect(screen.getByText("Ano nasc. aluno")).toBeInTheDocument();

      const header = screen.getByText("Diagnóstico").parentElement;
      expect(header).toHaveClass("grid-nutri-todos");
    });

    it("deve mostrar apenas dietas pendentes quando filtro status for 'pendentes'", () => {
      renderComponent(mockDados, { status: "pendentes" });
      expect(
        screen.getByText(
          (content) =>
            content.includes("Dietas") && content.includes("pendentes"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText((content) => content.includes("ativas")),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Dietas inativas/i)).not.toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("deve mostrar todas as colunas de status quando status for undefined", () => {
      renderComponent(mockDados, { status: undefined });
      const dietasElements = screen.getAllByText(/Dietas/i);
      expect(dietasElements[0]).toHaveTextContent("Dietaspendentes");
      expect(dietasElements[1]).toHaveTextContent("Dietasativas");
      expect(dietasElements[2]).toHaveTextContent("Dietasinativas");

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Perfil Diretoria Regional (DRE)", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    });

    it("deve ocultar a coluna DRE e usar classe grid-dre", () => {
      renderComponent(mockDados, {});

      expect(
        screen.queryByText("Diretoria Regional de Educação"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();

      const header = screen.getByText("Diagnóstico").parentElement;
      expect(header).toHaveClass("grid-dre-todos");
    });
  });

  describe("Perfil Escola", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    });

    it("deve renderizar com sufixo -sem-escola quando a escola for undefined", () => {
      const dadosSemEscola = [{ ...mockDados[0], escola: undefined }];
      renderComponent(dadosSemEscola, { status: "ativas" });
      expect(screen.queryByText("Unidade Escolar")).not.toBeInTheDocument();
      const header = screen.getByText("Diagnóstico").parentElement;
      expect(header).toHaveClass("grid-escola-unico-sem-escola");
    });
  });
});
