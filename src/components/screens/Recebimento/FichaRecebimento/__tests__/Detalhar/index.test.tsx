import "@testing-library/jest-dom";
import {
  render,
  screen,
  act,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import { ToastContainer } from "react-toastify";
import { mockGetFichaRecebimentoDetalhada } from "src/mocks/services/fichaRecebimento.service/mockGetFichaRecebimentoDetalhada";
import Detalhar from "../../components/Detalhar";
import mock from "src/services/_mock";
import type { VeiculoPayload } from "../../interfaces";

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

    window.history.pushState(
      {},
      "",
      `?uuid=${mockGetFichaRecebimentoDetalhada.uuid}`,
    );

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

  it("Exibe numero_chamada_publica quando ata nao existe", async () => {
    const mockCronogramaSemAta = {
      ...mockCronogramaCadastroRecebimento,
      results: {
        ...mockCronogramaCadastroRecebimento.results,
        ata: "",
        numero_chamada_publica: "6364/SME/CODAE/3666",
      },
    };

    cleanup();
    mock.reset();
    mock
      .onGet(
        `/cronogramas/${mockGetFichaRecebimentoDetalhada.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`,
      )
      .reply(200, mockCronogramaSemAta);
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

    await act(async () => {
      render(
        <MemoryRouter>
          <Detalhar />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    const collapseTitulo = screen.getByText("Dados do Cronograma de Entregas", {
      selector: "span",
    });
    fireEvent.click(collapseTitulo);

    expect(await screen.findByText("6364/SME/CODAE/3666")).toBeInTheDocument();
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

  it("Exibe a coluna Qtde Recebida na tabela de Laudos com valor formatado", async () => {
    const collapseTitulo = screen.getByText("Laudos");
    fireEvent.click(collapseTitulo);

    expect(screen.getByText("Qtde Recebida")).toBeInTheDocument();

    expect(await screen.findByText("13.000,00 kg")).toBeInTheDocument();
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

    window.history.pushState({}, "", `?uuid=${mockFichaComCredito.uuid}`);

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

describe("Campos dos veículos conforme a categoria do produto", () => {
  const veiculosParaTeste: VeiculoPayload[] = [
    {
      ...mockGetFichaRecebimentoDetalhada.veiculos[0],
      numero: "Veículo 1",
      placa: "ABC1D23",
      numero_nota_fiscal: "123456",
      quantidade_nota_fiscal: "1300.00",
      quantidade_recebida: "1250.50",
      temperatura_recebimento: "8",
      temperatura_produto: "4",
      lacre: "100001",
      numero_sif_sisbi_sisp: "1234",
      termografo: true,
    },
    {
      ...mockGetFichaRecebimentoDetalhada.veiculos[0],
      numero: "Veículo 2",
      placa: "DEF4G56",
      numero_nota_fiscal: "654321",
      quantidade_nota_fiscal: "650.00",
      quantidade_recebida: "625.75",
      temperatura_recebimento: "7",
      temperatura_produto: "3",
      lacre: "100002",
      numero_sif_sisbi_sisp: "5678",
      termografo: false,
    },
  ];
  const camposExclusivosDePereciveis = [
    "T ºC (Área de Recebimento):",
    "T ºC (Produto):",
    "Lacre:",
    "Nº SIF, SISBI ou SISP:",
    "Termógrafo:",
  ];

  beforeEach(() => {
    mock.reset();
  });

  const renderizarDetalhamento = async (
    categoria: "PERECIVEIS" | "NAO_PERECIVEIS",
    veiculos = veiculosParaTeste,
  ) => {
    const produto =
      categoria === "PERECIVEIS" ? "CARNE BOVINA" : "LEITE EM PO INTEGRAL";
    const ficha = {
      ...mockGetFichaRecebimentoDetalhada,
      status: "Assinado CODAE",
      veiculos,
    };
    mock.onGet(`/fichas-de-recebimento/${ficha.uuid}/`).reply(200, ficha);
    mock
      .onGet(
        `/cronogramas/${ficha.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`,
      )
      .reply(200, {
        ...mockCronogramaCadastroRecebimento,
        results: {
          ...mockCronogramaCadastroRecebimento.results,
          uuid: ficha.dados_cronograma.uuid,
          categoria,
          produto,
        },
      });
    window.history.pushState({}, "", `?uuid=${ficha.uuid}`);

    await act(async () => {
      render(
        <MemoryRouter>
          <Detalhar />
        </MemoryRouter>,
      );
    });
    await screen.findByText(produto);

    const cabecalho = screen
      .getByText("Veículos e Quantidade do Recebimento")
      .closest(".card-header");
    if (!cabecalho) throw new Error("Cabeçalho dos veículos não encontrado.");
    fireEvent.click(within(cabecalho as HTMLElement).getByRole("button"));

    const secao = document.getElementById("veiculosQuantidadeRecebimento");
    if (!secao) throw new Error("Seção dos veículos não encontrada.");
    return within(secao);
  };

  it("Oculta campos exclusivos de perecíveis em produtos não perecíveis", async () => {
    const secao = await renderizarDetalhamento("NAO_PERECIVEIS");

    camposExclusivosDePereciveis.forEach((campo) => {
      expect(secao.queryByText(campo)).not.toBeInTheDocument();
    });
    expect(secao.queryByText("100001")).not.toBeInTheDocument();
    expect(secao.queryByText("1234")).not.toBeInTheDocument();
  });

  it("Mantém os campos exclusivos e seus valores em produtos perecíveis", async () => {
    const secao = await renderizarDetalhamento("PERECIVEIS");

    camposExclusivosDePereciveis.forEach((campo) => {
      expect(secao.getAllByText(campo)).toHaveLength(2);
    });
    expect(secao.getByText("100001")).toBeInTheDocument();
    expect(secao.getByText("100002")).toBeInTheDocument();
    expect(secao.getByText("1234")).toBeInTheDocument();
    expect(secao.getByText("5678")).toBeInTheDocument();
    expect(secao.getByText("SIM")).toBeInTheDocument();
    expect(secao.getByText("NÃO")).toBeInTheDocument();
  });

  it.each(["PERECIVEIS", "NAO_PERECIVEIS"] as const)(
    "Exibe nota fiscal e quantidade recebida de cada veículo em %s",
    async (categoria) => {
      const secao = await renderizarDetalhamento(categoria);
      const notasFiscais = secao.getAllByText("Nº Nota Fiscal:");
      const quantidadesRecebidas = secao.getAllByText("Quantidade Recebida:");

      expect(notasFiscais).toHaveLength(2);
      expect(quantidadesRecebidas).toHaveLength(2);
      expect(notasFiscais[0]).toHaveTextContent("Nº Nota Fiscal: 123456");
      expect(notasFiscais[1]).toHaveTextContent("Nº Nota Fiscal: 654321");
      expect(quantidadesRecebidas[0]).toHaveTextContent(
        "Quantidade Recebida: 1.250,50",
      );
      expect(quantidadesRecebidas[1]).toHaveTextContent(
        "Quantidade Recebida: 625,75",
      );
      expect(secao.getByText("Veículo 1")).toBeInTheDocument();
      expect(secao.getByText("Veículo 2")).toBeInTheDocument();
      expect(secao.getByText("ABC1D23")).toBeInTheDocument();
      expect(secao.getByText("DEF4G56")).toBeInTheDocument();
    },
  );

  it("Exibe quantidade recebida igual a zero sem ocultar o valor", async () => {
    const secao = await renderizarDetalhamento("NAO_PERECIVEIS", [
      { ...veiculosParaTeste[0], quantidade_recebida: "0.00" },
    ]);

    expect(secao.getByText("Quantidade Recebida:")).toHaveTextContent(
      "Quantidade Recebida: 0,00",
    );
  });
});
