import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import CentralDownloads from "src/components/screens/CentralDownloads";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockDadosDownloads } from "src/mocks/services/centralDeDownloads.service/centralDownloads";
import { renderWithProvider } from "src/utils/test-utils";
import userEvent from "@testing-library/user-event";

describe("Testa a Central de Downloads", () => {
  beforeEach(async () => {
    global.URL.createObjectURL = jest.fn(() => "mock-url");
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
    mock.onGet("/downloads/").reply(200, mockDadosDownloads);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CentralDownloads />
        </MemoryRouter>
      );
    });
  });

  it("Verifica textos dos filtros", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Identificador/i)).toHaveLength(2);
      expect(screen.getAllByText(/Status/i)).toHaveLength(3);
      expect(screen.getAllByText(/Data de Criação/i)).toHaveLength(2);
      expect(screen.getAllByText(/Visto/i)).toHaveLength(4);
      expect(screen.getAllByText(/concluído/i)).toHaveLength(11);
      expect(screen.getAllByText(/em processamento/i)).toHaveLength(1);
      expect(screen.getAllByText(/erro/i)).toHaveLength(1);
      expect(screen.getAllByText(/não visto/i)).toHaveLength(1);
    });
  });

  it("Verifica textos da tabela", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Opções/i)).toHaveLength(1);
      expect(screen.getAllByText(/Concluído/i)).toHaveLength(11);
      expect(screen.getAllByText(/relatorio-adesao.pdf/i)).toHaveLength(5);
      expect(
        screen.getAllByText(
          /relatorio_historico_dietas_especiais_29_05_2025.pdf/i
        )
      ).toHaveLength(2);
      expect(
        screen.getAllByText(/relatorio_dietas_especiais.pdf/i)
      ).toHaveLength(1);
      expect(
        screen.getAllByText(
          "Relatório Medição Inicial - EMEBS HELEN KELLER - 03/2025.pdf"
        )
      ).toHaveLength(1);
      expect(
        screen.getAllByText(
          "Relatório Medição Inicial - CCI/CIPS CAMARA MUNICIPAL DE SAO PAULO - 03/2025.pdf"
        )
      ).toHaveLength(1);

      expect(
        screen.getAllByText(/30\/05\/2025/, { exact: false })
      ).toHaveLength(2);
      expect(
        screen.getAllByText(/12\/06\/2025/, { exact: false })
      ).toHaveLength(1);
      expect(
        screen.getAllByText(/01\/07\/2025/, { exact: false })
      ).toHaveLength(2);
      expect(
        screen.getAllByText(/07\/07\/2025/, { exact: false })
      ).toHaveLength(3);
      expect(
        screen.getAllByText(/08\/07\/2025/, { exact: false })
      ).toHaveLength(1);
    });
  });

  it("Verifica botões", async () => {
    await waitFor(() => {
      const textoLimparFiltros = screen.getAllByText("Limpar Filtros");
      const botaoLimparFiltros = textoLimparFiltros[0].closest("button");
      expect(textoLimparFiltros).toHaveLength(1);
      expect(botaoLimparFiltros).toBeInTheDocument();
      fireEvent.click(botaoLimparFiltros);

      const textoConsultar = screen.getAllByText("Consultar");
      const botaoConsultar = textoConsultar[0].closest("button");
      expect(textoConsultar).toHaveLength(1);
      expect(botaoConsultar).toBeInTheDocument();
      fireEvent.click(botaoConsultar);
    });
  });

  it("Testa a seleção de status", async () => {
    const usuario = userEvent.setup();
    const seletorStatus = screen
      .getByTestId("select-status")
      .querySelector("select");
    const opcoes = within(seletorStatus).getAllByRole("option");
    expect(opcoes).toHaveLength(4);

    const textosDasOpcoes = opcoes.map((opt) => opt.textContent);
    expect(textosDasOpcoes).toEqual([
      "Selecione um Status",
      "Concluído",
      "Em processamento",
      "Erro",
    ]);

    expect(seletorStatus).toHaveValue("");
    expect(seletorStatus).toHaveTextContent("Selecione um Status");

    await usuario.selectOptions(seletorStatus, "Em processamento");
    expect(seletorStatus).toHaveValue("EM_PROCESSAMENTO");
    expect(seletorStatus).toHaveTextContent("Em processamento");

    await usuario.selectOptions(seletorStatus, "Erro");
    expect(seletorStatus).toHaveValue("ERRO");
    expect(seletorStatus).toHaveTextContent("Erro");

    await usuario.selectOptions(seletorStatus, "Concluído");
    expect(seletorStatus).toHaveValue("CONCLUIDO");
    expect(seletorStatus).toHaveTextContent("Concluído");
  });

  it("Testa a seleção de visto", async () => {
    const usuario = userEvent.setup();
    const seletorVisto = screen
      .getByTestId("select-visto")
      .querySelector("select");
    const opcoes = within(seletorVisto).getAllByRole("option");
    expect(opcoes).toHaveLength(3);

    const textosDasOpcoes = opcoes.map((opt) => opt.textContent);
    expect(textosDasOpcoes).toEqual(["Selecione", "Visto", "Não Visto"]);

    expect(seletorVisto).toHaveValue("");
    expect(seletorVisto).toHaveTextContent("Selecione");

    await usuario.selectOptions(seletorVisto, "Visto");
    expect(seletorVisto).toHaveValue("true");
    expect(seletorVisto).toHaveTextContent("Visto");

    await usuario.selectOptions(seletorVisto, "Não Visto");
    expect(seletorVisto).toHaveValue("false");
    expect(seletorVisto).toHaveTextContent("Não Visto");
  });

  it("Testa o input identificador", async () => {
    const usuario = userEvent.setup();
    const campoInput = screen.getByTestId("campo-identificador");

    expect(campoInput).toHaveAttribute("placeholder", "Escreva uma palavra");
    expect(campoInput).toHaveValue("");

    await usuario.type(campoInput, "Texto de teste");
    expect(campoInput).toHaveValue("Texto de teste");
    expect(campoInput).not.toHaveDisplayValue("Escreva uma palavra");

    await usuario.clear(campoInput);
    expect(campoInput).toHaveValue("");
  });

  it("Testa a seleção de data", async () => {
    const usuario = userEvent.setup();
    const datepickerInput = screen
      .getByTestId("select-com-data")
      .querySelector("input");
    expect(datepickerInput).toHaveAttribute("placeholder", "Selecione a Data");
    expect(datepickerInput).toHaveValue("");

    const calendarioIcone = screen
      .getByTestId("select-com-data")
      .querySelector(".fa-calendar-alt");
    await usuario.click(calendarioIcone);
    const datepickerModal = document.querySelector(".react-datepicker");
    expect(datepickerModal).toBeInTheDocument();

    const dia15 = datepickerModal?.querySelector(
      '[role="option"][aria-label*="15 de julho de 2025"]'
    );
    expect(dia15).toBeInTheDocument();
    await usuario.click(dia15);

    const inputViaCalendario = screen
      .getByTestId("select-com-data")
      .querySelector("input");
    expect(inputViaCalendario).toHaveValue("15/07/2025");
    await usuario.clear(inputViaCalendario);

    const inputManual = screen
      .getByTestId("select-com-data")
      .querySelector("input");
    await usuario.type(inputManual, "15/07/2025");
    expect(inputManual).toHaveValue("15/07/2025");
  });

  it("Testa checkbox Visto", async () => {
    const checkboxNaoMarcado = screen.getByTestId(`checkbox-visto-0`);
    expect(checkboxNaoMarcado).not.toBeChecked();

    const checkboxMarcado = screen.getByTestId(`checkbox-visto-1`);
    expect(checkboxMarcado).toBeChecked();
  });

  it("Testa marcação do checkbox Visto", async () => {
    let index = 9;
    mock
      .onPut(`/downloads/marcar-visto/`)
      .reply(200, { mensagem: "Arquivo atualizado com sucesso" });

    const checkboxNaoMarcado = screen.getByTestId(`checkbox-visto-${index}`);
    expect(checkboxNaoMarcado).not.toBeChecked();
    fireEvent.click(checkboxNaoMarcado);
    expect(checkboxNaoMarcado).toBeChecked();
    fireEvent.click(checkboxNaoMarcado);
    expect(checkboxNaoMarcado).not.toBeChecked();
  });

  it("Testa o icone de baixar arquivo com prazo expirado", async () => {
    let index = 2;
    const botaoDownload = screen.getByTestId(`botao-download-${index}`);
    expect(botaoDownload).toBeDisabled();
  });

  it("Testa o icone de deletar arquivo", async () => {
    let index = 3;
    mock
      .onDelete(`/downloads/${mockDadosDownloads.results[index].uuid}/`)
      .reply(204, {});

    const botaoDeleta = screen.getByTestId(`botao-deleta-${index}`);
    expect(botaoDeleta).not.toBeDisabled();
    fireEvent.click(botaoDeleta);

    await waitFor(() => {
      const items = screen.getAllByText(/relatorio-adesao.pdf/i);
      expect(items).toHaveLength(4);
    });
  });

  it("Testa o icone de baixar arquivo com status OK", async () => {
    let index = 0;
    mock
      .onGet(mockDadosDownloads.results[index].arquivo)
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    const botaoDownload = screen.getByTestId(`botao-download-${index}`);
    expect(botaoDownload).not.toBeDisabled();
    fireEvent.click(botaoDownload);
  });
});
