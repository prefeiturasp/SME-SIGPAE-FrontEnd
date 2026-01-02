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
        `/cronogramas/${mockGetFichaRecebimentoDetalhada.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`,
      )
      .reply(200, mockCronogramaCadastroRecebimento);
    mock
      .onGet(`/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhada.uuid}/`)
      .reply(200, {
        ...mockGetFichaRecebimentoDetalhada,
        arquivos: [
          {
            nome: "teste.pdf",
            arquivo:
              "http://teste/media/arquivos_fichas_de_recebimentos/ec5fd0b5-5238-4633-8da7-1ed52abbceee.pdf",
          },
        ],
      });

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
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza dados principais da ficha", async () => {
    expect(
      await screen.findByText(
        mockGetFichaRecebimentoDetalhada.dados_cronograma.numero,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockCronogramaCadastroRecebimento.results.contrato),
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
        }),
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
        mockCronogramaCadastroRecebimento.results.contrato,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockCronogramaCadastroRecebimento.results.fornecedor),
    ).toBeInTheDocument();
  });

  it("Abre o collapse 'Conferência das Rotulagens' e exibe observações", async () => {
    const collapseTitulo = screen.getByText("Conferência das Rotulagens", {
      selector: "span",
    });
    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText("Observações da Conferência:"),
    ).toBeInTheDocument();
  });

  it("Abre o collapse 'Observações' e exibe os documentos anexados", async () => {
    const collapseTitulo = screen.getByText("Observações", {
      selector: "span",
    });
    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText("Descreva as observações necessárias:"),
    ).toBeInTheDocument();

    expect(screen.getByText("Visualizar Anexo")).toBeInTheDocument();
  });

  it("Deve renderizar a TagLeveLeite", async () => {
    const collapseTitulo = screen.getByText("Dados do Cronograma de Entregas");
    fireEvent.click(collapseTitulo);

    const tagLeveLeite = document.querySelector(".tag-leve-leite");
    expect(tagLeveLeite).toBeInTheDocument();
    expect(tagLeveLeite).toHaveTextContent("LEVE LEITE - PLL");
  });
});

describe("Testes quando reposicao_cronograma.tipo é Credito", () => {
  beforeEach(async () => {
    const mockFichaComCredito = {
      ...mockGetFichaRecebimentoDetalhada,
      reposicao_cronograma: {
        tipo: "Credito",
        descricao: "Crédito",
      },
      observacao: "Observação de crédito",
      arquivos: [
        {
          nome: "teste.pdf",
          arquivo:
            "https://teste/media/arquivos_fichas_de_recebimentos/ec5fd0b5-5238-4633-8da7-1ed52abbceee.pdf",
        },
      ],
    };

    mock
      .onGet(
        `/cronogramas/${mockFichaComCredito.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`,
      )
      .reply(200, mockCronogramaCadastroRecebimento);
    mock
      .onGet(`/fichas-de-recebimento/${mockFichaComCredito.uuid}/`)
      .reply(200, mockFichaComCredito);

    Object.defineProperty(window, "location", {
      value: {
        search: `?uuid=${mockFichaComCredito.uuid}`,
      },
      writable: true,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Detalhar />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("Não renderiza collapses específicos quando reposicao_cronograma.tipo é Credito", async () => {
    const collapsesNaoRenderizados = [
      "Laudos",
      "Veículos e Quantidade do Recebimento",
      "Conferência das Rotulagens",
      "Ocorrências",
      "Observações",
    ];

    const collapsesRenderizados = [
      "Dados do Cronograma de Entregas",
      "Etapas, Partes e Datas do Recebimento",
    ];

    collapsesNaoRenderizados.forEach((titulo) => {
      expect(screen.queryByText(titulo)).not.toBeInTheDocument();
    });

    collapsesRenderizados.forEach((titulo) => {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    });
  });

  it("Renderiza informações de crédito na seção de Etapas, Partes e Datas", async () => {
    const collapseTitulo = screen.getByText(
      "Etapas, Partes e Datas do Recebimento",
      {
        selector: "span",
      },
    );
    fireEvent.click(collapseTitulo);

    expect(
      await screen.findByText(
        "Referente a ocorrência registrada nesta etapa, o Fornecedor optou por:",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Crédito")).toBeInTheDocument();
    expect(screen.getByText("Observações:")).toBeInTheDocument();
    expect(screen.getByText("Observação de crédito")).toBeInTheDocument();
    expect(screen.getByText("Visualizar Anexo")).toBeInTheDocument();
  });

  it("Renderiza anexos na seção de Etapas quando é crédito", async () => {
    const collapseTitulo = screen.getByText(
      "Etapas, Partes e Datas do Recebimento",
      {
        selector: "span",
      },
    );
    fireEvent.click(collapseTitulo);

    expect(await screen.findByText("Visualizar Anexo")).toBeInTheDocument();
  });
});
