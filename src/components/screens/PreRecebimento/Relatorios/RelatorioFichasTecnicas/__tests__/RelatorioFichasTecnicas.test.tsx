import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { PERFIL } from "src/constants/shared";

import RelatorioFichasTecnicas from "src/components/screens/PreRecebimento/Relatorios/RelatorioFichasTecnicas";

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () => () => (
  <div data-testid="modal-solicitacao-download">Modal</div>
));

const mockFichasResponse = {
  count: 3,
  results: [
    {
      uuid: "1",
      numero: "FT-001",
      produto: { uuid: "p1", nome: "Arroz" },
      empresa: { uuid: "e1", nome_fantasia: "Fornecedor A" },
      categoria: "Perecíveis",
      programa: "Alimentação Escolar",
      pregao_chamada_publica: "001/2022",
      status: "Aprovada",
    },
    {
      uuid: "2",
      numero: "FT-002",
      produto: { uuid: "p2", nome: "Feijão" },
      empresa: { uuid: "e2", nome_fantasia: "Fornecedor B" },
      categoria: "Não Perecíveis",
      programa: "Leve Leite",
      pregao_chamada_publica: "002/2022",
      status: "Enviada para Correção",
    },
  ],
  totalizadores: {
    "Total de Fichas Aprovadas": 1,
    "Total de Fichas Enviadas para Correção": 1,
    "Total de Fichas Pendentes de Aprovação": 0,
  },
};

const renderComponent = () =>
  render(
    <BrowserRouter>
      <RelatorioFichasTecnicas />
    </BrowserRouter>,
  );

describe("RelatorioFichasTecnicas", () => {
  beforeEach(() => {
    mock.reset();
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);

    mock
      .onGet("/cadastro-produtos-edital/lista-completa-logistica/")
      .reply(200, { results: [] });

    mock
      .onGet("/terceirizadas/lista-empresas-cronograma/")
      .reply(200, { results: [] });

    mock
      .onGet("/ficha-tecnica/listagem-relatorio/")
      .reply(200, mockFichasResponse);

    mock.onGet("/ficha-tecnica/exportar-excel/").reply(200, { detail: "..." });
  });

  it("deve renderizar o título do collapse como 'Filtrar Cadastros'", () => {
    renderComponent();
    expect(screen.getByText("Filtrar Cadastros")).toBeInTheDocument();
  });

  it("deve exibir os campos de filtro (Produto, Empresa, Categoria, Programa, Pregao, Status)", () => {
    renderComponent();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Programa")).toBeInTheDocument();
    expect(
      screen.getByText("Nº de Pregão / Chamada Pública"),
    ).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("deve exibir os cards de totalizadores e grid apos submeter o formulario", async () => {
    renderComponent();

    const filtrarBtn = screen.getByText("Filtrar");
    fireEvent.click(filtrarBtn);

    await waitFor(() => {
      expect(screen.getByText("Total de Fichas Aprovadas")).toBeInTheDocument();
      expect(
        screen.getByText("Total de Fichas Enviadas para Correção"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Total de Fichas Pendentes de Aprovação"),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Arroz")).toBeInTheDocument();
      expect(screen.getByText("Fornecedor A")).toBeInTheDocument();
    });
  });

  it("deve exibir o titulo 'Resultado da Pesquisa' apos consulta", async () => {
    renderComponent();

    const filtrarBtn = screen.getByText("Filtrar");
    fireEvent.click(filtrarBtn);

    await waitFor(() => {
      expect(screen.getByText("Resultado da Pesquisa")).toBeInTheDocument();
    });
  });

  it("deve exibir 'Nenhum resultado encontrado' quando nao houver dados", async () => {
    mock
      .onGet("/ficha-tecnica/listagem-relatorio/")
      .reply(200, { count: 0, results: [], totalizadores: {} });

    renderComponent();

    const filtrarBtn = screen.getByText("Filtrar");
    fireEvent.click(filtrarBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("deve exibir o modal de download apos clicar em 'Baixar em Excel'", async () => {
    renderComponent();

    const filtrarBtn = screen.getByText("Filtrar");
    fireEvent.click(filtrarBtn);

    await waitFor(() => {
      expect(screen.getByText("Resultado da Pesquisa")).toBeInTheDocument();
    });

    const baixarBtn = screen.getByText("Baixar em Excel");
    fireEvent.click(baixarBtn);

    await waitFor(() => {
      expect(
        screen.getByTestId("modal-solicitacao-download"),
      ).toBeInTheDocument();
    });
  });
});
