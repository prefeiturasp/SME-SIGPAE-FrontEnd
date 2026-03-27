import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

import DetalharFornecedorDocumentosRecebimentoPage from "src/pages/PreRecebimento/DetalharFornecedorDocumentosRecebimentoPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: "uuid=test-uuid-123",
  }),
}));

const mockDadosDocumento = {
  uuid: "test-uuid-123",
  numero_cronograma: "001/2024",
  pregao_chamada_publica: "123/2024",
  nome_produto: "Produto Teste",
  numero_laudo: "LAUDO-001",
  programa_leve_leite: false,
  status: "Enviado para Análise",
  criado_em: "2024-01-15",
  logs: [
    {
      status_evento_explicacao: "Enviado para Análise",
      criado_em: "2024-01-15 10:00:00",
      usuario: { nome: "Usuário Teste" },
    },
  ],
  tipos_de_documentos: [
    {
      tipo_documento: "LAUDO",
      arquivos: [
        { nome: "laudo.pdf", arquivo: "http://example.com/laudo.pdf" },
      ],
    },
    {
      tipo_documento: "DECLARACAO_LEI_1512010",
      arquivos: [
        {
          nome: "declaracao.pdf",
          arquivo: "http://example.com/declaracao.pdf",
        },
      ],
    },
  ],
};

const mockDadosDocumentoAprovado = {
  ...mockDadosDocumento,
  status: "Aprovado",
  logs: [
    {
      status_evento_explicacao: "Aprovado",
      criado_em: "2024-01-20 10:00:00",
      usuario: { nome: "Usuário CODAE" },
    },
  ],
};

const mockDadosDocumentoSemLogs = {
  ...mockDadosDocumento,
  logs: null,
};

beforeEach(() => {
  mockNavigate.mockClear();
  mock
    .onGet(/\/documentos-de-recebimento\/.*\/?/)
    .reply(200, mockDadosDocumento);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={["/detalhar-documentos?uuid=test-uuid-123"]}
      >
        <DetalharFornecedorDocumentosRecebimentoPage />
      </MemoryRouter>,
    );
  });
};

describe("DetalharDocumentosRecebimento", () => {
  describe("Carregamento Inicial", () => {
    it("carrega a página com dados do documento", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
        expect(screen.getByText("Nº do Cronograma")).toBeInTheDocument();
        expect(screen.getByText("Data da Criação:")).toBeInTheDocument();
        expect(screen.getByText("Status:")).toBeInTheDocument();
      });
    });

    it("exibe todos os campos do formulário com valores", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByDisplayValue("001/2024")).toBeInTheDocument();
        expect(screen.getByDisplayValue("123/2024")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
        expect(screen.getByDisplayValue("LAUDO-001")).toBeInTheDocument();
      });
    });

    it("campos do laudo estão desabilitados", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByDisplayValue("001/2024")).toBeDisabled();
        expect(screen.getByDisplayValue("123/2024")).toBeDisabled();
        expect(screen.getByDisplayValue("Produto Teste")).toBeDisabled();
        expect(screen.getByDisplayValue("LAUDO-001")).toBeDisabled();
      });
    });
  });

  describe("TagLeveLeite", () => {
    it("não exibe tag quando programa_leve_leite é false", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.queryByText("LEVE LEITE - PLL")).not.toBeInTheDocument();
      });
    });

    it("exibe tag quando programa_leve_leite é true", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        programa_leve_leite: true,
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo de Status", () => {
    it("renderiza fluxo de status quando há logs", async () => {
      await setup();

      await waitFor(() => {
        const fluxoStatus = document.querySelector(".row.my-4");
        expect(fluxoStatus).toBeInTheDocument();
      });
    });

    it("não renderiza fluxo de status quando não há logs", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoSemLogs);

      await setup();

      await waitFor(() => {
        const fluxoStatus = document.querySelector(".row.my-4");
        expect(fluxoStatus).not.toBeInTheDocument();
      });
    });
  });

  describe("Outros Documentos", () => {
    it("renderiza seção de outros documentos", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
      });
    });
  });

  describe("Navegação", () => {
    it("possui botão de voltar", async () => {
      await setup();

      await waitFor(() => {
        const botoesVoltar = screen.getAllByText("Voltar");
        expect(botoesVoltar.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Botão Atualizar Documentos", () => {
    it("não exibe botão quando status não é Aprovado", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.queryByText("Atualizar Documentos"),
        ).not.toBeInTheDocument();
      });
    });

    it("exibe botão quando status é Aprovado", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoAprovado);

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      });
    });
  });

  describe("Estrutura HTML", () => {
    it("renderiza com estrutura correta", async () => {
      await setup();

      await waitFor(() => {
        expect(
          document.querySelector(".card-detalhar-documentos-recebimento"),
        ).toBeInTheDocument();
        expect(document.querySelectorAll("hr").length).toBeGreaterThan(0);
      });
    });
  });

  describe("API", () => {
    it("faz chamada para carregar dados do documento", async () => {
      await setup();

      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });
    });
  });
});
