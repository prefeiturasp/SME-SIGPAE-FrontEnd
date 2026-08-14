import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ModalRelatorioAnaliseSensorial from "../../components/ModalRelatorioAnaliseSensorial";
import userEvent from "@testing-library/user-event";
import mock from "src/services/_mock";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const setProdutos = jest.fn();
const closeModal = jest.fn();

describe("Testes do Relatório de Análise Sensorial", () => {
  const produto = {
    nome: "Arroz Integral",
    criado_em: "10/08/2026 09:00",
    marca: { nome: "Marca Boa" },
    fabricante: { nome: "Fabricante X" },
    ultima_homologacao: {
      protocolo_analise_sensorial: "AS12345",
      rastro_terceirizada: {
        nome_fantasia: "Terceirizada ABC",
      },
      log_solicitacao_analise: {
        criado_em: "11/08/2026 10:30",
        justificativa: "<p>Produto para análise.</p>",
      },
      resposta_analise: {
        data: "12/08/2026",
        hora: "14:00",
        responsavel_produto: "Maria Silva",
        registro_funcional: "123456",
        criado_em: "13/08/2026 15:00",
        observacao: "Sem observações",
      },
    },
  };

  const filtros = {
    nome_produto: "Arroz",
    data_inicial: "01/08/2026",
    data_final: "31/08/2026",
  };

  const setup = (props = {}) =>
    render(
      <ModalRelatorioAnaliseSensorial
        showModal
        closeModal={closeModal}
        produtos={[produto]}
        setProdutos={setProdutos}
        filtros={filtros}
        produtosCount={20}
        pageSize={10}
        {...props}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();

    Object.defineProperty(window, "URL", {
      writable: true,
      value: {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn(),
      },
    });
  });

  it("deve renderizar as informações do produto", () => {
    setup();

    expect(
      screen.getByText("Relatório de produtos em análise sensorial"),
    ).toBeInTheDocument();

    expect(screen.getByText("Arroz Integral")).toBeInTheDocument();
    expect(screen.getByText("Marca Boa")).toBeInTheDocument();
    expect(screen.getByText("Fabricante X")).toBeInTheDocument();
    expect(screen.getByText("Terceirizada ABC")).toBeInTheDocument();
    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText("AS12345")).toBeInTheDocument();
    expect(screen.getByText("Sem observações")).toBeInTheDocument();
    expect(screen.getByText("Produto para análise.")).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em Voltar", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve buscar os produtos da página selecionada", async () => {
    mock.onGet("/produtos/filtro-relatorio-em-analise-sensorial/").reply(200, {
      results: [
        {
          ...produto,
          nome: "Feijão Preto",
        },
      ],
    });

    setup();

    const pagina2 = screen.getByText("2", {
      selector: ".ant-pagination-item-2",
    });

    await userEvent.click(pagina2);

    await waitFor(() => {
      expect(setProdutos).toHaveBeenCalledWith([
        expect.objectContaining({
          nome: "Feijão Preto",
        }),
      ]);
    });
  });

  it("deve solicitar a impressão do relatório", async () => {
    mock.onGet("/produtos/relatorio-em-analise-sensorial/").reply(200, {});

    setup();

    await userEvent.click(
      screen.getByRole("button", {
        name: /imprimir/i,
      }),
    );

    await waitFor(() => {
      expect(mock.history.get).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: expect.stringContaining("/relatorio-em-analise-sensorial/"),
          }),
        ]),
      );
    });
  });

  it("não deve renderizar produtos quando a lista for nula", () => {
    setup({ produtos: null });

    expect(screen.queryByText("Arroz Integral")).not.toBeInTheDocument();
    expect(
      screen.getByText("Relatório de produtos em análise sensorial"),
    ).toBeInTheDocument();
  });
});
