import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import RelatorioReclamacaoProduto from "src/components/screens/Produto/RelatorioReclamacaoProduto";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/FinalFormToRedux", () => () => null);
jest.mock("src/components/Shareable/AutoCompleteField", () => (props) => (
  <input
    data-testid={`autocomplete-${props.name}`}
    name={props.name}
    placeholder={props.placeholder}
    value={props.input?.value ?? ""}
    onChange={(e) => props.input?.onChange(e.target.value)}
  />
));
jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: (props) => (
    <input
      data-testid={`datepicker-${props.name}`}
      name={props.name}
      placeholder={props.placeholder}
    />
  ),
}));
jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ onChange, current, total, pageSize }) => (
    <div data-testid="paginacao">
      <button
        data-testid="next-page-btn"
        onClick={() => onChange(current + 1)}
        disabled={current * pageSize >= total}
      >
        Próxima
      </button>
    </div>
  ),
}));
jest.mock("src/services/relatorios.service", () => ({
  getRelatorioReclamacao: jest.fn(),
}));

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  const MockModal = ({ visible, title, children, footer, onCancel }) =>
    visible ? (
      <div>
        <div>{title}</div>
        <div>{children}</div>
        <div>{footer}</div>
        <button onClick={onCancel}>Fechar</button>
      </div>
    ) : null;
  return { ...antd, Modal: MockModal };
});

const mockProduto = {
  nome: "Produto Teste",
  marca: { nome: "Marca Teste" },
  fabricante: { nome: "Fabricante Teste" },
  criado_em: "01/01/2024 10:00:00",
  ultima_homologacao: {
    status_titulo: "Ativo",
    reclamacoes: [
      {
        id_externo: "REC-001",
        status_titulo: "Aguardando avaliação",
        reclamante_nome: "João Silva",
        reclamante_registro_funcional: "123456",
        escola: { nome: "Escola Municipal", codigo_eol: "000001" },
        criado_em: "05/01/2024 08:00:00",
        reclamacao: "<p>Produto com qualidade ruim</p>",
        logs: [
          {
            criado_em: "06/01/2024 09:00:00",
            status_evento_explicacao: "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
            justificativa: "<p>Resposta da terceirizada</p>",
          },
        ],
      },
      {
        id_externo: "REC-002",
        status_titulo: "CODAE aceitou",
        reclamante_nome: "Maria Souza",
        reclamante_registro_funcional: "654321",
        escola: { nome: "Escola Estadual", codigo_eol: "000002" },
        criado_em: "07/01/2024 08:00:00",
        reclamacao: "<p>Produto vencido</p>",
        logs: [],
      },
    ],
  },
};

const mockResponseProdutos = {
  results: [mockProduto],
  count: 1,
};

beforeEach(() => {
  mock.reset();
  mock
    .onGet(/\/produtos\/filtro-reclamacoes\//)
    .reply(200, mockResponseProdutos);
  mock
    .onGet(/\/produtos\/lista-nomes\//)
    .reply(200, { results: [{ nome: "Produto A" }, { nome: "Produto B" }] });
  mock
    .onGet(/\/marcas\/lista-nomes\//)
    .reply(200, { results: [{ nome: "Marca A" }] });
  mock.onGet(/\/fabricantes\//).reply(200, { results: [{ nome: "Fab A" }] });
});

describe("<RelatorioReclamacaoProduto />", () => {
  it("deve renderizar o formulário de busca corretamente", async () => {
    render(<RelatorioReclamacaoProduto />);

    expect(
      screen.getByPlaceholderText("Digite nome do produto"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite marca do produto"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite fabricante do produto"),
    ).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  it("deve exibir mensagem de 'sem dados' quando busca retorna lista vazia", async () => {
    mock
      .onGet(/\/produtos\/filtro-reclamacoes\//)
      .reply(200, { results: [], count: 0 });

    render(<RelatorioReclamacaoProduto />);

    await act(async () => {
      await userEvent.click(screen.getByText("Consultar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Não existem dados para filtragem informada"),
      ).toBeInTheDocument();
    });
  });

  it("deve abrir o modal com produtos quando busca retorna resultados", async () => {
    render(<RelatorioReclamacaoProduto />);

    await act(async () => {
      await userEvent.click(screen.getByText("Consultar"));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Relatório de acompanhamento de reclamação de produto",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Produto Teste")).toBeInTheDocument();
      expect(screen.getByText("Marca Teste")).toBeInTheDocument();
      expect(screen.getByText("Fabricante Teste")).toBeInTheDocument();
    });
  });

  it("deve fechar o modal ao clicar em Voltar", async () => {
    render(<RelatorioReclamacaoProduto />);

    await act(async () => {
      await userEvent.click(screen.getByText("Consultar"));
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          "Relatório de acompanhamento de reclamação de produto",
        ),
      ).toBeInTheDocument(),
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Voltar"));
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText(
            "Relatório de acompanhamento de reclamação de produto",
          ),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("deve navegar para próxima página e recarregar produtos", async () => {
    const mockPage2 = {
      results: [{ ...mockProduto, nome: "Produto Página 2" }],
      count: 15,
    };

    mock
      .onGet(/\/produtos\/filtro-reclamacoes\//)
      .replyOnce(200, { results: [mockProduto], count: 15 })
      .onGet(/\/produtos\/filtro-reclamacoes\//)
      .reply(200, mockPage2);

    render(<RelatorioReclamacaoProduto />);

    await act(async () => {
      await userEvent.click(screen.getByText("Consultar"));
    });

    await waitFor(() =>
      expect(screen.getByTestId("paginacao")).toBeInTheDocument(),
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId("next-page-btn"));
    });

    await waitFor(() => {
      expect(screen.getByText("Produto Página 2")).toBeInTheDocument();
    });
  });

  it("deve limpar filtros ao clicar em 'Limpar Filtros'", async () => {
    render(<RelatorioReclamacaoProduto />);

    const inputNome = screen.getByPlaceholderText("Digite nome do produto");

    await act(async () => {
      await userEvent.type(inputNome, "Produto X");
    });

    await act(async () => {
      await userEvent.click(screen.getByText("Limpar Filtros"));
    });

    expect(inputNome).toHaveValue("");
  });
});
