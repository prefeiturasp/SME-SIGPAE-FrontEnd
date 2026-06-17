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
import { mockGetOpcoesEtapas } from "src/mocks/cronograma.service/mockGetOpcoesEtapas";
import { mockGetRascunhoCronograma } from "src/mocks/services/cronograma.service/mockGetRascunhoCronograma";
import mock from "src/services/_mock";

describe("Testes da interface de Cadastro de Cronograma - Edição", () => {
  beforeEach(async () => {
    const setWindowLocation = (search) => {
      window.history.pushState({}, "", `${window.location.pathname}${search}`);
    };

    const uuid_cronograma = "a8f9879e-9f80-4d71-91b4-b30f713477a1";

    mock.onGet("/ficha-tecnica/lista-simples-aprovadas/").reply(200, {
      results: [
        ...mockListaFichasTecnicasSimplesAprovadas.results,
        {
          uuid: "pp-uuid-123",
          numero: "FT-PP-01",
          produto: { nome: "LARANJA" },
          flv_ponto_a_ponto: true,
          uuid_empresa: mockListaEmpresas.results[7].uuid,
        },
      ],
    });
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
    mock
      .onGet("/interrupcao-programada-entrega/datas-bloqueadas-armazenavel/")
      .reply(200, {
        results: ["2025-01-01", "2025-12-25"],
      });
    mock
      .onGet(`/cronogramas/${uuid_cronograma}/`)
      .reply(200, mockGetRascunhoCronograma);

    setWindowLocation(`?uuid=${mockGetRascunhoCronograma.uuid}`);

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

  it("deve renderizar os dados do rascunho corretamente", () => {
    expect(screen.getByText("Pesquisar Empresa")).toBeInTheDocument();
    const empresa = screen.getByTestId("input-empresa").querySelector("input");
    expect(empresa.value).toBe("JP Alimentos");

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

    const botaoExpandir = screen
      .getByText("Dados do Produto")
      .closest(".card-header")
      .querySelector("button");
    fireEvent.click(botaoExpandir);

    expect(screen.getByText("FT018 - CALDO")).toBeInTheDocument();

    const quantidade = screen.getByTestId("quantidade_0");
    expect(quantidade.value).toBe("100,00");
  });
});
