import "@testing-library/jest-dom";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import CadastroCronograma from "..";
import { mockListaDistribuidores } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaDistribuidores";
import { mockListaEmpresas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaEmpresas";
import { mockListaFichasTecnicasSimplesAprovadas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas";
import { mockListaUnidadesMedidaLogistica } from "../../../../../mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaRascunhos } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaRascunhos";
import { mockListaTiposEmbalagens } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaTiposEmbalagens";
import { mockGetOpcoesEtapas } from "src/mocks/cronograma.service/mockGetOpcoesEtapas";
import mock from "src/services/_mock";

describe("Testes da interface de Cadastro de Cronograma", () => {
  beforeEach(async () => {
    mock
      .onGet("/ficha-tecnica/lista-simples-aprovadas/")
      .reply(200, mockListaFichasTecnicasSimplesAprovadas);
    mock
      .onGet("/terceirizadas/lista-nomes-distribuidores/")
      .reply(200, mockListaDistribuidores);
    mock
      .onGet("/terceirizadas/lista-empresas-cronograma/")
      .reply(200, mockListaEmpresas);
    mock
      .onGet("/unidades-medida-logistica/lista-nomes-abreviacoes/")
      .reply(200, mockListaUnidadesMedidaLogistica);
    mock.onGet("/cronogramas/rascunhos/").reply(200, mockListaRascunhos);
    mock
      .onGet("/tipos-embalagens/lista-tipos-embalagens/")
      .reply(200, mockListaTiposEmbalagens);
    mock.onGet("/cronogramas/opcoes-etapas/").reply(200, mockGetOpcoesEtapas);
    mock.onGet("/feriados-ano/ano-atual-e-proximo/").reply(200, {
      results: [
        { data: "2025-01-01", descricao: "Ano novo" },
        { data: "2025-12-25", descricao: "Natal" },
      ],
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CadastroCronograma />
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar a interface corretamente", () => {
    expect(screen.getByText("Pesquisar Empresa")).toBeInTheDocument();
    expect(screen.getByText("Nº do Contrato")).toBeInTheDocument();
    expect(
      screen.getByText("Nº do Pregão Eletrônico/Chamada Pública"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nº ATA")).toBeInTheDocument();
    expect(
      screen.getByText("Nº do Processo SEI - Contratos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Assinar e Enviar Cronograma")).toBeInTheDocument();
    expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
  });

  it("Preenche campo empresa e verifica exibição opção PLL", async () => {
    const empresa = screen.getByTestId("input-empresa").querySelector("input");
    fireEvent.focus(empresa);
    fireEvent.change(empresa, {
      target: { value: "Empresa do Luis Zimmermann" },
    });

    expect(empresa.value).toBe("Empresa do Luis Zimmermann");

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-contrato")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    const opcaoContrato = await screen.findByText(/LEVE LEITE - PLL/i);
    expect(opcaoContrato).toBeInTheDocument();
    fireEvent.click(opcaoContrato);

    await waitFor(() => {
      expect(screen.getByTestId("select-contrato").textContent).toContain(
        "LEVE LEITE - PLL",
      );
      expect(screen.getByText("Dados do Produto")).toBeInTheDocument();
      expect(screen.getByText("Dados do Recebimento")).toBeInTheDocument();
    });
  });

  it("não deve gerar warning de keys duplicadas ao renderizar empresas com mesmo nome", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const empresa = screen.getByTestId("input-empresa").querySelector("input");
    fireEvent.focus(empresa);
    fireEvent.change(empresa, {
      target: { value: "PETISTICO PET LTDA" },
    });

    await waitFor(() => {
      expect(empresa.value).toBe("PETISTICO PET LTDA");
    });

    // Verifica se houve warning de keys duplicadas
    const warningsDuplicateKeys = consoleErrorSpy.mock.calls.filter((call) =>
      String(call[0]).includes("Encountered two children with the same key"),
    );

    expect(warningsDuplicateKeys).toHaveLength(0);

    consoleErrorSpy.mockRestore();
  });
});
