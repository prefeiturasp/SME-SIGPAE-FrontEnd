import "@testing-library/jest-dom";
import { render, act, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import CadastroCronograma from "..";
import { mockListaDistribuidores } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaDistribuidores";
import { mockListaEmpresas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaEmpresas";
import { mockListaFichasTecnicasSimplesAprovadas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas";
import { mockListaUnidadesMedidaLogistica } from "../../../../../mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaRascunhos } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaRascunhos";
import { mockListaTiposEmbalagens } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaTiposEmbalagens";
import { mockGetCronograma } from "src/mocks/PreRecebimento/CadastroCronograma/mockGetCronograma";
import mock from "src/services/_mock";

describe("Testes da interface de Cadastro de Cronograma", () => {
  beforeEach(async () => {
    mock
      .onGet("/ficha-tecnica/lista-simples/")
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
    mock.onGet(`/cronogramas/${123}/`).reply(200, mockGetCronograma);

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

  const setInput = (id, valor) => {
    const campo = screen.getByTestId(id);
    const input = campo.querySelector("input");
    fireEvent.focus(input);
    fireEvent.change(input, {
      target: { value: valor },
    });
    return input;
  };

  it("Preenche campo Empresa e verifica opções", async () => {
    const empresa = setInput("input-empresa", "Empresa do Luis Zimmermann");
    expect(empresa.value).toBe("Empresa do Luis Zimmermann");
  });
});
