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
import mock from "src/services/_mock";
import TermoRecebimentoDefinitivo from "../index";
import {
  CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
} from "src/configs/constants";
import { PERFIL, TIPO_SERVICO } from "src/constants/shared";
import {
  mockListaTermosRecebimento,
  mockListaTermosRecebimentoFornecedor,
  mockListaTermosRecebimentoVazia,
} from "src/mocks/services/posRecebimento.service/mockListaTermosRecebimento";

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <TermoRecebimentoDefinitivo />
      </MemoryRouter>,
    );
  });
};

const clicarFiltrar = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId("botao-filtrar"));
  });
};

describe("TermoRecebimentoDefinitivo - Listagem e Filtros", () => {
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
      `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`,
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

describe("TermoRecebimentoDefinitivo - Versão Fornecedor", () => {
  const setupFornecedor = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TermoRecebimentoDefinitivo fornecedor />
        </MemoryRouter>,
      );
    });
  };

  const clicarFiltrarFornecedor = async () => {
    await act(async () => {
      fireEvent.click(screen.getByTestId("botao-filtrar"));
    });
  };

  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

    mock.reset();
    mock
      .onGet("/pos-recebimento/termos/")
      .reply(200, mockListaTermosRecebimentoFornecedor);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe os filtros da versão do fornecedor e oculta os exclusivos do CODAE", async () => {
    await setupFornecedor();

    expect(screen.getByText("Filtrar por Produto")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Nº do Contrato")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
    expect(
      screen.getByText("Filtrar por Período de Recebimento"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Filtrar por Empresa")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Filtrar por Nº do Cronograma"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Cadastrar Termo")).not.toBeInTheDocument();
  });

  it("renderiza a coluna Produtos e os status traduzidos ao filtrar", async () => {
    await setupFornecedor();
    await clicarFiltrarFornecedor();

    expect(
      await screen.findByText("Resultado da Pesquisa"),
    ).toBeInTheDocument();

    expect(screen.queryByText("Empresa Contratada")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "BISCOITO DE POLVILHO DOCE, BISCOITO DE POLVILHO SALGADO",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Recebido").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Assinado").length).toBeGreaterThan(0);
  });

  it("exibe Imprimir e Editar apenas para o termo assinado", async () => {
    await setupFornecedor();
    await clicarFiltrarFornecedor();

    expect(await screen.findByText("25/SME/CODAE/2025")).toBeInTheDocument();

    const acoes = screen.getAllByTitle("Detalhar");
    expect(acoes.length).toBe(2);
    expect(screen.getAllByTitle("Imprimir").length).toBe(1);
    expect(screen.getAllByTitle("Alterar").length).toBe(1);
  });

  it("envia o filtro de nº do contrato na requisição ao clicar em Filtrar", async () => {
    await setupFornecedor();

    fireEvent.change(screen.getByTestId("numero_contrato"), {
      target: { value: "25/SME" },
    });

    await clicarFiltrarFornecedor();

    await waitFor(() => {
      const enviouFiltro = mock.history.get.some(
        (call) => call.params?.get?.("numero_contrato") === "25/SME",
      );
      expect(enviouFiltro).toBe(true);
    });
  });

  it("envia o filtro de status agregado do fornecedor na requisição", async () => {
    await setupFornecedor();

    fireEvent.change(screen.getByTestId("status").querySelector("select"), {
      target: { value: "ASSINADO" },
    });

    await clicarFiltrarFornecedor();

    await waitFor(() => {
      const enviouFiltro = mock.history.get.some(
        (call) => call.params?.get?.("status_fornecedor") === "ASSINADO",
      );
      expect(enviouFiltro).toBe(true);
    });
  });
});
