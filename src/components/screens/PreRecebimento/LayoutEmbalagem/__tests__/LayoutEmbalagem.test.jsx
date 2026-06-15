import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import LayoutEmbalagem from "src/components/screens/PreRecebimento/LayoutEmbalagem";
import { listarLayoutsEmbalagens } from "src/services/layoutEmbalagem.service";

jest.mock("src/services/layoutEmbalagem.service", () => ({
  listarLayoutsEmbalagens: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn((data) => data),
  truncarString: jest.fn((str) => str),
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ onChange }) => (
    <button type="button" onClick={() => onChange(2)}>
      mock-paginacao
    </button>
  ),
}));

jest.mock(
  "src/components/screens/PreRecebimento/LayoutEmbalagem/components/Filtros",
  () =>
    ({ setFiltros, setLayoutsEmbalagens, setConsultaRealizada }) => (
      <div>
        <button
          type="button"
          onClick={() => setFiltros({ numero_ficha_tecnica: "FT-001" })}
        >
          Consultar
        </button>
        <button
          type="button"
          onClick={() => {
            setLayoutsEmbalagens([]);
            setConsultaRealizada(false);
            setFiltros({});
          }}
        >
          Limpar Filtros
        </button>
      </div>
    ),
);

jest.mock(
  "src/components/screens/PreRecebimento/LayoutEmbalagem/components/Listagem",
  () =>
    ({ objetos }) => (
      <div>
        <div>Layouts de Embalagens Cadastrados</div>
        {objetos.map((obj) => (
          <div key={obj.uuid}>{obj.numero_ficha_tecnica}</div>
        ))}
      </div>
    ),
);

jest.mock("antd", () => ({
  Spin: ({ children }) => <div>{children}</div>,
}));

const mockLayout = {
  uuid: "layout-uuid-001",
  numero_ficha_tecnica: "FT-001",
  nome_produto: "Produto Teste",
  pregao_chamada_publica: "Pregão 001",
  status: "Aprovado",
  criado_em: "2025-01-10T00:00:00Z",
};

function renderComponent() {
  return render(<LayoutEmbalagem />);
}

describe("LayoutEmbalagem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar os botões Consultar e Limpar Filtros", async () => {
      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 0, results: [] },
      });

      renderComponent();

      expect(screen.getByText("Consultar")).toBeInTheDocument();
      expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    });

    it("deve chamar listarLayoutsEmbalagens na montagem com page 1", async () => {
      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 0, results: [] },
      });

      renderComponent();

      await waitFor(() => {
        expect(listarLayoutsEmbalagens).toHaveBeenCalledTimes(1);
      });
    });

    it("não deve exibir listagem nem mensagem antes da consulta retornar", () => {
      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 0, results: [] },
      });

      renderComponent();

      expect(
        screen.queryByText("Layouts de Embalagens Cadastrados"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Nenhum resultado encontrado"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Consulta com resultados", () => {
    beforeEach(() => {
      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 1, results: [mockLayout] },
      });
    });

    it("deve exibir a listagem após consulta com resultados", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Layouts de Embalagens Cadastrados"),
        ).toBeInTheDocument();
        expect(screen.getByText("FT-001")).toBeInTheDocument();
      });
    });

    it("deve exibir a paginação quando há resultados", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("mock-paginacao")).toBeInTheDocument();
      });
    });

    it("não deve exibir mensagem de sem resultados quando há dados", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("FT-001")).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Nenhum resultado encontrado"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Consulta sem resultados", () => {
    beforeEach(() => {
      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 0, results: [] },
      });
    });

    it("deve exibir mensagem de nenhum resultado encontrado", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum resultado encontrado"),
        ).toBeInTheDocument();
      });
    });

    it("não deve exibir a listagem quando não há resultados", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.queryByText("Layouts de Embalagens Cadastrados"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Filtros", () => {
    it("deve chamar listarLayoutsEmbalagens novamente ao aplicar filtros", async () => {
      const user = userEvent.setup();

      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 1, results: [mockLayout] },
      });

      renderComponent();

      await waitFor(() => {
        expect(listarLayoutsEmbalagens).toHaveBeenCalledTimes(1);
      });

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(listarLayoutsEmbalagens).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Paginação", () => {
    it("deve chamar listarLayoutsEmbalagens com page 2 ao trocar de página", async () => {
      const user = userEvent.setup();

      listarLayoutsEmbalagens.mockResolvedValue({
        data: { count: 25, results: [mockLayout] },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("mock-paginacao")).toBeInTheDocument();
      });

      await user.click(screen.getByText("mock-paginacao"));

      await waitFor(() => {
        expect(listarLayoutsEmbalagens).toHaveBeenCalledTimes(2);
      });
    });
  });
});
