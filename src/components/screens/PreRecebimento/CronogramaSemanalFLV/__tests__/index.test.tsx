import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CronogramaSemanalFLV from "src/components/screens/PreRecebimento/CronogramaSemanalFLV";
import mock from "src/services/_mock";
import { mockGetCronogramasSemanais } from "src/mocks/services/cronogramaSemanal.service/mockGetCronogramasSemanais";
import { mockGetCronogramasMensalAssinados2 } from "src/mocks/services/cronogramaSemanal.service/mockGetCronogramasMensalAssinados";
import { mockListaSimplesTerceirizadas } from "src/mocks/services/terceirizada.service/mockListaSimplesTerceirizadas";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";

import { debug } from "jest-preview";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("CronogramaSemanalFLV - Component", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet("/cronogramas-semanais/").reply(200, mockGetCronogramasSemanais);
    mock
      .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
      .reply(200, mockGetCronogramasMensalAssinados2);
    mock
      .onGet("/terceirizadas/lista-simples/")
      .reply(200, mockListaSimplesTerceirizadas);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", "CODAE - DILOG");
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CronogramaSemanalFLV />
        </MemoryRouter>,
      );
    });
  };

  it("renderiza card de cronograma", async () => {
    await setup();
    await waitFor(() => {
      const card = document.querySelector(".card-cronograma-semanal-flv");
      expect(card).toBeInTheDocument();
    });
  });

  it("exibe botao de cadastrar cronograma", async () => {
    await setup();
    await waitFor(() => {
      expect(screen.getByText("Cadastrar Cronograma")).toBeInTheDocument();
    });
  });

  it("possui estrutura de card-body", async () => {
    await setup();
    await waitFor(() => {
      const cardBody = document.querySelector(".cronograma-semanal-flv");
      expect(cardBody).toBeInTheDocument();
    });
  });

  it("testa a renderização da listagem e dos filtros", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getAllByText("001/2026P")).toHaveLength(10);
      expect(screen.getAllByText("DOCE DE BANANA")).toHaveLength(10);
      expect(screen.getAllByText("1.200,00 kg")).toHaveLength(10);
      expect(screen.getAllByText("JP Alimentos")).toHaveLength(10);
      expect(screen.getAllByText("Rascunho")).toHaveLength(10);
    });

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThan(0);
    expect(comboboxes[0]).toBeInTheDocument();
    expect(comboboxes[0]).not.toBeDisabled();
  });

  it("testa a funcionalidade de filtro", async () => {
    await setup();

    mock.onGet("/cronogramas-semanais/").reply(200, { count: 0, results: [] });

    const inputProduto = screen.getAllByRole("combobox")[0];

    await act(async () => {
      fireEvent.change(inputProduto, { target: { value: "CAJU" } });
      fireEvent.keyDown(inputProduto, { key: "Enter", code: "Enter" });
    });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    await act(async () => {
      if (botaoFiltrar) {
        fireEvent.click(botaoFiltrar);
      }
    });

    await waitFor(() => {
      expect(screen.queryByText("DOCE DE BANANA")).not.toBeInTheDocument();
      expect(screen.queryByText("001/2026P")).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          "Não existe informação para os critérios de busca utilizados.",
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("CronogramaSemanalFLV - Component - Usuário Fornecedor", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet("/cronogramas-semanais/").reply(200, mockGetCronogramasSemanais);
    mock
      .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
      .reply(200, mockGetCronogramasMensalAssinados2);
    mock
      .onGet("/terceirizadas/lista-simples/")
      .reply(200, mockListaSimplesTerceirizadas);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", "JP Alimentos");
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);
  });

  const setupFornecedor = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CronogramaSemanalFLV />
        </MemoryRouter>,
      );
    });
  };

  it("renderiza card de cronograma para fornecedor", async () => {
    await setupFornecedor();
    await waitFor(() => {
      const card = document.querySelector(".card-cronograma-semanal-flv");
      expect(card).toBeInTheDocument();
    });
  });

  it("não exibe coluna Fornecedor na listagem", async () => {
    await setupFornecedor();

    await waitFor(() => {
      expect(screen.getAllByText("001/2026P")).toHaveLength(10);
      expect(screen.getAllByText("DOCE DE BANANA")).toHaveLength(10);
    });

    expect(screen.queryByText("Fornecedor")).not.toBeInTheDocument();

    const gridTable = document.querySelector(".grid-table.sem-fornecedor");
    expect(gridTable).toBeInTheDocument();
  });

  it("exibe status 'Recebido' ao invés de 'Enviado ao Fornecedor'", async () => {
    await setupFornecedor();

    const mockComStatusEnviado = {
      count: 1,
      results: [
        {
          uuid: "cronograma-teste",
          numero: "999/2026P",
          produto: "PRODUTO TESTE",
          quantidade_total: "500.00",
          unidade_medida: "kg",
          empresa: "JP Alimentos",
          status: "Enviado ao Fornecedor",
        },
      ],
    };

    mock.reset();
    mock.onGet("/cronogramas-semanais/").reply(200, mockComStatusEnviado);
    mock
      .onGet("/cronogramas-semanais/cronogramas-mensal-assinados/")
      .reply(200, mockGetCronogramasMensalAssinados2);
    mock
      .onGet("/terceirizadas/lista-simples/")
      .reply(200, mockListaSimplesTerceirizadas);

    await setupFornecedor();

    await waitFor(() => {
      expect(screen.getByText("Recebido")).toBeInTheDocument();
      expect(
        screen.queryByText("Enviado ao Fornecedor"),
      ).not.toBeInTheDocument();
    });
  });

  it("não exibe botão Cadastrar Cronograma para fornecedor", async () => {
    await setupFornecedor();

    await waitFor(() => {
      expect(
        screen.queryByText("Cadastrar Cronograma"),
      ).not.toBeInTheDocument();
    });
  });

  it("exibe filtros corretos para fornecedor", async () => {
    await setupFornecedor();

    debug();

    await waitFor(() => {
      expect(screen.getByText("Filtrar por Produto")).toBeInTheDocument();
      expect(
        screen.getByText("Filtrar por N° do Cronograma"),
      ).toBeInTheDocument();

      expect(screen.queryByText("Filtrar por Empresa")).not.toBeInTheDocument();
    });
  });
});
