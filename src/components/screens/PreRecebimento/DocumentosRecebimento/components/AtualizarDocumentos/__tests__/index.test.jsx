import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import { PRE_RECEBIMENTO, DOCUMENTOS_RECEBIMENTO } from "src/configs/constants";
import AtualizarFornecedorDocumentosRecebimentoPage from "src/pages/PreRecebimento/AtualizarFornecedorDocumentosRecebimentoPage";

jest.mock(
  "src/components/screens/PreRecebimento/DocumentosRecebimento/constants",
  () => ({
    OUTROS_DOCUMENTOS_OPTIONS: [
      {
        value: "DECLARACAO_LEI_1512010",
        label: "Declaração de atendimento a Lei Municipal: 15.120/10",
      },
      {
        value: "CERTIFICADO_CONF_ORGANICA",
        label: "Certificado de conformidade orgânica",
      },
      { value: "RASTREABILIDADE", label: "Rastreabilidade" },
      {
        value: "DECLARACAO_MATERIA_ORGANICA",
        label: "Declaração de Matéria Láctea",
      },
      { value: "OUTROS", label: "Outros" },
    ],
  }),
);

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

const mockDadosDocumentoComOutros = {
  ...mockDadosDocumento,
  tipos_de_documentos: [
    {
      tipo_documento: "LAUDO",
      arquivos: [
        { nome: "laudo.pdf", arquivo: "http://example.com/laudo.pdf" },
      ],
    },
    {
      tipo_documento: "OUTROS",
      descricao_documento: "Documento de teste",
      arquivos: [
        { nome: "outros.pdf", arquivo: "http://example.com/outros.pdf" },
      ],
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
  mock
    .onPatch(/\/documentos-de-recebimento\/.*\/atualizar-documentos\/?/)
    .reply(201);
});

afterEach(() => {
  cleanup();
  mock.reset();
  jest.clearAllMocks();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={["/atualizar-documentos?uuid=test-uuid-123"]}
      >
        <AtualizarFornecedorDocumentosRecebimentoPage />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
  await waitFor(() => {
    expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
  });
};

describe("AtualizarDocumentosRecebimento", () => {
  describe("Carregamento Inicial", () => {
    it("renderiza o componente com todos os elementos", async () => {
      await setup();

      expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      expect(screen.getByDisplayValue("001/2024")).toBeInTheDocument();
      expect(screen.getByDisplayValue("LAUDO-001")).toBeInTheDocument();
      expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
      expect(screen.getByText("Data da Criação:")).toBeInTheDocument();
      expect(screen.getByText("Status:")).toBeInTheDocument();
    });

    it("exibe campos do laudo desabilitados com valores", async () => {
      await setup();

      expect(screen.getByDisplayValue("001/2024")).toBeDisabled();
      expect(screen.getByDisplayValue("123/2024")).toBeDisabled();
      expect(screen.getByDisplayValue("Produto Teste")).toBeDisabled();
      expect(screen.getByDisplayValue("LAUDO-001")).toBeDisabled();
    });
  });

  describe("Logs", () => {
    it("renderiza logs quando existem", async () => {
      await setup();
      expect(
        document.querySelector('[data-testid="logs-section"]'),
      ).toBeInTheDocument();
    });

    it("não renderiza logs quando não existem", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoSemLogs);

      await setup();
      expect(
        document.querySelector('[data-testid="logs-section"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe("TagLeveLeite", () => {
    it("não exibe tag quando programa_leve_leite é false", async () => {
      await setup();
      expect(screen.queryByText("Leve Leite")).not.toBeInTheDocument();
    });

    it("renderiza quando programa_leve_leite é true", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        programa_leve_leite: true,
      });

      await setup();
      expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
    });
  });

  describe("Modal de Confirmação", () => {
    it("abre modal ao submeter formulário", async () => {
      await setup();
      const form = document.querySelector("form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Salvar e Enviar Documentos"),
        ).toBeInTheDocument();
        expect(screen.getByText("Sim")).toBeInTheDocument();
        expect(screen.getByText("Não")).toBeInTheDocument();
      });
    });

    it("fecha modal ao clicar em Não", async () => {
      await setup();
      fireEvent.submit(document.querySelector("form"));

      await waitFor(() => {
        expect(screen.getByText("Não")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Não"));

      await waitFor(() => {
        expect(
          screen.queryByText("Salvar e Enviar Documentos"),
        ).not.toBeInTheDocument();
      });
    });

    it("submete ao clicar em Sim", async () => {
      await setup();
      fireEvent.submit(document.querySelector("form"));

      await waitFor(() => {
        expect(screen.getByText("Sim")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Sim"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe("API - atualizarDocumentoRecebimento", () => {
    it("chama API com sucesso (status 201)", async () => {
      await setup();
      fireEvent.submit(document.querySelector("form"));

      await waitFor(() => {
        expect(screen.getByText("Sim")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Sim"));

      await waitFor(() => {
        expect(mock.history.patch.length).toBeGreaterThan(0);
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it("chama API com sucesso (status 200)", async () => {
      mock
        .onPatch(/\/documentos-de-recebimento\/.*\/atualizar-documentos\/?/)
        .reply(200);

      await setup();
      fireEvent.submit(document.querySelector("form"));

      await waitFor(() => {
        expect(screen.getByText("Sim")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Sim"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it("trata erro na API", async () => {
      mock
        .onPatch(/\/documentos-de-recebimento\/.*\/atualizar-documentos\/?/)
        .reply(500);

      await setup();
      fireEvent.submit(document.querySelector("form"));

      await waitFor(() => {
        expect(screen.getByText("Sim")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Sim"));

      await waitFor(() => {
        expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      });
    });
  });

  describe("Navegação", () => {
    it("volta para lista ao clicar em Cancelar", async () => {
      await setup();
      fireEvent.click(screen.getByText("Cancelar").closest("button"));
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
      );
    });
  });

  describe("Formulário", () => {
    it("possui formulário com estrutura correta", async () => {
      await setup();
      expect(
        document.querySelector('form[data-testid="documentos-form"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Tipos de Documentos", () => {
    it("carrega documentos com tipo OUTROS", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoComOutros);

      await setup();
      expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
    });

    it("carrega documentos com tipos vazios", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        tipos_de_documentos: [],
      });

      await setup();
      expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
    });
  });

  describe("Estrutura HTML", () => {
    it("renderiza com estrutura correta", async () => {
      await setup();
      expect(document.querySelector(".card")).toBeInTheDocument();
      expect(document.querySelectorAll("hr").length).toBeGreaterThan(0);
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
