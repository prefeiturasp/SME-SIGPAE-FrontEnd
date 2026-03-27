import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import {
  PRE_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
} from "src/configs/constants";
import DetalharCodaeDocumentosRecebimentoPage from "src/pages/PreRecebimento/DetalharCodaeDocumentosRecebimentoPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: "uuid=test-uuid-123",
  }),
}));

const mockDadosDocumentoAprovado = {
  uuid: "test-uuid-123",
  fornecedor: "Fornecedor Teste",
  numero_cronograma: "001/2024",
  pregao_chamada_publica: "123/2024",
  nome_produto: "Produto Teste",
  numero_sei: "SEI-12345",
  numero_laudo: "LAUDO-001",
  programa_leve_leite: false,
  status: "Aprovado",
  criado_em: "2024-01-15",
  laboratorio: { nome: "Laboratório Teste" },
  quantidade_laudo: 100,
  unidade_medida: { nome: "KG" },
  saldo_laudo: 50,
  data_final_lote: "2024-12-31",
  numero_lote_laudo: "LOTE-001",
  logs: [
    {
      status_evento_explicacao: "Aprovado",
      criado_em: "2024-01-20 10:00:00",
      usuario: { nome: "Usuário CODAE" },
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
  datas_fabricacao_e_prazos: [
    {
      data_fabricacao: "2024-01-01",
      data_validade: "2024-06-01",
      prazo_maximo_recebimento: "30",
      data_maxima_recebimento: "2024-05-01",
    },
  ],
};

const mockDadosDocumentoCorrecao = {
  ...mockDadosDocumentoAprovado,
  status: "Enviado para Análise",
  correcao_solicitada: "Favor corrigir o documento",
  logs: [
    {
      status_evento_explicacao: "Solicitação de Correção",
      criado_em: "2024-01-21 14:00:00",
      usuario: { nome: "Usuário CODAE" },
    },
  ],
};

const mockDadosDocumentoPrazoOutro = {
  ...mockDadosDocumentoAprovado,
  datas_fabricacao_e_prazos: [
    {
      data_fabricacao: "2024-01-01",
      data_validade: "2024-06-01",
      prazo_maximo_recebimento: "OUTRO",
      justificativa: "Justificativa do prazo diferente",
    },
  ],
};

beforeEach(() => {
  mockNavigate.mockClear();
  mock
    .onGet(/\/documentos-de-recebimento\/.*\/?/)
    .reply(200, mockDadosDocumentoAprovado);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={["/detalhar-codae-documentos?uuid=test-uuid-123"]}
      >
        <DetalharCodaeDocumentosRecebimentoPage />
      </MemoryRouter>,
    );
  });
};

describe("DetalharCodaeDocumentosRecebimento", () => {
  describe("Carregamento Inicial", () => {
    it("carrega a página com dados do documento", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados Gerais")).toBeInTheDocument();
        expect(screen.getByText("Fornecedor")).toBeInTheDocument();
        expect(screen.getByText("Nº do Cronograma")).toBeInTheDocument();
        expect(
          screen.getByText("Nº do Pregão/Chamada Pública"),
        ).toBeInTheDocument();
        expect(screen.getByText("Nome do Produto")).toBeInTheDocument();
        expect(screen.getByText("Nº do Processo SEI")).toBeInTheDocument();
        expect(screen.getByText("Nº do Laudo")).toBeInTheDocument();
      });
    });

    it("exibe seção Dados do Laudo com todos os campos", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
        expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();
        expect(screen.getByText("Quantidade do Laudo")).toBeInTheDocument();
        expect(screen.getByText("Unidade de Medida")).toBeInTheDocument();
        expect(screen.getByText("Saldo do Laudo")).toBeInTheDocument();
        expect(screen.getByText("Data Final do Laudo")).toBeInTheDocument();
        expect(
          screen.getByText("Nº do(s) Lote(s) do(s) Laudo(s)"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Status do Documento", () => {
    it("exibe status aprovado quando documento está aprovado", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText(/Documentos aprovados em/)).toBeInTheDocument();
      });
    });

    it("exibe status correção quando documento tem solicitação de correção", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoCorrecao);

      await setup();

      await waitFor(() => {
        expect(screen.getByText(/Solicitada Correção em/)).toBeInTheDocument();
      });
    });
  });

  describe("Datas de Fabricação e Prazos", () => {
    it("exibe datas de fabricação e validade", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Data de Fabricação")).toBeInTheDocument();
        expect(screen.getByText("Data de Validade")).toBeInTheDocument();
        expect(
          screen.getByText("Prazo Máximo de Recebimento"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Data Máxima de Recebimento"),
        ).toBeInTheDocument();
      });
    });

    it("exibe justificativa quando prazo é OUTRO", async () => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosDocumentoPrazoOutro);

      await setup();

      await waitFor(() => {
        expect(
          screen.getByText("Justifique Outro prazo máximo para Recebimento"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Download de Laudo", () => {
    it("renderiza botão de download do laudo", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Laudo Analisado")).toBeInTheDocument();
      });
    });
  });

  describe("Solicitação de Correção", () => {
    it("não exibe seção de correção quando aprovado", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados Gerais")).toBeInTheDocument();
        expect(
          screen.queryByText("Solicitação de Correção"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Navegação", () => {
    it("volta para painel ao clicar em Voltar", async () => {
      await setup();

      await waitFor(() => {
        const botoesVoltar = screen.getAllByText("Voltar");
        expect(botoesVoltar.length).toBeGreaterThan(0);
      });

      const botaoVoltar = screen.getAllByText("Voltar")[0].closest("button");
      fireEvent.click(botaoVoltar);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
      );
    });
  });

  describe("TagLeveLeite", () => {
    it("não exibe tag quando programa não é LEVE_LEITE", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.queryByText("LEVE LEITE - PLL")).not.toBeInTheDocument();
      });
    });

    it("exibe tag quando programa é LEVE_LEITE", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumentoAprovado,
        programa_leve_leite: true,
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
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

  describe("Estrutura HTML", () => {
    it("renderiza com classe de card específica", async () => {
      await setup();

      await waitFor(() => {
        expect(
          document.querySelector(".card-detalhar-documentos-recebimento-codae"),
        ).toBeInTheDocument();
        expect(document.querySelectorAll("hr").length).toBeGreaterThan(0);
      });
    });
  });

  describe("API", () => {
    it("faz chamada para detalhar documento", async () => {
      await setup();

      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });
    });
  });
});
