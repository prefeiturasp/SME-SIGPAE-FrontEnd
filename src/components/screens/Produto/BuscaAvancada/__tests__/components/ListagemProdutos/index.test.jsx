import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import ListagemProdutos from "../../../components/ListagemProdutos";
import { mockResultados } from "src/mocks/Produto/BuscaAvancada/results";
import { mockGetProdutosListagem } from "src/mocks/services/produto.service/mockGetProdutosListagemJujuba";

const produtoUm = mockResultados.results[3];
const produtoDois = mockResultados.results[7];
const produtoComAlergenicos = mockGetProdutosListagem.results[1];

const terceirizadaDe = (produto) =>
  produto.ultima_homologacao.rastro_terceirizada;

const dataCadastro = (produto) => produto.criado_em.split(" ")[0];

const renderiza = (props) =>
  render(
    <MemoryRouter>
      <ListagemProdutos {...props} />
    </MemoryRouter>,
  );

const ListagemComEstado = ({ produtos, ativosIniciais }) => {
  const [ativos, setAtivos] = useState(ativosIniciais);
  return (
    <ListagemProdutos
      produtos={produtos}
      ativos={ativos}
      setAtivos={setAtivos}
    />
  );
};

const renderizaComEstado = (produtos, ativosIniciais) =>
  render(
    <MemoryRouter>
      <ListagemComEstado produtos={produtos} ativosIniciais={ativosIniciais} />
    </MemoryRouter>,
  );

describe("Testes do componente - ListagemProdutos", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o cabeçalho da tabela", () => {
    renderiza({ produtos: [], ativos: [], setAtivos: jest.fn() });

    expect(screen.getByText("Resultado da Pesquisa")).toBeInTheDocument();
    [
      "Tipo",
      "Status",
      "Data cadastro",
      "Nome do Produto",
      "Marca",
      "Fabricante",
    ].forEach((coluna) => {
      expect(screen.getByText(coluna)).toBeInTheDocument();
    });
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renderiza as linhas dos produtos recolhidas quando não há ativos", () => {
    renderiza({
      produtos: [produtoUm, produtoDois],
      ativos: undefined,
      setAtivos: jest.fn(),
    });

    [produtoUm, produtoDois].forEach((produto) => {
      expect(
        screen.getByText(produto.produto_edital_tipo_produto),
      ).toBeInTheDocument();
      expect(screen.getByText(dataCadastro(produto))).toBeInTheDocument();
      expect(screen.getByText(produto.nome)).toBeInTheDocument();
      expect(screen.getByText(produto.marca.nome)).toBeInTheDocument();
      expect(screen.getByText(produto.fabricante.nome)).toBeInTheDocument();
    });

    const botoes = screen.getAllByRole("button");
    expect(botoes).toHaveLength(2);
    botoes.forEach((botao) => {
      expect(botao).toHaveClass("fas", "fa-angle-down");
      expect(botao).toHaveAttribute("aria-expanded", "false");
    });

    expect(screen.getByText(produtoUm.nome)).not.toHaveClass("desativar-borda");
    expect(
      screen.queryByText("Empresa solicitante (Terceirizada)"),
    ).not.toBeInTheDocument();
  });

  it("exibe os detalhes apenas do produto ativo", () => {
    renderiza({
      produtos: [produtoUm, produtoDois],
      ativos: [produtoUm.uuid],
      setAtivos: jest.fn(),
    });

    const [botaoUm, botaoDois] = screen.getAllByRole("button");
    expect(botaoUm).toHaveClass("fa-angle-up");
    expect(botaoUm).toHaveAttribute("aria-expanded", "true");
    expect(botaoDois).toHaveClass("fa-angle-down");
    expect(botaoDois).toHaveAttribute("aria-expanded", "false");

    expect(screen.getByText(produtoUm.nome)).toHaveClass("desativar-borda");
    expect(screen.getByText(produtoDois.nome)).not.toHaveClass(
      "desativar-borda",
    );

    expect(
      screen.getAllByText("Empresa solicitante (Terceirizada)"),
    ).toHaveLength(1);

    const terceirizada = terceirizadaDe(produtoUm);
    expect(screen.getByText(terceirizada.nome_fantasia)).toBeInTheDocument();
    terceirizada.contatos.forEach(({ telefone, email }) => {
      expect(screen.getByText(telefone)).toBeInTheDocument();
      expect(screen.getAllByText(email).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(produtoUm.componentes)).toBeInTheDocument();
    expect(screen.getByText("NÃO")).toBeInTheDocument();
    expect(screen.getByText(produtoUm.aditivos)).toBeInTheDocument();
    expect(screen.queryByText(produtoDois.componentes)).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Visualizar" })).toHaveAttribute(
      "href",
      `/pesquisa-desenvolvimento/relatorio-produto?uuid=${produtoUm.uuid}`,
    );
  });

  it("exibe 'SIM' quando o produto ativo possui aditivos alergênicos", () => {
    renderiza({
      produtos: [produtoComAlergenicos],
      ativos: [produtoComAlergenicos.uuid],
      setAtivos: jest.fn(),
    });

    expect(
      screen.getByText(terceirizadaDe(produtoComAlergenicos).nome_fantasia),
    ).toBeInTheDocument();
    expect(
      screen.getByText(produtoComAlergenicos.componentes),
    ).toBeInTheDocument();
    expect(screen.getByText("SIM")).toBeInTheDocument();
    expect(
      screen.getByText(produtoComAlergenicos.aditivos),
    ).toBeInTheDocument();
    expect(screen.queryByText("NÃO")).not.toBeInTheDocument();
  });

  it("inicia a lista de ativos com o produto clicado quando ativos não está definido", () => {
    const setAtivos = jest.fn();
    renderiza({ produtos: [produtoUm], ativos: undefined, setAtivos });

    fireEvent.click(screen.getByRole("button"));

    expect(setAtivos).toHaveBeenCalledWith([produtoUm.uuid]);
  });

  it("adiciona o produto clicado aos ativos já existentes", () => {
    const setAtivos = jest.fn();
    renderiza({
      produtos: [produtoUm, produtoDois],
      ativos: [produtoUm.uuid],
      setAtivos,
    });

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(setAtivos).toHaveBeenCalledWith([produtoUm.uuid, produtoDois.uuid]);
  });

  it("remove o produto clicado dos ativos quando já está expandido", () => {
    const setAtivos = jest.fn();
    renderiza({
      produtos: [produtoUm, produtoDois],
      ativos: [produtoUm.uuid, produtoDois.uuid],
      setAtivos,
    });

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(setAtivos).toHaveBeenCalledWith([produtoDois.uuid]);
  });

  it.each(["Enter", " "])(
    "alterna o produto ao pressionar a tecla '%s'",
    (key) => {
      const setAtivos = jest.fn();
      renderiza({ produtos: [produtoUm], ativos: [], setAtivos });

      fireEvent.keyDown(screen.getByRole("button"), { key });

      expect(setAtivos).toHaveBeenCalledWith([produtoUm.uuid]);
    },
  );

  it("não alterna o produto ao pressionar outra tecla", () => {
    const setAtivos = jest.fn();
    renderiza({ produtos: [produtoUm], ativos: [], setAtivos });

    fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });

    expect(setAtivos).not.toHaveBeenCalled();
  });

  it("expande e recolhe os detalhes do produto ao interagir com o ícone", () => {
    renderizaComEstado([produtoUm], []);

    const botao = screen.getByRole("button");
    fireEvent.click(botao);

    expect(botao).toHaveClass("fa-angle-up");
    expect(screen.getByText(produtoUm.componentes)).toBeInTheDocument();

    fireEvent.click(botao);

    expect(botao).toHaveClass("fa-angle-down");
    expect(screen.queryByText(produtoUm.componentes)).not.toBeInTheDocument();
  });
});
