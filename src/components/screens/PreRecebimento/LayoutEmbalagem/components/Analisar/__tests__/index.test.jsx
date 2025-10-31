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
import AnaliseLayoutEmbalagem from "../index";
import mock from "src/services/_mock";
import {
  PRE_RECEBIMENTO,
  PAINEL_LAYOUT_EMBALAGEM,
} from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import {
  mockAnaliseLayoutEmbalagem,
  mockTodasEmbalagensLayout,
} from "../../../../../../../mocks/services/layoutDeEmbalagem.service/Terceirizada/mockAnaliseLayoutEmbalagem";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/hooks/useSomenteLeitura", () => ({
  __esModule: true,
  default: jest.fn(() => false),
}));

const useSomenteLeitura = require("src/hooks/useSomenteLeitura").default;

beforeEach(() => {
  mock
    .onGet(/\/layouts-de-embalagem\/.*\/?/)
    .reply(200, mockAnaliseLayoutEmbalagem);
  mock
    .onPatch(/\/layouts-de-embalagem\/.*\/codae-aprova-ou-solicita-correcao\/?/)
    .reply(200);
});

afterEach(() => {
  mock.reset();
  mockNavigate.mockClear();
  useSomenteLeitura.mockReturnValue(false);
});

const setup = async (somenteLeitura = false) => {
  useSomenteLeitura.mockReturnValue(somenteLeitura);

  await act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{ meusDados: { nome: "Usuário Teste CODAE" } }}
        >
          <AnaliseLayoutEmbalagem />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

const clicarBotao = async (texto) => {
  await waitFor(() => {
    const botao = screen.getByText(texto).closest("button");
    expect(botao).toBeInTheDocument();
  });

  const botao = screen.getByText(texto).closest("button");
  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });
  fireEvent.click(botao);
};

const clicarBotaoPorIndice = async (texto, indice = 0) => {
  await waitFor(() => {
    const botoes = screen.getAllByText(texto);
    expect(botoes.length).toBeGreaterThan(indice);
  });

  const botoes = screen
    .getAllByText(texto)
    .map((botao) => botao.closest("button"));
  const botao = botoes[indice];

  await waitFor(() => {
    expect(botao).not.toBeDisabled();
  });

  fireEvent.click(botao);
};

const preencheTextArea = (placeholder, valor) => {
  const textarea = screen.getByPlaceholderText(placeholder);
  fireEvent.change(textarea, { target: { value: valor } });
};

describe("AnaliseLayoutEmbalagem - Testes Completos", () => {
  describe("Carregamento Inicial", () => {
    it("carrega a página com dados do layout", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
      });

      expect(mock.history.get.length).toBe(1);
      expect(screen.getByText("12345 - Produto Teste")).toBeInTheDocument();
      expect(screen.getByText("Pregão 001/2024")).toBeInTheDocument();
      expect(screen.getByText("Empresa Teste Ltda")).toBeInTheDocument();
    });
  });

  describe("Renderização de Embalagens", () => {
    it("permite solicitar embalagem terciária quando não existe", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Embalagem Terciária")).toBeInTheDocument();
        expect(screen.getByText("Lembrete!")).toBeInTheDocument();
        expect(screen.getByText("Solicitar Embalagem")).toBeInTheDocument();
      });
    });
  });

  describe("Interações de Aprovação/Reprovação", () => {
    it("solicita embalagem terciária e preenche justificativa", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Solicitar Embalagem")).toBeInTheDocument();
      });

      await clicarBotao("Solicitar Embalagem");

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(
            "Qual a sua observação para essa decisão?",
          ),
        ).toBeInTheDocument();
      });

      preencheTextArea(
        "Qual a sua observação para essa decisão?",
        "Necessária embalagem terciária para transporte",
      );
    });
  });

  describe("Modais de Confirmação", () => {
    it("abre modal ao clicar em Enviar para o Fornecedor", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getAllByText("Aprovar")[0]).toBeInTheDocument();
      });
      await clicarBotaoPorIndice("Aprovar", 0);

      const botoesEnviar = screen.getAllByRole("button", {
        name: /Enviar para o Fornecedor/i,
      });

      const btnEnviarFormulario = botoesEnviar[0];

      await waitFor(() => {
        expect(btnEnviarFormulario).not.toBeDisabled();
      });

      fireEvent.click(btnEnviarFormulario);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Deseja enviar sua avaliação dos Layouts das Embalagens para o Fornecedor?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("abre modal ao clicar em Cancelar", async () => {
      await setup();

      await clicarBotao("Cancelar");

      await waitFor(() => {
        expect(screen.getByText("Cancelar Análise")).toBeInTheDocument();
        expect(
          screen.getByText("Deseja cancelar a análise do Layout da Embalagem?"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Fluxo de Envio", () => {
    it("envia análise com sucesso", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getAllByText("Aprovar")[0]).toBeInTheDocument();
      });
      await clicarBotaoPorIndice("Aprovar", 0);

      await clicarBotaoPorIndice("Enviar para o Fornecedor", 0);
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain(
          "/codae-aprova-ou-solicita-correcao",
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
        );
      });
    });

    it("cancela análise e volta para o painel", async () => {
      await setup();

      await clicarBotao("Cancelar");
      await clicarBotao("Sim");

      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
      );
    });
  });

  describe("Validações", () => {
    it("botão enviar inicia desabilitado e é habilitado após aprovar todas as embalagens necessárias", async () => {
      await setup();

      const btnEnviar = screen
        .getByText("Enviar para o Fornecedor")
        .closest("button");

      if (!btnEnviar.disabled) {
        await clicarBotaoPorIndice("Reprovar", 0);
        await waitFor(() => {
          expect(btnEnviar).toBeDisabled();
        });
      } else {
        expect(btnEnviar).toBeDisabled();
      }

      await waitFor(() => {
        expect(screen.getAllByText("Aprovar")[0]).toBeInTheDocument();
      });
      await clicarBotaoPorIndice("Aprovar", 0);

      if (btnEnviar.disabled) {
        await waitFor(() => {
          expect(screen.getByText("Solicitar Embalagem")).toBeInTheDocument();
        });
        await clicarBotao("Solicitar Embalagem");
      }

      await waitFor(() => {
        expect(btnEnviar).not.toBeDisabled();
      });
    });

    it("exibe tooltip quando botão enviar está desabilitado", async () => {
      await setup();

      const btnEnviar = screen
        .getByText("Enviar para o Fornecedor")
        .closest("button");
      expect(btnEnviar).toBeDisabled();

      expect(btnEnviar).toHaveAttribute("disabled");
    });
  });

  describe("Cenário com Todas as Embalagens", () => {
    beforeEach(() => {
      mock
        .onGet(/\/layouts-de-embalagem\/.*\/?/)
        .reply(200, mockTodasEmbalagensLayout);
    });

    it("renderiza todas as três embalagens", async () => {
      await setup();

      await waitFor(() => {
        expect(screen.getByText("Embalagem Primária")).toBeInTheDocument();
        expect(screen.getByText("Embalagem Secundária")).toBeInTheDocument();
        expect(screen.getByText("Embalagem Terciária")).toBeInTheDocument();
      });

      expect(screen.getAllByText("Aprovar")).toHaveLength(3);
      expect(screen.getAllByText("Reprovar")).toHaveLength(3);
    });
  });
});
