import { render, screen, fireEvent } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import ModalRelatorioReclamacao from "../../components/ModalRelatorioReclamacao";
import mock from "src/services/_mock";

describe("Testes de comportamentos componente Modal do Relatorio de Reclamação", () => {
  const closeModal = jest.fn();
  const setProdutos = jest.fn();
  const setPage = jest.fn();

  const produtosMock = [
    {
      nome: "Produto Teste",
      marca: { nome: "Marca X" },
      fabricante: { nome: "Fabricante Y" },
      criado_em: "2024-01-01 10:00:00",
      ultima_homologacao: {
        status_titulo: "Ativo",
        reclamacoes: [
          {
            id_externo: "123",
            status_titulo: "Aberta",
            reclamante_nome: "João",
            reclamante_registro_funcional: "456",
            escola: {
              nome: "Escola Teste",
              codigo_eol: "789",
            },
            criado_em: "2024-01-01 10:00:00",
            reclamacao: "<p>Problema no produto</p>",
            logs: [
              {
                criado_em: "2024-01-02 10:00:00",
                status_evento_explicacao: "QUALQUER",
                justificativa: "<p>Resposta</p>",
              },
            ],
          },
        ],
      },
    },
  ];

  const baseProps = {
    showModal: true,
    closeModal,
    produtos: produtosMock,
    setProdutos,
    produtosCount: 10,
    filtros: {
      status_reclamacao: [],
    },
    pageSize: 10,
    page: 1,
    setPage,
  };

  const setup = (props = {}) =>
    render(<ModalRelatorioReclamacao {...baseProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();

    mock.onGet("/produtos/filtro-reclamacoes/").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            HTTP_STATUS.OK,
            {
              results: produtosMock,
            },
          ]);
        }, 100);
      });
    });

    mock.onGet("/produtos/relatorio-reclamacao/").reply(200, {
      detail: "Solicitação de geração de arquivo recebida com sucesso.",
    });
  });

  it("deve renderizar o modal com título", () => {
    setup();

    expect(
      screen.getByText("Relatório de acompanhamento de reclamação de produto"),
    ).toBeInTheDocument();
  });

  it("deve renderizar dados do produto", () => {
    setup();

    expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    expect(screen.getByText("Marca X")).toBeInTheDocument();
    expect(screen.getByText("Fabricante Y")).toBeInTheDocument();
  });

  it("deve renderizar dados da reclamação", () => {
    setup();

    expect(screen.getByText(/Reclamação #123/)).toBeInTheDocument();
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Escola Teste")).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em voltar", () => {
    setup();

    fireEvent.click(screen.getByText("Voltar"));

    expect(closeModal).toHaveBeenCalled();
  });

  it("não deve renderizar produtos quando lista for null", () => {
    setup({ produtos: null });

    expect(screen.queryByText("Produto Teste")).not.toBeInTheDocument();
  });

  it("deve fechar modal ao clicar no X", () => {
    setup();

    const closeButton = document.querySelector(".ant-modal-close");
    fireEvent.click(closeButton);

    expect(closeModal).toHaveBeenCalled();
  });
});
