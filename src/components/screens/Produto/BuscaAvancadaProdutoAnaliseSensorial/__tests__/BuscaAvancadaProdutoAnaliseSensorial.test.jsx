import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import BuscaAvancadaProdutoAnaliseSensorial from "src/components/screens/Produto/BuscaAvancadaProdutoAnaliseSensorial";
import { getProdutosRelatorioAnaliseSensorial } from "src/services/produto.service";

jest.mock("src/services/produto.service", () => ({
  getProdutosRelatorioAnaliseSensorial: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn((data) => data),
}));

jest.mock(
  "src/components/screens/Produto/BuscaAvancadaProdutoAnaliseSensorial/components/FormBuscaProduto",
  () =>
    ({ onSubmit }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ nome: "Produto Teste" });
        }}
      >
        <button type="submit">Buscar</button>
      </form>
    ),
);

jest.mock(
  "src/components/screens/Produto/BuscaAvancadaProdutoAnaliseSensorial/components/ModalRelatorioAnaliseSensorial",
  () =>
    ({ showModal, produtos }) =>
      showModal ? (
        <div data-testid="modal-relatorio">
          Modal aberto — {produtos?.length} produto(s)
        </div>
      ) : null,
);

jest.mock("antd", () => ({
  Spin: ({ children }) => <div>{children}</div>,
}));

const produtoMock = {
  uuid: "prod-001",
  nome: "Produto Teste",
  marca: { nome: "Marca A" },
};

function renderComponent() {
  return render(<BuscaAvancadaProdutoAnaliseSensorial />);
}

describe("BuscaAvancadaProdutoAnaliseSensorial", () => {
  beforeEach(() => {
    getProdutosRelatorioAnaliseSensorial.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o formulário de busca", () => {
      renderComponent();
      expect(screen.getByText("Buscar")).toBeInTheDocument();
    });

    it("não deve exibir a mensagem de sem resultados antes de buscar", () => {
      renderComponent();
      expect(
        screen.queryByText("Não existem dados para filtragem informada"),
      ).not.toBeInTheDocument();
    });

    it("não deve exibir o modal antes de buscar", () => {
      renderComponent();
      expect(screen.queryByTestId("modal-relatorio")).not.toBeInTheDocument();
    });
  });

  describe("Busca com resultados", () => {
    beforeEach(() => {
      getProdutosRelatorioAnaliseSensorial.mockResolvedValue({
        data: {
          count: 1,
          results: [produtoMock],
        },
      });
    });

    it("deve chamar getProdutosRelatorioAnaliseSensorial ao submeter o formulário", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Buscar"));

      await waitFor(() => {
        expect(getProdutosRelatorioAnaliseSensorial).toHaveBeenCalledTimes(1);
      });
    });

    it("deve abrir o modal quando há resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Buscar"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-relatorio")).toBeInTheDocument();
        expect(screen.getByText(/1 produto\(s\)/)).toBeInTheDocument();
      });
    });

    it("não deve exibir mensagem de vazio quando há resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Buscar"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-relatorio")).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Não existem dados para filtragem informada"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Busca sem resultados", () => {
    beforeEach(() => {
      getProdutosRelatorioAnaliseSensorial.mockResolvedValue({
        data: {
          count: 0,
          results: [],
        },
      });
    });

    it("deve exibir mensagem de vazio quando não há resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Buscar"));

      await waitFor(() => {
        expect(
          screen.getByText("Não existem dados para filtragem informada"),
        ).toBeInTheDocument();
      });
    });

    it("não deve abrir o modal quando não há resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Buscar"));

      await waitFor(() => {
        expect(
          screen.getByText("Não existem dados para filtragem informada"),
        ).toBeInTheDocument();
      });

      expect(screen.queryByTestId("modal-relatorio")).not.toBeInTheDocument();
    });
  });
});
