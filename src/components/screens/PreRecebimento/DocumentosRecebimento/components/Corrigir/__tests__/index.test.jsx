// CorrigirDocumentosRecebimentoPage.test.jsx
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
import { PRE_RECEBIMENTO, DOCUMENTOS_RECEBIMENTO } from "src/configs/constants";
import CorrigirDocumentosRecebimentoPage from "src/pages/PreRecebimento/CorrigirDocumentosRecebimentoPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock dos toasts
jest.mock("src/components/Shareable/Toast/dialogs");

// Mock do helper de download de arquivos
jest.mock("src/components/Shareable/Input/InputFile/helper", () => ({
  downloadAndConvertToBase64: jest.fn((url) =>
    Promise.resolve(`base64_mock_${url}`),
  ),
}));

import { mockGetDocumentoRecebimentoCorrigir as mockDadosDocumento } from "src/mocks/services/documentosRecebimento.service/mockGetDocumentoRecebimentoCorrigir";

beforeEach(() => {
  // Mock das APIs
  mock
    .onGet(/\/documentos-de-recebimento\/.*\/?/)
    .reply(200, mockDadosDocumento);
  mock
    .onPatch(/\/documentos-de-recebimento\/.*\/corrigir-documentos\/?/)
    .reply(200);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/corrigir-documentos?uuid=doc-123"]}>
        <CorrigirDocumentosRecebimentoPage />
      </MemoryRouter>,
    );
  });
};

const clicarBotao = async (texto, index = 0) => {
  let botao;
  const elementos = screen.getAllByText(texto);
  botao = elementos[index].closest("button");

  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });
  fireEvent.click(botao);
};

describe("CorrigirDocumentosRecebimento - Testes Completos", () => {
  describe("Carregamento Inicial", () => {
    it("carrega a página com dados do documento para correção", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue("CRON-456")).toBeInTheDocument();
      expect(screen.getByDisplayValue("PREGAO-789")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("LAUDO-123")).toBeInTheDocument();
    });

    it("exibe fluxo de status quando disponível", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Enviado para Correção")).toBeInTheDocument();
      });
    });

    it("exibe data da solicitação corretamente", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Data da Solicitação:")).toBeInTheDocument();
        expect(screen.getByText("2023-01-15")).toBeInTheDocument();
      });
    });

    it("exibe status como 'Solicitada Correção'", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Status:")).toBeInTheDocument();
        expect(screen.getByText("Solicitada Correção")).toBeInTheDocument();
      });
    });

    it("exibe correções necessárias em campo desabilitado", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Correções Necessárias")).toBeInTheDocument();
        const textarea = screen.getByDisplayValue(
          "Favor corrigir o documento do laudo conforme especificações técnicas.",
        );
        expect(textarea).toBeDisabled();
      });
    });
  });

  describe("Renderização de Dados", () => {
    it("exibe todos os dados do laudo corretamente", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByDisplayValue("CRON-456")).toBeInTheDocument();
        expect(screen.getByDisplayValue("PREGAO-789")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
        expect(screen.getByDisplayValue("LAUDO-123")).toBeInTheDocument();
      });
    });

    it("exibe seção Dados do Laudo", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      });
    });

    it("exibe seção Outros Documentos", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
      });
    });

    it("exibe mensagem de aviso sobre múltiplas páginas do laudo", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.getByText(
            /Caso o laudo contiver múltiplas páginas, elas devem ser reunidas em um único documento/,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("TagLeveLeite", () => {
    it("exibe a tag LEVE LEITE - PLL quando o programa é LEVE_LEITE", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        programa_leve_leite: true,
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
      });
    });

    it("não exibe a tag LEVE LEITE - PLL quando o programa não é LEVE_LEITE", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        programa_leve_leite: false,
      });

      await setup();

      await waitFor(() => {
        expect(screen.queryByText("LEVE LEITE - PLL")).not.toBeInTheDocument();
      });
    });
  });

  describe("Formulário - Seleção de Documentos", () => {
    it("renderiza MultiSelect de documentos", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Selecione o documento")).toBeInTheDocument();
      });
    });

    it("exibe label 'Selecione o documento'", async () => {
      await setup();

      await waitFor(() => {
        const labels = screen.getAllByText("Selecione o documento");
        expect(labels.length).toBeGreaterThan(0);
      });
    });

    it("campo de seleção de documentos é obrigatório", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getAllByText("*").length).toBeGreaterThan(0);
        expect(screen.getByText("Selecione o documento")).toBeInTheDocument();
      });
    });
  });

  describe("Gestão de Arquivos - Laudo", () => {
    it("exibe componente de inserção de documento para laudo", async () => {
      await setup();

      await waitFor(() => {
        // O componente InserirDocumento deve estar presente
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
      });
    });

    it("carrega arquivos iniciais do laudo", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("laudo-original.pdf")).toBeInTheDocument();
      });
    });
  });

  describe("Gestão de Arquivos - Outros Documentos", () => {
    it("carrega arquivos iniciais de outros documentos", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("declaracao.pdf")).toBeInTheDocument();
        expect(screen.getByText("rastreabilidade.pdf")).toBeInTheDocument();
      });
    });
  });

  describe("Validações de Formulário", () => {
    it("botão 'Salvar e Enviar' é exibido", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      });
    });

    it("botão 'Cancelar' é exibido", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Cancelar")).toBeInTheDocument();
      });
    });

    it("botão 'Cancelar' está sempre habilitado", async () => {
      await setup();

      await waitFor(() => {
        const btnCancelar = screen.getByText("Cancelar").closest("button");
        expect(btnCancelar).not.toBeDisabled();
      });
    });
  });

  describe("Modais de Confirmação", () => {
    it("abre modal ao clicar em 'Salvar e Enviar'", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Salvar e Enviar")).toBeInTheDocument();
      });

      await clicarBotao("Salvar e Enviar");

      await waitFor(() => {
        expect(
          screen.getByText("Salvar e Enviar Documentos"),
        ).toBeInTheDocument();
      });
    });

    it("modal exibe mensagem correta para correção", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");

      await waitFor(() => {
        expect(
          screen.getByText(/Deseja enviar as correções para/),
        ).toBeInTheDocument();
        expect(screen.getByText(/Análise da CODAE/)).toBeInTheDocument();
      });
    });

    it("fecha modal ao clicar em 'Não'", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");

      await waitFor(() => {
        expect(
          screen.getByText("Salvar e Enviar Documentos"),
        ).toBeInTheDocument();
      });

      await clicarBotao("Não");

      await waitFor(() => {
        expect(
          screen.queryByText("Salvar e Enviar Documentos"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Fluxo de Submissão", () => {
    it("envia correção com sucesso", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/corrigir-documentos/");
      });
    });

    it("navega para página anterior após sucesso", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
        );
      });
    });

    it("exibe erro quando API falha", async () => {
      mock
        .onPatch(/\/documentos-de-recebimento\/.*\/corrigir-documentos\/?/)
        .reply(500);

      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(
        () => {
          expect(mock.history.patch.length).toBe(1);
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Navegação", () => {
    it("volta para página anterior ao clicar em 'Cancelar'", async () => {
      await setup();

      await clicarBotao("Cancelar");

      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
      );
    });

    it("navega para rota correta após cancelamento", async () => {
      await setup();

      await clicarBotao("Cancelar");

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
        );
      });
    });
  });

  describe("Payload de Submissão", () => {
    it("formata payload corretamente com tipos de documentos", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        const payload = JSON.parse(mock.history.patch[0].data);
        expect(payload).toHaveProperty("tipos_de_documentos");
        expect(Array.isArray(payload.tipos_de_documentos)).toBe(true);
      });
    });

    it("inclui laudo no payload", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(() => {
        const payload = JSON.parse(mock.history.patch[0].data);
        const laudoNoPayload = payload.tipos_de_documentos.find(
          (doc) => doc.tipo_documento === "LAUDO",
        );
        expect(laudoNoPayload).toBeDefined();
      });
    });

    it("inclui arquivos convertidos em base64", async () => {
      await setup();

      await clicarBotao("Salvar e Enviar");
      await clicarBotao("Sim");

      await waitFor(() => {
        const payload = JSON.parse(mock.history.patch[0].data);
        const laudoNoPayload = payload.tipos_de_documentos.find(
          (doc) => doc.tipo_documento === "LAUDO",
        );
        expect(
          laudoNoPayload.arquivos_do_tipo_de_documento.length,
        ).toBeGreaterThan(0);
        expect(laudoNoPayload.arquivos_do_tipo_de_documento[0]).toHaveProperty(
          "arquivo",
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("lida com documento sem correção solicitada", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        correcao_solicitada: "",
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Correções Necessárias")).toBeInTheDocument();
      });
    });

    it("lida com documento com logs mínimos", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        logs: [
          {
            status_evento_explicacao: "Enviado para Correção",
            criado_em: "2023-01-15 10:30:00",
            usuario: { nome: "Usuário Teste" },
          },
        ],
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
        expect(screen.getByText("2023-01-15")).toBeInTheDocument();
      });
    });

    it("lida com documento sem tipos de documentos além do laudo", async () => {
      mock.onGet(/\/documentos-de-recebimento\/.*\/?/).reply(200, {
        ...mockDadosDocumento,
        tipos_de_documentos: [
          {
            tipo_documento: "LAUDO",
            arquivos: [
              {
                nome: "laudo-unico.pdf",
                arquivo: "http://example.com/laudo-unico.pdf",
              },
            ],
          },
        ],
      });

      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Laudo")).toBeInTheDocument();
        expect(screen.getByText("Outros Documentos")).toBeInTheDocument();
      });
    });
  });
});
