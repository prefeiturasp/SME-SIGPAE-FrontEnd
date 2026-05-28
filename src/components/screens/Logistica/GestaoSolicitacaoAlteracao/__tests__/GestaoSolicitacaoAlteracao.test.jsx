import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import GestaoSolicitacaoAlteracao from "src/components/screens/Logistica/GestaoSolicitacaoAlteracao";
import { getListagemSolicitacaoAlteracao } from "src/services/logistica.service";
import mock from "src/services/_mock";

jest.mock("../../../../../services/logistica.service", () => ({
  getListagemSolicitacaoAlteracao: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn((data) => data),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/Paginacao/index.jsx", () => ({
  Paginacao: ({ onChange }) => (
    <button type="button" onClick={() => onChange(2)}>
      mock-paginacao
    </button>
  ),
}));

jest.mock(
  "src/components/screens/Logistica/GestaoSolicitacaoAlteracao/components/Filtros",
  () =>
    ({ setFiltros, setSolicitacoes, setTotal, inicioResultado }) => (
      <div>
        <div ref={inicioResultado} data-testid="inicio-resultado" />
        <button
          type="button"
          onClick={() => setFiltros({ numero_solicitacao: "ALT-001" })}
        >
          Consultar
        </button>
        <button
          type="button"
          onClick={() => {
            setSolicitacoes(undefined);
            setTotal(undefined);
          }}
        >
          Limpar Filtros
        </button>
      </div>
    ),
);

jest.mock(
  "src/components/screens/Logistica/GestaoSolicitacaoAlteracao/components/ListagemSolicitacoes",
  () =>
    ({ solicitacoes }) => (
      <div>
        <div>Solicitações Disponibilizadas</div>
        {solicitacoes.map((s) => (
          <div key={s.uuid}>{s.numero_solicitacao}</div>
        ))}
      </div>
    ),
);

jest.mock("antd", () => ({
  Spin: ({ children }) => <div>{children}</div>,
}));

const mockSolicitacao = {
  uuid: "sol-uuid-001",
  numero_solicitacao: "ALT-001",
  requisicao: { numero_solicitacao: "REQ-001" },
  qtd_guias: 2,
  nome_distribuidor: "Distribuidor X",
  status: "Em análise",
  data_entrega: "10/01/2025",
  criado_em: "05/01/2025",
  motivo: "ALTERAR_DATA_ENTREGA",
  justificativa: "Justificativa teste",
};

function renderComponent() {
  return render(<GestaoSolicitacaoAlteracao />);
}

describe("GestaoSolicitacaoAlteracao", () => {
  beforeEach(() => {
    mock.reset();
    getListagemSolicitacaoAlteracao.mockReset();
  });
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar os botões Consultar e Limpar Filtros", () => {
      renderComponent();
      expect(screen.getByText("Consultar")).toBeInTheDocument();
      expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    });

    it("não deve exibir a listagem antes de consultar", () => {
      renderComponent();
      expect(
        screen.queryByText("Solicitações Disponibilizadas"),
      ).not.toBeInTheDocument();
    });

    it("não deve exibir mensagem de sem resultados antes de consultar", () => {
      renderComponent();
      expect(
        screen.queryByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("Consulta com resultados", () => {
    beforeEach(() => {
      getListagemSolicitacaoAlteracao.mockResolvedValue({
        data: {
          count: 1,
          results: [mockSolicitacao],
        },
      });
    });

    it("deve chamar getListagemSolicitacaoAlteracao ao definir filtros", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(getListagemSolicitacaoAlteracao).toHaveBeenCalledTimes(1);
      });
    });

    it("deve exibir a listagem após consultar com resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(
          screen.getByText("Solicitações Disponibilizadas"),
        ).toBeInTheDocument();
        expect(screen.getByText("ALT-001")).toBeInTheDocument();
      });
    });

    it("deve exibir a paginação quando há resultados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("mock-paginacao")).toBeInTheDocument();
      });
    });

    it("não deve exibir mensagem de sem resultados quando há dados", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("ALT-001")).toBeInTheDocument();
      });

      expect(
        screen.queryByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("Consulta sem resultados", () => {
    beforeEach(() => {
      getListagemSolicitacaoAlteracao.mockResolvedValue({
        data: {
          count: 0,
          results: [],
        },
      });
    });

    it("deve exibir mensagem de sem resultados quando count é 0", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(
          screen.getByText(
            "Não existe informação para os critérios de busca utilizados.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("não deve exibir a listagem quando count é 0", async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(
          screen.queryByText("Solicitações Disponibilizadas"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Paginação", () => {
    it("deve chamar getListagemSolicitacaoAlteracao com page 2 ao trocar de página", async () => {
      const user = userEvent.setup();

      getListagemSolicitacaoAlteracao.mockResolvedValue({
        data: {
          count: 25,
          results: [mockSolicitacao],
        },
      });

      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("mock-paginacao")).toBeInTheDocument();
      });

      await user.click(screen.getByText("mock-paginacao"));

      await waitFor(() => {
        expect(getListagemSolicitacaoAlteracao).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Limpar Filtros", () => {
    it("deve ocultar a listagem ao limpar os filtros", async () => {
      const user = userEvent.setup();

      getListagemSolicitacaoAlteracao.mockResolvedValue({
        data: {
          count: 1,
          results: [mockSolicitacao],
        },
      });

      renderComponent();

      await user.click(screen.getByText("Consultar"));

      await waitFor(() => {
        expect(screen.getByText("ALT-001")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Limpar Filtros"));

      await waitFor(() => {
        expect(
          screen.queryByText("Solicitações Disponibilizadas"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
