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
import LayoutEmbalagemCorrecaoAtualizacao from "../index";
import mock from "src/services/_mock";
import { PRE_RECEBIMENTO, LAYOUT_EMBALAGEM } from "src/configs/constants";
import { ToastContainer } from "react-toastify";
import {
  mockLayoutEmbalagemReprovado,
  mockLayoutEmbalagemAprovado,
  mockLayoutComTerciaria,
  mockLayoutEmbalagemReprovadoSomenteEmbalagemPrimeria,
} from "src/mocks/services/layoutEmbalagem.service/mockDetalharLayoutEmbalagem";

import { toastSuccess } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/components/Shareable/Toast/dialogs");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Input/InputFile/helper", () => ({
  downloadAndConvertToBase64: jest.fn(() =>
    Promise.resolve("data:image/jpeg;base64,fake-base64-data"),
  ),
  readerFile: jest.fn((file) =>
    Promise.resolve({
      arquivo: `data:${file.type};base64,fake-base64-data`,
      nome: file.name,
    }),
  ),
}));

beforeEach(() => {
  const mockGet = jest.fn().mockReturnValue("mock-uuid-123");
  Object.defineProperty(window, "URLSearchParams", {
    value: jest.fn().mockImplementation(() => ({
      get: mockGet,
    })),
  });

  mock
    .onGet(/\/layouts-de-embalagem\/.*\/?/)
    .reply(200, mockLayoutEmbalagemReprovado);
  mock.onGet(/\/arquivos\/.*\/?/).reply(200, "arquivo");
  mock
    .onPatch(/\/layouts-de-embalagem\/.*\/fornecedor-realiza-correcao\/?/)
    .reply(200);
  mock.onPatch(/\/layouts-de-embalagem\/.*\/?/).reply(200);
});

afterEach(() => {
  mock.reset();
});

const setup = async (atualizar = false) => {
  await act(async () => {
    render(
      <MemoryRouter>
        <LayoutEmbalagemCorrecaoAtualizacao atualizar={atualizar} />
        <ToastContainer />
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

const preencheObservacoes = (valor) => {
  const textarea = screen.getByTestId("observacoes");
  fireEvent.change(textarea, { target: { value: valor } });
};

const simularUpload = (dataTestId, fileName = "arquivo-teste.jpg") => {
  const file = new File(["(⌐□_□)"], fileName, { type: "image/jpeg" });
  const input = screen.getByTestId(dataTestId);
  fireEvent.change(input, { target: { files: [file] } });
};

describe("LayoutEmbalagemCorrecaoAtualizacao - Testes Completos", () => {
  describe("Comportamentos Gerais", () => {
    it("carrega a página com dados do layout", async () => {
      await setup(false);

      await waitFor(() => {
        expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
      });

      // Verifica que a requisição foi feita
      expect(mock.history.get.length).toBe(1);

      expect(screen.getByText("12345 - Produto Teste")).toBeInTheDocument();
      expect(screen.getByText("Pregão 001/2024")).toBeInTheDocument();
    });

    it("cancela e volta para página anterior", async () => {
      await setup(false);
      await clicarBotao("Cancelar");
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`,
      );
    });
  });

  describe("Modo Correção", () => {
    it("exibe seções de embalagem reprovadas corretamente", async () => {
      await setup(false);

      await waitFor(() => {
        expect(screen.getByText("Embalagem Primária")).toBeInTheDocument();
        expect(screen.getByText("Embalagem Secundária")).toBeInTheDocument();
        expect(screen.getAllByText("Correções Necessárias")).toHaveLength(2);
      });
    });

    it("abre modal de confirmação ao enviar correção", async () => {
      await setup(false);

      simularUpload("inserir-arquivo-primaria", "primaria-correcao.jpg");
      await clicarBotao("Enviar Correção");

      await waitFor(() => {
        expect(screen.getAllByText("Enviar Correção")).toHaveLength(2);
        expect(
          screen.getByText(
            "Confirma o envio da correção no layout das embalagens para análise da CODAE?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("envia correção do layout com sucesso", async () => {
      await setup(false);

      simularUpload("inserir-arquivo-primaria", "primaria-correcao.jpg");
      preencheObservacoes("Observações de correção");

      await clicarBotao("Enviar Correção");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain(
          "/fornecedor-realiza-correcao",
        );
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it("fecha modal de confirmação ao clicar em Não", async () => {
      await setup(false);

      simularUpload("inserir-arquivo-primaria", "primaria-correcao.jpg");
      await clicarBotao("Enviar Correção");

      await waitFor(() => {
        expect(screen.getAllByText("Enviar Correção")).toHaveLength(2);
      });

      await clicarBotao("Não");

      await waitFor(() => {
        expect(screen.getAllByText("Enviar Correção")).toHaveLength(1);
      });
    });
  });

  describe("Modo Atualização", () => {
    beforeEach(() => {
      // Configura mock para retornar layout aprovado no modo atualização
      mock
        .onGet(/\/layouts-de-embalagem\/.*\/?/)
        .reply(200, mockLayoutEmbalagemAprovado);
    });

    it("carrega página em modo atualização", async () => {
      await setup(true);

      await waitFor(() => {
        expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
        expect(screen.getByText("Atualizar Layout")).toBeInTheDocument();
      });
    });

    it("abre modal de atualização ao clicar em Atualizar Layout", async () => {
      await setup(true);

      simularUpload("inserir-arquivo-primaria", "nova-primaria.jpg");
      await clicarBotao("Atualizar Layout");

      await waitFor(() => {
        expect(
          screen.getByText("Atualizar Layout da Embalagem"),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Deseja atualizar as imagens deste Layout de Embalagens?",
          ),
        ).toBeInTheDocument();
      });
    });

    it("envia atualização do layout com sucesso", async () => {
      await setup(true);

      simularUpload("inserir-arquivo-primaria", "nova-primaria.jpg");
      simularUpload("inserir-arquivo-secundaria", "nova-secundaria.pdf");
      preencheObservacoes("Observações de atualização");

      await clicarBotao("Atualizar Layout");
      await clicarBotao("Sim");

      await waitFor(() => {
        expect(mock.history.patch.length).toBe(1);
        expect(mock.history.patch[0].url).toContain("/layouts-de-embalagem/");
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it("fecha modal de atualização ao clicar em Não", async () => {
      await setup(true);

      simularUpload("inserir-arquivo-primaria", "nova-primaria.jpg");
      await clicarBotao("Atualizar Layout");

      await waitFor(() => {
        expect(
          screen.getByText("Atualizar Layout da Embalagem"),
        ).toBeInTheDocument();
      });

      await clicarBotao("Não");

      await waitFor(() => {
        expect(
          screen.queryByText("Atualizar Layout da Embalagem"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Testes de Renderização Condicional", () => {
    it("renderiza embalagem terciária quando disponível", async () => {
      mock
        .onGet(/\/layouts-de-embalagem\/.*\/?/)
        .reply(200, mockLayoutComTerciaria);

      await setup(false);

      await waitFor(() => {
        expect(screen.getByText("Embalagem Terciária")).toBeInTheDocument();
      });
    });
  });

  describe("Testes do Enviar Correção com somente uma embalagem", () => {
    it("Testa se o envio foi realizado", async () => {
      mock
        .onGet(/\/layouts-de-embalagem\/.*\/?/)
        .reply(200, mockLayoutEmbalagemReprovadoSomenteEmbalagemPrimeria);

      await setup(false);
      simularUpload("inserir-arquivo-primaria", "primaria-correcao.jpg");
      await clicarBotao("Enviar Correção");

      await waitFor(() => {
        expect(screen.getAllByText("Enviar Correção")).toHaveLength(2);
        expect(
          screen.getByText(
            "Confirma o envio da correção no layout das embalagens para análise da CODAE?",
          ),
        ).toBeInTheDocument();
      });
      clicarBotao("Sim");
      await waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith(
          "Layout atualizado e enviado para análise com sucesso!",
        );
      });
    });
  });

  describe("TagLeveLeite", () => {
    it("exibe a tag LEVE LEITE - PLL quando o programa é LEVE_LEITE", async () => {
      mock.onGet(/\/layouts-de-embalagem\/.*\/?/).reply(200, {
        ...mockLayoutEmbalagemReprovado,
        programa: "LEVE_LEITE",
      });

      await setup(false);

      await waitFor(() => {
        expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
      });
    });

    it("não exibe a tag LEVE LEITE - PLL quando o programa não é LEVE_LEITE", async () => {
      mock.onGet(/\/layouts-de-embalagem\/.*\/?/).reply(200, {
        ...mockLayoutEmbalagemReprovado,
        programa: "ALIMENTACAO_ESCOLAR",
      });

      await setup(false);

      await waitFor(() => {
        expect(screen.queryByText("LEVE LEITE - PLL")).not.toBeInTheDocument();
      });
    });
  });
});
