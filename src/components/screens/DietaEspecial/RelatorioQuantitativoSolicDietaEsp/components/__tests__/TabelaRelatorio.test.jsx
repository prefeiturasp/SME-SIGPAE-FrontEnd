import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaRelatorio from "src/components/screens/DietaEspecial/RelatorioQuantitativoSolicDietaEsp/components/TabelaRelatorio";
import { TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

const mockDados = [
  {
    dre: "DRE BUTANTA",
    escola: "EMEF OSWALDO CRUZ",
    qtde_pendentes: 10,
    qtde_ativas: 25,
    qtde_inativas: 5,
  },
];

describe("TabelaRelatorio Solicitação Dieta Especial - Testes por Perfil", () => {
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

    it("deve renderizar a grid completa com as classes corretas", () => {
      renderComponent(mockDados, {});
      expect(
        screen.getByText("Diretoria Regional de Educação"),
      ).toBeInTheDocument();
      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();

      expect(
        screen.getByText((content) =>
          content.replace(/\s/g, "").includes("Dietaspendentes"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.replace(/\s/g, "").includes("Dietasativas"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.replace(/\s/g, "").includes("Dietasinativas"),
        ),
      ).toBeInTheDocument();

      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-nutri-todos");
    });

    it("deve exibir apenas colunas inativas quando o filtro for 'inativas'", () => {
      renderComponent(mockDados, { status: "inativas" });
      expect(
        screen.getByText(
          (content) =>
            content.includes("Dietas") && content.includes("inativas"),
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText("Dietas ativas")).not.toBeInTheDocument();
      expect(screen.queryByText("Dietas pendentes")).not.toBeInTheDocument();

      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  describe("Perfil Diretoria Regional (DRE)", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    });
    it("deve renderizar a DRE e usar a classe grid-dre", () => {
      renderComponent(mockDados, {});
      expect(
        screen.getByText("Diretoria Regional de Educação"),
      ).toBeInTheDocument();

      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-dre-todos");
    });
  });

  describe("Perfil Escola", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    });

    it("deve aplicar classe unico e sufixo sem-escola corretamente", () => {
      const dadosSemEscola = [{ ...mockDados[0], escola: undefined }];
      renderComponent(dadosSemEscola, { status: "ativas" });

      expect(screen.queryByText("Unidade Escolar")).not.toBeInTheDocument();

      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-escola-unico-sem-escola");

      expect(
        screen.getByText((content) =>
          content.replace(/\s/g, "").includes("Dietasativas"),
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText("Dietas pendentes")).not.toBeInTheDocument();

      expect(screen.getByText("25")).toBeInTheDocument();
    });
  });
});
