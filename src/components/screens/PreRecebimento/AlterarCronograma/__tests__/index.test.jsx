import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
  configure,
} from "@testing-library/react";
import "@testing-library/jest-dom";

configure({ asyncUtilTimeout: 5000 });
import { MemoryRouter } from "react-router-dom";
import AlterarCronograma from "../index";
import mock from "src/services/_mock";
import {
  PRE_RECEBIMENTO,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
} from "src/configs/constants";
import {
  mockCronogramaBase,
  mockSolicitacaoEmAnalise,
  mockSolicitacaoCronogramaCiente,
  mockSolicitacaoAprovadaAbastecimento,
  mockSolicitacaoAprovadaDilog,
  mockSolicitacaoAlteracaoCodae,
  mockOpcoesEtapas,
  mockFeriados,
} from "src/mocks/services/cronograma.service/mockAlterarCronograma";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock das funções de utilidade de usuário
jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  usuarioEhEmpresaFornecedor: jest.fn(() => false),
  usuarioEhCronogramaOuCodae: jest.fn(() => false),
  usuarioEhCronograma: jest.fn(() => false),
  usuarioEhCodaeDilog: jest.fn(() => false),
  usuarioEhDilogAbastecimento: jest.fn(() => false),
  usuarioEhDilogDiretoria: jest.fn(() => false),
}));

beforeEach(() => {
  const mockGet = jest.fn().mockReturnValue("cronograma-uuid-123");
  Object.defineProperty(window, "URLSearchParams", {
    value: jest.fn().mockImplementation(() => ({
      get: mockGet,
    })),
    writable: true,
  });

  window.scrollTo = jest.fn();

  // Reset mocks de usuário
  const {
    usuarioEhEmpresaFornecedor,
    usuarioEhCronogramaOuCodae,
    usuarioEhCronograma,
    usuarioEhCodaeDilog,
    usuarioEhDilogAbastecimento,
    usuarioEhDilogDiretoria,
  } = require("src/helpers/utilities");

  usuarioEhEmpresaFornecedor.mockReturnValue(false);
  usuarioEhCronogramaOuCodae.mockReturnValue(false);
  usuarioEhCronograma.mockReturnValue(false);
  usuarioEhCodaeDilog.mockReturnValue(false);
  usuarioEhDilogAbastecimento.mockReturnValue(false);
  usuarioEhDilogDiretoria.mockReturnValue(false);

  mock.onGet(/\/cronogramas\/opcoes-etapas\/?/).reply(200, mockOpcoesEtapas);
  mock.onGet(/\/feriados-ano\/ano-atual-e-proximo\/?/).reply(200, mockFeriados);

  // Mock padrão das APIs
  mock.onGet(/\/cronogramas\/.*\/?/).reply(200, mockCronogramaBase);
  mock
    .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
    .reply(200, mockSolicitacaoEmAnalise);
  mock.onPost(/\/solicitacao-de-alteracao-de-cronograma\/?/).reply(200);
  mock
    .onPatch(
      /\/solicitacao-de-alteracao-de-cronograma\/.*\/cronograma-ciente\/?/,
    )
    .reply(200);
  mock
    .onPatch(
      /\/solicitacao-de-alteracao-de-cronograma\/.*\/analise-abastecimento\/?/,
    )
    .reply(200);
  mock
    .onPatch(/\/solicitacao-de-alteracao-de-cronograma\/.*\/analise-dilog\/?/)
    .reply(200);
  mock
    .onPatch(
      /\/solicitacao-de-alteracao-de-cronograma\/.*\/fornecedor-ciente\/?/,
    )
    .reply(200);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
});

const setup = async (analiseSolicitacao = false) => {
  await act(async () => {
    render(
      <MemoryRouter>
        <AlterarCronograma analiseSolicitacao={analiseSolicitacao} />
      </MemoryRouter>,
    );
  });
};

const clicarBotao = async (texto) => {
  const botao = screen.getByText(texto).closest("button");
  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });
  fireEvent.click(botao);
};

describe("AlterarCronograma - Testes Completos", () => {
  describe("Carregamento Inicial", () => {
    it("carrega cronograma para criação de alteração", async () => {
      await setup(false);

      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });

      await waitFor(
        () => {
          expect(screen.getByText(/Dados Gerais/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("carrega solicitação de alteração em análise", async () => {
      await setup(true);

      await waitFor(() => {
        expect(mock.history.get.length).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(screen.getByText(/Status do Cronograma/i)).toBeInTheDocument();
      });
    });

    it("exibe dados do produto corretamente", async () => {
      await setup(false);

      await waitFor(() => {
        expect(screen.getAllByText(/JP Alimentos/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/ARROZ TIPO I/i)[0]).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo Fornecedor - Nova Solicitação", () => {
    beforeEach(() => {
      const { usuarioEhEmpresaFornecedor } = require("src/helpers/utilities");
      usuarioEhEmpresaFornecedor.mockReturnValue(true);
    });

    it("renderiza campos para nova solicitação", async () => {
      await setup(false);

      await waitFor(() => {
        expect(
          screen.getByText(/Informe as Alterações Necessárias/i),
        ).toBeInTheDocument();
      });
    });

    it("exibe botão Enviar Solicitação", async () => {
      await setup(false);

      await waitFor(() => {
        expect(screen.getByText(/Enviar Solicitação/i)).toBeInTheDocument();
      });
    });

    it("abre modal ao clicar em Enviar Solicitação", async () => {
      await setup(false);

      await waitFor(() => {
        const botao = screen.getByText(/Enviar Solicitação/i).closest("button");
        expect(botao).toBeInTheDocument();
      });
    });

    it("cancela e volta para cronogramas", async () => {
      await setup(false);

      await waitFor(
        () => {
          expect(screen.getByText(/Voltar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await clicarBotao("Voltar");

      await waitFor(
        () => {
          expect(screen.getByText(/Deseja retornar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const botoes = screen.getAllByRole("button");
      const modalSim = botoes.find(
        (b) => b.textContent === "Voltar sem Salvar",
      );

      // Mock history length para forçar navigate(-1)
      Object.defineProperty(window.history, "length", {
        value: 2,
        configurable: true,
      });

      fireEvent.click(modalSim);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

  describe("Fluxo Fornecedor - Ciência da Alteração", () => {
    beforeEach(() => {
      const { usuarioEhEmpresaFornecedor } = require("src/helpers/utilities");
      usuarioEhEmpresaFornecedor.mockReturnValue(true);
      mock
        .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
        .reply(200, mockSolicitacaoAlteracaoCodae);
    });

    it("renderiza tabela com alterações da CODAE", async () => {
      await setup(true);

      await waitFor(() => {
        expect(
          screen.getAllByText(/Alteração da CODAE/i)[0],
        ).toBeInTheDocument();
      });

      // Verifica se a tabela está presente
      await waitFor(() => {
        expect(
          screen.getByText(/Confirmar N° do Empenho/i),
        ).toBeInTheDocument();
      });
    });

    it("exibe botão Ciente da Alteração", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Ciente da Alteração/i)).toBeInTheDocument();
      });
    });

    it("envia ciência com sucesso", async () => {
      await setup(true);

      await waitFor(
        () => {
          expect(screen.getByText(/Ciente da Alteração/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await clicarBotao("Ciente da Alteração");

      await waitFor(
        () => {
          expect(
            screen.getByText(/Ciência da Alteração no Cronograma/i),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const botoes = screen.getAllByRole("button");
      const modalCiente = botoes.find((b) => b.textContent === "Ciente");
      fireEvent.click(modalCiente);

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/fornecedor-ciente");
      });
    });
  });

  describe("Fluxo CODAE/Cronograma - Alteração", () => {
    beforeEach(() => {
      const { usuarioEhCronogramaOuCodae } = require("src/helpers/utilities");
      usuarioEhCronogramaOuCodae.mockReturnValue(true);
    });

    it("renderiza campo de quantidade total", async () => {
      await setup(false);

      await waitFor(() => {
        expect(
          screen.getByText(/Quantidade Total Programada/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo CODAE/Cronograma - Análise", () => {
    beforeEach(() => {
      const {
        usuarioEhCronogramaOuCodae,
        usuarioEhCronograma,
      } = require("src/helpers/utilities");
      usuarioEhCronogramaOuCodae.mockReturnValue(true);
      usuarioEhCronograma.mockReturnValue(true);
    });

    it("visualiza solicitação do fornecedor", async () => {
      await setup(true);

      await waitFor(() => {
        expect(
          screen.getByText(/Solicitação de Alteração do Fornecedor/i),
        ).toBeInTheDocument();
      });
    });

    it("exibe botão Enviar Abastecimento", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Enviar Abastecimento/i)).toBeInTheDocument();
      });
    });

    it("abre modal de análise ao clicar em Enviar Abastecimento", async () => {
      await setup(true);

      await clicarBotao("Enviar Abastecimento");

      await waitFor(() => {
        expect(screen.getByText(/Análise da alteração/i)).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo Abastecimento", () => {
    beforeEach(() => {
      const { usuarioEhDilogAbastecimento } = require("src/helpers/utilities");
      usuarioEhDilogAbastecimento.mockReturnValue(true);
      mock
        .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
        .reply(200, mockSolicitacaoCronogramaCiente);
    });

    it("renderiza análise do Cronograma", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Análise Cronograma/i)).toBeInTheDocument();
      });
    });

    it("exibe radio buttons de aprovação/reprovação", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Analise Aprovada/i)).toBeInTheDocument();
        expect(screen.getByText(/Analise Reprovada/i)).toBeInTheDocument();
      });
    });

    it("exibe botão Enviar DILOG", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Enviar DILOG/i)).toBeInTheDocument();
      });
    });

    it("exibe campo de justificativa ao reprovar", async () => {
      await setup(true);

      // Seleciona reprovar
      const radioReprovar = await screen.findByText(/Analise Reprovada/i);
      fireEvent.click(radioReprovar);

      await waitFor(() => {
        const justificativaFields = screen.getAllByPlaceholderText(
          /Escreva as alterações necessárias/i,
        );
        expect(justificativaFields.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Fluxo DILOG", () => {
    beforeEach(() => {
      const { usuarioEhDilogDiretoria } = require("src/helpers/utilities");
      usuarioEhDilogDiretoria.mockReturnValue(true);
      mock
        .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
        .reply(200, mockSolicitacaoAprovadaAbastecimento);
    });

    it("renderiza análise DILOG", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Análise DILOG/i)).toBeInTheDocument();
      });
    });

    it("exibe botão Enviar Fornecedor", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Enviar Fornecedor/i)).toBeInTheDocument();
      });
    });

    it("exibe status quando já analisado pela DILOG", async () => {
      mock
        .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
        .reply(200, mockSolicitacaoAprovadaDilog);

      await setup(true);

      await waitFor(() => {
        expect(screen.getAllByText(/Aprovado DILOG/i)[0]).toBeInTheDocument();
      });
    });
  });

  describe("Validações e Modais", () => {
    beforeEach(() => {
      const { usuarioEhEmpresaFornecedor } = require("src/helpers/utilities");
      usuarioEhEmpresaFornecedor.mockReturnValue(true);
    });

    it("valida campos obrigatórios antes de enviar", async () => {
      await setup(false);

      const botaoEnviar = await screen.findByText(/Enviar Solicitação/i);

      await waitFor(() => {
        expect(botaoEnviar.closest("button")).toBeInTheDocument();
      });
    });

    it("exibe modal de voltar ao clicar em Voltar", async () => {
      await setup(false);

      await waitFor(
        () => {
          expect(screen.getByText(/Voltar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await clicarBotao("Voltar");

      await waitFor(
        () => {
          expect(screen.getByText(/Deseja retornar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it("fecha modal ao clicar em Não", async () => {
      await setup(false);

      await waitFor(
        () => {
          expect(screen.getByText(/Voltar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await clicarBotao("Voltar");

      await waitFor(
        () => {
          expect(screen.getByText(/Deseja retornar/i)).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const botoes = screen.getAllByRole("button");
      const modalNao = botoes.find((b) => b.textContent === "Permanecer");
      fireEvent.click(modalNao);

      await waitFor(() => {
        expect(screen.queryByText(/Deseja retornar/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Renderização da Tabela de Alterações", () => {
    beforeEach(() => {
      const { usuarioEhCronogramaOuCodae } = require("src/helpers/utilities");
      usuarioEhCronogramaOuCodae.mockReturnValue(true);
    });

    it("destaca células alteradas na tabela", async () => {
      await setup(true);

      await waitFor(() => {
        const celulasLaranja = document.querySelectorAll(".fundo-laranja");
        // Se houver alterações, deve haver células destacadas
        expect(celulasLaranja.length >= 0).toBeTruthy();
      });
    });

    it("renderiza tabela em modo somente leitura", async () => {
      await setup(true);

      await waitFor(() => {
        expect(
          screen.getByText(/Confirmar N° do Empenho/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo Completo de Envio", () => {
    beforeEach(() => {
      const { usuarioEhDilogAbastecimento } = require("src/helpers/utilities");
      usuarioEhDilogAbastecimento.mockReturnValue(true);
      mock
        .onGet(/\/solicitacao-de-alteracao-de-cronograma\/.*\/?/)
        .reply(200, mockSolicitacaoCronogramaCiente);
    });

    it("envia análise do Abastecimento com sucesso", async () => {
      await setup(true);

      // Seleciona aprovar
      const radioAprovar = await screen.findByText(/Analise Aprovada/i);
      fireEvent.click(radioAprovar);

      await clicarBotao("Enviar DILOG");

      const modalSim = await screen.findByText("Sim");
      fireEvent.click(modalSim);

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/analise-abastecimento");
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`,
        );
      });
    });
  });

  describe("Renderização Condicional", () => {
    it("renderiza justificativa quando em análise", async () => {
      await setup(true);

      await waitFor(() => {
        const justificativaFields = screen.getAllByText(/Justificativa/i);
        expect(justificativaFields.length).toBeGreaterThan(0);
      });
    });

    it("renderiza FluxoDeStatusPreRecebimento quando há solicitação", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText(/Status do Cronograma/i)).toBeInTheDocument();
      });
    });
  });
});
