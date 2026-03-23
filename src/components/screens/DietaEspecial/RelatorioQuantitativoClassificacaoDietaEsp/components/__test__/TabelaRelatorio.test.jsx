import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaRelatorio from "src/components/screens/DietaEspecial/RelatorioQuantitativoClassificacaoDietaEsp/components/TabelaRelatorio";
import { TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

const mockDados = [
  {
    dre: "DRE IPIRANGA",
    escola: "EMEF NILTON REIS",
    classificacao: "Celíacos",
    qtde_pendentes: 2,
    qtde_ativas: 8,
    qtde_inativas: 1,
  },
];

describe("TabelaRelatorio Quantitativo Dieta - Testes por Perfil", () => {
  const renderComponent = (dadosRelatorio, filtros) => {
    return render(
      <TabelaRelatorio dadosRelatorio={dadosRelatorio} filtros={filtros} />,
    );
  };
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    jest.clearAllMocks();
  });

  it("deve retornar falso e não renderizar nada se a lista de dados for vazia", () => {
    const { container } = renderComponent([], []);
    expect(container.firstChild).toBeNull();
  });

  describe("Perfil Nutricionista", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.NUTRICAO_MANIFESTACAO);
    });

    it("deve renderizar todas as colunas quando não há filtro de status", () => {
      renderComponent(mockDados, {});

      expect(
        screen.getByText("Diretoria Regional de Educação"),
      ).toBeInTheDocument();
      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();
      expect(screen.getByText("Dietas pendentes")).toBeInTheDocument();
      expect(screen.getByText("Dietas ativas")).toBeInTheDocument();
      expect(screen.getByText("Dietas inativas")).toBeInTheDocument();

      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-nutri-todos");
    });

    it("deve aplicar a classe 'unico' quando houver filtro de status", () => {
      renderComponent(mockDados, { status: "ativas" });
      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-nutri-unico");
    });
    it("deve exibir apenas 'pendentes' quando o filtro for 'pendentes'", () => {
      renderComponent(mockDados, { status: "pendentes" });

      expect(screen.getByText("Dietas pendentes")).toBeInTheDocument();
      expect(screen.queryByText("Dietas ativas")).not.toBeInTheDocument();
      expect(screen.queryByText("Dietas inativas")).not.toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("deve exibir apenas 'inativas' quando o filtro for 'inativas'", () => {
      renderComponent(mockDados, { status: "inativas" });

      expect(screen.getByText("Dietas inativas")).toBeInTheDocument();
      expect(screen.queryByText("Dietas ativas")).not.toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("Perfil Diretoria Regional (DRE)", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    });

    it("não deve renderizar a coluna de DRE, pois o usuário já pertence a uma", () => {
      renderComponent(mockDados, {});

      expect(
        screen.queryByText("Diretoria Regional de Educação"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();

      const header = screen.getByText("Unidade Escolar").parentElement;
      expect(header).toHaveClass("grid-dre-todos");
    });
  });

  describe("Perfil Escola", () => {
    beforeEach(() => {
      localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    });

    it("deve renderizar com a classe 'grid-escola' e exibir dados da unidade", () => {
      renderComponent(mockDados, {});

      expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();
      const header = screen.getByText("Unidade Escolar").parentElement;
      expect(header).toHaveClass("grid-escola-todos");
    });

    it("deve adicionar o sufixo '-sem-escola' quando o campo escola não existir nos dados", () => {
      const dadosSemEscola = [{ ...mockDados[0] }];
      delete dadosSemEscola[0].escola;

      renderComponent(dadosSemEscola, { status: "pendentes" });
      expect(screen.queryByText("Unidade Escolar")).not.toBeInTheDocument();
      const header = screen.getByText(
        "Diretoria Regional de Educação",
      ).parentElement;
      expect(header).toHaveClass("grid-escola-unico-sem-escola");
    });
  });
});
