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

  it("deve exibir cards de módulo inicialmente", () => {
    expect(
      screen.getByTestId("card-logo-gestao-alimentacao"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("card-logo-dieta-especial")).toBeInTheDocument();
    expect(screen.getByTestId("card-logo-gestao-produto")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione um dos módulos acima para"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gerenciar os e-mails Cadastrados"),
    ).toBeInTheDocument();
  });

  it("não deve exibir resultados inicialmente", () => {
    expect(screen.queryByTestId("botao-adicionar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("input-busca")).not.toBeInTheDocument();
  });

  it("deve exibir as informações referentes ao  módulo Gestão de Alimentação", async () => {
    expect(
      screen.getByTestId("card-logo-gestao-alimentacao"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("card-logo-gestao-alimentacao"));

    await waitFor(() => {
      preview.debug();

      expect(
        screen.getByTestId("card-logo-gestao-alimentacao"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("card-logo-dieta-especial"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("card-logo-gestao-produto"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Selecione um dos módulos acima para"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Gerenciar os e-mails Cadastrados"),
      ).toBeInTheDocument();

      const botaoAdicionar = screen.getByTestId("botao-adicionar");
      expect(botaoAdicionar).toBeInTheDocument();
      expect(botaoAdicionar).toHaveTextContent("Adicionar E-mails");

      const inputBusca = screen.getByTestId("input-busca");
      expect(inputBusca).toBeInTheDocument();
      expect(inputBusca).toHaveAttribute(
        "placeholder",
        "Buscar Empresa ou E-mail cadastrado",
      );

      expect(
        screen.getByText(
          "Empresas e E-mails Cadastrados no Módulo de Gestão de Alimentação",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Agro Comercial Porto S.A.")).toBeInTheDocument();
    });
  });
});
