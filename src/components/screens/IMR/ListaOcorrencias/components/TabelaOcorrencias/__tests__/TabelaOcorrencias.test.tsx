import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { OcorrenciaDiretorInterface } from "src/interfaces/imr.interface";
import TabelaOcorrencias from "..";

const OCORRENCIA: OcorrenciaDiretorInterface = {
  uuid: "11111111-1111-4111-8111-111111111111",
  data: "10/01/2026",
  categoria: {
    uuid: "22222222-2222-4222-8222-222222222222",
    nome: "FUNCIONÁRIOS",
    posicao: 1,
    gera_notificacao: false,
  },
  tipo_ocorrencia: "33333333-3333-4333-8333-333333333333",
  titulo: "UNIFORME DOS MANIPULADORES",
  descricao: "Funcionários utilizavam uniforme completo?",
  grupo: 1,
  respostas: [
    {
      uuid: "44444444-4444-4444-8444-444444444444",
      parametrizacao: "55555555-5555-4555-8555-555555555555",
      titulo: "Qual item do uniforme faltou?",
      posicao: 1,
      resposta: "Touca",
    },
    {
      uuid: "66666666-6666-4666-8666-666666666666",
      parametrizacao: "77777777-7777-4777-8777-777777777777",
      titulo: "Qual a quantidade de itens ausentes?",
      posicao: 2,
      resposta: "2.0",
    },
  ],
};

const OCORRENCIA_SEGUNDO_GRUPO: OcorrenciaDiretorInterface = {
  ...OCORRENCIA,
  grupo: 2,
  respostas: [
    {
      ...OCORRENCIA.respostas[0],
      uuid: "88888888-8888-4888-8888-888888888888",
      resposta: "Avental",
    },
    {
      ...OCORRENCIA.respostas[1],
      uuid: "99999999-9999-4999-8999-999999999999",
      resposta: "1.0",
    },
  ],
};

describe("TabelaOcorrencias", () => {
  it("apresenta as quatro colunas na ordem prevista", () => {
    render(<TabelaOcorrencias ocorrencias={[OCORRENCIA]} />);

    const cabecalhos = screen
      .getAllByRole("columnheader")
      .map((cabecalho) => cabecalho.textContent);

    expect(cabecalhos).toEqual([
      "Data da Ocorrência",
      "Categoria",
      "Ocorrência",
      "Ações",
    ]);
  });

  it("apresenta data, categoria, título, descrição e respostas do diretor", () => {
    render(<TabelaOcorrencias ocorrencias={[OCORRENCIA]} />);

    const linha = screen.getAllByRole("row")[1];
    const celulas = within(linha).getAllByRole("cell");

    expect(celulas[0]).toHaveTextContent(OCORRENCIA.data);
    expect(celulas[1]).toHaveTextContent(OCORRENCIA.categoria.nome);
    expect(within(celulas[2]).getByText(OCORRENCIA.titulo)).toBeInTheDocument();
    expect(
      within(celulas[2]).getByText(OCORRENCIA.descricao),
    ).toBeInTheDocument();
    expect(
      within(celulas[2]).getByText("Qual item do uniforme faltou? Touca"),
    ).toBeInTheDocument();
    expect(
      within(celulas[2]).getByText("Qual a quantidade de itens ausentes? 2.0"),
    ).toBeInTheDocument();
  });

  it("mantém o título e as respostas quando a ocorrência não possui descrição", () => {
    render(
      <TabelaOcorrencias ocorrencias={[{ ...OCORRENCIA, descricao: "" }]} />,
    );

    expect(screen.getByText(OCORRENCIA.titulo)).toBeInTheDocument();
    expect(screen.queryByText(OCORRENCIA.descricao)).not.toBeInTheDocument();
    expect(
      screen.getByText("Qual item do uniforme faltou? Touca"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Qual a quantidade de itens ausentes? 2.0"),
    ).toBeInTheDocument();
  });

  it("apresenta grupos do mesmo formulário em linhas separadas com suas respectivas respostas", () => {
    render(
      <TabelaOcorrencias
        ocorrencias={[OCORRENCIA, OCORRENCIA_SEGUNDO_GRUPO]}
      />,
    );

    const linhas = screen.getAllByRole("row");

    expect(linhas).toHaveLength(3);
    expect(
      within(linhas[1]).getByText("Qual item do uniforme faltou? Touca"),
    ).toBeInTheDocument();
    expect(
      within(linhas[1]).queryByText("Qual item do uniforme faltou? Avental"),
    ).not.toBeInTheDocument();
    expect(
      within(linhas[2]).getByText("Qual item do uniforme faltou? Avental"),
    ).toBeInTheDocument();
    expect(
      within(linhas[2]).queryByText("Qual item do uniforme faltou? Touca"),
    ).not.toBeInTheDocument();
  });

  it("adiciona dois-pontos apenas quando o título da resposta não termina em ? ou :", () => {
    const ocorrenciaComPontuacoes: OcorrenciaDiretorInterface = {
      ...OCORRENCIA,
      respostas: [
        {
          ...OCORRENCIA.respostas[0],
          uuid: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          titulo: "Qual item faltou?",
          resposta: "Touca",
        },
        {
          ...OCORRENCIA.respostas[1],
          uuid: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          titulo: "Observação:",
          resposta: "Sem itens",
        },
        {
          ...OCORRENCIA.respostas[1],
          uuid: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          titulo: "Responsável",
          resposta: "João",
        },
      ],
    };

    render(<TabelaOcorrencias ocorrencias={[ocorrenciaComPontuacoes]} />);

    expect(screen.getByText("Qual item faltou? Touca")).toBeInTheDocument();
    expect(screen.getByText("Observação: Sem itens")).toBeInTheDocument();
    expect(screen.getByText("Responsável: João")).toBeInTheDocument();
  });

  it("mantém a edição desabilitada em todas as ocorrências", () => {
    render(
      <TabelaOcorrencias
        ocorrencias={[OCORRENCIA, OCORRENCIA_SEGUNDO_GRUPO]}
      />,
    );

    const botoesEditar = screen.getAllByRole("button", {
      name: `Editar ocorrência ${OCORRENCIA.titulo}`,
    });

    expect(botoesEditar).toHaveLength(2);
    botoesEditar.forEach((botao) => {
      expect(botao).toBeDisabled();
      expect(botao).toHaveAttribute("title", "Edição indisponível");
    });
  });
});
