import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";

import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { mockEmpresas } from "src/mocks/terceirizada.service/mockGetListaSimples";
import { mockEmailporModulo } from "src/mocks/terceirizada.service/mockGetEmailPorModulo";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { renderWithProvider } from "src/utils/test-utils";
import GerenciamentoEmails from "src/components/screens/Configuracoes/GerenciamentoEmails/GerenciamentoEmails";
import preview from "jest-preview";

describe("Testa a configuração de Gerenciamento de E-mails", () => {
  beforeEach(async () => {
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 306 });
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEADMIN);
    mock
      .onGet("/downloads/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    mock.onGet("/terceirizadas/lista-simples/").reply(200, mockEmpresas);
    mock
      .onGet("/terceirizadas/emails-por-modulo/")
      .reply(200, mockEmailporModulo);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <GerenciamentoEmails />
        </MemoryRouter>,
      );
    });
  });

  describe("Estado inicial", () => {
    it("deve exibir os três cards de módulo", () => {
      expect(
        screen.getByTestId("card-logo-gestao-alimentacao"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("card-logo-dieta-especial"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("card-logo-gestao-produto"),
      ).toBeInTheDocument();
    });

    it("deve exibir instrução para selecionar módulo", () => {
      expect(
        screen.getByText("Selecione um dos módulos acima para"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Gerenciar os e-mails Cadastrados"),
      ).toBeInTheDocument();
    });

    it("não deve exibir área de resultados inicialmente", () => {
      expect(screen.queryByTestId("botao-adicionar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("input-busca")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Empresas e E-mails Cadastrados"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Seleção de módulo 'Gestão de Alimentação'", () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId("card-logo-gestao-alimentacao"));
      await waitFor(() => {
        expect(screen.getByTestId("input-busca")).toBeInTheDocument();
      });
    });

    it("deve exibir interface de gerenciamento após selecionar módulo", () => {
      expect(
        screen.getByText(
          "Empresas e E-mails Cadastrados no Módulo de Gestão de Alimentação",
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId("botao-adicionar")).toBeInTheDocument();
      expect(screen.getByTestId("input-busca")).toBeInTheDocument();
    });

    it("deve exibir botão 'Adicionar E-mails' com propriedades corretas", () => {
      const botaoAdicionar = screen.getByTestId("botao-adicionar");

      expect(botaoAdicionar).toBeInTheDocument();
      expect(botaoAdicionar).toHaveTextContent("Adicionar E-mails");
      expect(botaoAdicionar).toHaveAttribute("type", "button");
      expect(botaoAdicionar).toHaveAttribute("data-cy", "Adicionar E-mails");
      expect(botaoAdicionar).toHaveClass(
        "general-button",
        "green-button",
        "float-end",
        "ms-3",
      );
    });

    it("deve exibir input de busca com placeholder correto", () => {
      const inputBusca = screen.getByTestId("input-busca");

      expect(inputBusca).toBeInTheDocument();
      expect(inputBusca).toHaveAttribute(
        "placeholder",
        "Buscar Empresa ou E-mail cadastrado",
      );
      expect(inputBusca).toHaveAttribute("type", "text");
      expect(inputBusca).toHaveAttribute("data-cy", "buscar");
    });

    it("deve carregar e exibir empresas do mock", () => {
      expect(screen.getByText("Agro Comercial Porto S.A.")).toBeInTheDocument();
      expect(
        screen.getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
      ).toBeInTheDocument();
    });

    it("deve exibir paginação quando há resultados", () => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
    });
    preview.debug();
  });
});
