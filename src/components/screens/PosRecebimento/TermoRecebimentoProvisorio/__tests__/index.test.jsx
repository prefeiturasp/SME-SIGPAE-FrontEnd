import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { saveAs } from "file-saver";
import mock from "src/services/_mock";
import TermoRecebimentoProvisorio from "../index";
import {
  CADASTRO_TERMO_RECEBIMENTO_PROVISORIO,
  POS_RECEBIMENTO,
} from "src/configs/constants";
import { PERFIL } from "src/constants/shared";
import {
  mockListaTermosRecebimento,
  mockListaTermosRecebimentoVazia,
} from "src/mocks/services/posRecebimento.service/mockListaTermosRecebimento";

jest.mock("file-saver", () => ({ saveAs: jest.fn() }));

const mockListaComStatus = (status) => ({
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      uuid: "uuid-dilog",
      numero_contrato: "123/2025",
      nome_empresa: "Empresa Alfa",
      data_cadastro: "01/08/2025",
      status,
      status_display: status,
    },
  ],
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <TermoRecebimentoProvisorio />
      </MemoryRouter>,
    );
  });
};

const clicarFiltrar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId("botao-filtrar"));
  });
};

describe("TermoRecebimentoProvisorio - Listagem e Filtros", () => {
  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);

    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimento);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe o botão Cadastrar Termo apontando para a rota de cadastro", async () => {
    await setup();

    const botao = screen.getByText("Cadastrar Termo");
    expect(botao.closest("a")).toHaveAttribute(
      "href",
      `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_PROVISORIO}`,
    );
  });

  it("NÃO realiza busca ao carregar a página (só ao filtrar)", async () => {
    await setup();

    expect(mock.history.get.length).toBe(0);
    expect(screen.queryByText("Resultado da Pesquisa")).not.toBeInTheDocument();
  });

  it("renderiza a listagem com os termos ao clicar em Filtrar", async () => {
    await setup();
    await clicarFiltrar();

    expect(
      await screen.findByText("Resultado da Pesquisa"),
    ).toBeInTheDocument();

    expect(screen.getByText("123/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Alfa")).toBeInTheDocument();
    expect(screen.getByText("456/2025")).toBeInTheDocument();
    expect(screen.getByText("Empresa Beta")).toBeInTheDocument();
  });

  it("exibe 'Nenhum resultado encontrado' ao filtrar sem resultados", async () => {
    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimentoVazia);

    await setup();
    await clicarFiltrar();

    expect(
      await screen.findByText("Nenhum resultado encontrado"),
    ).toBeInTheDocument();
  });

  it("envia o filtro de empresa na requisição ao clicar em Filtrar", async () => {
    await setup();

    const inputEmpresa = screen.getByTestId("nome_empresa");
    fireEvent.change(inputEmpresa, { target: { value: "Empresa Alfa" } });

    await clicarFiltrar();

    await waitFor(() => {
      const enviouFiltro = mock.history.get.some(
        (call) => call.params?.get?.("nome_empresa") === "Empresa Alfa",
      );
      expect(enviouFiltro).toBe(true);
    });
  });

  it("Não realiza busca ao clicar em Limpar Filtros", async () => {
    await setup();

    await act(async () => {
      fireEvent.click(screen.getByText("Limpar Filtros"));
    });

    expect(mock.history.get.length).toBe(0);
    expect(screen.queryByText("Resultado da Pesquisa")).not.toBeInTheDocument();
  });
});

describe("TermoRecebimentoProvisorio - Download do Termo em PDF", () => {
  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
    mock.reset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe o ícone de impressora quando as três assinaturas foram concluídas", async () => {
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaComStatus("ENVIADO_DILOG"));

    await setup();
    await clicarFiltrar();

    expect(await screen.findByTestId("btnImprimir")).toBeInTheDocument();
  });

  it("não exibe o ícone de impressora com assinaturas pendentes", async () => {
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaComStatus("ENVIADO_FISCAIS"));

    await setup();
    await clicarFiltrar();

    expect(await screen.findByText("Empresa Alfa")).toBeInTheDocument();
    expect(screen.queryByTestId("btnImprimir")).not.toBeInTheDocument();
  });

  it("não exibe o ícone para perfis fora da história", async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_ABASTECIMENTO);
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaComStatus("ENVIADO_DILOG"));

    await setup();
    await clicarFiltrar();

    expect(await screen.findByText("Empresa Alfa")).toBeInTheDocument();
    expect(screen.queryByTestId("btnImprimir")).not.toBeInTheDocument();
  });

  it("realiza o download do PDF ao acionar o ícone de impressora", async () => {
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaComStatus("ENVIADO_DILOG"));
    mock
      .onGet("/pos-recebimento/termos/uuid-dilog/gerar-pdf-termo/")
      .reply(200, new Blob(["pdf"], { type: "application/pdf" }));
    saveAs.mockClear();

    await setup();
    await clicarFiltrar();

    await act(async () => {
      fireEvent.click(await screen.findByTestId("btnImprimir"));
    });

    await waitFor(() => {
      expect(
        mock.history.get.some((call) => call.url.includes("gerar-pdf-termo")),
      ).toBe(true);
    });
    expect(saveAs).toHaveBeenCalled();
  });
});
