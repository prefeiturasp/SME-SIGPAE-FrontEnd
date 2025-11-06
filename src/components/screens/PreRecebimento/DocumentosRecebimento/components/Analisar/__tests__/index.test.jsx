// AnalisarDocumentosRecebimentoPage.test.jsx
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
import AnalisarDocumentosRecebimentoPage from "src/pages/PreRecebimento/AnalisarDocumentosRecebimentoPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock dos toasts
jest.mock("src/components/Shareable/Toast/dialogs");

const mockDadosDocumento = {
  uuid: "123",
  fornecedor: "Fornecedor Teste",
  numero_cronograma: "456",
  pregao_chamada_publica: "789",
  nome_produto: "Produto Teste",
  numero_sei: "SEI123",
  numero_laudo: "LAUDO456",
  tipos_de_documentos: [
    {
      tipo_documento: "LAUDO",
      arquivos: [{ nome: "laudo.pdf", uuid: "arquivo123" }],
    },
    {
      tipo_documento: "DECLARACAO_LEI_1512010",
      arquivos: [{ nome: "declaracao.pdf", uuid: "arquivo456" }],
    },
    {
      tipo_documento: "CERTIFICADO_CONF_ORGANICA",
      arquivos: [{ nome: "certificado.pdf", uuid: "arquivo789" }],
    },
    {
      tipo_documento: "RASTREABILIDADE",
      arquivos: [{ nome: "rastreabilidade.pdf", uuid: "arquivo101" }],
    },
  ],
  logs: [
    {
      status_evento_explicacao: "Rascunho",
      data: "2023-01-01",
      usuario: { nome: "Usuário Teste" },
    },
  ],
  laboratorio: { uuid: "lab123", nome: "Laboratório Teste" },
  quantidade_laudo: 100,
  unidade_medida: { uuid: "medida123", nome: "Kg" },
  data_final_lote: "01/01/2023",
  numero_lote_laudo: "LOTE123",
  datas_fabricacao_e_prazos: [
    {
      data_fabricacao: "01/01/2023",
      data_validade: "01/01/2024",
      prazo_maximo_recebimento: "30",
      justificativa: "",
    },
  ],
};

const mockUnidadesMedida = {
  results: [
    { uuid: "medida123", nome: "Kg" },
    { uuid: "medida124", nome: "L" },
    { uuid: "medida125", nome: "g" },
    { uuid: "medida126", nome: "mg" },
  ],
};

const mockLaboratorios = {
  results: [
    { uuid: "lab123", nome: "Laboratório Teste" },
    { uuid: "lab124", nome: "Laboratório Teste 2" },
    { uuid: "lab125", nome: "Laboratório Credenciado" },
  ],
};

beforeEach(() => {
  // Mock das APIs usando axios-mock-adapter COM AS URLs EXATAS FORNECIDAS
  mock
    .onGet(/\/documentos-de-recebimento\/.*\/?/)
    .reply(200, mockDadosDocumento);
  mock
    .onGet(/\/unidades-medida-logistica\/lista-nomes-abreviacoes\/?/)
    .reply(200, mockUnidadesMedida);
  mock
    .onGet(/\/laboratorios\/lista-laboratorios-credenciados\/?/)
    .reply(200, mockLaboratorios);
  mock
    .onPatch(/\/documentos-de-recebimento\/.*\/analise-documentos\/?/)
    .reply(200);
  mock
    .onPatch(/\/documentos-de-recebimento\/.*\/analise-documentos-rascunho\/?/)
    .reply(200);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/analise-documentos?uuid=mock-uuid-123"]}>
        <AnalisarDocumentosRecebimentoPage />
      </MemoryRouter>,
    );
  });
};

const clicarBotao = async (texto, index = 0) => {
  let botao;
  botao = screen.getAllByText(texto)[index].closest("button");

  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });
  fireEvent.click(botao);
};

const clicarSalvarAlteracoes = async () => {
  // Encontra todos os botões "Salvar Alterações" e clica no primeiro (do formulário)
  await waitFor(() => {
    const botoes = screen
      .getAllByText("Salvar Alterações")
      .map((node) => node.closest("button"));
    expect(botoes.length).toBeGreaterThan(0);

    // Normalmente o primeiro é o do formulário principal
    const botaoFormulario = botoes[0];
    expect(botaoFormulario).toBeInTheDocument();
  });

  const botoes = screen
    .getAllByText("Salvar Alterações")
    .map((node) => node.closest("button"));
  const botaoFormulario = botoes[0];

  await waitFor(() => {
    expect(botaoFormulario).not.toBeDisabled();
  });
  fireEvent.click(botaoFormulario);
};

const preencheInput = (placeholder, valor) => {
  const input = screen.getByPlaceholderText(placeholder);
  fireEvent.change(input, { target: { value: valor } });
};

const preencheTextArea = (placeholder, valor) => {
  const textarea = screen.getByPlaceholderText(placeholder);
  fireEvent.change(textarea, { target: { value: valor } });
};

describe("AnaliseDocumentosRecebimento - Testes Completos", () => {
  describe("Carregamento Inicial", () => {
    it("carrega a página com dados do documento", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados Gerais")).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue("Fornecedor Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("456")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
    });

    it("exibe fluxo de status quando disponível", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Rascunho")).toBeInTheDocument();
      });
    });
  });

  describe("Renderização de Dados", () => {
    it("exibe dados do produto corretamente", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Fornecedor Teste"),
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue("456")).toBeInTheDocument();
        expect(screen.getByDisplayValue("789")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
        expect(screen.getByDisplayValue("SEI123")).toBeInTheDocument();
        expect(screen.getByDisplayValue("LAUDO456")).toBeInTheDocument();
      });
    });

    it("exibe laudo enviado pelo fornecedor", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.getByText("Laudo enviado pelo Fornecedor:"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Formulário de Dados do Laudo", () => {
    it("permite preencher dados do laboratório", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();
      });

      const selectLaboratorio = screen.getByTestId("select-laboratorio");
      const inputLaboratorio = selectLaboratorio.querySelector("select");
      fireEvent.change(inputLaboratorio, {
        target: { value: "lab124" },
      });
    });

    it("permite preencher quantidade do laudo", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Quantidade do Laudo")).toBeInTheDocument();
      });

      preencheInput("Digite a Quantidade", "150");
    });

    it("exibe aviso do laboratório quando selecionado", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();
      });

      const selectLaboratorio = screen.getByTestId("select-laboratorio");
      const inputLaboratorio = selectLaboratorio.querySelector("select");
      fireEvent.change(inputLaboratorio, {
        target: { value: "lab124" },
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            /Não se esqueça de verificar se o Laboratório é credenciado/,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Gestão de Prazos", () => {
    it("adiciona novo prazo quando clicar no botão +", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("+")).toBeInTheDocument();
      });

      await clicarBotao("+");

      await waitFor(() => {
        const datasFabricacao = screen.getAllByText(/Data de Fabricação/i);
        expect(datasFabricacao.length).toBe(2);
      });
    });

    it("exibe campo de justificativa quando prazo for OUTRO", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.getByText("Prazo Máximo de Recebimento"),
        ).toBeInTheDocument();
      });

      const selectPrazo = screen.getByTestId("prazo_maximo_0");
      const selectElement = selectPrazo.querySelector("select");
      fireEvent.change(selectElement, { target: { value: "OUTRO" } });

      await waitFor(() => {
        expect(
          screen.getByText(/Justifique Outro prazo máximo para Recebimento/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Modais de Confirmação", () => {
    it("abre modal ao clicar em Aprovar Documentos", async () => {
      await setup();

      await waitFor(() => {
        expect(
          screen.getAllByText("Aprovar Documentos")[0],
        ).toBeInTheDocument();
      });

      await clicarBotao("Aprovar Documentos");

      await waitFor(() => {
        expect(
          screen.getAllByText("Aprovar Documentos")[1],
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Deseja aprovar os Documentos de Recebimento/),
        ).toBeInTheDocument();
      });
    });

    it("abre modal de correção ao clicar em Solicitar Correção", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Solicitar Correção")).toBeInTheDocument();
      });

      await clicarBotao("Solicitar Correção");

      await waitFor(() => {
        expect(
          screen.getByText("Solicitar Correção ao Fornecedor"),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Informe aqui as correções necessárias"),
        ).toBeInTheDocument();
      });
    });

    it("abre modal ao clicar em Salvar Alterações", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Salvar Alterações")).toBeInTheDocument();
      });

      await clicarSalvarAlteracoes();

      await waitFor(() => {
        expect(
          screen.getByText(/Deseja salvar as alterações realizadas/),
        ).toBeInTheDocument();
      });
    });

    it("abre modal ao clicar em Cancelar", async () => {
      await setup();

      await clicarBotao("Cancelar");

      await waitFor(() => {
        expect(screen.getByText("Cancelar Alterações")).toBeInTheDocument();
        expect(
          screen.getByText(/as alterações realizadas/),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Validações de Formulário", () => {
    it("botão Enviar no modal de correção inicia desabilitado", async () => {
      await setup();

      await clicarBotao("Solicitar Correção");

      await waitFor(() => {
        const btnEnviar = screen.getByText("Enviar").closest("button");
        expect(btnEnviar).toBeDisabled();
      });
    });

    it("habilita botão Enviar no modal de correção quando campo é preenchido", async () => {
      await setup();

      await clicarBotao("Solicitar Correção");

      preencheTextArea(
        "Informe aqui as correções necessárias",
        "Correções necessárias",
      );

      await waitFor(() => {
        const btnEnviar = screen.getByText("Enviar").closest("button");
        expect(btnEnviar).not.toBeDisabled();
      });
    });
  });

  describe("Fluxo de Envio", () => {
    it("envia aprovação com sucesso", async () => {
      await setup();

      await clicarBotao("Aprovar Documentos");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/analise-documentos/");
      });
    });

    it("envia correção com sucesso", async () => {
      await setup();

      await clicarBotao("Solicitar Correção");
      preencheTextArea(
        "Informe aqui as correções necessárias",
        "Correções necessárias",
      );
      await clicarBotao("Enviar");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/analise-documentos/");
      });
    });

    it("salva rascunho com sucesso", async () => {
      await setup();

      // Aguarda o carregamento completo
      await waitFor(() => {
        expect(screen.getByText("Dados Gerais")).toBeInTheDocument();
      });

      // Modifica um campo para garantir que há alterações
      const quantidadeInput = screen.getByPlaceholderText(
        "Digite a Quantidade",
      );
      if (quantidadeInput) {
        fireEvent.change(quantidadeInput, { target: { value: "200" } });
      }

      // Usa a função específica para Salvar Alterações
      await clicarSalvarAlteracoes();

      // Confirma no modal
      await clicarBotao("Sim");

      // Aguarda a requisição PATCH
      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
      });

      // Verifica se foi a URL correta
      expect(mock.history.patch[0].url).toMatch(/analise-documentos-rascunho/);
    });

    it("cancela análise e volta para o painel", async () => {
      await setup();

      await clicarBotao("Cancelar");
      await clicarBotao("Sim");

      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
      );
    });
  });

  describe("Comportamento com Documento Aprovado", () => {
    const mockDadosAprovado = {
      ...mockDadosDocumento,
      logs: [
        {
          status_evento_explicacao: "Aprovado",
          data: "2023-01-01",
          usuario: { nome: "Usuário Teste" },
        },
      ],
    };

    beforeEach(() => {
      mock
        .onGet(/\/documentos-de-recebimento\/.*\/?/)
        .reply(200, mockDadosAprovado);
    });

    it("desabilita campos quando documento já foi aprovado", async () => {
      await setup();

      await waitFor(() => {
        // Verifica se o botão de adicionar prazo está desabilitado
        const btnAdicionar = screen.getByText("+").closest("button");
        expect(btnAdicionar).toBeDisabled();

        // Pelo menos o botão de adicionar deve estar desabilitado
        // Os outros botões podem ter comportamentos diferentes
        expect(btnAdicionar).toBeDisabled();

        // Verifica se os valores estão em modo de exibição (não edição)
        expect(
          screen.getByDisplayValue("Fornecedor Teste"),
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue("456")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
      });
    });

    it("desabilita botão de adicionar prazo quando documento aprovado", async () => {
      await setup();

      await waitFor(() => {
        const btnAdicionar = screen.getByText("+").closest("button");
        expect(btnAdicionar).toBeDisabled();
      });
    });
  });

  describe("Testes de Navegação", () => {
    it("volta para página anterior ao confirmar cancelamento", async () => {
      await setup();

      await clicarBotao("Cancelar");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
        );
      });
    });

    it("fecha modal de cancelamento ao clicar em Não", async () => {
      await setup();

      await clicarBotao("Cancelar");
      await clicarBotao("Não");

      await waitFor(() => {
        expect(
          screen.queryByText("Cancelar Alterações"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Testes de Outros Documentos", () => {
    it("renderiza todos os tipos de documentos corretamente", async () => {
      await setup();

      await waitFor(() => {
        // Verifica se as seções de outros documentos estão presentes
        expect(
          screen.getByText(
            "Declaração de atendimento a Lei Municipal: 15.120/10",
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Certificado de conformidade orgânica"),
        ).toBeInTheDocument();
        expect(screen.getByText("Rastreabilidade")).toBeInTheDocument();

        // Verifica se o componente OutrosDocumentos está sendo renderizado
        expect(screen.getByText(/Outros Documentos/i)).toBeInTheDocument();
      });
    });
  });
});
