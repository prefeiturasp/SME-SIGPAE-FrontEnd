import "@testing-library/jest-dom";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { ToastContainer } from "react-toastify";
import { mockGetFichaRecebimentoDetalhada } from "src/mocks/services/fichaRecebimento.service/mockGetFichaRecebimentoDetalhada";
import Detalhar from "../../components/Detalhar";
import mock from "src/services/_mock";

describe("Testes de pagína de Detalhes da Ficha de Recebimento", () => {
  beforeEach(async () => {
    mock
      .onGet(
        `/cronogramas/${mockGetFichaRecebimentoDetalhada.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`
      )
      .reply(200, mockCronogramaCadastroRecebimento);
    mock
      .onGet(`/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhada.uuid}/`)
      .reply(200, mockGetFichaRecebimentoDetalhada);

    Object.defineProperty(window, "location", {
      value: {
        search: `?uuid=${mockGetFichaRecebimentoDetalhada.uuid}`,
      },
      writable: true,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Detalhar />
          <ToastContainer />
        </MemoryRouter>
      );
    });
  });

  it("Renderiza dados principais da ficha", async () => {
    expect(
      await screen.findByText(
        mockGetFichaRecebimentoDetalhada.dados_cronograma.numero
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockCronogramaCadastroRecebimento.results.contrato)
    ).toBeInTheDocument();

    expect(screen.getByText("Ficha em PDF")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("Renderiza todos os collapses da ficha de recebimento", async () => {
    const titulos = [
      "Dados do Cronograma de Entregas",
      "Etapas, Partes e Datas do Recebimento",
      "Laudos",
      "Veículos e Quantidade do Recebimento",
      "Conferência das Rotulagens",
      "Ocorrências",
      "Observações",
    ];

    titulos.forEach((titulo) => {
      expect(
        screen.getByText((content) => content.includes(titulo), {
          selector: "span.col-8.titulo",
        })
      ).toBeInTheDocument();
    });
  });

  it("Abre o collapse 'Dados do Cronograma de Entregas' e exibe informações do cronograma", async () => {
    const collapseTitulo = screen.getByText("Dados do Cronograma de Entregas", {
      selector: "span",
    });

    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText(
        mockCronogramaCadastroRecebimento.results.contrato
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockCronogramaCadastroRecebimento.results.fornecedor)
    ).toBeInTheDocument();
  });

  it("Abre o collapse 'Conferência das Rotulagens' e exibe observações", async () => {
    const collapseTitulo = screen.getByText("Conferência das Rotulagens", {
      selector: "span",
    });
    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText("Observações da Conferência:")
    ).toBeInTheDocument();
  });

  it("Abre o collapse 'Observações' e exibe os documentos anexados", async () => {
    const collapseTitulo = screen.getByText("Observações", {
      selector: "span",
    });
    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText("Descreva as observações necessárias:")
    ).toBeInTheDocument();

    expect(screen.getByText("Visualizar Anexo")).toBeInTheDocument();
  });
});
