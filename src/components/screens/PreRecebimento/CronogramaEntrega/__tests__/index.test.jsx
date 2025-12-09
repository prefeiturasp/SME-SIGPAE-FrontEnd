import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import CronogramaEntregaPage from "src/pages/PreRecebimento/CronogramaEntregaPage";
import { mockListaCronogramas } from "../../../../../mocks/cronograma.service/mockGetCronogramas";
import { mockListaNomesDistribuidores } from "../../../../../mocks/logistica.service/mockGetNomesDistribuidores";
import { PERFIL, TIPO_SERVICO } from "../../../../../constants/shared";

beforeEach(() => {
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  mock.onGet(`/cronogramas/`).reply(200, mockListaCronogramas);
  mock
    .onGet(`/terceirizadas/lista-nomes-distribuidores/`)
    .reply(200, mockListaNomesDistribuidores);
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CronogramaEntregaPage />
      </MemoryRouter>,
    );
  });
};

const filtrar = () => {
  const btnFiltrar = screen.getByText("Filtrar").closest("button");
  expect(btnFiltrar).not.toBeDisabled();
  fireEvent.click(btnFiltrar);
};

describe("Testa página de Consulta de Cronogramas (Perfil Cronograma)", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.DILOG_CRONOGRAMA);
  });

  it("exibe botao Cadastrar Cronograma", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    const btnFiltrar = screen
      .getByText("Cadastrar Cronograma")
      .closest("button");
    expect(btnFiltrar).not.toBeDisabled();
    fireEvent.click(btnFiltrar);
  });

  it("carrega a página com requisições", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    filtrar();
    await waitFor(() =>
      expect(screen.getByText(`Resultados da Pesquisa`)).toBeInTheDocument(),
    );
  });

  it("preenche campos e Limpa Filtros", async () => {
    await setup();
    await waitFor(() =>
      expect(
        screen.getByText(`Filtrar por Nome do Produto`),
      ).toBeInTheDocument(),
    );

    let inputNumeroFicha = screen.getByTestId("nome_produto");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "FORMIGA" },
    });

    expect(inputNumeroFicha).toHaveValue("FORMIGA");

    const btnLimpar = screen.getByText("Limpar Filtros").closest("button");
    expect(btnLimpar).not.toBeDisabled();
    fireEvent.click(btnLimpar);

    expect(inputNumeroFicha).not.toHaveValue("FORMIGA");
  });

  it("carrega a próxima página de requisições", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    filtrar();

    await waitFor(() =>
      expect(screen.getByText(`Resultados da Pesquisa`)).toBeInTheDocument(),
    );

    const nextButton = screen.getByLabelText("right");
    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(screen.getByText(`Resultados da Pesquisa`)).toBeInTheDocument(),
    );
  });

  it("baixa pdf do cronograma", async () => {
    let createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    filtrar();
    await waitFor(() =>
      expect(screen.getByText(`Resultados da Pesquisa`)).toBeInTheDocument(),
    );

    mock
      .onGet(
        `/cronogramas/${mockListaCronogramas.results[3].uuid}/gerar-pdf-cronograma/`,
      )
      .reply(200, new Blob());

    const btnImprimir = screen.getByTestId("imprimir_3");
    fireEvent.click(btnImprimir);

    expect(screen.getAllByText(`Castilho Perez`)[0]).toBeInTheDocument();
  });

  it("exibe mensagem pra resultado de busca vazio", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    const btnFiltrar = screen.getByText("Filtrar").closest("button");
    expect(btnFiltrar).not.toBeDisabled();

    mock.onGet(`/cronogramas/`).reply(200, { count: 0 });

    fireEvent.click(btnFiltrar);

    await waitFor(() =>
      expect(
        screen.getByText(
          `Não existe informação para os critérios de busca utilizados.`,
        ),
      ).toBeInTheDocument(),
    );
  });
});

describe("Testa página de Consulta de Cronogramas (Perfil Fornecedor)", () => {
  beforeAll(() => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem(
      "tipo_servico",
      TIPO_SERVICO.FORNECEDOR_E_DISTRIBUIDOR,
    );
  });

  it("carrega a página com requisições", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar Cadastros`)).toBeInTheDocument(),
    );

    filtrar();
    await waitFor(() =>
      expect(screen.getByText(`Resultados da Pesquisa`)).toBeInTheDocument(),
    );
  });

  it("verifica exibição de tag PLL nos resultados", async () => {
    await setup();

    filtrar();
    await waitFor(() =>
      expect(screen.getByText(/LEVE LEITE - PLL/i)).toBeInTheDocument(),
    );
  });
});
